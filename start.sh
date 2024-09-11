#!/bin/bash

docker-compose up -d

cd ./frontend || exit
npm install
npm start &

cd ../backend || exit
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt
export FLASK_APP=app.py
flask run &
