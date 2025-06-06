from flask import jsonify, request, g
from models.course_model import Course
from services.file_upload_service import upload_course_material
from bson import ObjectId
from datetime import datetime, timezone
from models.assignment_model import Assignment

class CourseController:
    @staticmethod
    def create_course():
        try:
            data = {}
            # 1) Title & description are required
            data['title'] = request.form.get('title', '').strip()
            data['description'] = request.form.get('description', '').strip()

            if not data['title']:
                return jsonify({'error': 'title is required'}), 400
            if not data['description']:
                return jsonify({'error': 'description is required'}), 400

            # 2) Set uploader_id to current user (always) and instructor_id (if not provided)
            user_id = str(g.current_user['_id'])
            data['uploader_id'] = user_id  # Always set to current user

            # Set instructor_id from request, or default to current user if not provided
            instructor_id = request.form.get('instructor_id')
            if instructor_id:
                data['instructor_id'] = instructor_id.strip()
            else:
                data['instructor_id'] = user_id

            print(data['title'],
                  data['description'],
                  data['instructor_id'],
                  data['uploader_id'],  # Add to debug print
                  data
                  )

            # 3) Handle price (if sent), else default to 0.0
            price_raw = request.form.get('price', None)
            if price_raw is not None and price_raw != '':
                try:
                    data['price'] = float(price_raw)
                except ValueError:
                    return jsonify({'error': 'Invalid price format'}), 400
            else:
                data['price'] = 0.0

            # 4) Collect repeated 'tag_ids' keys into a Python list
            tag_ids_list = request.form.getlist('tag_ids')
            data['tag_ids'] = tag_ids_list if tag_ids_list else []

            # 5) Collect repeated 'major_ids' keys into a Python list
            major_ids_list = request.form.getlist('major_ids')
            data['major_ids'] = major_ids_list if major_ids_list else []

            # 6) Handle optional file upload under 'cover_image'
            if 'cover_image' in request.files:
                cover_file = request.files['cover_image']
                if cover_file and cover_file.filename:
                    upload_result = upload_course_material(cover_file, "temp", "covers")
                    if upload_result.get('success'):
                        data['cover_image_url'] = upload_result['file_url']

            # 7) Persist to MongoDB (or whatever Course.save does)
            course_id = Course.save(data)
            return jsonify({'message': 'Course created successfully', 'course_id': course_id}), 201

        except Exception as e:
            return jsonify({'error': f'Failed to create course: {str(e)}'}), 500
    @staticmethod
    def get_course(course_id):
        """
        Get basic course information (public).
        """
        try:
            course = Course.find_by_id(course_id)
            if not course:
                return jsonify({'error': 'Course not found'}), 404
            return jsonify(course), 200
        except Exception as e:
            return jsonify({'error': f'Failed to retrieve course: {str(e)}'}), 500


    @staticmethod
    def update_course(course_id):
        try:
            # Ensure the course exists
            if not Course.find_instance_by_id(course_id):
                return jsonify({'error': 'Course not found'}), 404

            data = {}
            # Grab optional title/description
            if 'title' in request.form:
                data['title'] = request.form.get('title').strip()
            if 'description' in request.form:
                data['description'] = request.form.get('description').strip()

            # Handle price if present
            if 'price' in request.form:
                raw_price = request.form.get('price')
                if raw_price != '':
                    try:
                        data['price'] = float(raw_price)
                    except ValueError:
                        return jsonify({'error': 'Invalid price format'}), 400
                else:
                    data['price'] = 0.0

            # Handle tag_ids[]:
            tag_ids_list = request.form.getlist('tag_ids')
            if tag_ids_list:
                data['tag_ids'] = [tid for tid in tag_ids_list]
            else:
                # If they explicitly passed tag_ids=[] (empty), it becomes empty list
                if 'tag_ids' in request.form:
                    data['tag_ids'] = []

            # Handle major_ids[]:
            major_ids_list = request.form.getlist('major_ids')
            if major_ids_list:
                data['major_ids'] = [mid for mid in major_ids_list]
            else:
                if 'major_ids' in request.form:
                    data['major_ids'] = []

            # Handle new cover_image file:
            if 'cover_image' in request.files:
                cover_file = request.files['cover_image']
                if cover_file and cover_file.filename:
                    upload_result = upload_course_material(cover_file, course_id, "covers")
                    if upload_result.get('success'):
                        data['cover_image_url'] = upload_result['file_url']

            # Now update in DB:
            Course.update(course_id, data)
            return jsonify({'message': 'Course updated successfully'}), 200

        except Exception as e:
            return jsonify({'error': f'Failed to update course: {str(e)}'}), 500


    @staticmethod
    def delete_course(course_id):
        """
        Delete course (owner/admin only).
        """
        try:
            if not Course.find_instance_by_id(course_id):
                return jsonify({'error': 'Course not found'}), 404
            Course.delete(course_id)
            return jsonify({'message': 'Course deleted successfully'}), 200
        except Exception as e:
            return jsonify({'error': f'Failed to delete course: {str(e)}'}), 500


    @staticmethod
    def get_all_courses():
        """Get all courses (public)."""
        try:
            courses = Course.find_all()
            return jsonify(courses), 200
        except Exception as e:
            return jsonify({'error': f'Failed to retrieve courses: {str(e)}'}), 500


    @staticmethod
    def get_my_courses():
        """
        Get courses associated with the current logged-in user (enrolled/teaching).
        """
        try:
            user_id_str = str(g.current_user['_id'])
            role = g.current_user.get('role')
            courses_with_instructor = Course.find_by_user_with_instructor(user_id_str, role=role)
            return jsonify(courses_with_instructor), 200
        except Exception as e:
            return jsonify({'error': f'Failed to retrieve your courses: {str(e)}'}), 500


    @staticmethod
    def preview_course(course_id):
        """Get course preview with instructor details (no auth required)."""
        try:
            course_preview = Course.get_preview_details(course_id)
            if not course_preview:
                return jsonify({'error': 'Course not found'}), 404
            return jsonify(course_preview), 200
        except Exception as e:
            return jsonify({'error': f'Failed to get course preview: {str(e)}'}), 500


    @staticmethod
    def detail_course(course_id):
        """Get detailed course content for enrolled students (auth required)."""
        try:
            student_id = str(g.current_user['_id'])
            course_details = Course.get_full_details(course_id, student_id_str=student_id)
            course_details['enrolled_students'] = Course.get_enrolled_students_with_details(course_id)
            if not course_details:
                return jsonify({'error': 'Course not found or access denied'}), 404
            return jsonify(course_details), 200
        except Exception as e:
            return jsonify({'error': f'Failed to get course details: {str(e)}'}), 500


    @staticmethod
    def full_course(course_id):
        """Get full course information for instructors/admins."""
        try:
            course_full_details = Course.get_full_details(course_id)
            if not course_full_details:
                return jsonify({'error': 'Course not found'}), 404

            # Add the enrolled students detail array
            course_full_details['enrolled_students'] = Course.get_enrolled_students_with_details(course_id)
            return jsonify(course_full_details), 200
        except Exception as e:
            print(f"Error in full_course: {e}")
            return jsonify({'error': f'Failed to get full course: {str(e)}'}), 500


    @staticmethod
    def enroll_student(course_id):
        """Enroll current user in course."""
        try:
            course = Course.find_instance_by_id(course_id)
            if not course:
                return jsonify({'error': 'Course not found'}), 404

            student_id = str(g.current_user['_id'])
            # If already enrolled, return 400:
            if ObjectId(student_id) in course.enrolled_students:
                return jsonify({'error': 'Already enrolled in this course'}), 400

            Course.enroll_student(course_id, student_id)
            return jsonify({'message': 'Successfully enrolled in course'}), 200
        except Exception as e:
            return jsonify({'error': f'Failed to enroll: {str(e)}'}), 500


    @staticmethod
    def get_enrolled_students(course_id):
        """Get list of enrolled students with full details (instructor only)."""
        try:
            if not Course.find_instance_by_id(course_id):
                return jsonify({'error': 'Course not found'}), 404

            students = Course.get_enrolled_students_with_details(course_id)
            return jsonify(students), 200
        except Exception as e:
            return jsonify({'error': f'Failed to get enrolled students: {str(e)}'}), 500


    @staticmethod
    def get_course_analytics(course_id):
        """Get course analytics and statistics (instructor only)."""
        try:
            course = Course.find_instance_by_id(course_id)
            if not course:
                return jsonify({'error': 'Course not found'}), 404

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
                        submitted_count = len([
                            s for s in assignment.submissions if s.status != 'not_submitted'
                        ])
                        assignment_stats.append({
                            'assignment_id': str(assignment_id),
                            'title': assignment.title,
                            'total_submissions': submitted_count,
                            'submission_rate': (
                                    submitted_count / len(course.enrolled_students) * 100
                            )
                        })
            analytics['assignment_stats'] = assignment_stats
            return jsonify(analytics), 200
        except Exception as e:
            return jsonify({'error': f'Failed to get analytics: {str(e)}'}), 500


    @staticmethod
    def get_course_progress(course_id):
        """Get a student’s progress in the course (auth required)."""
        try:
            course = Course.find_instance_by_id(course_id)
            if not course:
                return jsonify({'error': 'Course not found'}), 404

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
                'progress_percentage': (
                    (completed_assignments / total_assignments * 100)
                    if total_assignments > 0 else 0
                ),
                'total_modules': len(course.modules)
            }
            return jsonify(progress), 200
        except Exception as e:
            return jsonify({'error': f'Failed to get progress: {str(e)}'}), 500


    @staticmethod
    def publish_course(course_id):
        """Publish/unpublish course (instructor only)."""
        try:
            data = request.get_json() or {}
            is_published = data.get('is_published', True)

            Course._coll().update_one(
                {'_id': ObjectId(course_id)},
                {'$set': {
                    'is_published': is_published,
                    'updated_at': datetime.now(timezone.utc)
                }}
            )

            status = 'published' if is_published else 'unpublished'
            return jsonify({'message': f'Course {status} successfully'}), 200
        except Exception as e:
            return jsonify({'error': f'Failed to publish course: {str(e)}'}), 500
