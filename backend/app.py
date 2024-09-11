from flask import Flask, request, jsonify
from pymongo import MongoClient
from minio import Minio
from minio.error import S3Error
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Allow only requests from the React app

# MongoDB configuration
mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/mydb')
mongo_client = MongoClient(mongo_uri)
db = mongo_client.mydb

# MinIO configuration
minio_client = Minio(
    os.getenv('MINIO_ENDPOINT', 'localhost:9000'),
    access_key=os.getenv('MINIO_ACCESS_KEY', 'minio'),
    secret_key=os.getenv('MINIO_SECRET_KEY', 'minio123'),
    secure=False
)

# Ensure the bucket exists
bucket_name = 'mybucket'
if not minio_client.bucket_exists(bucket_name):
    minio_client.make_bucket(bucket_name)

@app.route('/data', methods=['POST'])
def add_data():
    data = request.json
    result = db.my_collection.insert_one(data)
    return jsonify({'_id': str(result.inserted_id)})

@app.route('/files/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    filename = file.filename
    try:
        minio_client.put_object(
            bucket_name, filename, file.stream, file.content_length or len(file.read())
        )
        return jsonify({'message': 'File uploaded successfully'}), 201
    except S3Error as e:
        return jsonify({'error': str(e)}), 500

@app.route('/files/<filename>', methods=['GET'])
def get_file(filename):
    try:
        response = minio_client.get_object(bucket_name, filename)
        file_data = response.read()
        response.close()  # Ensure the stream is closed
        return file_data, 200
    except S3Error as e:
        return jsonify({'error': str(e)}), 500

# Test endpoint
@app.route('/test', methods=['GET'])
def test_endpoint():
    return jsonify({'message': 'Test endpoint is working!'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)