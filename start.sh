# Function to kill processes on Windows
function Kill-ProcessesWindows {
  $pids = netstat -ano | Select-String ':5001|:3000' | ForEach-Object { $_.Line.Split()[-1] } | Sort-Object -Unique
  if (-not $pids) {
    Write-Host "No process is running on port 5001 or port 3000."
  } else {
    Write-Host "The following processes are running on ports 5001 or 3000:"
    Write-Host $pids
    $confirm = Read-Host "Are you sure you want to kill these processes? (y/n)"
    if ($confirm -eq 'y' -or $confirm -eq 'Y') {
      foreach ($pid in $pids) {
        Stop-Process -Id $pid -Force
        Write-Host "Killed process $pid."
      }
    } else {
      Write-Host "Processes not killed."
      exit 1
    }
  }
}

# Check OS and run the appropriate function
if ($IsWindows) {
  Kill-ProcessesWindows
} else {
  Write-Host "This script is for Windows. For Unix-like systems, please use the Unix version."
  exit 1
}

# Frontend setup
cd ./frontend
npm install
npm start &

# Backend setup
cd ../backend

# Check if virtual environment exists, if not create one
if (-not (Test-Path "venv")) {
  python -m venv venv
}

# Activate the virtual environment
& venv/Scripts/Activate.ps1

# Install Python dependencies
pip install -r requirements.txt

# Export the Flask app and start it
$env:FLASK_APP = "app.py"
flask run --host=0.0.0.0 --port=5001 &
