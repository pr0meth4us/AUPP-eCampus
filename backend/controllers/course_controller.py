from flask import jsonify, request, g

from models.course_model import Course


class CourseController:
    @staticmethod
    def create_course():
        data = request.form.to_dict()
        required_fields = ['title', 'description', 'instructor_id']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        data['uploader_id'] = str(g.current_user['_id'])
        course_id = Course.save(data)
        return jsonify({'message': 'Course created', 'course_id': course_id}), 201

    @staticmethod
    def get_course(course_id):
        course = Course.find_by_id(course_id)
        if not course:
            return jsonify({'error': 'Course not found'}), 404
        return jsonify(course), 200

    @staticmethod
    def update_course(course_id):
        data = request.form.to_dict()
        Course.update(course_id, data)
        return jsonify({'message': 'Course updated'}), 200

    @staticmethod
    def delete_course(course_id):
        Course.delete(course_id)
        return jsonify({'message': 'Course deleted'}), 200

    @staticmethod
    def get_all_courses():
        courses = Course.find_all()
        return jsonify(courses), 200

    @staticmethod
    def get_my_courses():
        """Get courses associated with the current logged-in user"""
        from flask import g

        user_id = str(g.current_user['_id'])
        role = g.current_user.get('role')

        # For admin users, optionally return all courses or their specific courses
        if role == 'admin':
            courses = Course.find_by_user(user_id)
        elif role == 'instructor':
            # Instructors see courses they teach
            courses = Course.find_by_user(user_id, role='instructor')
        else:
            # Students see courses they're enrolled in
            courses = Course.find_by_user(user_id, role='student')

        return jsonify(courses), 200

    @staticmethod
    def preview_course(course_id):
        # Use find_instance_by_id to get Course object, not dict
        course = Course.find_instance_by_id(course_id)
        if not course:
            return jsonify({'error': 'Not found'}), 404
        return jsonify(course.to_preview_dict()), 200

    @staticmethod
    def detail_course(course_id, has_access=False):
        if not has_access:
            return jsonify({'error': 'Payment required'}), 402
        # Use find_instance_by_id to get Course object, not dict
        course = Course.find_instance_by_id(course_id)
        print(course)
        if not course:
            return jsonify({'error': 'Not found'}), 404
        return jsonify(course.to_student_dict()), 200

    @staticmethod
    def full_course(course_id):
        # Use find_instance_by_id to get Course object, not dict
        course = Course.find_instance_by_id(course_id)
        if not course:
            return jsonify({'error': 'Not found'}), 404
        return jsonify(course.to_instructor_dict()), 200
