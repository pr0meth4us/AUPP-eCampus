from flask import jsonify, request, g
from bson import ObjectId
from app.models.assignment_model import Assignment
from app.models.course_model import Course
from app.services.file_upload_service import upload_assignment_file, upload_student_submission
from app.utils.date_utils import ensure_datetime, utc_now

class AssignmentController:
    @staticmethod
    def create_assignment(course_id):
        """Create a new assignment for the course (instructor only)"""
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

            # Parse numeric fields
            if 'allowed_file_types' in data:
                data['allowed_file_types'] = data['allowed_file_types'].split(',') if data['allowed_file_types'] else []
            for field in ['max_file_size', 'max_files', 'points', 'late_penalty']:
                if field in data and data[field]:
                    try:
                        data[field] = float(data[field]) if field == 'late_penalty' else int(data[field])
                    except ValueError:
                        return jsonify({'error': f'Invalid {field} format'}), 400

            # Handle attachment file uploads
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
                        else:
                            return jsonify({'error': 'Attachment upload failed', 'details': upload_result['errors']}), 400

            data['attachment_urls'] = attachment_urls
            data['attachment_names'] = attachment_names

            assignment_id = Assignment.save(data)
            return jsonify({'message': 'Assignment created successfully', 'assignment_id': assignment_id}), 201

        except Exception as e:
            return jsonify({'error': f'Failed to create assignment: {str(e)}'}), 500

    @staticmethod
    def get_course_assignments(course_id):
        """Get all assignments for a course (instructor view)"""
        try:
            course = Course.find_instance_by_id(course_id)
            if not course:
                return jsonify({'error': 'Course not found'}), 404

            assignments = Assignment.find_by_course(course_id)
            return jsonify(assignments), 200

        except Exception as e:
            return jsonify({'error': f'Failed to get assignments: {str(e)}'}), 500

    # @staticmethod
    # def get_student_assignments(course_id):
    #     """Get assignments plus this student's submission status"""
    #     try:
    #         student_id = str(g.current_user['_id'])
    #         assignments = Assignment.find_by_student(student_id, course_id)
    #         return jsonify(assignments), 200
    #     except Exception as e:
    #         return jsonify({'error': f'Failed to get student assignments: {str(e)}'}), 500
    #
    # @staticmethod
    # def submit_assignment(course_id, assignment_id):
    #     """Submit assignment as a student (supports file uploads)"""
    #     try:
    #         assignment_doc = Assignment._coll().find_one({'_id': ObjectId(assignment_id)})
    #         if not assignment_doc:
    #             return jsonify({'error': 'Assignment not found'}), 404
    #
    #         student_id = str(g.current_user['_id'])
    #         data = request.form.to_dict()
    #
    #         uploaded_files = []
    #         file_names = []
    #         # Expect form field "files" to be a list of files
    #         files = request.files.getlist('files')
    #         if files:
    #             assignment_obj = Assignment(assignment_doc)
    #             upload_result = upload_student_submission(
    #                 files,
    #                 course_id,
    #                 assignment_id,
    #                 student_id,
    #                 assignment_obj.allowed_file_types
    #             )
    #             if upload_result['success']:
    #                 for file_info in upload_result['uploaded_files']:
    #                     uploaded_files.append(file_info['file_url'])
    #                     file_names.append(file_info['original_filename'])
    #             else:
    #                 return jsonify({'error': 'File upload failed', 'details': upload_result['errors']}), 400
    #
    #         submission_data = {
    #             'content': data.get('content', ''),
    #             'file_urls': uploaded_files,
    #             'file_names': file_names
    #         }
    #
    #         submission_id = Assignment.submit_assignment(assignment_id, student_id, submission_data)
    #         return jsonify({'message': 'Assignment submitted successfully', 'submission_id': submission_id}), 201
    #
    #     except Exception as e:
    #         return jsonify({'error': f'Failed to submit assignment: {str(e)}'}), 500

    @staticmethod
    def grade_assignment(course_id, assignment_id, submission_id):
        """Grade one specific submission (instructor only)."""
        try:
            data = request.get_json() or {}
            if 'grade' not in data or 'feedback' not in data:
                return jsonify({'error': 'Both grade and feedback are required'}), 400

            try:
                grade = float(data['grade'])
            except ValueError:
                return jsonify({'error': 'Invalid grade format'}), 400

            feedback = data['feedback']
            grader_id = str(g.current_user['_id'])

            # Call the updated grade_submission (which now needs submission_id)
            Assignment.grade_submission(assignment_id, submission_id, grade, feedback, grader_id)
            return jsonify({'message': 'Assignment graded successfully'}), 200

        except Exception as e:
            return jsonify({'error': f'Failed to grade assignment: {str(e)}'}), 500

    @staticmethod
    def get_assignment_details(course_id, assignment_id):
        """Get detailed assignment info (returns full for instructor/admin, limited for student)"""
        try:
            assignment_doc = Assignment._coll().find_one({'_id': ObjectId(assignment_id)})
            if not assignment_doc:
                return jsonify({'error': 'Assignment not found'}), 404

            assignment_obj = Assignment(assignment_doc)
            user_role = g.current_user.get('role')
            course = Course.find_instance_by_id(course_id)
            user_id = str(g.current_user['_id'])

            # If admin or course instructor, give full to_dict()
            if (
                    user_role == 'admin'
                    or str(course.instructor_id) == user_id
                    or str(course.uploader_id) == user_id
            ):
                return jsonify(assignment_obj.to_dict()), 200
            else:
                # Otherwise student sees only their own submission
                return jsonify(assignment_obj.to_student_dict(user_id)), 200

        except Exception as e:
            return jsonify({'error': f'Failed to get assignment details: {str(e)}'}), 500

    @staticmethod
    def update_assignment(course_id, assignment_id):
        """Update assignment details (instructor only)"""
        try:
            data = request.form.to_dict()

            # Parse numeric fields
            if 'allowed_file_types' in data:
                data['allowed_file_types'] = data['allowed_file_types'].split(',') if data['allowed_file_types'] else []
            for field in ['max_file_size', 'max_files', 'points', 'late_penalty']:
                if field in data and data[field]:
                    try:
                        data[field] = float(data[field]) if field == 'late_penalty' else int(data[field])
                    except ValueError:
                        return jsonify({'error': f'Invalid {field} format'}), 400

            # Handle new attachment uploads (if any)
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
                        else:
                            return jsonify({'error': 'Attachment upload failed', 'details': upload_result['errors']}), 400

            if attachment_urls:
                data['attachment_urls'] = attachment_urls
                data['attachment_names'] = attachment_names

            data['updated_at'] = utc_now()
            Assignment._coll().update_one(
                {'_id': ObjectId(assignment_id)},
                {'$set': data}
            )
            return jsonify({'message': 'Assignment updated successfully'}), 200

        except Exception as e:
            return jsonify({'error': f'Failed to update assignment: {str(e)}'}), 500

    @staticmethod
    def delete_assignment(course_id, assignment_id):
        """Delete an assignment (instructor only)"""
        try:
            Course._coll().update_one(
                {'_id': ObjectId(course_id)},
                {'$pull': {'assignments': ObjectId(assignment_id)}}
            )
            Assignment._coll().delete_one({'_id': ObjectId(assignment_id)})
            return jsonify({'message': 'Assignment deleted successfully'}), 200

        except Exception as e:
            return jsonify({'error': f'Failed to delete assignment: {str(e)}'}), 500

    @staticmethod
    def get_assignment_submissions(course_id, assignment_id):
        """Get all submissions for an assignment (instructor only)"""
        try:
            assignment_doc = Assignment._coll().find_one({'_id': ObjectId(assignment_id)})
            if not assignment_doc:
                return jsonify({'error': 'Assignment not found'}), 404

            assignment_obj = Assignment(assignment_doc)
            submissions = [s.to_dict() for s in assignment_obj.submissions]
            return jsonify(submissions), 200

        except Exception as e:
            return jsonify({'error': f'Failed to get submissions: {str(e)}'}), 500

    @staticmethod
    def publish_assignment(course_id, assignment_id):
        """Publish or unpublish an assignment (instructor only)"""
        try:
            # Determine is_published from either query param or request body
            action = request.args.get('action')
            if action:
                is_published = action.lower() == 'publish'
            else:
                data = request.get_json()
                if not data:
                    return jsonify({'error': 'No data provided'}), 400
                is_published = data.get('is_published', True)

            assignment_doc = Assignment._coll().find_one({'_id': ObjectId(assignment_id)})
            if not assignment_doc:
                return jsonify({'error': 'Assignment not found'}), 404

            Assignment._coll().update_one(
                {'_id': ObjectId(assignment_id)},
                {
                    '$set': {
                        'is_published': is_published,
                        'updated_at': utc_now()
                    }
                }
            )

            status = 'published' if is_published else 'unpublished'
            return jsonify({'message': f'Assignment {status} successfully'}), 200

        except Exception as e:
            return jsonify({'error': f'Failed to publish assignment: {str(e)}'}), 500

    @staticmethod
    def get_student_assignments(course_id):
        """Get every assignment in this course, plus exactly this student's submission (if any)."""
        try:
            student_id = str(g.current_user['_id'])

            # Fetch all assignments for this course
            all_docs = Assignment._coll().find({'course_id': ObjectId(course_id)})
            result_list = []
            for doc in all_docs:
                assignment_obj = Assignment(doc)
                student_view = assignment_obj.to_student_dict(student_id)
                result_list.append(student_view)

            return jsonify(result_list), 200

        except Exception as e:
            return jsonify({'error': f'Failed to get student assignments: {str(e)}'}), 500


    @staticmethod
    def submit_assignment(course_id, assignment_id):
        """Submit assignment as a student (supports file uploads)."""
        try:
            # 1) Check assignment exists
            assignment_doc = Assignment._coll().find_one({'_id': ObjectId(assignment_id)})
            if not assignment_doc:
                return jsonify({'error': 'Assignment not found'}), 404

            student_id = str(g.current_user['_id'])
            data = request.form.to_dict()

            # 2) Debug log: see which file‐keys were actually sent
            print(">> DEBUG: request.files keys =", list(request.files.keys()))

            # 3) Grab files under the correct key.
            #    Make sure your front‐end uses <input name="files" multiple>
            files = request.files.getlist('files')
            uploaded_files = []
            file_names = []

            if files and any(f.filename for f in files):
                assignment_obj = Assignment(assignment_doc)
                upload_result = upload_student_submission(
                    files,
                    course_id,
                    assignment_id,
                    student_id,
                    assignment_obj.allowed_file_types
                )
                if upload_result.get('success'):
                    for file_info in upload_result['uploaded_files']:
                        uploaded_files.append(file_info['file_url'])
                        file_names.append(file_info['original_filename'])
                else:
                    # Return the S3 errors to client
                    return jsonify({
                        'error': 'File upload failed',
                        'details': upload_result.get('errors', 'unknown')
                    }), 400

            # 4) Build submission payload
            submission_data = {
                'content': data.get('content', ''),
                'file_urls': uploaded_files,
                'file_names': file_names
            }

            # 5) Actually save into MongoDB
            submission_id = Assignment.submit_assignment(
                assignment_id, student_id, submission_data
            )

            return jsonify({
                'message': 'Assignment submitted successfully',
                'submission_id': submission_id
            }), 201

        except Exception as e:
            return jsonify({'error': f'Failed to submit assignment: {str(e)}'}), 500
