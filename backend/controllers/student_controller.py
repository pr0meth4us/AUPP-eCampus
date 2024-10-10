# controllers/student_controller.py
from flask import jsonify, request
from models.student import Student
from services.mongo_service import db
from datetime import datetime


class StudentController:
    @staticmethod
    def create_student_profile():
        data = request.json
        student = Student(
            student_id=data.get("student_id"),
            name=data.get("name"),
            email=data.get("email"),
            bio=data.get("bio"),
            courses_enrolled=data.get("courses_enrolled", []),
            profile_image=data.get("profile_image", "")
        )
        student_data = student.to_dict()
        student_data["created_at"] = datetime.utcnow()
        student_data["updated_at"] = datetime.utcnow()

        result = db.students.insert_one(student_data)
        return jsonify({"message": "Student profile created", "id": str(result.inserted_id)}), 201

    @staticmethod
    def get_student_profile(student_id):
        student = db.students.find_one({"student_id": student_id})
        if student:
            student['_id'] = str(student['_id'])  # Convert ObjectId to string for JSON serialization
            return jsonify(student)
        else:
            return jsonify({"message": "Student not found"}), 404

    @staticmethod
    def update_student_profile(student_id):
        data = request.json
        updated_data = {
            "name": data.get("name"),
            "email": data.get("email"),
            "bio": data.get("bio"),
            "courses_enrolled": data.get("courses_enrolled"),
            "profile_image": data.get("profile_image"),
            "updated_at": datetime.utcnow()
        }
        result = db.students.update_one({"student_id": student_id}, {"$set": updated_data})
        if result.matched_count > 0:
            return jsonify({"message": "Student profile updated"})
        else:
            return jsonify({"message": "Student not found"}), 404

    @staticmethod
    def delete_student_profile(student_id):
        result = db.students.delete_one({"student_id": student_id})
        if result.deleted_count > 0:
            return jsonify({"message": "Student profile deleted"})
        else:
            return jsonify({"message": "Student not found"}), 404