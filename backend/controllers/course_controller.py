import logging
import os
import tempfile
from flask import jsonify, request, g
from models.course_model import Course, Major, Tag
from services.youtube_service import upload_video_to_youtube, delete_from_youtube
from services.cloudinary_service import delete_from_cloudinary
from bson import ObjectId


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CourseController:
    @staticmethod
    def get_all_courses():
        try:
            courses = Course.get_all_courses()
            return jsonify(courses), 200
        except Exception as e:
            logger.error(f"Error fetching courses: {e}")
            return jsonify({"error": "Failed to fetch courses"}), 500

    @staticmethod
    def validate_majors(major_ids):
        valid_majors = Major.get_all()
        return [major_id for major_id in major_ids if major_id not in valid_majors]

    @staticmethod
    def create_major():
        data = request.json
        name = data.get('name')

        if not name:
            return jsonify({'message': 'Name is required.'}), 400

        new_major = Major(name=name)
        major_id = new_major.save_to_db()

        return jsonify({
            'message': 'Major created successfully',
            'major_id': major_id,
            'name': name
        }), 201

    @staticmethod
    def create_tags(tag_names):
        if not tag_names or not isinstance(tag_names, list):
            return [], ['A list of tag names is required.']

        created_tags = []
        for tag_name in tag_names:
            if not tag_name:
                continue

            tag = Tag(name=tag_name)
            tag_id = tag.save_to_db()
            created_tags.append({'tag_name': tag_name, 'tag_id': tag_id})
            logger.info(f"Tag created successfully: {tag_name} with ID: {tag_id}")

        return created_tags

    @staticmethod
    def handle_video_upload(video_file, title, description):
        if not video_file:
            return None, None

        logger.info("Video file received. Attempting to upload to YouTube.")
        try:
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                video_file.save(temp_file.name)
                temp_file_path = temp_file.name

            video_url, thumbnail_url = upload_video_to_youtube(temp_file_path, title, description)
            logger.info(f"Video uploaded successfully: {video_url}")
            return video_url, thumbnail_url

        except Exception as e:
            logger.error(f"Error uploading video: {str(e)}")
            raise e
        finally:
            os.remove(temp_file_path)

    @staticmethod
    def extract_request_data():
        title = request.form.get('title')
        description = request.form.get('description')
        instructor_id = request.form.get('instructor_id')
        video_file = request.files.get('video')
        major_ids = request.form.getlist('major_ids')
        tag_names = request.form.getlist('tags')

        if instructor_id == "(You)":
            instructor_id = g.user_id

        return {
            'title': title,
            'description': description,
            'instructor_id': instructor_id,
            'video_file': video_file,
            'major_ids': major_ids,
            'tag_names': tag_names,
        }

    @staticmethod
    def validate_majors_and_return(major_ids):
        invalid_majors = CourseController.validate_majors(major_ids)
        if invalid_majors:
            logger.warning(f"Invalid major IDs provided: {invalid_majors}")
            return invalid_majors
        return None

    @staticmethod
    def create_course():
        logger.info("Create course request received.")

        data = CourseController.extract_request_data()
        title = data['title']
        description = data['description']
        instructor_id = data['instructor_id']
        video_file = data['video_file']
        major_ids = data['major_ids']
        tag_names = data['tag_names']

        logger.info(f"Received title: {title}, description: {description}, instructor_id: {instructor_id}, major_ids: {major_ids}, tags: {tag_names}")

        if not title or not description or not instructor_id:
            logger.warning("Title, description, or instructor_id is missing.")
            return jsonify({'message': 'Title, description, and instructor are required.'}), 400

        created_tags, tag_errors = CourseController.create_tags(tag_names)

        try:
            video_url, thumbnail_url = CourseController.handle_video_upload(video_file, title, description)
        except Exception as e:
            return jsonify({'message': f'Error uploading video: {str(e)}'}), 500

        tag_ids = [ObjectId(tag['tag_id']) for tag in created_tags]

        course = Course(
            title=title,
            description=description,
            instructor_id=ObjectId(instructor_id),
            video_url=video_url,
            uploader_id=ObjectId(g.user_id),
            thumbnail_url=thumbnail_url,
            major_ids=major_ids,
            tag_ids=tag_ids
        )
        course_id = course.save_to_db()
        logger.info(f"Course created successfully with ID: {course_id}")

        return jsonify({'message': 'Course created successfully', 'course_id': course_id, 'video_url': video_url}), 201

    @staticmethod
    def update_course(course_id):
        logger.info(f"Updating course with ID: {course_id}")

        data = CourseController.extract_request_data()
        title = data['title']
        description = data['description']
        instructor_id = data['instructor_id']
        video_file = data['video_file']
        major_ids = data['major_ids']
        tag_names = data['tag_names']

        current_course = Course.find_by_id(course_id)

        if not current_course:
            return jsonify({'message': 'Course not found.'}), 404

        current_video_url = current_course.get('video_url')

        if CourseController.validate_majors_and_return(major_ids):
            return jsonify({'message': f'Invalid major IDs provided'}), 400

        created_tags, tag_errors = CourseController.create_tags(tag_names)
        if tag_errors:
            return jsonify({'message': 'Error creating tags', 'errors': tag_errors}), 400

        try:
            update_data = {
                'title': title,
                'description': description,
                'instructor_id': ObjectId(instructor_id),
                'major_ids': major_ids,
                'tag_ids': [ObjectId(tag['tag_id']) for tag in created_tags]
            }

            Course.update_course(course_id, **update_data)

            # Handle video upload if a new video is provided
            if video_file:
                logger.info("New video file received. Attempting to upload to YouTube.")
                try:
                    new_video_url, thumbnail_url = CourseController.handle_video_upload(video_file,
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
