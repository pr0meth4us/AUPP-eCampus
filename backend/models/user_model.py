from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from services.mongo_service import db
from typing import List, Optional, Dict, Any


class User:
    COLLECTION = db.users

    def __init__(self, name: str, email: str, password: str, role: str,
                 bio: Optional[str] = None, profile_image: Optional[str] = None,
                 courses: Optional[List[str]] = None, expertise: Optional[List[str]] = None):
        self._id = None
        self.name = name
        self.email = email
        self.password_hash = generate_password_hash(password)
        self.role = role
        self.bio = bio or ""
        self.profile_image = profile_image or ""
        self.courses = [ObjectId(cid) for cid in (courses or [])]
        self.expertise = expertise or []  # Only for instructors

    def to_dict(self) -> Dict[str, Any]:
        data = {
            '_id': str(self._id) if self._id else None,
            'name': self.name,
            'email': self.email,
            'password_hash': self.password_hash,
            'role': self.role,
            'bio': self.bio,
            'profile_image': self.profile_image,
            'courses': [str(cid) for cid in self.courses]
        }
        if self.role == 'instructor':
            data['expertise'] = self.expertise
        return data

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'User':
        user = cls(
            name=data['name'],
            email=data['email'],
            password='',  # Password not stored plain
            role=data['role'],
            bio=data.get('bio'),
            profile_image=data.get('profile_image'),
            courses=data.get('courses', []),
            expertise=data.get('expertise', [])
        )
        user._id = data.get('_id')
        user.password_hash = data['password_hash']
        return user

    def save(self) -> str:
        if self.COLLECTION.find_one({'email': self.email}):
            raise ValueError(f"Email '{self.email}' is already in use.")
        data = self.to_dict()
        data.pop('_id', None)
        result = self.COLLECTION.insert_one(data)
        self._id = result.inserted_id
        return str(self._id)

    @classmethod
    def find_by_id(cls, user_id: str) -> Optional['User']:
        data = cls.COLLECTION.find_one({'_id': ObjectId(user_id)})
        return cls.from_dict(data) if data else None

    @classmethod
    def find_by_email(cls, email: str) -> Optional['User']:
        data = cls.COLLECTION.find_one({'email': email})
        return cls.from_dict(data) if data else None

    @classmethod
    def search_users(cls, query: str, role: Optional[str] = None) -> List['User']:
        """Search users by name or email with optional role filter."""
        search_filter = {
            '$or': [
                {'name': {'$regex': query, '$options': 'i'}},  # Case-insensitive
                {'email': {'$regex': query, '$options': 'i'}}
            ]
        }
        if role:
            search_filter['role'] = role
        data = cls.COLLECTION.find(search_filter).limit(50)  # Limit for performance
        return [cls.from_dict(user) for user in data]

    def update(self, **kwargs) -> None:
        update_data = {}
        for key, value in kwargs.items():
            if key == 'password':
                update_data['password_hash'] = generate_password_hash(value)
            elif key == 'courses':
                update_data[key] = [ObjectId(cid) for cid in value]
            elif key in ['name', 'email', 'bio', 'profile_image', 'expertise']:
                update_data[key] = value
        if 'email' in update_data and update_data['email'] != self.email:
            if self.COLLECTION.find_one({'email': update_data['email'], '_id': {'$ne': self._id}}):
                raise ValueError(f"Email '{update_data['email']}' is already in use.")
        result = self.COLLECTION.update_one({'_id': self._id}, {'$set': update_data})
        if result.modified_count == 0:
            raise ValueError("No changes made or user not found.")

    def delete(self) -> None:
        result = self.COLLECTION.delete_one({'_id': self._id})
        if result.deleted_count == 0:
            raise ValueError("User not found.")

    @classmethod
    def get_all(cls, role: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all users, optionally filtered by role."""
        query = {'role': role} if role else {}
        pipeline = [
            {'$match': query},
            {'$project': {
                '_id': {'$toString': '$_id'},
                'name': 1,
                'email': 1,
                'role': 1
            }}
        ]
        return list(cls.COLLECTION.aggregate(pipeline))

    @staticmethod
    def verify_password(stored_hash: str, provided_password: str) -> bool:
        return check_password_hash(stored_hash, provided_password)

    def add_course(self, course_id: str) -> None:
        if ObjectId(course_id) not in self.courses:
            self.COLLECTION.update_one(
                {'_id': self._id},
                {'$addToSet': {'courses': ObjectId(course_id)}}
            )
            self.courses.append(ObjectId(course_id))

    def remove_course(self, course_id: str) -> None:
        if ObjectId(course_id) in self.courses:
            self.COLLECTION.update_one(
                {'_id': self._id},
                {'$pull': {'courses': ObjectId(course_id)}}
            )
            self.courses.remove(ObjectId(course_id))
