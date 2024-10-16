import cloudinary
import cloudinary.uploader
from config import Config
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

cloudinary.config(
    cloud_name=Config.CLOUDINARY_CLOUD_NAME,
    api_key=Config.CLOUDINARY_API_KEY,
    api_secret=Config.CLOUDINARY_API_SECRET,
)


def upload_to_cloudinary(video_file, title):
    upload_result = cloudinary.uploader.upload(
        video_file,
        resource_type='video'
    )

    video_url = upload_result['secure_url']
    thumbnail_url = video_url.replace('/upload/', '/upload/c_scale,w_300,h_300,f_jpg/')

    return video_url, thumbnail_url


def delete_from_cloudinary(public_id):
    try:
        cloudinary.uploader.destroy(public_id, resource_type='video')
        logging.info(f"Video with public ID {public_id} deleted from Cloudinary.")
    except Exception as e:
        logging.error(f"Failed to delete video from Cloudinary: {str(e)}")
