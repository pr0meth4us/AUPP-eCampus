import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Card,
    CardBody,
    CardHeader,
    Avatar,
    Button,
    Chip,
    Divider
} from "@nextui-org/react";
import {
    UserIcon,
    AcademicCapIcon,
    EnvelopeIcon,
    PencilIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/authContext';
import { course } from '../services';

const ProfilePage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const isOwnProfile = user?._id === id;
    const [courseNames, setCourseNames] = useState({});

    useEffect(() => {
        const fetchCourseNames = async () => {
            if (user?.courses && user.courses.length > 0) {
                try {
                    const names = await Promise.all(
                        user.courses.map(async (courseId) => {
                            const courseData = await course.getCourseById(courseId);
                            return { id: courseId, name: courseData.title };
                        })
                    );
                    const nameMap = names.reduce((acc, { id, name }) => {
                        acc[id] = name;
                        return acc;
                    }, {});
                    setCourseNames(nameMap);
                } catch (error) {
                    console.error("Error fetching course names:", error);
                }
            }
        };

        fetchCourseNames();
    }, [user]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <Card className="w-full shadow-lg">
                <CardHeader className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-500 to-purple-600">
                    <h1 className="text-3xl font-bold text-white">Profile</h1>
                    {isOwnProfile && (
                        <Button
                            as={Link}
                            to="/edit-profile"
                            color="secondary"
                            variant="solid"
                            startContent={<PencilIcon className="h-5 w-5" />}
                        >
                            Edit Profile
                        </Button>
                    )}
                </CardHeader>

                <CardBody className="p-6">
                    <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 mb-8">
                        <Avatar
                            src={user?.profile_image}
                            fallback={<UserIcon className="h-16 w-16 text-gray-500" />}
                            className="w-36 h-36 text-large border-4 border-white shadow-lg"
                        />
                        <div className="text-center md:text-left space-y-2">
                            <h2 className="text-3xl font-bold text-gray-800">
                                {user?.name || 'No Name'}
                            </h2>
                            <div className="flex items-center justify-center md:justify-start space-x-3">
                                <Chip
                                    color="primary"
                                    variant="flat"
                                    startContent={<AcademicCapIcon className="h-5 w-5" />}
                                >
                                    {user?.role || 'Role Not Specified'}
                                </Chip>
                                <div className="flex items-center text-gray-600">
                                    <EnvelopeIcon className="h-5 w-5 mr-2" />
                                    <span>{user?.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Divider className="my-6" />

                    {user?.role === 'student' && (
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Courses Enrolled</h3>
                            {user?.courses && user.courses.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {user.courses.map((courseId, index) => (
                                        <Card
                                            key={index}
                                            isPressable
                                            as={Link}
                                            to={`/course/${courseId}`}
                                            className="hover:shadow-lg transition-shadow"
                                        >
                                            <CardBody>
                                                <p className="text-lg font-medium text-blue-600">
                                                    {courseNames[courseId] || 'Loading...'}
                                                </p>
                                            </CardBody>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No courses enrolled</p>
                            )}
                        </div>
                    )}

                    {user?.role === 'instructor' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Courses Taught</h3>
                                {user?.courses && user.courses.length > 0 ? (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {user.courses.map((courseId, index) => (
                                            <Card
                                                key={index}
                                                isPressable
                                                as={Link}
                                                to={`/courses/${courseId}`}
                                                className="hover:shadow-lg transition-shadow"
                                            >
                                                <CardBody>
                                                    <p className="text-lg font-medium text-blue-600">
                                                        {courseNames[courseId] || 'Loading...'}
                                                    </p>
                                                </CardBody>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No courses taught</p>
                                )}
                            </div>

                            <Divider />

                            <div>
                                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Expertise</h3>
                                <Card variant="bordered" className="p-4">
                                    <p className="text-gray-700">
                                        {user?.expertise || 'No expertise provided'}
                                    </p>
                                </Card>
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

export default ProfilePage;