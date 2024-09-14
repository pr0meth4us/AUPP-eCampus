backend/
├── app.py                        # Main Flask application
├── models.py                     # Database models (if using a database like MongoDB or SQL)
├── routes/
│   ├── __init__.py               # Initializes all routes
│   ├── courses_routes.py         # Manages API endpoints related to courses
│   ├── user_routes.py            # Manages API endpoints related to user accounts
│   ├── instructor_routes.py      # API endpoints for instructor information
├── services/
│   ├── __init__.py               # Initializes service modules
│   ├── database.py               # Database connection (MongoDB, MySQL, etc.)
│   └── external_api.py           # Handles communication with external APIs (if needed)
├── templates/                    # HTML templates (if necessary, for server-side rendering)
├── static/                       # Static files like images, CSS (if serving any from the backend)
├── config.py                     # Configuration settings (e.g., environment variables, database URLs)
├── requirements.txt              # Python dependencies
├── Dockerfile                    # Docker setup for backend
└── start.sh                      # Script to start backend services







<!-- //start mongoDB -->

brew services stop mongodb/brew/mongodb-community@6.0

brew services list


<!-- //connect mongodb compass -->
mongodb://localhost:27017


<!-- stop mongodb -->
brew services stop mongodb/brew/mongodb-community@6.0


<!-- our password -->
= AuppeCampus2024@@--


mongosh -u admin -p 'AuppeCampus2024@@--' --authenticationDatabase admin