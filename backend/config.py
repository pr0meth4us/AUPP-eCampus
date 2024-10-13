import os

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
    GOOGLE_SERVICE_ACCOUNT_FILE = os.getenv('GOOGLE_SERVICE_ACCOUNT_FILE', 'youtube-credentials.json')
    CLOUDINARY_CLOUD_NAME = 'dpjhgw3sd'
    CLOUDINARY_API_KEY = '293292133628933'
    CLOUDINARY_API_SECRET = 'BHAS5TcukTsbpSzGbi4sx_jqwqs'
