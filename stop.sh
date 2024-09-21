#!/bin/bash

docker-compose down

pkill -f 'flask run'
pkill -f 'npm start'

pids=$(lsof -t -i:5000 -i:3000)

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