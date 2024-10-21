FROM python:3.13-slim

WORKDIR /app

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend ./

COPY backend/.env ./
COPY backend/youtube-credentials.json ./

EXPOSE 5001

ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

CMD ["flask", "run"]
