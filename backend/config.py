import os


class Config:
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/mydb')
    SECRET_KEY = os.getenv('SECRET_KEY', 'b4584b3bfb7d11c2f51a9b759cd63efd8d611a6a4b4313f844de38cc1c55d298')
    CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:3000,*').split(',')
    ADMIN_TOKEN = os.getenv('ADMIN_TOKEN', 'yfuyiuytu')
    EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')
