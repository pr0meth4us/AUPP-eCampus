#!/bin/bash

echo "Starting Docker Compose services..."
docker-compose up -d

# Navigate to the React frontend directory and start the development server
echo "Starting React frontend..."
cd ./frontend
npm install
npm start &

# Navigate to the Flask backend directory and start the Flask server
echo "Starting Flask backend..."
cd ../backend  # Go back to the root, then into the backend directory
source venv/bin/activate
pip install -r requirements.txt
export FLASK_APP=app.py
flask run &

echo "All services have been started!"
