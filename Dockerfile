FROM python:3.12.7-slim
WORKDIR /app/backend

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./

EXPOSE 5001

ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5001

CMD ["gunicorn", "-b", "0.0.0.0:5001", "--workers", "4", "--threads", "2", "--log-level", "debug", "--access-logfile", "-", "--error-logfile", "-", "app:app"]
