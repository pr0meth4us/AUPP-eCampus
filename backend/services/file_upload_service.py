import mimetypes
import os
import uuid
from datetime import datetime
from typing import List, Tuple

import boto3
from botocore.exceptions import NoCredentialsError, ClientError
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

from config import Config


class FileUploadService:
    """Unified file upload service supporting multiple cloud providers"""

    ALLOWED_EXTENSIONS = {
        'document': ['pdf', 'doc', 'docx', 'txt', 'rtf'],
        'presentation': ['ppt', 'pptx', 'odp'],
        'spreadsheet': ['xls', 'xlsx', 'csv', 'ods'],
        'image': ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
        'video': ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
        'audio': ['mp3', 'wav', 'ogg', 'aac', 'm4a'],
        'archive': ['zip', 'rar', '7z', 'tar', 'gz']
    }

    MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB default

    def __init__(self, provider: str = "cloudflare"):
        self.provider = provider.lower()
        self._init_client()

    def _init_client(self):
        """Initialize cloud storage client based on provider"""
        if self.provider == "cloudflare":
            self.client = boto3.client(
                's3',
                aws_access_key_id=Config.CLOUDFLARE_ACCESS_KEY_ID,
                aws_secret_access_key=Config.CLOUDFLARE_SECRET_ACCESS_KEY,
                region_name=Config.CLOUDFLARE_REGION,
                endpoint_url=Config.CLOUDFLARE_PUBLIC_URL
            )
            self.bucket = Config.CLOUDFLARE_BUCKET_NAME
            self.public_url = Config.CLOUDFLARE_PUBLIC_URL

        elif self.provider == "supabase":
            self.client = boto3.client(
                "s3",
                endpoint_url=Config.SUPABASE_S3_ENDPOINT,
                aws_access_key_id=Config.SUPABASE_S3_ACCESS_KEY,
                aws_secret_access_key=Config.SUPABASE_S3_SECRET_KEY,
                region_name=Config.SUPABASE_S3_REGION
            )
            self.bucket = Config.SUPABASE_S3_BUCKET
            self.public_url = Config.SUPABASE_PUBLIC_URL

        elif self.provider == "aws":
            self.client = boto3.client(
                's3',
                aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
                region_name='ap-southeast-2'
            )
            self.bucket = 'auppecampus'
            self.public_url = f"https://{self.bucket}.s3.amazonaws.com"

    def validate_file(self, file: FileStorage, allowed_types: List[str] = None, max_size: int = None) -> Tuple[bool, str]:
        """Validate file type and size"""
        if not file or not file.filename:
            return False, "No file provided"

        # Check file size
        max_size = max_size or self.MAX_FILE_SIZE
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)

        if file_size > max_size:
            return False, f"File size exceeds {max_size / (1024*1024):.1f}MB limit"

        # Check file extension
        file_ext = file.filename.rsplit('.', 1)[-1].lower()

        if allowed_types:
            # Check against specific allowed types
            if file_ext not in [t.lower() for t in allowed_types]:
                return False, f"File type .{file_ext} not allowed. Allowed types: {', '.join(allowed_types)}"
        else:
            # Check against all known types
            all_extensions = []
            for category in self.ALLOWED_EXTENSIONS.values():
                all_extensions.extend(category)

            if file_ext not in all_extensions:
                return False, f"File type .{file_ext} not supported"

        return True, "Valid file"

    def generate_unique_filename(self, original_filename: str, prefix: str = "") -> str:
        """Generate unique filename to prevent conflicts"""
        secure_name = secure_filename(original_filename)
        name, ext = os.path.splitext(secure_name)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]

        if prefix:
            return f"{prefix}_{timestamp}_{unique_id}_{name}{ext}"
        return f"{timestamp}_{unique_id}_{name}{ext}"

    def upload_file(self, file: FileStorage, folder: str, allowed_types: List[str] = None,
                    max_size: int = None, custom_filename: str = None) -> dict:
        """
        Upload file to cloud storage

        Args:
            file: FileStorage object
            folder: Destination folder (e.g., 'courses/123/assignments')
            allowed_types: List of allowed file extensions
            max_size: Maximum file size in bytes
            custom_filename: Custom filename (optional)

        Returns:
            dict with file info or error
        """
        try:
            # Validate file
            is_valid, message = self.validate_file(file, allowed_types, max_size)
            if not is_valid:
                return {'success': False, 'error': message}

            # Generate filename
            if custom_filename:
                filename = custom_filename
            else:
                filename = self.generate_unique_filename(file.filename, folder.replace('/', '_'))

            # Create object key (path in bucket)
            object_key = f"{folder.strip('/')}/{filename}"

            # Get content type
            content_type, _ = mimetypes.guess_type(file.filename)
            if not content_type:
                content_type = 'application/octet-stream'

            # Save to temp file first
            temp_dir = "/tmp"
            os.makedirs(temp_dir, exist_ok=True)
            temp_path = os.path.join(temp_dir, filename)
            file.save(temp_path)

            try:
                # Upload to cloud storage
                extra_args = {
                    'ContentType': content_type,
                    'ACL': 'public-read' if self.provider == 'aws' else 'public-read'
                }

                self.client.upload_file(temp_path, self.bucket, object_key, ExtraArgs=extra_args)

                # Generate public URL
                if self.provider == "supabase":
                    file_url = f"{self.public_url}/storage/v1/object/public/{self.bucket}/{object_key}"
                elif self.provider == "cloudflare":
                    file_url = f"{self.public_url}/{object_key}"
                else:  # AWS
                    file_url = f"{self.public_url}/{object_key}"

                return {
                    'success': True,
                    'file_url': file_url,
                    'filename': filename,
                    'original_filename': file.filename,
                    'file_size': os.path.getsize(temp_path),
                    'content_type': content_type,
                    'object_key': object_key
                }

            finally:
                # Clean up temp file
                if os.path.exists(temp_path):
                    os.remove(temp_path)

        except NoCredentialsError:
            return {'success': False, 'error': 'Invalid cloud storage credentials'}
        except ClientError as e:
            return {'success': False, 'error': f'Upload failed: {e.response["Error"]["Message"]}'}
        except Exception as e:
            return {'success': False, 'error': f'Unexpected error: {str(e)}'}

    def upload_multiple_files(self, files: List[FileStorage], folder: str,
                              allowed_types: List[str] = None, max_size: int = None) -> dict:
        """Upload multiple files"""
        results = []
        errors = []

        for file in files:
            result = self.upload_file(file, folder, allowed_types, max_size)
            if result['success']:
                results.append(result)
            else:
                errors.append({'filename': file.filename, 'error': result['error']})

        return {
            'success': len(errors) == 0,
            'uploaded_files': results,
            'errors': errors,
            'total_uploaded': len(results),
            'total_errors': len(errors)
        }

    def delete_file(self, object_key: str) -> dict:
        """Delete file from cloud storage"""
        try:
            self.client.delete_object(Bucket=self.bucket, Key=object_key)
            return {'success': True, 'message': f'File {object_key} deleted successfully'}
        except ClientError as e:
            return {'success': False, 'error': f'Delete failed: {e.response["Error"]["Message"]}'}
        except Exception as e:
            return {'success': False, 'error': f'Unexpected error: {str(e)}'}

    def get_file_categories(self) -> dict:
        """Return allowed file extensions by category"""
        return self.ALLOWED_EXTENSIONS

    def get_file_category(self, filename: str) -> str:
        """Determine file category based on extension"""
        if not filename:
            return 'unknown'

        ext = filename.rsplit('.', 1)[-1].lower()

        for category, extensions in self.ALLOWED_EXTENSIONS.items():
            if ext in extensions:
                return category

        return 'unknown'

