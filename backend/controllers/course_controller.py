from flask import jsonify, request, g
from models.course_model import Course
from services.file_upload_service import upload_course_material
from bson import ObjectId

class CourseController:
    @staticmethod
    def create_course():
        """Create a new course with optional cover image upload"""
        try:
            data = request.form.to_dict()
            required_fields = ['title', 'description', 'instructor_id']
            for field in required_fields:
                if field not in data:
                    return jsonify({'error': f'{field} is required'}), 400

            data['uploader_id'] = str(g.current_user['_id'])
            if 'cover_image' in request.files:
                cover_file = request.files['cover_image']
                if cover_file and cover_file.filename:
                    upload_result = upload_course_material(cover_file, "temp", "covers")
                    if upload_result['success']:
                        data['cover_image_url'] = upload_result['file_url']

            if 'major_ids' in data:
                data['major_ids'] = data['major_ids'].split(',') if isinstance(data['major_ids'], str) else data['major_ids']
            if 'tag_ids' in data:
                data['tag_ids'] = data['tag_ids'].split(',') if isinstance(data['tag_ids'], str) else data['tag_ids']
            if 'price' in data and data['price']:
                try:
                    data['price'] = float(data['price'])
                except ValueError:
                    return jsonify({'error': 'Invalid price format'}), 400

            course_id = Course.save(data)
            return jsonify({'message': 'Course created successfully', 'course_id': course_id}), 201
        except Exception as e:
            return jsonify({'error': f'Failed to create course: {str(e)}'}), 500

    @staticmethod
    def get_course(course_id):
        """Get basic course information"""
        try:
            course = Course.find_by_id(course_id)
            if not course:
                return jsonify({'error': 'Course not found'}), 404
            return jsonify(course), 200
        except Exception as e:
            return jsonify({'error': f'Failed to retrieve course: {str(e)}'}), 500

    @staticmethod
    def update_course(course_id):
        """Update course information with optional file uploads"""
        try:
            if not Course.find_instance_by_id(course_id):
                return jsonify({'error': 'Course not found'}), 404

            data = request.form.to_dict()
            if 'cover_image' in request.files:
                cover_file = request.files['cover_image']
                if cover_file and cover_file.filename:
                    upload_result = upload_course_material(cover_file, course_id, "covers")
                    if upload_result['success']:
                        data['cover_image_url'] = upload_result['file_url']

            if 'major_ids' in data and isinstance(data['major_ids'], str):
                data['major_ids'] = data['major_ids'].split(',')
            if 'tag_ids' in data and isinstance(data['tag_ids'], str):
                data['tag_ids'] = data['tag_ids'].split(',')
            if 'price' in data and data['price']:
                try:
                    data['price'] = float(data['price'])
                except ValueError:
                    return jsonify({'error': 'Invalid price format'}), 400

            Course.update(course_id, data)
            return jsonify({'message': 'Course updated successfully'}), 200
        except Exception as e:
            return jsonify({'error': f'Failed to update course: {str(e)}'}), 500

    @staticmethod
    def delete_course(course_id):
        """Delete course and all related data"""
        try:
            if not Course.find_instance_by_id(course_id):
                return jsonify({'error': 'Course not found'}), 404
            Course.delete(course_id)
            return jsonify({'message': 'Course deleted successfully'}), 200
        except Exception as e:
            return jsonify({'error': f'Failed to delete course: {str(e)}'}), 500

    @staticmethod
    def get_all_courses():
        """Get all courses with instructor info (public endpoint)"""
        try:
            courses = Course.find_all()
            return jsonify(courses), 200
        except Exception as e:
            return jsonify({'error': f'Failed to retrieve courses: {str(e)}'}), 500

    @staticmethod
    def get_my_courses():
        """Get courses associated with the current logged-in user"""
        try:
            user_id = str(g.current_user['_id'])
            role = g.current_user.get('role')
            courses = Course.find_by_user(user_id, role=role)
            return jsonify(courses), 200
        except Exception as e:
            return jsonify({'error': f'Failed to retrieve user courses: {str(e)}'}), 500

    @staticmethod
    def preview_course(course_id):
        """Get course preview with instructor details"""
        try:
            course_preview = Course.get_preview_details(course_id)
            if not course_preview:
                return jsonify({'error': 'Course not found'}), 404
            return jsonify(course_preview), 200
        except Exception as e:
            return jsonify({'error': f'Failed to get course preview: {str(e)}'}), 500

    @staticmethod
    def detail_course(course_id):
        """Get detailed course content for enrolled students."""
        try:
            student_id = str(g.current_user['_id'])
            # Pass the student’s ID into get_full_details(...)
            course_details = Course.get_full_details(course_id, student_id_str=student_id)
            if not course_details:
                return jsonify({'error': 'Course not found or access denied'}), 404
            return jsonify(course_details), 200
        except Exception as e:
            return jsonify({'error': f'Failed to get course details: {str(e)}'}), 500


    @staticmethod
    def full_course(course_id):
        """Get full course information for instructors/admins, including all student details"""
        try:
            course_full_details = Course.get_full_details(course_id)
            if not course_full_details:
                return jsonify({'error': 'Course not found'}), 404
            # Hydrate the response with the rich student list
            course_full_details['enrolled_students'] = Course.get_enrolled_students_with_details(course_id)
            return jsonify(course_full_details), 200
        except Exception as e:
            # For debugging, print the exception to the console
            print(f"Error in full_course: {e}")
            return jsonify({'error': f'Failed to get full course: {str(e)}'}), 500

    @staticmethod
    def enroll_student(course_id):
        """Enroll current user in course"""
        try:
            course = Course.find_instance_by_id(course_id)
            if not course:
                return jsonify({'error': 'Course not found'}), 404
            student_id = str(g.current_user['_id'])
            if ObjectId(student_id) in course.enrolled_students:
                return jsonify({'error': 'Already enrolled in this course'}), 400
            Course.enroll_student(course_id, student_id)
            return jsonify({'message': 'Successfully enrolled in course'}), 200
        except Exception as e:
            return jsonify({'error': f'Failed to enroll: {str(e)}'}), 500

    @staticmethod
    def get_enrolled_students(course_id):
        """Get list of enrolled students with full details"""
        try:
            if not Course.find_instance_by_id(course_id):
                return jsonify({'error': 'Course not found'}), 404
            students = Course.get_enrolled_students_with_details(course_id)
            return jsonify(students), 200
        except Exception as e:
            return jsonify({'error': f'Failed to get enrolled students: {str(e)}'}), 500

    @staticmethod
    def get_course_analytics(course_id):
        """Get course analytics and statistics"""
        try:
            course = Course.find_instance_by_id(course_id)
            if not course:
                return jsonify({'error': 'Course not found'}), 404
            from models.assignment_model import Assignment
            analytics = {
                'total_students': len(course.enrolled_students),
                'total_modules': len(course.modules),
                'total_assignments': len(course.assignments),
                'course_created': course.created_at.isoformat() if course.created_at else None
            }
            assignment_stats = []
            if course.enrolled_students:
                for assignment_id in course.assignments:
                    assignment_doc = Assignment._coll().find_one({'_id': assignment_id})
                    if assignment_doc:
                        assignment = Assignment(assignment_doc)
                        submitted_count = len([s for s in assignment.submissions if s.status != 'not_submitted'])
                        assignment_stats.append({
                            'assignment_id': str(assignment_id),
                            'title': assignment.title,
                            'total_submissions': submitted_count,
                            'submission_rate': (submitted_count / len(course.enrolled_students) * 100)
                        })
            analytics['assignment_stats'] = assignment_stats
            return jsonify(analytics), 200
        except Exception as e:
            return jsonify({'error': f'Failed to get analytics: {str(e)}'}), 500

    @staticmethod
    def get_course_progress(course_id):
        """Get student's progress in the course"""
        try:
            course = Course.find_instance_by_id(course_id)
            if not course:
                return jsonify({'error': 'Course not found'}), 404
            from models.assignment_model import Assignment
            student_id = str(g.current_user['_id'])
            total_assignments = len(course.assignments)
            completed_assignments = 0
            for assignment_id in course.assignments:
                assignment_doc = Assignment._coll().find_one({'_id': assignment_id})
                if assignment_doc:
                    assignment = Assignment(assignment_doc)
                    student_submission = next(
                        (s for s in assignment.submissions if str(s.student_id) == student_id),
                        None
                    )
                    if student_submission and student_submission.status in ['submitted', 'graded']:
                        completed_assignments += 1
            progress = {
                'course_id': course_id,
                'student_id': student_id,
                'total_assignments': total_assignments,
                'completed_assignments': completed_assignments,
                'progress_percentage': (completed_assignments / total_assignments * 100) if total_assignments > 0 else 0,
                'total_modules': len(course.modules)
            }
            return jsonify(progress), 200
        except Exception as e:
            return jsonify({'error': f'Failed to get progress: {str(e)}'}), 500

    @staticmethod
    def publish_course(course_id):
        """Publish/unpublish course"""
        try:
            from datetime import datetime, timezone
            data = request.get_json()
            is_published = data.get('is_published', True)
            Course._coll().update_one(
                {'_id': ObjectId(course_id)},
                {'$set': {'is_published': is_published, 'updated_at': datetime.now(timezone.utc)}}
            )
            status = 'published' if is_published else 'unpublished'
            return jsonify({'message': f'Course {status} successfully'}), 200
        except Exception as e:
            return jsonify({'error': f'Failed to publish course: {str(e)}'}), 500