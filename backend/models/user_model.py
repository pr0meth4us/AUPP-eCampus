from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from services.mongo_service import db
from config import Config
from typing import List, Optional, Dict, Any


class User:
    """Base class containing common user attributes and methods."""

    required_fields = {'name', 'email', 'password', 'role'}
    optional_fields = {'bio', 'profile_image', 'courses'}

    def __init__(self, name: str, email: str, password: str, role: str,
                 bio: Optional[str] = None, profile_image: Optional[str] = None,
                 courses: Optional[List[str]] = None):
        self.name = name
        self.email = email
        self.password_hash = generate_password_hash(password)
        self.role = role
        self.bio = bio
        self.profile_image = profile_image
        self.courses = courses or []

    def to_dict(self) -> Dict[str, Any]:
        """Convert user object to dictionary for database storage."""
        return {
            'name': self.name,
            'email': self.email,
            'password_hash': self.password_hash,
            'role': self.role,
            'bio': self.bio,
            'profile_image': self.profile_image,
            'courses': self.courses
        }

    @staticmethod
    def is_email_taken(email: str) -> bool:
        """Check if email is already registered."""
        return db.users.find_one({'email': email}) is not None

    @staticmethod
    def find_by_email(email: str) -> Optional[Dict]:
        """Find user by email."""
        return db.users.find_one({'email': email})

    @staticmethod
    def find_by_id(user_id: str) -> Optional[Dict]:
        """Find user by ID."""
        return db.users.find_one({'_id': ObjectId(user_id)})

    @staticmethod
    def verify_password(stored_password: str, provided_password: str) -> bool:
        """Verify password hash."""
        return check_password_hash(stored_password, provided_password)

    def save_to_db(self) -> None:
        """Save user to database with email uniqueness check."""
        if self.is_email_taken(self.email):
            raise ValueError(f"Email '{self.email}' is already in use.")
        db.users.insert_one(self.to_dict())

    def update_courses(self, course_id: str, add: bool = True) -> None:
        """Add or remove a course."""
        if add and course_id not in self.courses:
            self.courses.append(course_id)
        elif not add and course_id in self.courses:
            self.courses.remove(course_id)

        db.users.update_one(
            {'email': self.email},
            {'$set': {'courses': self.courses}}
        )

    def update_self(self, new_name: Optional[str] = None,
                    new_email: Optional[str] = None,
                    new_password: Optional[str] = None,
                    new_bio: Optional[str] = None,
                    new_profile_image: Optional[str] = None) -> None:
        """Allow the user to update their own information."""
        update_data = {}
        if new_name:
            update_data['name'] = new_name
        if new_email:
            if self.is_email_taken(new_email):
                raise ValueError(f"Email '{new_email}' is already in use.")
            update_data['email'] = new_email
        if new_password:
            update_data['password_hash'] = generate_password_hash(new_password)
        if new_bio is not None:
            update_data['bio'] = new_bio
        if new_profile_image is not None:
            update_data['profile_image'] = new_profile_image

        if not update_data:
            raise ValueError("No fields to update.")

        result = db.users.update_one(
            {'email': self.email},
            {'$set': update_data}
        )
        if result.modified_count == 0:
            raise ValueError("User not found or no changes made.")


class Student(User):
    """Student user model."""

    def __init__(self, name: str, email: str, password: str,
                 bio: Optional[str] = None,
                 courses: Optional[List[str]] = None,
                 profile_image: Optional[str] = None):
        super().__init__(name, email, password, role='student',
                         bio=bio, profile_image=profile_image,
                         courses=courses)


class Instructor(User):
    """Instructor user model with expertise."""

    def __init__(self, name: str, email: str, password: str,
                 bio: Optional[str] = None,
                 courses: Optional[List[str]] = None,
                 expertise: Optional[List[str]] = None,
                 profile_image: Optional[str] = None):
        super().__init__(name, email, password, role='instructor',
                         bio=bio, profile_image=profile_image,
                         courses=courses)
        self.expertise = expertise or []

    def to_dict(self) -> Dict[str, Any]:
        """Override to_dict to include instructor-specific fields."""
        data = super().to_dict()
        data['expertise'] = self.expertise
        return data

    def add_expertise(self, expertise_area: str) -> None:
        """Add an area of expertise."""
        if expertise_area not in self.expertise:
            self.expertise.append(expertise_area)
            db.users.update_one(
                {'email': self.email},
                {'$set': {'expertise': self.expertise}}
            )


class Admin(User):
    """Admin user model with administrative capabilities."""

    def __init__(self, name: str, email: str, password: str,
                 bio: Optional[str] = None,
                 profile_image: Optional[str] = None):
        super().__init__(name, email, password, role='admin',
                         bio=bio, profile_image=profile_image)
        self.token = Config.ADMIN_TOKEN

    def to_dict(self) -> Dict[str, Any]:
        """Override to_dict to exclude courses for admin."""
        data = super().to_dict()
        data.pop('courses', None)  # Remove courses field for admin
        return data

    @staticmethod
    def delete_user(user_id: str) -> None:
        """Delete a user from the database."""
        result = db.users.delete_one({'_id': ObjectId(user_id)})
        if result.deleted_count == 0:
            raise ValueError("User not found.")

    @staticmethod
    def get_all_users() -> List[Dict[str, Any]]:
        """Get all users from the database."""
        return [{
            'id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'role': user['role']
        } for user in db.users.find()]

    @staticmethod
    def update_user(user_id: str, new_name: Optional[str] = None,
                    new_email: Optional[str] = None,
                    new_password: Optional[str] = None) -> None:
        """Update user information."""
        update_data = {}
        if new_name:
            update_data['name'] = new_name
        if new_email:
            if User.is_email_taken(new_email):
                raise ValueError(f"Email '{new_email}' is already in use.")
            update_data['email'] = new_email
        if new_password:
            update_data['password_hash'] = generate_password_hash(new_password)

        if not update_data:
            return

        result = db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )
        if result.modified_count == 0:
            raise ValueError("User not found or no changes made.")
