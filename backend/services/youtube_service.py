import random
import time
from googleapiclient.errors import HttpError
from googleapiclient.discovery import build
from google.oauth2 import service_account
from googleapiclient.http import MediaFileUpload
from config import Config
from utils.logger import logger

SERVICE_ACCOUNT_INFO = {
    "type": Config.GOOGLE_SERVICE_ACCOUNT_TYPE,
    "project_id": Config.GOOGLE_PROJECT_ID,
    "private_key_id": Config.GOOGLE_PRIVATE_KEY_ID,
    "private_key": Config.GOOGLE_PRIVATE_KEY,
    "client_email": Config.GOOGLE_CLIENT_EMAIL,
    "client_id": Config.GOOGLE_CLIENT_ID,
    "auth_uri": Config.GOOGLE_AUTH_URI,
    "token_uri": Config.GOOGLE_TOKEN_URI,
    "auth_provider_x509_cert_url": Config.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": Config.GOOGLE_CLIENT_X509_CERT_URL
}

SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"
MAX_RETRIES = 10
RETRIABLE_STATUS_CODES = [500, 502, 503, 504]


def get_authenticated_service():
    credentials = service_account.Credentials.from_service_account_info(SERVICE_ACCOUNT_INFO, scopes=SCOPES)
    return build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, credentials=credentials)


def resumable_upload(insert_request):
    response = None
    retry = 0
    while response is None:
        try:
            status, response = insert_request.next_chunk()
            if response and 'id' in response:
                logger.info(f"Video id '{response['id']}' successfully uploaded.")
                return f"https://www.youtube.com/watch?v={response['id']}"
        except HttpError as e:
            if e.resp.status in RETRIABLE_STATUS_CODES:
                logger.warning(f"Retriable HTTP error {e.resp.status} occurred. Retrying...")
            else:
                raise e
        retry += 1
        if retry > MAX_RETRIES:
            logger.error("Max retries reached. Upload failed.")
            raise Exception("Max retries reached.")
        sleep_seconds = random.random() * (2 ** retry)
        logger.info(f"Sleeping {sleep_seconds} seconds before retrying...")
        time.sleep(sleep_seconds)


def upload_to_youtube(video_file, title, description, category_id='27', privacy_status='unlisted', tags=None):
    try:
        youtube = get_authenticated_service()

        body = {
            "snippet": {
                "title": title,
                "description": description,
                "tags": tags.split(",") if tags else None,
                "categoryId": category_id
            },
            "status": {
                "privacyStatus": privacy_status
            }
        }

        insert_request = youtube.videos().insert(
            part=",".join(body.keys()),
            body=body,
            media_body=MediaFileUpload(video_file, chunksize=-1, resumable=True)
        )
        video_url = resumable_upload(insert_request)
        video_id = video_url.split("=")[-1]
        video_details = youtube.videos().list(part='snippet', id=video_id).execute()
        thumbnail_url = video_details['items'][0]['snippet']['thumbnails']['high']['url']

        return video_url, thumbnail_url

    except HttpError as e:
        logger.error(f"HTTP error {e.resp.status} occurred during YouTube upload. Error details:\n{e.content}")
        raise e


def delete_from_youtube(video_id):
    try:
        youtube = get_authenticated_service()
        youtube.videos().delete(id=video_id).execute()
        logger.info(f"Video with ID {video_id} deleted from YouTube.")
    except Exception as e:
        logger.error(f"Failed to delete video from YouTube: {str(e)}")
