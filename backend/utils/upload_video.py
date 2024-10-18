from services.youtube_service import upload_to_youtube
from services.cloudinary_service import upload_to_cloudinary
from utils.logger import logger


def upload_video(video_file, title, description, category_id='27', privacy_status='unlisted', tags=None):
    try:
        logger.info("Uploading video to YouTube...")
        return upload_to_youtube(video_file, title, description, category_id, privacy_status, tags)

    except Exception as e:
        logger.info("Fallback to Cloudinary upload due to error in YouTube upload.")
        logger.error(f"Error: {str(e)}")

        video_url, thumbnail_url = upload_to_cloudinary(video_file, title)
        return video_url, thumbnail_url
