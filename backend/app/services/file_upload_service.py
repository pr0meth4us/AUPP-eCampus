# services/file_upload_service.py

import mimetypes
import os
import uuid
from datetime import datetime
from typing import List, Tuple

import boto3
from botocore.exceptions import NoCredentialsError, ClientError
from botocore.client import Config as BotoConfig
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

    def __init__(self, provider: str = "aws"):
        self.provider = provider.lower()
        self._init_client()

    def _init_client(self):
        """Initialize cloud storage client based on provider"""
        try:
            if self.provider == "cloudflare":
                self.client = boto3.client(
                    's3',
                    aws_access_key_id=Config.CLOUDFLARE_ACCESS_KEY_ID,
                    aws_secret_access_key=Config.CLOUDFLARE_SECRET_ACCESS_KEY,
                    region_name=Config.CLOUDFLARE_REGION,
                    endpoint_url=Config.CLOUDFLARE_PUBLIC_URL,
                    config=BotoConfig(signature_version='s3v4', s3={'addressing_style': 'path'})
                )
                self.bucket = Config.CLOUDFLARE_BUCKET_NAME
                self.public_url = Config.CLOUDFLARE_PUBLIC_URL

            elif self.provider == "supabase":
                # ‟endpoint_url” must end at …/storage/v1 (no trailing “/s3”)
                self.client = boto3.client(
                    's3',
                    endpoint_url=Config.SUPABASE_S3_ENDPOINT,          # e.g. "https://<project>.supabase.co/storage/v1"
                    aws_access_key_id=Config.SUPABASE_S3_ACCESS_KEY,
                    aws_secret_access_key=Config.SUPABASE_S3_SECRET_KEY,
                    region_name="us-east-1",                            # ALWAYS use "us-east-1" for Supabase S3
                    config=BotoConfig(signature_version='s3v4', s3={'addressing_style': 'path'})
                )
                self.bucket = Config.SUPABASE_S3_BUCKET                   # exact bucket name
                self.public_url = Config.SUPABASE_PUBLIC_URL              # e.g. "https://<project>.supabase.co"

            elif self.provider == "aws":
                self.client = boto3.client(
                    's3',
                    aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
                    region_name='ap-southeast-2',
                    config=BotoConfig(signature_version='s3v4')
                )
                self.bucket = 'auppecampus'
                self.public_url = f"https://{self.bucket}.s3.ap-southeast-2.amazonaws.com"

            else:
                raise ValueError(f"Unsupported provider: {self.provider}")

        except Exception as e:
            raise

    def validate_file(self, file: FileStorage,
                      allowed_types: List[str] = None,
                      max_size: int = None) -> Tuple[bool, str]:
        """Validate file type and size"""
        if not file or not file.filename:
            return False, "No file provided"

        max_size = max_size or self.MAX_FILE_SIZE
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)

        if file_size > max_size:
            return False, f"File size exceeds {max_size / (1024*1024):.1f}MB limit"

        file_ext = file.filename.rsplit('.', 1)[-1].lower()

        if allowed_types:
            if file_ext not in [t.lower() for t in allowed_types]:
                return False, f"File type .{file_ext} not allowed. Allowed types: {', '.join(allowed_types)}"
        else:
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
            simple_prefix = prefix.replace('/', '_').replace('\\', '_')[:20]
            return f"{simple_prefix}_{timestamp}_{unique_id}_{name}{ext}"
        return f"{timestamp}_{unique_id}_{name}{ext}"

    def upload_file(self,
                    file: FileStorage,
                    folder: str,
                    allowed_types: List[str] = None,
                    max_size: int = None,
                    custom_filename: str = None) -> dict:
        """
        Upload file to cloud storage (AWS, Cloudflare, or Supabase).
        """
        is_valid, message = self.validate_file(file, allowed_types, max_size)
        if not is_valid:
            return {'success': False, 'error': message}

        if custom_filename:
            filename = secure_filename(custom_filename)
        else:
            filename = self.generate_unique_filename(file.filename, folder.replace('/', '_'))

        clean_folder = folder.strip('/').replace('\\', '/')
        object_key = f"{clean_folder}/{filename}"

        content_type, _ = mimetypes.guess_type(file.filename)
        if not content_type:
            content_type = 'application/octet-stream'

        temp_dir = "/tmp"
        if os.name == 'nt':
            temp_dir = os.environ.get('TEMP', 'C:\\temp')
        os.makedirs(temp_dir, exist_ok=True)

        temp_filename = f"upload_{uuid.uuid4().hex[:8]}_{filename}"
        temp_path = os.path.join(temp_dir, temp_filename)
        file.save(temp_path)

        if not os.path.exists(temp_path):
            return {'success': False, 'error': 'Failed to save file to temporary location'}

        file_size = os.path.getsize(temp_path)

        try:
            extra_args = {'ContentType': content_type}
            # Only AWS needs explicit ACL; Supabase/Cloudflare ignore it
            if self.provider == 'aws':
                extra_args['ACL'] = 'public-read'

            self.client.upload_file(temp_path, self.bucket, object_key, ExtraArgs=extra_args)

            if self.provider == "supabase":
                # Supabase public URL pattern: /storage/v1/object/public/<bucket>/<key>
                file_url = f"{self.public_url}/storage/v1/object/public/{self.bucket}/{object_key}"
            elif self.provider == "cloudflare":
                file_url = f"{self.public_url}/{object_key}"
            else:  # aws
                file_url = f"{self.public_url}/{object_key}"

            return {
                'success': True,
                'file_url': file_url,
                'filename': filename,
                'original_filename': file.filename,
                'file_size': file_size,
                'content_type': content_type,
                'object_key': object_key
            }

        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

    def upload_multiple_files(self,
                              files: List[FileStorage],
                              folder: str,
                              allowed_types: List[str] = None,
                              max_size: int = None) -> dict:
        """Upload multiple files"""
        results = []
        errors = []

        for f in files:
            result = self.upload_file(f, folder, allowed_types, max_size)
            if result.get('success'):
                results.append(result)
            else:
                errors.append({'filename': f.filename, 'error': result.get('error')})

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
            error_code = e.response['Error']['Code']
            error_message = e.response['Error']['Message']
            return {'success': False, 'error': f'Delete failed: {error_code} - {error_message}'}
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

    def test_connection(self) -> dict:
        """Test connection to cloud storage"""
        try:
            # Just try listing a single object to validate connectivity
            self.client.list_objects_v2(Bucket=self.bucket, MaxKeys=1)
            return {'success': True, 'message': 'Connection successful'}
        except NoCredentialsError:
            return {'success': False, 'error': 'Invalid credentials'}
        except ClientError as e:
            error_code = e.response['Error']['Code']
            error_message = e.response['Error']['Message']
            return {'success': False, 'error': f'{error_code}: {error_message}'}
        except Exception as e:
            return {'success': False, 'error': f'Connection test failed: {str(e)}'}


