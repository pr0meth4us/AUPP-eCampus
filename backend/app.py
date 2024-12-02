from flask import Flask, jsonify, request
from services.mongo_service import init_mongo, insert_document
from config import Config
import traceback


def create_app():
    flask_app = Flask(__name__)

    # Load configuration
    flask_app.config.from_object(Config)

    # Initialize MongoDB
    init_mongo()

    # CORS initialization (if needed)
    from services.cors_service import init_cors
    init_cors(flask_app)

    @flask_app.errorhandler(500)
    def internal_xerror(error):
        return jsonify(
            {'error': 'Internal Server Error', 'details': traceback.format_exc(), 'exception': str(error)}
        ), 500

    @flask_app.route('/health')
    def health_check():
        return jsonify(status="healthy"), 200

    @flask_app.route('/submit-survey', methods=['POST'])
    def submit_survey():
        try:
            # Get survey data from the request body
            survey_data = request.get_json()

            if not survey_data:
                return jsonify({"message": "No data provided", "success": False}), 400

            # Insert the survey data into MongoDB
            survey_id = insert_document( survey_data)

            return jsonify({
                "message": "Survey submitted successfully",
                "success": True,
                "survey_id": survey_id
            }), 201

        except Exception as e:
            return jsonify({"message": "Failed to submit survey", "error": str(e), "success": False}), 500

    @flask_app.route('/get-surveys', methods=['GET'])
    def get_surveys():
        try:
            # Get all surveys from the "survey_responses" collection
            surveys = get_documents("survey_responses")

            return jsonify({
                "message": "Surveys fetched successfully",
                "success": True,
                "surveys": surveys
            }), 200

        except Exception as e:
            return jsonify({"message": "Failed to fetch surveys", "error": str(e), "success": False}), 500

    @flask_app.route('/update-survey/<survey_id>', methods=['PUT'])
    def update_survey(survey_id):
        try:
            # Get update data from the request body
            update_data = request.get_json()

            # Update the survey response with the provided survey_id
            result = update_document("survey_responses", {"_id": survey_id}, update_data)

            if result:
                return jsonify({"message": "Survey updated successfully", "success": True}), 200
            else:
                return jsonify({"message": "Survey not found", "success": False}), 404

        except Exception as e:
            return jsonify({"message": "Failed to update survey", "error": str(e), "success": False}), 500

    @flask_app.route('/delete-survey/<survey_id>', methods=['DELETE'])
    def delete_survey(survey_id):
        try:
            # Delete the survey response with the provided survey_id
            result = delete_document("survey_responses", {"_id": survey_id})

            if result:
                return jsonify({"message": "Survey deleted successfully", "success": True}), 200
            else:
                return jsonify({"message": "Survey not found", "success": False}), 404

        except Exception as e:
            return jsonify({"message": "Failed to delete survey", "error": str(e), "success": False}), 500

    @flask_app.after_request
    def add_csp_headers(response):
        response.headers['Content-Security-Policy'] = (
            "default-src 'self'; "
            "script-src 'self' https://www.google.com https://www.gstatic.com; "
            "frame-src 'self' https://www.google.com; "
            "style-src 'self' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com;"
        )
        return response

    return flask_app


app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
