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
            courses_enrolled=data.get("courses_enrolled", []),
            profile_image=""
        )
        student.save_to_db()
        return jsonify({"message": "Student profile created successfully"}), 201

    @staticmethod
    def get_student_profile(student_id):
        student = db.users.find_one({"_id": ObjectId(student_id)})
        if student:
            student['_id'] = str(student['_id'])
            return jsonify(student)
        else:
            return jsonify({"message": "Student not found"}), 404

    @staticmethod
    def update_student_profile():
        data = request.json
        updated_data = {
            "name": data.get("name"),
            "email": data.get("email"),
            "bio": data.get("bio"),
            "courses_enrolled": data.get("courses_enrolled"),
            "updated_at": datetime.now(timezone.utc)
        }
        try:
            Student.update_self(
                                new_name=updated_data.get("name"),
                                new_email=updated_data.get("email"),
                                new_password=data.get("password"))
            return jsonify({"message": "Student profile updated successfully"}), 200
        except ValueError:
            return jsonify({"message": "Student not found or no changes made."}), 404

    @staticmethod
    def upload_profile_image(student_id):
        if 'image' not in request.files:
            return jsonify({"message": "No image file provided"}), 400

        image = request.files['image']

        if image.filename == '':
            return jsonify({"message": "No selected file"}), 400

        image_path = upload_to_s3(image, image.filename)

        if not image_path:
            return jsonify({"message": "Failed to upload image"}), 500

        updated_data = {
            "profile_image": image_path,
            "updated_at": datetime.now(timezone.utc)
        }
        result = db.users.update_one({"_id": ObjectId(student_id)}, {"$set": updated_data})
        if result.modified_count > 0:
            return jsonify({"message": "Profile image uploaded successfully", "image_path": image_path}), 200
        else:
            return jsonify({"message": "Student not found"}), 404

    @staticmethod
    def delete_student_profile(student_id):
        result = db.students.delete_one({"student_id": student_id})
        if result.deleted_count > 0:
            return jsonify({"message": "Student profile deleted"})
        else:
            return jsonify({"message": "Student not found"}), 404
