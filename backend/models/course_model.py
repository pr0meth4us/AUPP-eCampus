from datetime import datetime
from bson import ObjectId
from services.mongo_service import db


class Course:
    @classmethod
    def _coll(cls):
        return db.courses

    def __init__(self, data: dict):
        # All fields come in correct BSON types now.
        self._id = data.get("_id")                    # ObjectId
        self.title = data.get("title")                # string
        self.description = data.get("description")    # string
        self.instructor_id = data.get("instructor_id")# ObjectId
        self.uploader_id = data.get("uploader_id")    # ObjectId
        self.cover_image_url = data.get("cover_image_url")
        self.major_ids = data.get("major_ids", [])    # list of ObjectId
        self.tag_ids = data.get("tag_ids", [])        # list of ObjectId
        self.price = data.get("price")                # string or number
        self.enrolled_students = data.get("enrolled_students", [])  # list of ObjectId
        self.assignments = data.get("assignments", [])              # list of ObjectId
        self.modules = data.get("modules", [])                    # list of ObjectId

        # These are real datetime objects because of the migration
        self.created_at = data.get("created_at")      # datetime
        self.updated_at = data.get("updated_at")      # datetime

    @classmethod
    def save(cls, payload: dict) -> str:
        now = datetime.utcnow()
        doc = {
            "title": payload["title"],
            "description": payload["description"],
            "instructor_id": ObjectId(payload["instructor_id"]),
            "uploader_id": ObjectId(payload["uploader_id"]),
            "cover_image_url": payload.get("cover_image_url"),
            "major_ids": [ObjectId(mid) for mid in payload.get("major_ids", [])],
            "tag_ids": [ObjectId(tid) for tid in payload.get("tag_ids", [])],
            "price": payload.get("price"),
            "enrolled_students": [],
            "assignments": [],
            "modules": [],
            "created_at": now,
            "updated_at": now
        }
        result = cls._coll().insert_one(doc)
        return str(result.inserted_id)

    @classmethod
    def update(cls, course_id: str, payload: dict) -> None:
        now = datetime.utcnow()
        set_fields = {}
        for key in ["title", "description", "price"]:
            if key in payload:
                set_fields[key] = payload[key]
        if "instructor_id" in payload:
            set_fields["instructor_id"] = ObjectId(payload["instructor_id"])
        if "uploader_id" in payload:
            set_fields["uploader_id"] = ObjectId(payload["uploader_id"])
        if "tag_ids" in payload:
            set_fields["tag_ids"] = [ObjectId(t) for t in payload["tag_ids"]]
        if "major_ids" in payload:
            set_fields["major_ids"] = [ObjectId(m) for m in payload["major_ids"]]

        set_fields["updated_at"] = now
        cls._coll().update_one(
            {"_id": ObjectId(course_id)},
            {"$set": set_fields}
        )

    @classmethod
    def enroll_student(cls, course_id: str, student_id: str) -> None:
        cls._coll().update_one(
            {"_id": ObjectId(course_id)},
            {
                "$addToSet": {"enrolled_students": ObjectId(student_id)},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )

    @classmethod
    def delete(cls, course_id: str) -> None:
        from .module_model import Module
        from .assignment_model import Assignment

        Module._coll().delete_many({"course_id": ObjectId(course_id)})
        Assignment._coll().delete_many({"course_id": ObjectId(course_id)})
        cls._coll().delete_one({"_id": ObjectId(course_id)})

    @classmethod
    def find_instance_by_id(cls, course_id: str):
        doc = cls._coll().find_one({"_id": ObjectId(course_id)})
        return cls(doc) if doc else None

    @classmethod
    def find_by_id(cls, course_id: str) -> dict:
        doc = cls._coll().find_one({"_id": ObjectId(course_id)})
        return cls(doc).to_dict() if doc else None

    @classmethod
    def find_all(cls) -> list:
        docs = cls._coll().find()
        return [cls(d).to_dict() for d in docs]

    @classmethod
    def find_by_user(cls, user_id: str, role: str = None) -> list:
        user_oid = ObjectId(user_id)
        if role == "instructor":
            query = {"instructor_id": user_oid}
        elif role == "student":
            query = {"enrolled_students": user_oid}
        else:
            query = {
                "$or": [
                    {"instructor_id": user_oid},
                    {"enrolled_students": user_oid}
                ]
            }
        docs = cls._coll().find(query)
        return [cls(d).to_dict() for d in docs]

    def to_dict(self) -> dict:
        return {
            "_id": str(self._id),
            "title": self.title,
            "description": self.description,
            "instructor_id": str(self.instructor_id),
            "uploader_id": str(self.uploader_id),
            "cover_image_url": self.cover_image_url,
            "major_ids": [str(mid) for mid in self.major_ids],
            "tag_ids": [str(tid) for tid in self.tag_ids],
            "price": self.price,
            "enrolled_students": [str(s) for s in self.enrolled_students],
            "assignments": [str(a) for a in self.assignments],
            "modules": [str(m) for m in self.modules],
            # .isoformat() is safe because these are always datetime objects now
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }

    def to_preview_dict(self) -> dict:
        return {
            "_id": str(self._id),
            "title": self.title,
            "description": self.description,
            "cover_image_url": self.cover_image_url,
            "price": self.price,
        }