# Convenience functions for specific use cases
def upload_course_material(file: FileStorage, course_id: str, material_type: str = "general") -> dict:
    """Upload course material (modules, resources)"""
    service = FileUploadService()
    folder = f"courses/{course_id}/materials/{material_type}"

    # Allow common educational file types
    allowed_types = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'mp4', 'mp3', 'jpg', 'png']

    return service.upload_file(file, folder, allowed_types, max_size=100*1024*1024)  # 100MB for course materials

def upload_assignment_file(file: FileStorage, course_id: str, assignment_id: str, uploader_type: str = "instructor") -> dict:
    """Upload assignment-related files"""
    service = FileUploadService()
    folder = f"courses/{course_id}/assignments/{assignment_id}/{uploader_type}"

    if uploader_type == "instructor":
        # Instructors can upload any type for assignment instructions
        allowed_types = None
        max_size = 50*1024*1024  # 50MB
    else:
        # Students limited to common submission types
        allowed_types = ['pdf', 'doc', 'docx', 'txt', 'zip', 'jpg', 'png']
        max_size = 25*1024*1024  # 25MB

    return service.upload_file(file, folder, allowed_types, max_size)

def upload_student_submission(files: List[FileStorage], course_id: str, assignment_id: str,
                              student_id: str, allowed_types: List[str]) -> dict:
    """Upload student assignment submission"""
    service = FileUploadService()
    folder = f"courses/{course_id}/assignments/{assignment_id}/submissions/{student_id}"

    return service.upload_multiple_files(files, folder, allowed_types, max_size=25*1024*1024)

# Initialize default service
default_upload_service = FileUploadService()