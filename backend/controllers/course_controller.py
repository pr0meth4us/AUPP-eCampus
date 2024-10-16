import logging
import os
import tempfile
from flask import jsonify, request, g
import json
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
            courses = Course.get_all()
            serialized_courses = [
                {
                    'title': course.get('title'),
                    'description': course.get('description'),
                    'instructor_id': str(course['instructor_id']),
                    'uploader_id': str(course['uploader_id']),
                    'video_url': course.get('video_url'),
                    'thumbnail_url': course.get('thumbnail_url'),
                    'major_ids': [str(mid) for mid in course.get('major_ids', [])],
                    'tag_ids': [str(tid) for tid in course.get('tag_ids', [])],
                    'created_at': course.get('created_at'),
                    'updated_at': course.get('updated_at')
                }
                for course in courses
            ]
            return jsonify(serialized_courses), 200
        except Exception as e:
            logger.error(f"Error fetching courses: {e}")
            return jsonify({"error": "Failed to fetch courses"}), 500

    @staticmethod
    def validate_majors(major_ids):
        valid_majors = [str(major._id) for major in Major.get_all()]
        return [major_id for major_id in major_ids if major_id not in valid_majors]

    @staticmethod
    def create_major():
        data = request.json
        name = data.get('name')

        if not name:
            return jsonify({'message': 'Name is required.'}), 400

        major_id = Major(name=name).save_to_db()
        return jsonify({'message': 'Major created successfully', 'major_id': major_id}), 201

    @staticmethod
    def create_tags(tag_names):
        if not tag_names or not isinstance(tag_names, list):
            return [], ['A list of tag names is required.']

        created_tags = []
        for tag_name in tag_names:
            existing_tag = Tag.find_by_name(tag_name)
            if existing_tag:
                created_tags.append({'tag_name': tag_name, 'tag_id': str(existing_tag)})
            else:
                new_tag = Tag(name=tag_name)
                tag_id = new_tag.save_to_db()
                created_tags.append({'tag_name': tag_name, 'tag_id': tag_id})
                logger.info(f"Tag '{tag_name}' created with ID: {tag_id}")

        return created_tags

    @staticmethod
    def handle_video_upload(video_file, title, description):
        if not video_file:
            return None, None

        try:
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                video_file.save(temp_file.name)
                video_url, thumbnail_url = upload_video_to_youtube(temp_file.name, title, description)
            return video_url, thumbnail_url
        finally:
            os.remove(temp_file.name)

    @staticmethod
    def extract_request_data():
        title = request.form.get('title')
        description = request.form.get('description')
        instructor_id = request.form.get('instructor_id') or g.user_id
        video_file = request.files.get('video')
        tag_names = json.loads(request.form.get('tag_names', '[]'))
        major_ids = json.loads(request.form.get('major_ids', '[]'))

        return {
            'title': title,
            'description': description,
            'instructor_id': instructor_id,
            'video_file': video_file,
            'major_ids': [ObjectId(mid) for mid in major_ids],
            'tag_names': tag_names,
        }

    @staticmethod
    def create_course():
        data = CourseController.extract_request_data()
        if not data['title'] or not data['description'] or not data['instructor_id']:
            return jsonify({'message': 'Title, description, and instructor are required.'}), 400

        created_tags = CourseController.create_tags(data['tag_names'])
        tag_ids = [ObjectId(tag['tag_id']) for tag in created_tags]
        video_url, thumbnail_url = CourseController.handle_video_upload(data['video_file'], data['title'], data['description'])
        course = Course(
            title=data['title'],
            description=data['description'],
            instructor_id=ObjectId(data['instructor_id']),
            video_url=video_url,
            uploader_id=ObjectId(g.user_id),
            thumbnail_url=thumbnail_url,
            major_ids=data['major_ids'],
            tag_ids=tag_ids,
        )
        course_id = course.save_to_db()
        return jsonify({'message': 'Course created successfully', 'course_id': course_id}), 201

    @staticmethod
    def update_course(course_id):
        data = CourseController.extract_request_data()
        current_course = Course.find_by_id(course_id)

        if not current_course:
            return jsonify({'message': 'Course not found.'}), 404

        # Validate and create tags
        created_tags = CourseController.create_tags(data['tag_names'])
        tag_ids = [ObjectId(tag['tag_id']) for tag in created_tags]

        # Update course details
        Course.update_course(
            course_id,
            title=data['title'],
            description=data['description'],
            instructor_id=ObjectId(data['instructor_id']),
            major_ids=data['major_ids'],
            tag_ids=tag_ids
        )

        # Handle video upload
        if data['video_file']:
            new_video_url, thumbnail_url = CourseController.handle_video_upload(data['video_file'], data['title'], data['description'])

            current_video_url = current_course.get('video_url')
            if 'youtube.com' in current_video_url:
                delete_from_youtube(current_video_url.split('=')[-1])
            elif 'cloudinary.com' in current_video_url:
                delete_from_cloudinary(current_video_url)

            Course.update_course(course_id, video_url=new_video_url, thumbnail_url=thumbnail_url)

        return jsonify({'message': 'Course updated successfully'}), 200

    @staticmethod
    def delete_course(course_id):
        try:
            course = Course.find_by_id(course_id)
            if not course:
                return jsonify({'message': 'Course not found.'}), 404

            video_url = course.get('video_url')
            if video_url:
                if 'youtube.com' in video_url:
                    delete_from_youtube(video_url.split('=')[-1])
                elif 'cloudinary.com' in video_url:
                    delete_from_cloudinary(video_url)

            Course.delete_course(course_id)
            return jsonify({'message': 'Course deleted successfully'}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
