import os
import random
import time
from googleapiclient.errors import HttpError
from googleapiclient.discovery import build
from google.oauth2 import service_account
from googleapiclient.http import MediaFileUpload
from utils.logger import logger

class Config:
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/mydb')
    SECRET_KEY = os.getenv('SECRET_KEY')
    CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:3000,*').split(',')
    ADMIN_TOKEN = os.getenv('ADMIN_TOKEN', 'yfuyiuytu')
    EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')
    REDIS_HOST = os.getenv('REDIS_HOST')
    REDIS_PORT = os.getenv('REDIS_PORT')
    REDIS_PASSWORD = os.getenv('REDIS_PASSWORD')
    RECAPTCHA_SECRET_KEY = os.getenv('RECAPTCHA_SECRET_KEY')
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'
    GOOGLE_SERVICE_ACCOUNT_TYPE = os.getenv('GOOGLE_SERVICE_ACCOUNT_TYPE')
    GOOGLE_PROJECT_ID = os.getenv('GOOGLE_PROJECT_ID')
    GOOGLE_PRIVATE_KEY_ID = os.getenv('GOOGLE_PRIVATE_KEY_ID')
    GOOGLE_PRIVATE_KEY = os.getenv('GOOGLE_PRIVATE_KEY').replace('\\n', '\n') 
    GOOGLE_CLIENT_EMAIL = os.getenv('GOOGLE_CLIENT_EMAIL')
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
    GOOGLE_AUTH_URI = os.getenv('GOOGLE_AUTH_URI')
    GOOGLE_TOKEN_URI = os.getenv('GOOGLE_TOKEN_URI')
    GOOGLE_AUTH_PROVIDER_X509_CERT_URL = os.getenv('GOOGLE_AUTH_PROVIDER_X509_CERT_URL')
    GOOGLE_CLIENT_X509_CERT_URL = os.getenv('GOOGLE_CLIENT_X509_CERT_URL')