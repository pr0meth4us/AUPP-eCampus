from datetime import datetime, timezone
from bson import ObjectId
from services.mongo_service import db
from .assignment_model import Assignment
from flask import jsonify


class Course:
    def __init__(self, title, description, instructor_id, video_url, uploader_id, thumbnail_url, major_ids, tag_ids,
                 price, cover_image_url=None, enrolled_students=None, assignments=None, _id=None, created_at=None, updated_at=None):
        self._id = _id
        self.title = title
        self.description = description
        self.instructor_id = ObjectId(instructor_id)
        self.uploader_id = ObjectId(uploader_id)
        self.video_url = video_url
        self.thumbnail_url = thumbnail_url
        self.cover_image_url = cover_image_url
        self.major_ids = [ObjectId(mid) for mid in major_ids]
        self.tag_ids = [ObjectId(tid) for tid in tag_ids]
        self.created_at = created_at or datetime.now(timezone.utc)
        self.updated_at = updated_at or datetime.now(timezone.utc)
        self.price = price
        self.enrolled_students = enrolled_students if isinstance(enrolled_students, list) else []
        self.assignments = assignments if assignments else []

    @staticmethod
    def get_all():
        return list(db.courses.find())

    def to_dict(self):
        return {
            '_id': str(self._id) if self._id else None,  # Convert ObjectId to string
            'title': self.title,
            'description': self.description,
            'instructor_id': str(self.instructor_id),
            'uploader_id': str(self.uploader_id),
            'video_url': self.video_url,
            'thumbnail_url': self.thumbnail_url,
            'cover_image_url': self.cover_image_url,  # Include cover image URL
            'major_ids': [str(mid) for mid in self.major_ids],  # Convert ObjectId to string
            'tag_ids': [str(tid) for tid in self.tag_ids],  # Convert ObjectId to string
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'price': self.price,
            'enrolled_students': [str(student) for student in self.enrolled_students],
            'assignments': self.assignments
        }

    def save_to_db(self):
        course_data = self.to_dict()
        course_data.pop('_id')  # MongoDB generates _id automatically
        result = db.courses.insert_one(course_data)
        self._id = result.inserted_id
        return str(self._id)

    @staticmethod
    def find_by_id(course_id):
        return db.courses.find_one({'_id': ObjectId(course_id)})

    @staticmethod
    def get_course_by_id(course_id):
        data = db.courses.find_one({'_id': ObjectId(course_id)})
        if data:
            return Course(
                _id=str(data['_id']),
                title=data.get('title'),
                description=data.get('description'),
                instructor_id=str(data.get('instructor_id')),
                video_url=data.get('video_url'),
                uploader_id=str(data.get('uploader_id')),
                thumbnail_url=data.get('thumbnail_url'),
                cover_image_url=data.get('cover_image_url'),  # Retrieve cover image URL
                major_ids=data.get('major_ids', []),
                tag_ids=data.get('tag_ids', []),
                price=data.get('price', 0),
                enrolled_students=data.get('enrolled_students', []),
                assignments=data.get('assignments', []),
                created_at=data.get('created_at'),
                updated_at=data.get('updated_at')
            )
        return None

    @staticmethod
    def update_course(course_id, **kwargs):
        kwargs['updated_at'] = datetime.now(timezone.utc)
        result = db.courses.update_one({'_id': ObjectId(course_id)}, {'$set': kwargs})
        if result.modified_count == 0:
            raise ValueError("Course not found or no changes made.")

    @staticmethod
    def delete_course(course_id):
        result = db.courses.delete_one({'_id': ObjectId(course_id)})
        if result.deleted_count == 0:
            raise ValueError("Course not found.")

    def add_student(self, student_id):
        student_id = ObjectId(student_id)
        if student_id not in self.enrolled_students:
            self.enrolled_students.append(student_id)
            db.courses.update_one({'_id': self._id}, {'$addToSet': {'enrolled_students': student_id}})

    def remove_student(self, student_id):
        student_id = ObjectId(student_id)
        if student_id in self.enrolled_students:
            self.enrolled_students.remove(student_id)
            db.courses.update_one({'_id': self._id}, {'$pull': {'enrolled_students': student_id}})

    def get_major_names(self):
        return [
            db.majors.find_one({'_id': mid}).get('name', 'Unknown') for mid in self.major_ids
        ]

    def get_tag_names(self):
        return [
            db.tags.find_one({'_id': tid}).get('name', 'Unknown') for tid in self.tag_ids
        ]

    def add_assignment(self, title, description, due_date, max_grade, file, allow_late_submission=False):
        assignment = Assignment(
            course_id=ObjectId(self._id),
            title=title,
            description=description,
            due_date=due_date,
            max_grade=max_grade,
            allow_late_submission=allow_late_submission,
            file=file,
            is_locked=False
        )
        assignment_id = assignment.save_to_db()
        self.assignments.append(assignment_id)
        db.courses.update_one({'_id': self._id}, {'$push': {'assignments': assignment_id}})
        return assignment_id

    def get_assignments(self):
        return Assignment.get_by_course(self._id)

    @staticmethod
    def get_details_with_names(course_id):
        try:
            course = Course.get_course_by_id(course_id)
            if not course:
                raise ValueError("Course not found")

            # Fetch instructor details
            instructor = db.users.find_one({"_id": ObjectId(course.instructor_id)}, {"name": 1, "profile_image": 1})

            if not instructor:
                raise ValueError("Instructor not found")

            # Fetch major names
            major_names = [
                major.get("name", "Unknown")
                for major in db.majors.find({"_id": {"$in": [ObjectId(mid) for mid in course.major_ids]}})
            ]

            # Fetch tag names
            tag_names = [
                tag.get("name", "Unknown")
                for tag in db.tags.find({"_id": {"$in": [ObjectId(tid) for tid in course.tag_ids]}})
            ]

            # Construct response
            course_data = course.to_dict()
            course_data["majors"] = major_names
            course_data["tags"] = tag_names
            course_data["instructor"] = {
                "name": instructor.get("name", "Unknown"),
                "profile_image": instructor.get("profile_image", None),
            }

            return course_data

        except Exception as e:
            print(f"Error in get_details_with_names: {e}")  # Add logging
            raise