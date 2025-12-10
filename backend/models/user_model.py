from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from services.mongo_service import db
from typing import List, Optional, Dict, Any


class User:
    @classmethod
    def _coll(cls):
        return db.users

    def __init__(self, name: str, email: str, role: str,
                 _id: Optional[str] = None,
                 bio: Optional[str] = None, profile_image: Optional[str] = None,
                 courses: Optional[List[str]] = None, expertise: Optional[List[str]] = None):
        self._id = ObjectId(_id) if _id else None
        self.name = name
        self.email = email
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
        return cls(
            _id=data.get('_id'),
            name=data['name'],
            email=data['email'],
            role=data['role'],
            bio=data.get('bio'),
            profile_image=data.get('profile_image'),
            courses=data.get('courses', []),
            expertise=data.get('expertise', [])
        )

    def save(self) -> str:
        # Check for existing email using the collection method
        if self._coll().find_one({'email': self.email}):
            # If we are updating an existing user (we have an ID), ensure we aren't clashing with ANOTHER user
            if not self._id:
                raise ValueError(f"Email '{self.email}' is already in use.")

            # If we have an ID, we might be saving an existing object, but usually save() is for new inserts.
            # Ideally, upsert logic handles this, but sticking to your pattern:
            # If this is a new insert (no self._id), fail.
            pass

        data = self.to_dict()
        data.pop('_id', None)

        # Insert
        result = self._coll().insert_one(data)
        self._id = result.inserted_id
        return str(self._id)

    @classmethod
    def find_by_id(cls, user_id: str) -> Optional['User']:
        try:
            data = cls._coll().find_one({'_id': ObjectId(user_id)})
            return cls.from_dict(data) if data else None
        except:
            return None

    @classmethod
    def find_by_email(cls, email: str) -> Optional['User']:
        data = cls._coll().find_one({'email': email})
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
        data = cls._coll().find(search_filter).limit(50)  # Limit for performance
        return [cls.from_dict(user) for user in data]

    def update(self, **kwargs) -> None:
        update_data = {}
        for key, value in kwargs.items():
            if key == 'courses':
                update_data[key] = [ObjectId(cid) for cid in value]
            elif key in ['name', 'email', 'bio', 'profile_image', 'expertise']:
                update_data[key] = value

        if 'email' in update_data and update_data['email'] != self.email:
            if self._coll().find_one({'email': update_data['email'], '_id': {'$ne': self._id}}):
                raise ValueError(f"Email '{update_data['email']}' is already in use.")

        result = self._coll().update_one({'_id': self._id}, {'$set': update_data})
        if result.modified_count == 0 and result.matched_count == 0:
            # matched_count == 0 means user didn't exist
            pass

    def delete(self) -> None:
        result = self._coll().delete_one({'_id': self._id})
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
        return list(cls._coll().aggregate(pipeline))

    def add_course(self, course_id: str) -> None:
        if ObjectId(course_id) not in self.courses:
            self._coll().update_one(
                {'_id': self._id},
                {'$addToSet': {'courses': ObjectId(course_id)}}
            )
            self.courses.append(ObjectId(course_id))

    def remove_course(self, course_id: str) -> None:
        if ObjectId(course_id) in self.courses:
            self._coll().update_one(
                {'_id': self._id},
                {'$pull': {'courses': ObjectId(course_id)}}
            )
            self.courses.remove(ObjectId(course_id))