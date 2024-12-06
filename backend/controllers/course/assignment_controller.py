from flask import jsonify
from models.course.assignment_model import Assignment
from models.course import Course
from services.cloudflare_service import handle_temp_file_upload


class AssignmentController:
    @staticmethod
    def add_assignment(course_id, data):
        try:
            course = Course.get_course_by_id(course_id)
            file = data.get('file')
            file_url = None
            if file:
                handle_temp_file_upload(file, "assignment")

            assignment_id = course.add_assignment(
                title=data['title'],
                description=data['description'],
                due_date=data['due_date'],
                max_grade=data['max_grade'],
                file=file_url,
                allow_late_submission=data.get('allow_late_submission', False)
            )
            return jsonify({"message": "Assignment added successfully", "assignment_id": assignment_id}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    @staticmethod
    def get_assignments(course_id):
        try:
            course = Course.find_by_id(course_id)
            if not course:
                return jsonify({"error": "Course not found"}), 404

            assignments = course.get_assignments()
            return jsonify(assignments), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    @staticmethod
    def get_assignment_by_id(assignment_id):
        try:
            assignment = Assignment.get_by_id(assignment_id)
            if not assignment:
                return jsonify({"error": "Assignment not found"}), 404
            return jsonify(assignment), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    @staticmethod
    def delete_assignment(assignment_id):
        try:
            Assignment.delete_from_db(assignment_id)
            return jsonify({"message": "Assignment deleted successfully"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400
