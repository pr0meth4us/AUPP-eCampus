#!/bin/bash

echo "Starting Docker Compose services..."
docker-compose up -d

echo "Starting React frontend..."
cd ./frontend || exit
npm install
npm start &

echo "Starting Flask backend..."
cd ../backend || exit

if [ ! -d "venv" ]; then
  echo "Virtual environment not found, creating one..."
  python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt
export FLASK_APP=app.py
flask run &

echo "All services have been started!"
