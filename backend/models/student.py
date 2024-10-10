from bson import ObjectId

class Student:
    def __init__(self, student_id, name, email, bio, courses_enrolled, profile_image):
        self.student_id = student_id
        self.name = name
        self.email = email
        self.bio = bio
        self.courses_enrolled = courses_enrolled
        self.profile_image = profile_image

    def to_dict(self):
        return {
            "student_id": self.student_id,
            "name": self.name,
            "bio": self.bio,
            "courses_enrolled": self.courses_enrolled,
            "profile_image": self.profile_image,
        }