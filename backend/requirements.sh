#!/bin/bash

# Activate the virtual environment if it exists
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
else
    echo "No virtual environment found. Please create one first."
    exit 1
fi

# Install the necessary packages
echo "Freezing current package versions..."
pip freeze > requirements.txt

# Confirm that the requirements.txt file has been created
if [ -f "requirements.txt" ]; then
    echo "Requirements have been frozen into requirements.txt"
else
    echo "Failed to create requirements.txt"
    exit 1
fi
