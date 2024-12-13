from datetime import datetime, timezone
from bson import ObjectId
from services.mongo_service import db
from models.course.assignment_model import Assignment
from models.course.tag_model import Tag
from models.course.major_model import Major
from models.user_model import User

class Course:
    def __init__(self, title, description, instructor_id, uploader_id, major_ids, tag_ids, price, cover_image_url=None,
                 enrolled_students=None, assignments=None, modules=None, _id=None, created_at=None, updated_at=None):
        self._id = ObjectId(_id) if _id else None
        self.title = title
        self.description = description
        self.instructor_id = ObjectId(instructor_id)
        self.uploader_id = ObjectId(uploader_id)
        self.cover_image_url = cover_image_url
        self.major_ids = [ObjectId(mid) for mid in major_ids]
        self.tag_ids = [ObjectId(tid) for tid in tag_ids]
        self.price = price
        self.enrolled_students = enrolled_students or []
        self.assignments = assignments or []
        self.modules = modules or []
        self.created_at = created_at or datetime.now(timezone.utc)
        self.updated_at = updated_at or datetime.now(timezone.utc)

    def to_dict(self):
        return {
            "_id": str(self._id) if self._id else None,
            "title": self.title,
            "description": self.description,
            "instructor_id": str(self.instructor_id),
            "uploader_id": str(self.uploader_id),
            "cover_image_url": self.cover_image_url,
            "major_ids": [str(mid) for mid in self.major_ids],
            "tag_ids": [str(tid) for tid in self.tag_ids],
            "price": self.price,
            "enrolled_students": [str(student) for student in self.enrolled_students],
            "assignments": [str(assignment) for assignment in self.assignments],
            "modules": [str(module) for module in self.modules],
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

    @staticmethod
    def get_all():
        return [Course(**course).to_dict() for course in db.courses.find()]

    @staticmethod
    def get_course_preview(course_id):
        course = db.courses.find_one({'_id': ObjectId(course_id)})

        if not course:
            return None

        instructor_name = User.get_name_by_id(course['instructor_id'])
        instructor_pfp = User.get_pfp_by_id(course['instructor_id'])
        major_names = [Major.find_by_id(mid)['name'] for mid in course['major_ids']]
        tag_names = [Tag.find_by_id(tid)['name'] for tid in course['tag_ids']]

        course_preview = {
            "_id": str(course['_id']),
            "title": course['title'],
            "description": course['description'],
            "instructor_name": instructor_name,
            "cover_image_url": course.get('cover_image_url', ""),
            "major_names": major_names,
            "tag_names": tag_names,
            "student_count": len(course['enrolled_students']) if isinstance(course['enrolled_students'], list) else 0,
            "created_at": course['created_at'],
            "updated_at": course['updated_at'],
            "price": course['price'],
            "instructor_pfp": instructor_pfp,
        }

        return course_preview

    @staticmethod
    def get_all_courses_preview():
        courses = db.courses.find()
        course_previews = []
        for course in courses:
            instructor_name = User.get_name_by_id(course['instructor_id'])
            major_names = [Major.find_by_id(mid)['name'] for mid in course['major_ids']]
            tag_names = [Tag.find_by_id(tid)['name'] for tid in course['tag_ids']]
            course_preview = {
                "_id": str(course['_id']),
                "title": course['title'],
                "description": course['description'],
                "instructor_name": instructor_name,
                "uploader_id": str(course['uploader_id']),
                "cover_image_url": course.get('cover_image_url', ""),
                "major_names": major_names,
                "tag_names": tag_names,
                "price": course['price'],
            }
            course_previews.append(course_preview)
        return course_previews

    @staticmethod
    def find_by_id(course_id):
        data = db.courses.find_one({"_id": ObjectId(course_id)})
        return Course(**data).to_dict()

    def save_to_db(self):
        course_data = self.to_dict()
        course_data.pop("_id")
        result = db.courses.insert_one(course_data)
        self._id = result.inserted_id
        return str(self._id)

    @staticmethod
    def update_course(course_id, **kwargs):
        set_fields = {k: v for k, v in kwargs.items() if k != "$push"}
        push_fields = kwargs.get("$push", None)
        set_fields["updated_at"] = datetime.now(timezone.utc)
        update_query = {}
        if set_fields:
            update_query["$set"] = set_fields
        if push_fields:
            update_query["$push"] = push_fields
        result = db.courses.update_one({"_id": ObjectId(course_id)}, update_query)
        if result.modified_count == 0:
            raise ValueError("Course not found or no changes made.")

    @staticmethod
    def delete_course(course_id):
        result = db.courses.delete_one({"_id": ObjectId(course_id)})
        if result.deleted_count == 0:
            raise ValueError("Course not found.")

    def add_student(self, student_id):
        student_id = ObjectId(student_id)
        if student_id not in self.enrolled_students:
            self.enrolled_students.append(student_id)
            db.courses.update_one({"_id": self._id}, {"$addToSet": {"enrolled_students": student_id}})

    def remove_student(self, student_id):
        student_id = ObjectId(student_id)
        if student_id in self.enrolled_students:
            self.enrolled_students.remove(student_id)
            db.courses.update_one({"_id": self._id}, {"$pull": {"enrolled_students": student_id}})

    def add_assignment(self, title, description, due_date, max_grade, file= None, allow_late_submission=False):
        assignment = Assignment(
            title=title,
            description=description,
            due_date=due_date,
            max_grade=max_grade,
            allow_late_submission=allow_late_submission,
            file=file,

        )
        assignment_id = assignment.save_to_db()
        self.assignments.append(assignment_id)
        db.courses.update_one({"_id": self._id}, {"$push": {"assignments": assignment_id}})
        return assignment_id

    def get_assignments(self):
        return Assignment.get_by_course(self._id)
    @staticmethod
    def get_people(course_id):
        course = db.courses.find_one({"_id": ObjectId(course_id)})

        # Retrieve instructor data, including profile_image
        instructor = db.users.find_one(
            {"_id": ObjectId(course["instructor_id"])},
            {"_id": 1, "name": 1, "profile_image": 1}  # Add profile_image field here
        )
        instructor_data = {
            "id": str(instructor["_id"]),
            "name": instructor.get("name", "Unknown"),
            "profile_image": instructor.get("profile_image", None)  # Add profile_image to the response
        }

        student_ids = course.get("enrolled_students", [])

        # Retrieve students data, including profile_image
        students = list(db.users.find(
            {"_id": {"$in": [ObjectId(sid) for sid in student_ids]}},
            {"_id": 1, "name": 1, "profile_image": 1}  # Add profile_image field here
        ))

        student_data = [
            {
                "id": str(student["_id"]),
                "name": student.get("name", "Unknown"),
                "profile_image": student.get("profile_image", None)  # Add profile_image to the response
            }
            for student in students
        ]

        return {
            "instructor": instructor_data,
            "students": student_data
        }