# Convenience functions for specific use cases

def upload_course_material(file: FileStorage,
                           course_id: str,
                           material_type: str = "general",
                           provider: str = "aws") -> dict:
    """Upload course material (modules, resources)"""
    service = FileUploadService(provider=provider)
    folder = f"courses/{course_id}/materials/{material_type}"
    allowed_types = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt',
                     'mp4', 'mp3', 'jpg', 'png']
    return service.upload_file(file, folder, allowed_types, max_size=100*1024*1024)


def upload_assignment_file(file: FileStorage,
                           course_id: str,
                           assignment_id: str,
                           uploader_type: str = "instructor",
                           provider: str = "aws") -> dict:
    """Upload assignment-related files"""
    service = FileUploadService(provider=provider)
    folder = f"courses/{course_id}/assignments/{assignment_id}/{uploader_type}"
    if uploader_type == "instructor":
        allowed_types = None
        max_size = 50 * 1024 * 1024
    else:
        allowed_types = ['pdf', 'doc', 'docx', 'txt', 'zip', 'jpg', 'png']
        max_size = 25 * 1024 * 1024
    return service.upload_file(file, folder, allowed_types, max_size)


def upload_student_submission(files: List[FileStorage],
                              course_id: str,
                              assignment_id: str,
                              student_id: str,
                              allowed_types: List[str],
                              provider: str = "aws") -> dict:
    """Upload student assignment submission"""
    service = FileUploadService(provider=provider)
    folder = f"courses/{course_id}/assignments/{assignment_id}/submissions/{student_id}"
    return service.upload_multiple_files(files, folder, allowed_types, max_size=25*1024*1024)


# Initialize default service (AWS by default)
default_upload_service = FileUploadService()
