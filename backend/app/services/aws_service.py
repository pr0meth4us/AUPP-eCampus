import logging
import boto3
from config import Config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

s3 = boto3.client(
    's3',
    aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
    region_name='ap-southeast-2'
)

BUCKET_NAME = 'auppecampus'


def upload_to_s3(image_file, title):
    public_id = title.strip()

    s3.upload_fileobj(
        image_file,
        BUCKET_NAME,
        public_id,
        ExtraArgs={
            'ACL': 'public-read',
            'ContentType': image_file.content_type
        }
    )

    image_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{public_id}"
    logger.info(f"Uploaded image to S3: {image_url}")
    return image_url


def delete_from_s3(public_id):
    s3.delete_object(Bucket=BUCKET_NAME, Key=public_id)
    logger.info(f"Image with public ID {public_id} deleted from S3.")


def retrieve_all_images_from_s3():
    response = s3.list_objects_v2(Bucket=BUCKET_NAME)
    image_urls = []

    if 'Contents' in response:
        for obj in response['Contents']:
            public_id = obj['Key']
            image_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{public_id}"
            image_urls.append({'public_id': public_id, 'url': image_url})

    logger.info(f"Retrieved resources: {image_urls}")
    return image_urls
