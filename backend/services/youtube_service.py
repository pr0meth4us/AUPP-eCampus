import random
import time
import httplib2
import logging
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload
from google.oauth2 import service_account
from config import Config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SERVICE_ACCOUNT_FILE = Config.GOOGLE_SERVICE_ACCOUNT_FILE
SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"
MAX_RETRIES = 10
RETRIABLE_EXCEPTIONS = (httplib2.HttpLib2Error, IOError)
RETRIABLE_STATUS_CODES = [500, 502, 503, 504]

VALID_PRIVACY_STATUSES = ("public", "private", "unlisted")


def get_authenticated_service():
    logger.info("Authenticating with YouTube API.")
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    return build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, credentials=credentials)


def initialize_upload(youtube, options):
    logger.info(f"Preparing to upload video: {options.title}")
    tags = options.keywords.split(",") if options.keywords else None

    body = dict(
        snippet=dict(
            title=options.title,
            description=options.description,
            tags=tags,
            categoryId=options.category
        ),
        status=dict(
            privacyStatus=options.privacyStatus
        )
    )

    insert_request = youtube.videos().insert(
        part=",".join(body.keys()),
        body=body,
        media_body=MediaFileUpload(options.file, chunksize=-1, resumable=True)
    )

    logger.info("Starting resumable upload.")
    return resumable_upload(insert_request)  # Return the video URL


def resumable_upload(insert_request):
    response = None
    error = None
    retry = 0
    while response is None:
        try:
            logger.info("Uploading file...")
            status, response = insert_request.next_chunk()
            if response is not None:
                if 'id' in response:
                    logger.info(f"Video id '{response['id']}' was successfully uploaded.")
                    return f"https://www.youtube.com/watch?v={response['id']}"
                else:
                    logger.error(f"The upload failed with an unexpected response: {response}")
                    exit(f"The upload failed with an unexpected response: {response}")
        except HttpError as e:
            if e.resp.status in RETRIABLE_STATUS_CODES:
                error = f"A retriable HTTP error {e.resp.status} occurred:\n{e.content}"
                logger.warning(error)
            else:
                logger.error(f"Non-retriable HTTP error occurred: {e.resp.status}\n{e.content}")
                raise
        except RETRIABLE_EXCEPTIONS as e:
            error = f"A retriable error occurred: {e}"
            logger.warning(error)

        if error is not None:
            retry += 1
            if retry > MAX_RETRIES:
                logger.error("No longer attempting to retry.")
                exit("No longer attempting to retry.")

            max_sleep = 2 ** retry
            sleep_seconds = random.random() * max_sleep
            logger.info(f"Sleeping {sleep_seconds} seconds and then retrying...")
            time.sleep(sleep_seconds)


def upload_video_to_youtube(video_file, title, description, category_id='27', privacy_status='unlisted', tags=None):
    logger.info("Starting video upload process.")
    youtube = get_authenticated_service()

    class Options:
        def __init__(self, file, title, description, category, privacy_status, keywords):
            self.file = file
            self.title = title
            self.description = description
            self.category = category
            self.privacyStatus = privacy_status
            self.keywords = keywords

    options = Options(video_file, title, description, category_id, privacy_status, tags)

    try:
        video_url = initialize_upload(youtube, options)
        return video_url
    except HttpError as e:
        logger.error(f"An HTTP error {e.resp.status} occurred:\n{e.content}")
        raise
