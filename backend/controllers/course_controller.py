from flask import jsonify, request
from middleware.auth_middleware import token_required
from models.course_model import Course
from services.youtube_service import upload_video_to_youtube


class CourseController:
    @staticmethod
    @token_required
    def create_course(current_user):
        if current_user['role'] not in ['admin', 'instructor']:
            return jsonify({'message': 'Unauthorized'}), 403

        title = request.form.get('title')
        description = request.form.get('description')
        video_file = request.files.get('video')

        if not title or not description:
            return jsonify({'message': 'Missing required fields'}), 400

        video_url = None
        if video_file:
            try:
                video_url = upload_video_to_youtube(video_file, title, description)
            except Exception as e:
                return jsonify({'message': f'Error uploading video: {str(e)}'}), 500

        course = Course(title, description, current_user['_id'], video_url)
        course_id = course.save_to_db()

        return jsonify({'message': 'Course created successfully', 'course_id': course_id, 'video_url': video_url}), 201

    @staticmethod
    def get_all_courses():
        courses = Course.get_all_courses()
        return jsonify(courses), 200

    @staticmethod
    @token_required
    def update_course(current_user, course_id):
        if current_user['role'] not in ['admin', 'instructor']:
            return jsonify({'message': 'Unauthorized'}), 403

        data = request.get_json()
        try:
            Course.update_course(course_id, **data)
            return jsonify({'message': 'Course updated successfully'}), 200
        except ValueError as e:
            return jsonify({'message': str(e)}), 404

    @staticmethod
    @token_required
    def delete_course(current_user, course_id):
        if current_user['role'] != 'admin':
            return jsonify({'message': 'Unauthorized'}), 403

        try:
            Course.delete_course(course_id)
            return jsonify({'message': 'Course deleted successfully'}), 200
        except ValueError as e:
            return jsonify({'message': str(e)}), 404
