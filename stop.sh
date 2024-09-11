#!/bin/bash

docker-compose down

pkill -f 'flask run'
pkill -f 'npm start'