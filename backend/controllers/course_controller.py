import logging
import os
import tempfile
from flask import jsonify, request, g
from models.course_model import Course
from services.youtube_service import upload_video_to_youtube, delete_from_youtube
from services.cloudinary_service import delete_from_cloudinary
from bson import ObjectId

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

        if instructor_id == "(You)":
            instructor_id = g.user_id

        logger.info(f"Received title: {title}, description: {description}, instructor_id: {instructor_id}")

        if not title or not description or not instructor_id:
            logger.warning("Title, description, or instructor_id is missing.")
            return jsonify({'message': 'Title, description, and instructor are required.'}), 400

        video_url = None
        thumbnail_url = None
        if video_file:
            logger.info("Video file received. Attempting to upload to YouTube.")
            try:
                with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                    video_file.save(temp_file.name)
                    temp_file_path = temp_file.name

                video_url, thumbnail_url = upload_video_to_youtube(temp_file_path, title, description)
                logger.info(f"Video uploaded successfully: {video_url}")

            except Exception as e:
                logger.error(f"Error uploading video: {str(e)}")
                return jsonify({'message': f'Error uploading video: {str(e)}'}), 500
            finally:
                os.remove(temp_file_path)

        course = Course(
            title=title,
            description=description,
            instructor_id=ObjectId(instructor_id),
            video_url=video_url,
            uploader_id=ObjectId(g.user_id),
            thumbnail_url=thumbnail_url
        )
        course_id = course.save_to_db()
        logger.info(f"Course created successfully with ID: {course_id}")

        return jsonify({'message': 'Course created successfully', 'course_id': course_id, 'video_url': video_url}), 201

    @staticmethod
    def get_all_courses():
        try:
            courses = Course.get_all_courses()
            return jsonify(courses), 200
        except Exception as e:
            logger.error(f"Error fetching courses: {e}")
            return jsonify({"error": "Failed to fetch courses"}), 500

    @staticmethod
    def update_course(course_id):
        logger.info(f"Updating course with ID: {course_id}")

        title = request.form.get('title')
        description = request.form.get('description')
        instructor_id = request.form.get('instructor_id')
        video_file = request.files.get('video')

        current_course = Course.find_by_id(course_id)

        if not current_course:
            return jsonify({'message': 'Course not found.'}), 404

        current_video_url = current_course.get('video_url')

        try:
            Course.update_course(course_id, title=title, description=description, instructor_id=instructor_id)

            if video_file:
                logger.info("New video file received. Attempting to upload to YouTube.")
                try:
                    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                        video_file.save(temp_file.name)
                        temp_file_path = temp_file.name

                    new_video_url, thumbnail_url = upload_video_to_youtube(temp_file_path,
                                                                           title or current_course['title'],
                                                                           description or current_course['description'])
                    logger.info(f"New video uploaded successfully: {new_video_url}")

                    if current_video_url:
                        if 'youtube.com' in current_video_url:
                            video_id = current_video_url.split('=')[-1]
                            delete_from_youtube(video_id)
                        elif 'cloudinary.com' in current_video_url:
                            delete_from_cloudinary(current_video_url)

                    Course.update_course(course_id, video_url=new_video_url, thumbnail_url=thumbnail_url)

                except Exception as e:
                    logger.error(f"Error uploading new video: {str(e)}")
                    return jsonify({'message': f'Error uploading new video: {str(e)}'}), 500
                finally:
                    os.remove(temp_file_path)

            logger.info(f"Course with ID {course_id} updated successfully.")
            return jsonify({'message': 'Course updated successfully'}), 200
        except ValueError as e:
            logger.error(f"Error updating course: {str(e)}")
            return jsonify({'message': str(e)}), 404


    @staticmethod
    def delete_course(course_id):
        logger.info(f"Attempting to delete course with ID: {course_id}")
        try:
            course = Course.find_by_id(course_id)
            if not course:
                raise ValueError(f"Course with ID {course_id} not found.")

            video_url = course.get('video_url')
            if video_url:
                logger.info(f"Course with ID {course_id} has an associated video: {video_url}")

                if 'youtube.com' in video_url:
                    video_id = video_url.split('=')[-1]
                    logger.info(f"Deleting YouTube video with ID: {video_id}")
                    delete_from_youtube(video_id)
                elif 'cloudinary.com' in video_url:
                    logger.info(f"Deleting Cloudinary video: {video_url}")
                    delete_from_cloudinary(video_url)

            Course.delete_course(course_id)
            logger.info(f"Course with ID {course_id} deleted successfully.")

            return jsonify({'message': 'Course and associated video deleted successfully.'}), 200

        except ValueError as e:
            logger.error(f"Error deleting course: {str(e)}")
            return jsonify({'message': str(e)}), 404
        except Exception as e:
            logger.error(f"An error occurred while deleting the course: {str(e)}")
            return jsonify({'message': 'Failed to delete course and associated video.'}), 500
