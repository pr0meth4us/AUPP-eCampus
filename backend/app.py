from flask import Flask, request, jsonify
from pymongo import MongoClient
from minio import Minio
from minio.error import S3Error
import os

app = Flask(__name__)

# MongoDB configuration
mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/mydb')
mongo_client = MongoClient(mongo_uri)
db = mongo_client.mydb

# MinIO configuration
minio_client = Minio(
    os.getenv('MINIO_ENDPOINT', 'localhost:9000'),  # Just the hostname and port
    access_key=os.getenv('MINIO_ACCESS_KEY', 'minio'),
    secret_key=os.getenv('MINIO_SECRET_KEY', 'minio123'),
    secure=False  # Secure=False means using HTTP
)

@app.route('/data', methods=['POST'])
def add_data():
    data = request.json
    result = db.collection.insert_one(data)
    return jsonify({'_id': str(result.inserted_id)})

@app.route('/files/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    filename = file.filename
    try:
        minio_client.put_object(
            'mybucket', filename, file.stream, file.content_length
        )
        return jsonify({'message': 'File uploaded successfully'}), 201
    except S3Error as e:
        return jsonify({'error': str(e)}), 500

@app.route('/files/<filename>', methods=['GET'])
def get_file(filename):
    try:
        response = minio_client.get_object('mybucket', filename)
        return response.read(), 200
    except S3Error as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
