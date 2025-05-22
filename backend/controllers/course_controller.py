from flask import jsonify, request, g
from models.course_model import Course, Module, Assignment
from services.file_upload_service import upload_course_material, upload_assignment_file, upload_student_submission
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

            # Set uploader as current user
            data['uploader_id'] = str(g.current_user['_id'])

            # Handle cover image upload if provided
            if 'cover_image' in request.files:
                cover_file = request.files['cover_image']
                if cover_file and cover_file.filename:
                    upload_result = upload_course_material(
                        cover_file,
                        "temp",
                        "covers"
                    )
                    if upload_result['success']:
                        data['cover_image_url'] = upload_result['file_url']

            # Parse arrays if provided as strings
            if 'major_ids' in data:
                data['major_ids'] = data['major_ids'].split(',') if isinstance(data['major_ids'], str) else data['major_ids']
            if 'tag_ids' in data:
                data['tag_ids'] = data['tag_ids'].split(',') if isinstance(data['tag_ids'], str) else data['tag_ids']

            # Convert price to float if provided
            if 'price' in data and data['price']:
                try:
                    data['price'] = float(data['price'])
                except ValueError:
                    return jsonify({'error': 'Invalid price format'}), 400

            course_id = Course.save(data)

            # Update cover image path with actual course ID
            if 'cover_image_url' in data:
                # Re-upload with proper course folder structure
                Course.update(course_id, {'cover_image_url': data['cover_image_url']})

            return jsonify({
                'message': 'Course created successfully',
                'course_id': course_id
            }), 201

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
            # Check if course exists
            course = Course.find_instance_by_id(course_id)
            if not course:
                return jsonify({'error': 'Course not found'}), 404

            data = request.form.to_dict()

            # Handle cover image upload if provided
            if 'cover_image' in request.files:
                cover_file = request.files['cover_image']
                if cover_file and cover_file.filename:
                    upload_result = upload_course_material(
                        cover_file,
                        course_id,
                        "covers"
                    )
                    if upload_result['success']:
                        data['cover_image_url'] = upload_result['file_url']

            # Parse arrays if provided as strings
            if 'major_ids' in data:
                data['major_ids'] = data['major_ids'].split(',') if isinstance(data['major_ids'], str) else data['major_ids']
            if 'tag_ids' in data:
                data['tag_ids'] = data['tag_ids'].split(',') if isinstance(data['tag_ids'], str) else data['tag_ids']

            # Convert price to float if provided
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
            # Check if course exists
            course = Course.find_instance_by_id(course_id)
            if not course:
                return jsonify({'error': 'Course not found'}), 404

            Course.delete(course_id)
            return jsonify({'message': 'Course deleted successfully'}), 200

        except Exception as e:
            return jsonify({'error': f'Failed to delete course: {str(e)}'}), 500

    @staticmethod
    def get_all_courses():
        """Get all courses (public endpoint)"""
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

            if role == 'admin':
                courses = Course.find_by_user(user_id)
            elif role == 'instructor':
                courses = Course.find_by_user(user_id, role='instructor')
            else:
                courses = Course.find_by_user(user_id, role='student')

            return jsonify(courses), 200

        except Exception as e:
            return jsonify({'error': f'Failed to retrieve user courses: {str(e)}'}), 500

    @staticmethod
    def preview_course(course_id):
        """Get course preview (public information only)"""
        try:
            course = Course.find_instance_by_id(course_id)
            return jsonify(course.to_preview_dict()), 200
        except Exception as e:
            return jsonify({'error': f'Failed to get course preview: {str(e)}'}), 500

    @staticmethod
    def detail_course(course_id):
        """Get detailed course content for enrolled students"""
        try:
            course = Course.find_instance_by_id(course_id)
            student_id = str(g.current_user['_id'])
            course_dict = course.to_student_dict(student_id)
            return jsonify(course_dict), 200
        except Exception as e:
            return jsonify({'error': f'Failed to get course details: {str(e)}'}), 500


    @staticmethod
    def full_course(course_id):
        """Get full course information for instructors/admins"""
        try:
            course = Course.find_instance_by_id(course_id)
            if not course:
                return jsonify({'error': 'Course not found'}), 404
            return jsonify(course.to_instructor_dict()), 200
        except Exception as e:
            return jsonify({'error': f'Failed to get full course: {str(e)}'}), 500

    @staticmethod
    def enroll_student(course_id):
        """Enroll current user in course"""
        try:
            course = Course.find_instance_by_id(course_id)
            if not course:
                return jsonify({'error': 'Course not found'}), 404

            student_id = str(g.current_user['_id'])

            # Check if already enrolled
            if student_id in [str(s) for s in course.enrolled_students]:
                return jsonify({'error': 'Already enrolled in this course'}), 400

            Course.enroll_student(course_id, student_id)
            return jsonify({'message': 'Successfully enrolled in course'}), 200

        except Exception as e:
            return jsonify({'error': f'Failed to enroll: {str(e)}'}), 500

    # Module-related methods
    @staticmethod
    def create_module(course_id):
        """Create a new module for the course"""
        try:
            # Verify course exists and user has permission
            course = Course.find_instance_by_id(course_id)
            if not course:
                return jsonify({'error': 'Course not found'}), 404

            data = request.get_json()
            required_fields = ['title']

            for field in required_fields:
                if field not in data:
                    return jsonify({'error': f'{field} is required'}), 400

            data['course_id'] = course_id
            module_id = Module.save(data)

            return jsonify({
                'message': 'Module created successfully',
                'module_id': module_id
            }), 201

        except Exception as e:
            return jsonify({'error': f'Failed to create module: {str(e)}'}), 500

    @staticmethod
    def add_module_content(course_id, module_id):
        """Add content to a module with file upload support"""
        try:
            data = request.form.to_dict()
            required_fields = ['title', 'content_type']

            for field in required_fields:
                if field not in data:
                    return jsonify({'error': f'{field} is required'}), 400

            # Handle file upload if content_type is 'file'
            if data['content_type'] == 'file' and 'file' in request.files:
                file = request.files['file']
                if file and file.filename:
                    upload_result = upload_course_material(file, course_id, f"modules/{module_id}")
                    if upload_result['success']:
                        data['file_url'] = upload_result['file_url']
                        data['file_name'] = upload_result['original_filename']
                        data['file_type'] = upload_result['content_type']

            content_id = Module.add_content(module_id, data)
            return jsonify({
                'message': 'Content added successfully',
                'content_id': content_id
            }), 201

        except Exception as e:
            return jsonify({'error': f'Failed to add content: {str(e)}'}), 500

    @staticmethod
    def get_course_modules(course_id):
        """Get all modules for a course"""
        try:
            # Verify course exists
            course = Course.find_instance_by_id(course_id)
            if not course:
                return jsonify({'error': 'Course not found'}), 404

            modules = Module.find_by_course(course_id)
            return jsonify(modules), 200

        except Exception as e:
            return jsonify({'error': f'Failed to get modules: {str(e)}'}), 500

    # Assignment-related methods
    @staticmethod
    def create_assignment(course_id):
        """Create a new assignment for the course"""
        try:
            course = Course.find_instance_by_id(course_id)
            if not course:
                return jsonify({'error': 'Course not found'}), 404

            data = request.form.to_dict()
            required_fields = ['title', 'description']

            for field in required_fields:
                if field not in data:
                    return jsonify({'error': f'{field} is required'}), 400

            data['course_id'] = course_id

            # Parse array fields
            if 'allowed_file_types' in data:
                data['allowed_file_types'] = data['allowed_file_types'].split(',') if data['allowed_file_types'] else []

            # Convert numeric fields
            for field in ['max_file_size', 'max_files', 'points', 'late_penalty']:
                if field in data and data[field]:
                    try:
                        if field == 'late_penalty':
                            data[field] = float(data[field])
                        else:
                            data[field] = int(data[field])
                    except ValueError:
                        return jsonify({'error': f'Invalid {field} format'}), 400

            # Handle attachment files
            attachment_urls = []
            attachment_names = []

            for key in request.files:
                if key.startswith('attachment_'):
                    file = request.files[key]
                    if file and file.filename:
                        upload_result = upload_assignment_file(file, course_id, "temp", "instructor")
                        if upload_result['success']:
                            attachment_urls.append(upload_result['file_url'])
                            attachment_names.append(upload_result['original_filename'])

            data['attachment_urls'] = attachment_urls
            data['attachment_names'] = attachment_names

            assignment_id = Assignment.save(data)

            return jsonify({
                'message': 'Assignment created successfully',
                'assignment_id': assignment_id
            }), 201

        except Exception as e:
            return jsonify({'error': f'Failed to create assignment: {str(e)}'}), 500

    @staticmethod
    def submit_assignment(course_id, assignment_id):
        """Submit assignment as a student"""
        try:
            # Verify assignment exists
            assignment_doc = Assignment._coll().find_one({'_id': ObjectId(assignment_id)})
            if not assignment_doc:
                return jsonify({'error': 'Assignment not found'}), 404

            student_id = str(g.current_user['_id'])
            data = request.form.to_dict()

            # Handle file uploads
            uploaded_files = []
            file_names = []

            files = request.files.getlist('files')
            if files:
                assignment = Assignment(assignment_doc)
                upload_result = upload_student_submission(
                    files, course_id, assignment_id, student_id,
                    assignment.allowed_file_types
                )

                if upload_result['success']:
                    for file_info in upload_result['uploaded_files']:
                        uploaded_files.append(file_info['file_url'])
                        file_names.append(file_info['original_filename'])
                else:
                    return jsonify({'error': 'File upload failed', 'details': upload_result['errors']}), 400

            submission_data = {
                'content': data.get('content', ''),
                'file_urls': uploaded_files,
                'file_names': file_names
            }

            submission_id = Assignment.submit_assignment(assignment_id, student_id, submission_data)

            return jsonify({
                'message': 'Assignment submitted successfully',
                'submission_id': submission_id
            }), 201

        except Exception as e:
            return jsonify({'error': f'Failed to submit assignment: {str(e)}'}), 500

    @staticmethod
    def grade_assignment(course_id, assignment_id, student_id):
        """Grade a student's assignment submission"""
        try:
            data = request.get_json()
            required_fields = ['grade', 'feedback']

            for field in required_fields:
                if field not in data:
                    return jsonify({'error': f'{field} is required'}), 400

            try:
                grade = float(data['grade'])
            except ValueError:
                return jsonify({'error': 'Invalid grade format'}), 400

            grader_id = str(g.current_user['_id'])

            Assignment.grade_submission(
                assignment_id, student_id, grade,
                data['feedback'], grader_id
            )

            return jsonify({'message': 'Assignment graded successfully'}), 200

        except Exception as e:
            return jsonify({'error': f'Failed to grade assignment: {str(e)}'}), 500

    @staticmethod
    def get_course_assignments(course_id):
        """Get all assignments for a course"""
        try:
            course = Course.find_instance_by_id(course_id)
            if not course:
                return jsonify({'error': 'Course not found'}), 404

            assignments = Assignment.find_by_course(course_id)
            return jsonify(assignments), 200

        except Exception as e:
            return jsonify({'error': f'Failed to get assignments: {str(e)}'}), 500

    @staticmethod
    def get_student_assignments(course_id):
        """Get assignments with student's submission status"""
        try:
            student_id = str(g.current_user['_id'])
            assignments = Assignment.find_by_student(student_id, course_id)
            return jsonify(assignments), 200

        except Exception as e:
            return jsonify({'error': f'Failed to get student assignments: {str(e)}'}), 500

    # Additional methods for enhanced functionality
    @staticmethod
    def get_enrolled_students(course_id):
        """Get list of enrolled students"""
        try:
            from models.user_model import User  # Assuming you have a User model

            course = Course.find_instance_by_id(course_id)
            if not course:
                return jsonify({'error': 'Course not found'}), 404

            # Get basic info for enrolled students
            students = []
            for student_id in course.enrolled_students:
                student = User.find_by_id(str(student_id))  # Adjust based on your User model
                if student:
                    students.append({
                        '_id': str(student_id),
                        'name': student.get('name', 'Unknown'),
                        'email': student.get('email', 'Unknown')
                    })

            return jsonify(students), 200

        except Exception as e:
            return jsonify({'error': f'Failed to get enrolled students: {str(e)}'}), 500

    @staticmethod
    def get_assignment_submissions(course_id, assignment_id):
        """Get all submissions for an assignment"""
        try:
            from bson import ObjectId

            assignment_doc = Assignment._coll().find_one({'_id': ObjectId(assignment_id)})
            if not assignment_doc:
                return jsonify({'error': 'Assignment not found'}), 404

            assignment = Assignment(assignment_doc)
            submissions = [s.to_dict() for s in assignment.submissions]

            return jsonify(submissions), 200

        except Exception as e:
            return jsonify({'error': f'Failed to get submissions: {str(e)}'}), 500

    @staticmethod
    def get_assignment_details(course_id, assignment_id):
        """Get detailed assignment information"""
        try:
            from bson import ObjectId

            assignment_doc = Assignment._coll().find_one({'_id': ObjectId(assignment_id)})
            if not assignment_doc:
                return jsonify({'error': 'Assignment not found'}), 404

            assignment = Assignment(assignment_doc)

            # Return different views based on user role
            user_role = g.current_user.get('role')
            course = Course.find_instance_by_id(course_id)
            user_id = str(g.current_user['_id'])

            if (user_role == 'admin' or
                    str(course.instructor_id) == user_id or
                    str(course.uploader_id) == user_id):
                return jsonify(assignment.to_dict()), 200
            else:
                return jsonify(assignment.to_student_dict(user_id)), 200

        except Exception as e:
            return jsonify({'error': f'Failed to get assignment details: {str(e)}'}), 500

    @staticmethod
    def update_assignment(course_id, assignment_id):
        """Update assignment details"""
        try:
            from bson import ObjectId
            from datetime import datetime, timezone

            data = request.form.to_dict()

            # Parse array fields
            if 'allowed_file_types' in data:
                data['allowed_file_types'] = data['allowed_file_types'].split(',') if data['allowed_file_types'] else []

            # Convert numeric fields
            for field in ['max_file_size', 'max_files', 'points', 'late_penalty']:
                if field in data and data[field]:
                    try:
                        if field == 'late_penalty':
                            data[field] = float(data[field])
                        else:
                            data[field] = int(data[field])
                    except ValueError:
                        return jsonify({'error': f'Invalid {field} format'}), 400

            # Handle new attachment files
            attachment_urls = []
            attachment_names = []

            for key in request.files:
                if key.startswith('attachment_'):
                    file = request.files[key]
                    if file and file.filename:
                        upload_result = upload_assignment_file(file, course_id, assignment_id, "instructor")
                        if upload_result['success']:
                            attachment_urls.append(upload_result['file_url'])
                            attachment_names.append(upload_result['original_filename'])

            if attachment_urls:
                data['attachment_urls'] = attachment_urls
                data['attachment_names'] = attachment_names

            data['updated_at'] = datetime.now(timezone.utc)

            Assignment._coll().update_one(
                {'_id': ObjectId(assignment_id)},
                {'$set': data}
            )

            return jsonify({'message': 'Assignment updated successfully'}), 200

        except Exception as e:
            return jsonify({'error': f'Failed to update assignment: {str(e)}'}), 500

    @staticmethod
    def delete_assignment(course_id, assignment_id):
        """Delete an assignment"""
        try:
            from bson import ObjectId

            # Remove from course's assignments array
            Course._coll().update_one(
                {'_id': ObjectId(course_id)},
                {'$pull': {'assignments': ObjectId(assignment_id)}}
            )

            # Delete the assignment
            Assignment._coll().delete_one({'_id': ObjectId(assignment_id)})

            return jsonify({'message': 'Assignment deleted successfully'}), 200

        except Exception as e:
            return jsonify({'error': f'Failed to delete assignment: {str(e)}'}), 500

    @staticmethod
    def update_module(course_id, module_id):
        """Update module details"""
        try:
            from bson import ObjectId
            from datetime import datetime, timezone

            data = request.get_json()
            data['updated_at'] = datetime.now(timezone.utc)

            Module._coll().update_one(
                {'_id': ObjectId(module_id)},
                {'$set': data}
            )

            return jsonify({'message': 'Module updated successfully'}), 200

        except Exception as e:
            return jsonify({'error': f'Failed to update module: {str(e)}'}), 500

    @staticmethod
    def delete_module(course_id, module_id):
        """Delete a module and its contents"""
        try:
            from bson import ObjectId

            # Remove from course's modules array
            Course._coll().update_one(
                {'_id': ObjectId(course_id)},
                {'$pull': {'modules': ObjectId(module_id)}}
            )

            # Delete the module
            Module._coll().delete_one({'_id': ObjectId(module_id)})

            return jsonify({'message': 'Module deleted successfully'}), 200

        except Exception as e:
            return jsonify({'error': f'Failed to delete module: {str(e)}'}), 500

    @staticmethod
    def get_course_analytics(course_id):
        """Get course analytics and statistics"""
        try:
            course = Course.find_instance_by_id(course_id)
            if not course:
                return jsonify({'error': 'Course not found'}), 404

            # Basic analytics
            analytics = {
                'total_students': len(course.enrolled_students),
                'total_modules': len(course.modules),
                'total_assignments': len(course.assignments),
                'course_created': course.created_at.isoformat() if course.created_at else None
            }

            # Assignment submission stats
            assignment_stats = []
            for assignment_id in course.assignments:
                assignment_doc = Assignment._coll().find_one({'_id': assignment_id})
                if assignment_doc:
                    assignment = Assignment(assignment_doc)
                    submitted_count = len([s for s in assignment.submissions if s.status != 'not_submitted'])
                    assignment_stats.append({
                        'assignment_id': str(assignment_id),
                        'title': assignment.title,
                        'total_submissions': submitted_count,
                        'submission_rate': (submitted_count / len(course.enrolled_students) * 100) if course.enrolled_students else 0
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

            student_id = str(g.current_user['_id'])

            # Calculate progress based on assignments
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

            # Note: This assumes you add an is_published field to your Course model
            Course._coll().update_one(
                {'_id': ObjectId(course_id)},
                {
                    '$set': {
                        'is_published': is_published,
                        'updated_at': datetime.now(timezone.utc)
                    }
                }
            )

            status = 'published' if is_published else 'unpublished'
            return jsonify({'message': f'Course {status} successfully'}), 200

        except Exception as e:
            return jsonify({'error': f'Failed to publish course: {str(e)}'}), 500