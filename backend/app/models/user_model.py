from bson import ObjectId
from app.services.mongo_service import db
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
        self.expertise = expertise or []

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
        """
        Saves or Upserts the user.
        If self._id is set (from Bifrost), we upsert based on that ID.
        """
        data = self.to_dict()
        doc_id = data.pop('_id', None)

        if doc_id:
            # Sync Logic: Update if exists, Insert if not, using the Bifrost ID
            self._coll().update_one(
                {'_id': ObjectId(doc_id)},
                {'$set': data},
                upsert=True
            )
            self._id = ObjectId(doc_id)
        else:
            # Fallback for manual creation without ID (should be rare now)
            if self._coll().find_one({'email': self.email}):
                raise ValueError(f"Email '{self.email}' is already in use.")
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

    # ... (Keep find_by_email, search_users, update, delete, get_all, add_course, remove_course as they were) ...
    # (Just ensure they use cls._coll() instead of db.users directly if you changed that pattern)
    @classmethod
    def find_by_email(cls, email: str) -> Optional['User']:
        data = cls._coll().find_one({'email': email})
        return cls.from_dict(data) if data else None

    @classmethod
    def search_users(cls, query: str, role: Optional[str] = None) -> List['User']:
        search_filter = {
            '$or': [
                {'name': {'$regex': query, '$options': 'i'}},
                {'email': {'$regex': query, '$options': 'i'}}
            ]
        }
        if role:
            search_filter['role'] = role
        data = cls._coll().find(search_filter).limit(50)
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

        self._coll().update_one({'_id': self._id}, {'$set': update_data})

    def delete(self) -> None:
        result = self._coll().delete_one({'_id': self._id})
        if result.deleted_count == 0:
            raise ValueError("User not found.")

    @classmethod
    def get_all(cls, role: Optional[str] = None) -> List[Dict[str, Any]]:
        query = {'role': role} if role else {}
        pipeline = [
            {'$match': query},
            {'$project': {
                '_id': {'$toString': '$_id'},
                'name': 1, 'email': 1, 'role': 1
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