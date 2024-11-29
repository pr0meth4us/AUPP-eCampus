import logging
from bson import ObjectId
from flask import jsonify, g

from models.course.module_model import Module
from utils.upload_video import upload_video
from services.cloudinary_service import upload_to_cloudinary, delete_from_cloudinary
from models.course import Course, Tag, Major, Submission, Assignment
from models.user_model import User
from utils.helpers import serialize_document

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CourseController:

    @staticmethod
    def create_course(title, description, instructor_id, price, tag_names, major_ids, cover_image):
        try:
            if not title or not description:
                return jsonify({'message': 'Title and description are required.'}), 400
            if not instructor_id:
                return jsonify({'message': 'Instructor ID is required.'}), 400

            created_tags = CourseController._find_or_create_tags(tag_names)
            tag_ids = [ObjectId(tag['tag_id']) for tag in created_tags]
            cover_image_url = None
            if cover_image:
                cover_image_url = upload_to_cloudinary(cover_image, cover_image.filename)

            course = Course(
                title=title,
                description=description,
                instructor_id=ObjectId(instructor_id),
                price=price,
                cover_image_url=cover_image_url,
                tag_ids=tag_ids,
                major_ids=major_ids,
                uploader_id=g.current_user['_id'],
                enrolled_students=[]
            )
            course_id = course.save_to_db()
            User.add_course_to_user(instructor_id, course_id, add=True)
            return jsonify({'message': 'Course created successfully.', 'course_id': str(course_id)}), 201

        except Exception as e:
            logger.error(f"Error creating course: {str(e)}")
            return jsonify({'message': 'An error occurred while creating the course.', 'details': str(e)}), 500

    @staticmethod
    def update_course(course_id, title, description, instructor_id, tag_names, major_ids, video_file):
        try:
            course = Course.find_by_id(course_id)
            if not course:
                return jsonify({'message': 'Course not found.'}), 404

            created_tags = CourseController._find_or_create_tags(tag_names)
            tag_ids = [ObjectId(tag['tag_id']) for tag in created_tags]

            if video_file:
                new_video_url, new_thumbnail_url = CourseController._upload_video(video_file, title, description)
                if course.get('video_url'):
                    CourseController._delete_video(course['video_url'])
                course.video_url = new_video_url
                course.thumbnail_url = new_thumbnail_url

            course.update(
                title=title,
                description=description,
                instructor_id=ObjectId(instructor_id),
                major_ids=major_ids,
                tag_ids=tag_ids
            )
            return jsonify({'message': 'Course updated successfully.'}), 200

        except Exception as e:
            logger.error(f"Error updating course: {str(e)}")
            return jsonify({'message': 'An error occurred while updating the course.', 'details': str(e)}), 500

    @staticmethod
    def delete_course(course_id):
        try:
            course = Course.find_by_id(course_id)
            if not course:
                return jsonify({'message': 'Course not found.'}), 404

            if course.get('video_url'):
                CourseController._delete_video(course['video_url'])

            course.delete()
            return jsonify({'message': 'Course deleted successfully.'}), 200

        except Exception as e:
            logger.error(f"Error deleting course: {str(e)}")
            return jsonify({'message': 'An error occurred while deleting the course.', 'details': str(e)}), 500

    @staticmethod
    def enroll_student(course_id, student_id):
        course = Course.find_by_id(course_id)
        if not course:
            return jsonify({'message': 'Course not found.'}), 404

        if student_id in course['enrolled_students']:
            return jsonify({'message': 'Student already enrolled.'}), 200
        kwargs = {
            "_id": ObjectId(course_id),
            "$push": {"enrolled_students": ObjectId(student_id)}
        }

        Course.update_course(course_id, **kwargs)

        User.add_course_to_user(student_id, course_id, add=True)
        return jsonify({'message': 'Student enrolled successfully.'}), 200

    @staticmethod
    def unenroll_student(course_id, student_id):
        course = Course.find_by_id(course_id)
        if not course:
            return jsonify({'message': 'Course not found.'}), 404

        if ObjectId(student_id) not in course['enrolled_students']:
            return jsonify({'message': 'Student is not enrolled in this course.'}), 400

        course['enrolled_students'].remove(ObjectId(student_id))
        course.save()
        User.add_course_to_user(student_id, course_id, add=False)
        return jsonify({'message': 'Student unenrolled successfully.'}), 200

    @staticmethod
    def get_course_by_id(course_id):
        course = Course.find_by_id(course_id)
        if not course:
            return jsonify({'message': 'Course not found.'}), 404
        return jsonify(course.to_dict()), 200

    @staticmethod
    def _find_or_create_tags(tag_names):
        """Find existing tags or create new ones."""
        tags = []
        for name in tag_names:
            tag = Tag.find_by_name(name)
            if tag:
                tags.append({'tag_id': str(tag['_id']), 'name': name})
            else:
                new_tag = Tag(name=name)
                tag_id = new_tag.save_to_db()
                tags.append({'tag_id': str(tag_id), 'name': name})
        return tags

    @staticmethod
    def _upload_video(video_file, title, description):
        """Handle video upload."""
        if not video_file:
            return None, None

        video_url, thumbnail_url = upload_video(video_file, title, description)
        return video_url, thumbnail_url

    @staticmethod
    def _delete_video(video_url):
        delete_from_cloudinary(video_url)

    @staticmethod
    def get_course_details(course_id,student_id, has_access=False):
        course = Course.get_course_preview(course_id)
        if not has_access:
            return jsonify({"course": serialize_document(course)}), 200
        modules = Module.get_by_course(course_id)
        assignments = Assignment.get_by_course(course_id)
        people = Course.get_people(course_id)

        for assignment in assignments:
            assignment_id = assignment.get('_id')
            if assignment_id:
                submissions = Submission.get_by_course(assignment_id, student_id)
                if submissions:
                    assignment['submissionsData'] = [serialize_document(submission) for submission in submissions]
                else:
                    assignment['submissionsData'] = []

        return {
            "modules": [serialize_document(module) for module in modules],
            "assignments": [serialize_document(assignment) for assignment in assignments],
            "people": people,
            "course": course
        }

    @staticmethod
    def get_course_preview(course_id):
        course = Course.get_course_preview(course_id)
        return {"course": course}

    @staticmethod
    def get_course_details_teacher(course_id):
        course = Course.get_course_preview(course_id)
        modules = Module.get_by_course(course_id)
        assignments = Assignment.get_by_course(course_id)
        people = Course.get_people(course_id)

        for assignment in assignments:
            assignment_id = assignment.get('_id')
            if assignment_id:
                submissions = Submission.get_all_submissions_for_teacher(assignment_id)
                if submissions:
                    assignment['submissionsData'] = [serialize_document(submission) for submission in submissions]
                else:
                    assignment['submissionsData'] = []

        return {
            "modules": [serialize_document(module) for module in modules],
            "assignments": [serialize_document(assignment) for assignment in assignments],
            "people": people,
            "course": course
        }
    @staticmethod
    def get_all_course_preview():
        courses = Course.get_all_courses_preview()
        return courses