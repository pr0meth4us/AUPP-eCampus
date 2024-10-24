#!/bin/bash

# Function to kill processes on macOS and Linux
kill_processes_unix() {
  pids=$(lsof -t -i:5001 -i:3000)
  if [ -z "$pids" ]; then
    echo "No process is running on port 5001 or port 3000."
  else
    echo "The following processes are running on ports 5001 or 3000:"
    echo "$pids"
    read -p "Are you sure you want to kill these processes? (y/n): " confirm
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
      for pid in $pids; do
        if [[ "$pid" =~ ^[0-9]+$ ]]; then
          kill -9 "$pid"
          echo "Killed process $pid."
        else
          echo "Invalid PID: $pid"
        fi
      done
    else
      echo "Processes not killed."
      exit 1
    fi
  fi
}

# Function to kill processes on Windows
kill_processes_windows() {
  pids=$(netstat -ano | findstr :5001 :3000 | awk '{print $5}' | sort | uniq)
  if [ -z "$pids" ]; then
    echo "No process is running on port 5001 or port 3000."
  else
    echo "The following processes are running on ports 5001 or 3000:"
    echo "$pids"
    read -p "Are you sure you want to kill these processes? (y/n): " confirm
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
      for pid in $pids; do
        taskkill //PID "$pid" //F
        echo "Killed process $pid."
      done
    else
      echo "Processes not killed."
      exit 1
    fi
  fi
}

# Determine OS and run the appropriate function
if [[ "$OSTYPE" == "linux-gnu"* || "$OSTYPE" == "darwin"* ]]; then
  kill_processes_unix
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
  kill_processes_windows
else
  echo "Unsupported OS."
  exit 1
fi

# Uncomment the following line if you want to start docker-compose services
# docker-compose up -d

# Frontend setup
cd ./frontend || exit 1
npm install
npm start &

# Backend setup
cd ../backend || exit 1

# Check if virtual environment exists, if not create one
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi

# Activate the virtual environment
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Export the Flask app and start it
export FLASK_APP=app.py
flask run --host=0.0.0.0 --port=5001 &