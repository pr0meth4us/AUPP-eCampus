from flask import current_app
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload


def get_youtube_credentials():
    return Credentials(
        token=None,
        refresh_token=current_app.config['YOUTUBE_REFRESH_TOKEN'],
        token_uri=current_app.config['YOUTUBE_TOKEN_URI'],
        client_id=current_app.config['YOUTUBE_CLIENT_ID'],
        client_secret=current_app.config['YOUTUBE_CLIENT_SECRET']
    )


def upload_video_to_youtube(video_file, title, description):
    credentials = get_youtube_credentials()
    youtube = build('youtube', 'v3', credentials=credentials)

    request_body = {
        'snippet': {
            'title': title,
            'description': description,
            'tags': ['education', 'course'],
            'categoryId': '27'  # Education category
        },
        'status': {
            'privacyStatus': 'unlisted'
        }
    }

    media = MediaFileUpload(video_file, resumable=True)

    response = youtube.videos().insert(
        part='snippet,status',
        body=request_body,
        media_body=media
    ).execute()

    return f"https://www.youtube.com/watch?v={response['id']}"
