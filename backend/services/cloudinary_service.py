import cloudinary
import cloudinary.uploader
import cloudinary.api
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
        resource_type='video',
        public_id=title
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


def retrieve_all_video_from_cloudinary():
    try:
        resources = cloudinary.api.resources(resource_type="video")
        video_urls = []
        for resource in resources.get('resources', []):
            public_id = resource.get('public_id')
            url = resource.get('secure_url')
            thumbnail_url = url.replace('/upload/', '/upload/c_scale,w_300,h_300,f_jpg/')
            video_urls.append({'public_id': public_id, 'url': url, 'thumbnail_url': thumbnail_url})

        logger.info(f"Retrieved resources: {video_urls}")
        return video_urls
    except Exception as e:
        logger.error(f"Failed to retrieve videos from Cloudinary: {str(e)}")
        return None
