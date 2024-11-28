from flask import jsonify
from models.course.assignment_model import Assignment
from models.course import Course
from bson import ObjectId

class AssignmentController:
    @staticmethod
    def add_assignment(course_id, title, description, due_date, max_grade, file_url=None, allow_late_submission=False):
        # Create a new assignment instance
        assignment = Assignment(
            course_id=ObjectId(course_id),
            title=title,
            description=description,
            due_date=due_date,
            max_grade=max_grade,
            file=file_url,
            allow_late_submission=allow_late_submission
        )

        assignment_id = assignment.save_to_db()

        kwargs = {
            "$push": {"assignments": ObjectId(assignment_id)}
        }

        Course.update_course(course_id, **kwargs)

        return jsonify({"message": "Assignment added successfully", "assignment_id": str(assignment_id)}), 201



    @staticmethod
    def get_assignments(course_id):
        course = Course.find_by_id(course_id)
        if not course:
            return jsonify({"error": "Course not found"}), 404

        assignments = course.get_assignments()

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
