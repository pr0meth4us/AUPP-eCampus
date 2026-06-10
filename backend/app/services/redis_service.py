from config import Config
import redis

redis_client = redis.Redis(
    host=Config.REDIS_HOST,
    port=Config.REDIS_PORT,
    password=Config.REDIS_PASSWORD,
    decode_responses=True
)
