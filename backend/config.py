import os

class Config:
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/mydb')
    SECRET_KEY = os.getenv('SECRET_KEY', 'b4584b3bfb7d11c2f51a9b759cd63efd8d611a6a4b4313f844de38cc1c55d298')
    CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:3000,*').split(',')
    ADMIN_TOKEN = os.getenv('ADMIN_TOKEN', 'yfuyiuytu')
    EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')
    REDIS_HOST = os.getenv('REDIS_HOST')
    REDIS_PORT = os.getenv('REDIS_PORT')
    REDIS_PASSWORD = os.getenv('REDIS_PASSWORD')
    RECAPTCHA_SECRET_KEY = os.getenv('RECAPTCHA_SECRET_KEY')
    YOUTUBE_CLIENT_ID = os.getenv('YOUTUBE_CLIENT_ID')
    YOUTUBE_CLIENT_SECRET = os.getenv('YOUTUBE_CLIENT_SECRET')
    YOUTUBE_PROJECT_ID = os.getenv('YOUTUBE_PROJECT_ID')
    YOUTUBE_REDIRECT_URIS = os.getenv('YOUTUBE_REDIRECT_URIS', 'http://localhost').split(',')
    YOUTUBE_AUTH_URI = os.getenv('YOUTUBE_AUTH_URI', 'https://accounts.google.com/o/oauth2/auth')
    YOUTUBE_TOKEN_URI = os.getenv('YOUTUBE_TOKEN_URI', 'https://oauth2.googleapis.com/token')
    YOUTUBE_AUTH_PROVIDER_CERT_URL = os.getenv('YOUTUBE_AUTH_PROVIDER_CERT_URL', 'https://www.googleapis.com/oauth2/v1/certs')
    JWT_SECRET_KEY = 'your-secret-key'  # Replace with your actual secret key
    JWT_TOKEN_LOCATION = ['headers']  # This specifies where to look for the JWT
    JWT_HEADER_NAME = 'Authorization'  # The name of the header to look for the JWT
    JWT_HEADER_TYPE = 'Bearer'
