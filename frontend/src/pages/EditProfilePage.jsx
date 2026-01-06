import React, { useState, useEffect } from 'react';
import {
  Input,
  Button,
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Textarea,
} from '@heroui/react';
import {
  CameraIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/authContext';
import { user as userService } from '../services';

const EditProfilePage = () => {
  const { user: contextUser, loading: authLoading, logout, updateUser } = useAuth();

  // Local form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // Initialize form fields from contextUser once it’s available
  useEffect(() => {
    if (contextUser) {
      setName(contextUser.name || '');
      setEmail(contextUser.email || '');
      setBio(contextUser.bio || '');
      setProfileImage(contextUser.profile_image || contextUser.profileImage || '');
    }
  }, [contextUser]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !contextUser?._id) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Image must be less than 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPEG, PNG, and WebP images are allowed');
      return;
    }

    setImageUploading(true);
    setError('');

    try {
      const data = await userService.uploadProfileImage(contextUser._id, file);
      const newImage = data.image_path || data.profileImage || data.url;
      setProfileImage(newImage);
      setSuccess('Profile image updated successfully!');
      setTimeout(() => setSuccess(''), 3000);

      // Update contextUser via updateUser if you want to persist
      updateUser({ profile_image: newImage });
    } catch (err) {
      let errorMessage = 'Failed to upload image. Try again.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!name.trim()) {
      setError('Name is required');
      setIsSubmitting(false);
      return;
    }

    if (!email.trim()) {
      setError('Email is required');
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    if (password && password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        bio: bio.trim(),
      };
      if (password) payload.password = password;
      if (profileImage) payload.profile_image = profileImage;

      await userService.updateProfile(contextUser._id, payload);
      setSuccess('Profile updated successfully!');
      updateUser({ ...payload }); // update contextUser fields
      setPassword('');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      let errorMessage = 'An error occurred while updating your profile.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 409) {
        errorMessage = 'Email already exists. Please use a different email.';
      } else if (err.response?.status === 400) {
        errorMessage = 'Invalid data provided. Please check your inputs.';
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!contextUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardBody className="text-center p-8">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-4">Please log in to edit your profile.</p>
            <Button color="primary" onClick={() => (window.location.href = '/login')}>
              Go to Login
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="profileImageUpload"
            disabled={imageUploading}
          />
          <label
            htmlFor="profileImageUpload"
            className={`cursor-pointer relative group ${
              imageUploading ? 'pointer-events-none' : ''
            }`}
          >
            {profileImage ? (
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white">
                <img
                  src={profileImage}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <Avatar
                isBordered
                isRounded
                className="w-36 h-36 border-4 border-white"
                icon={<UserIcon className="w-16 h-16 text-gray-500" />}
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {imageUploading ? (
                <Spinner size="lg" color="white" />
              ) : (
                <CameraIcon className="w-12 h-12 text-white bg-black/50 rounded-full p-2" />
              )}
            </div>
          </label>
          <h2 className="text-2xl font-bold text-white mt-4">Edit Profile</h2>
          <p className="text-blue-100 text-sm">
            {contextUser.role} • {contextUser.name}
          </p>
        </CardHeader>

        <CardBody className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span className="text-red-600 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-green-600 text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              startContent={<UserIcon className="w-5 h-5 text-default-400" />}
              label="Name"
              value={name}
              onValueChange={setName}
              variant="bordered"
              required
              isDisabled={isSubmitting}
              placeholder="Enter your name"
            />

            <Input
              type="email"
              startContent={<EnvelopeIcon className="w-5 h-5 text-default-400" />}
              label="Email"
              value={email}
              onValueChange={setEmail}
              variant="bordered"
              required
              isDisabled={isSubmitting}
              placeholder="Enter your email"
            />

            <Input
              type="password"
              startContent={<LockClosedIcon className="w-5 h-5 text-default-400" />}
              label="New Password"
              value={password}
              onValueChange={setPassword}
              description="Leave blank to keep current password"
              variant="bordered"
              isDisabled={isSubmitting}
              placeholder="Enter new password (optional)"
            />

            <Textarea
              label="Bio"
              value={bio}
              onValueChange={setBio}
              variant="bordered"
              minRows={3}
              maxRows={5}
              isDisabled={isSubmitting}
              placeholder="Tell us about yourself..."
              description={`${bio.length}/500 characters`}
              maxLength={500}
            />

            <Button
              color="primary"
              type="submit"
              fullWidth
              isLoading={isSubmitting}
              loadingText="Updating..."
              className="mt-6"
              size="lg"
            >
              Update Profile
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default EditProfilePage;
