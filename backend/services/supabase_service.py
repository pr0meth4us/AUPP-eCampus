import boto3
import os
from botocore.exceptions import ClientError
from config import Config
from utils.logger import logger


def upload_to_s3(file_object, destination_path):
    try:
        s3 = boto3.client(
            "s3",
            endpoint_url=Config.SUPABASE_S3_ENDPOINT,
            aws_access_key_id=Config.SUPABASE_S3_ACCESS_KEY,
            aws_secret_access_key=Config.SUPABASE_S3_SECRET_KEY,
            region_name=Config.SUPABASE_S3_REGION
        )
        print(Config.SUPABASE_S3_REGION)
        buckets = s3.list_buckets()
        print("Available buckets:",
              [bucket['Name'] for bucket in buckets['Buckets']])

        temp_filename = f"temp_{file_object.filename}"
        file_object.save(temp_filename)
        print(Config.SUPABASE_S3_BUCKET)

        s3.upload_file(temp_filename, Config.SUPABASE_S3_BUCKET, destination_path)

        public_url = f"{Config.SUPABASE_PUBLIC_URL}/storage/v1/object/public/{Config.SUPABASE_S3_BUCKET}/{destination_path}"
        logger.info(f"File uploaded to S3: {public_url}")

        os.remove(temp_filename)

        return public_url
    except ClientError as e:
        logger.error(f"Failed to upload file to S3: {e}")
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        raise e
