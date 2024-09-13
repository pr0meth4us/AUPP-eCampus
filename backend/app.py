from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from routes.auth_routes import auth_bp
from models import User, Authentication
from utils import create_token
import os
import traceback

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Allow only requests from the React app

# MongoDB configuration
mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/mydb')
mongo_client = MongoClient(mongo_uri)
db = mongo_client.mydb

# Register authentication routes
app.register_blueprint(auth_bp, url_prefix='/auth')

# Test endpoint
@app.route('/test', methods=['GET'])
def test_endpoint():
    return jsonify({'message': 'Test endpoint is working!'}), 200

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal Server Error', 'details': traceback.format_exc()}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
