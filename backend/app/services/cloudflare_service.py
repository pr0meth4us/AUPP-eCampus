import boto3
from botocore.exceptions import NoCredentialsError, ClientError
from config import Config
import os
from werkzeug.utils import secure_filename


class CloudflareUploadService:
    def __init__(self, config):
        self.access_key_id = config.CLOUDFLARE_ACCESS_KEY_ID
        self.secret_access_key = config.CLOUDFLARE_SECRET_ACCESS_KEY
        self.bucket_name = config.CLOUDFLARE_BUCKET_NAME
        self.region = config.CLOUDFLARE_REGION
        self.endpoint_url = config.CLOUDFLARE_ENDPOINT_URL
        self.public_url = config.CLOUDFLARE_PUBLIC_URL

        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=self.access_key_id,
            aws_secret_access_key=self.secret_access_key,
            region_name=self.region,
            endpoint_url=self.public_url
        )

    def upload_assignment(self, file_path, object_name=None):
        if object_name is None:
            object_name = file_path.split('/')[-1]

        try:
            self.s3_client.upload_file(file_path, self.bucket_name, object_name)

            file_url = f"{self.public_url}/{object_name}"
            return file_url

        except FileNotFoundError:
            raise FileNotFoundError(f"File '{file_path}' not found.")
        except NoCredentialsError:
            raise NoCredentialsError("Invalid Cloudflare R2 credentials.")
        except ClientError as e:
            raise RuntimeError(f"Failed to upload file: {e.response['Error']['Message']}")


def handle_temp_file_upload(file, path):
    temp_dir = "/tmp"
    os.makedirs(temp_dir, exist_ok=True)

    filename = secure_filename(file.filename)
    temp_file_path = os.path.join(temp_dir, filename)
    file.save(temp_file_path)

    cloudflare_upload_service = CloudflareUploadService(Config)
    object_name = f"assignments/{path}/{filename}"
    try:
        file_url = cloudflare_upload_service.upload_assignment(temp_file_path, object_name=object_name)
    finally:
        os.remove(temp_file_path)
    return file_url


cloudflare_service = CloudflareUploadService(Config())
