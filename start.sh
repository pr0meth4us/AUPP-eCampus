#!/bin/bash

docker-compose up -d

cd ./frontend || exit 1
npm install
npm start &

cd ../backend || exit 1

if [ ! -d "venv" ]; then
  python3 -m venv venv
fi

source venv/bin/activate

pip install -r requirements.txt

export FLASK_APP=app.py

flask run --host=0.0.0.0 --port=5001 &