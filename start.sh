#!/bin/bash

pids=$(lsof -t -i:5001 -i:3000)

if [ -z "$pids" ]; then
  echo "No process is running on port 5000 or port 3000."
else
  for pid in $pids; do
    if [[ "$pid" =~ ^[0-9]+$ ]]; then
      kill -9 "$pid"
      echo "Killed process $pid."
    else
      echo "Invalid PID: $pid"
    fi
  done
fi
#docker-compose up -d

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