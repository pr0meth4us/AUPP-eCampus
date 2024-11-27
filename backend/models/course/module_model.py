import boto3
from datetime import datetime
from services.mongo_service import db
from bson import ObjectId
import os


class Module:
    def __init__(self, course_id, title, description, _id=None, created_at=None, updated_at=None):
        self._id = _id
        self.course_id = ObjectId(course_id)  # Store as ObjectId
        self.title = title
        self.description = description
        self.created_at = created_at or datetime.now()
        self.updated_at = updated_at or datetime.now()

    def to_dict(self):
        return {
            '_id': str(self._id) if self._id else None,
            'course_id': str(self.course_id),
            'title': self.title,
            'description': self.description,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

    def save_to_db(self):
        module_data = self.to_dict()
        module_data.pop('_id')  # Do not include _id when inserting into DB
        result = db.modules.insert_one(module_data)
        self._id = result.inserted_id
        return str(self._id)

    def create_module(self):
        """Creates a folder on S3 or other storage for the module."""
        folder_name = f"course_{self.course_id}_module_{self._id}"

        # AWS Region for the bucket
        region = 'ap-southeast-2'  # Set your S3 bucket region here

        # Assuming you are using AWS S3 with boto3
        s3_client = boto3.client(
            's3',
            region_name=region,
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
        )

        # Create the folder in the S3 bucket
        s3_client.put_object(Bucket='auppecampus', Key=f'{folder_name}/')

        # Save the module in the database
        self.save_to_db()

    @staticmethod
    def get_by_course(course_id):
        return list(db.modules.find({'course_id': ObjectId(course_id)}))

    @staticmethod
    def find_by_id(module_id):
        return db.modules.find_one({'_id': ObjectId(module_id)})