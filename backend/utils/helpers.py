from bson import ObjectId
from datetime import datetime

def serialize_object(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, list):
        return [serialize_object(item) for item in obj]
    elif isinstance(obj, dict):
        return {key: serialize_object(value) for key, value in obj.items()}
    return obj


def serialize_document(doc):
    """
    Recursively converts ObjectId and datetime fields in a document to JSON-serializable formats.
    """
    if isinstance(doc, list):
        return [serialize_document(item) for item in doc]
    elif isinstance(doc, dict):
        return {
            key: serialize_document(value)
            for key, value in doc.items()
        }
    elif isinstance(doc, ObjectId):
        return str(doc)
    elif isinstance(doc, datetime):
        return doc.isoformat()
    else:
        return doc
