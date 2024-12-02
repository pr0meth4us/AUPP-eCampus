from pymongo import MongoClient, errors
from config import Config

mongo_client = None
db = None


def init_mongo():
    global mongo_client, db
    try:
        mongo_uri = Config.MONGO_URI
        print(f"Connecting to MongoDB using URI: {mongo_uri}")

        mongo_client = MongoClient(mongo_uri)
        db = mongo_client.get_database('auppEcampus')  # You can change the database name here

        if db is not None:
            print('MongoDB connected successfully!')
        else:
            print('Failed to connect to MongoDB')

    except errors.ConnectionError as e:
        print(f"Error connecting to MongoDB: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")


def insert_document(document):
    """
    Insert a document into the 'surveys' collection in MongoDB.

    Parameters:
    - document: dict, The document to insert into the collection.

    Returns:
    - The inserted document's ID as a string if successful, None if failed.
    """
    try:
        if db is None:
            print("Database connection not initialized.")
            return None

        # Insert the document into the 'surveys' collection
        result = db.surveys.insert_one(document)
        print(f"Document inserted with ID: {result.inserted_id}")
        return str(result.inserted_id)

    except errors.PyMongoError as e:
        print(f"Error inserting document: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error inserting document: {e}")
        return None
