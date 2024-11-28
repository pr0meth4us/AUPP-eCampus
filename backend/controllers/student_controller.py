from flask import jsonify, request
from services.mongo_service import db
from datetime import datetime, timezone
from models.user_model import Student
from services.aws_service import upload_to_s3
from bson import ObjectId


class StudentController:
    @staticmethod
    def create_student_profile():
        data = request.json
        student = Student(
            name=data.get("name"),
            email=data.get("email"),
            password=data.get("password"),
            bio=data.get("bio"),
            courses=data.get("courses", []),
            profile_image=""
        )
        student.save_to_db()
        return jsonify({"message": "Student profile created successfully"}), 201

    @staticmethod
    def get_student_profile(student_id):
        student = db.users.find_one({"_id": ObjectId(student_id)})
        if student:
            student['_id'] = str(student['_id'])
            student.pop('password_hash')
            return jsonify(student)
        else:
            return jsonify({"message": "Student not found"}), 404

    @staticmethod
    def update_student_profile(updated_data, student_id):
        student = Student.find_by_id(student_id)
        student.update_self(
            new_name=updated_data.get("name"),
            new_email=updated_data.get("email"),
            new_password=updated_data.get("password"))
        return jsonify({"message": "Student profile updated successfully"}), 200

    @staticmethod
    def upload_profile_image(student_id, image_file):
        image_path = upload_to_s3(image_file, image_file.filename)
        if not image_path:
            return jsonify({"message": "Failed to upload image"}), 500
        updated_data = {
            "profile_image": image_path,
            "updated_at": datetime.now(timezone.utc)
        }
        result = db.users.update_one({"_id": ObjectId(student_id)}, {"$set": updated_data})
        if result.modified_count > 0:
            return jsonify({"message": "Profile image uploaded successfully", "image_path": image_path}), 200

    @staticmethod
    def delete_student_profile(student_id):
        result = db.students.delete_one({"student_id": student_id})
        if result.deleted_count > 0:
            return jsonify({"message": "Student profile deleted"})
