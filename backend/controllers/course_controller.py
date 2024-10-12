import logging
from flask import jsonify, request, g
from models.course_model import Course
from services.youtube_service import upload_video_to_youtube
import os
import tempfile

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CourseController:
    @staticmethod
    def create_course():
        logger.info("Create course request received.")

        title = request.form.get('title')
        description = request.form.get('description')
        instructor_id = request.form.get('instructor_id')
        video_file = request.files.get('video')

        logger.info(f"Received title: {title}, description: {description}, instructor_id: {instructor_id}")

        if not title or not description or not instructor_id:
            logger.warning("Title, description, or instructor_id is missing.")
            return jsonify({'message': 'Title, description, and instructor are required.'}), 400

        video_url = None
        if video_file:
            logger.info("Video file received. Attempting to upload to YouTube.")
            try:
                # Create a temporary file
                with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                    # Save the video file to the temporary location
                    video_file.save(temp_file.name)
                    temp_file_path = temp_file.name  # Get the temporary file path

                # Upload the video using the temporary file path
                video_url = upload_video_to_youtube(temp_file_path, title, description)
                logger.info(f"Video uploaded successfully: {video_url}")

            except Exception as e:
                logger.error(f"Error uploading video: {str(e)}")
                return jsonify({'message': f'Error uploading video: {str(e)}'}), 500
            finally:
                # Clean up the temporary file
                os.remove(temp_file_path)

        course = Course(
            title=title,
            description=description,
            instructor_id=instructor_id,
            video_url=video_url,
            uploader_id=g.user_id
        )
        course_id = course.save_to_db()
        logger.info(f"Course created successfully with ID: {course_id}")

        return jsonify({'message': 'Course created successfully', 'course_id': course_id, 'video_url': video_url}), 201

    @staticmethod
    def get_all_courses():
        logger.info("Fetching all courses.")
        courses = Course.get_all_courses()
        logger.info(f"Retrieved {len(courses)} courses.")
        return jsonify(courses), 200

    @staticmethod
    def update_course(course_id):
        logger.info(f"Updating course with ID: {course_id}")
        data = request.get_json()
        try:
            Course.update_course(course_id, **data)
            logger.info(f"Course with ID {course_id} updated successfully.")
            return jsonify({'message': 'Course updated successfully'}), 200
        except ValueError as e:
            logger.error(f"Error updating course: {str(e)}")
            return jsonify({'message': str(e)}), 404

    @staticmethod
    def delete_course(course_id):
        logger.info(f"Attempting to delete course with ID: {course_id}")
        try:
            Course.delete_course(course_id)
            logger.info(f"Course with ID {course_id} deleted successfully.")
            return jsonify({'message': 'Course deleted successfully'}), 200
        except ValueError as e:
            logger.error(f"Error deleting course: {str(e)}")
            return jsonify({'message': str(e)}), 404
