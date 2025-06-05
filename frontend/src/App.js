// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages / Components
import AdminPage from './pages/AdminDashboardPage';
import PrivateRoute from './constants/PrivateRoute';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import EditProfile from './pages/EditProfilePage';
import Layout from './context/Layout';
import CourseCreate from './pages/CourseCreatePage';
import AdminSignup from './pages/AdminSignup';
import AdminLogin from './pages/AdminLogin';
import MyCourse from './pages/MyCourse';
import EditCourse from './pages/InstructorCourseDashboardPage';
import CoursePage from './pages/CoursePreviewPage';
import CourseCatalogPage from './pages/CourseCatalogPage';
import CourseSuccessPage from './pages/CourseSuccessPage';
import CourseConfirmationPage from './pages/CourseConfirmationPage';
import CourseStudyPage from './pages/CourseStudyPage';
import { AssignmentDetailPage } from './pages/AssignmentPage';
import { ModuleDetailPage } from './pages/ModulePage';
import { MaterialDetailPage } from './pages/MaterialPage';
import { ContentDetailPage } from './pages/ContentPage';
import ErrorPage from './pages/ErrorPage';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const App = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/admin-signup" element={<AdminSignup />} />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/course-catalog" element={<CourseCatalogPage />} />
                    <Route path="/course/success" element={<CourseSuccessPage />} />
                    <Route path="/course/confirmation" element={<CourseConfirmationPage />} />
                    <Route path="/unauthorized" element={<ErrorPage code={403} />} />

                    <Route
                        path="/admin/dashboard"
                        element={
                            <PrivateRoute
                                element={<AdminPage />}
                                allowedRoles={['admin']}
                            />
                        }
                    />

                    {/* Profile and Edit (student, instructor, admin) */}
                    <Route
                        path="/profile/:id"
                        element={
                            <PrivateRoute
                                element={<ProfilePage />}
                                allowedRoles={['student', 'instructor', 'admin']}
                            />
                        }
                    />
                    <Route
                        path="/edit-profile"
                        element={
                            <PrivateRoute
                                element={<EditProfile />}
                                allowedRoles={['student', 'instructor', 'admin']}
                            />
                        }
                    />

                    <Route
                        path="/my-courses"
                        element={
                            <PrivateRoute
                                element={<MyCourse role="student" />}
                                allowedRoles={['student', 'instructor', 'admin']}
                            />
                        }
                    />
                    <Route
                        path="/course-i-teach"
                        element={
                            <PrivateRoute
                                element={<MyCourse role="instructor" />}
                                allowedRoles={['instructor', 'admin']}
                            />
                        }
                    />

                    {/* Course Preview (public) */}
                    <Route path="/courseoverview/:id" element={<CoursePage />} />

                    {/* Instructor: Edit or Create Course */}
                    <Route
                        path="/instructor/course/:id"
                        element={
                            <PrivateRoute
                                element={<EditCourse />}
                                allowedRoles={['instructor', 'admin']}
                            />
                        }
                    />
                    <Route
                        path="/instructor/course/create"
                        element={
                            <PrivateRoute
                                element={<CourseCreate />}
                                allowedRoles={['instructor', 'admin']}
                            />
                        }
                    />

                    {/* Course Study (enrolled only) */}
                    <Route
                        path="/course/:id"
                        element={
                            <PrivateRoute
                                element={<CourseStudyPage />}
                                allowedRoles={['student', 'instructor', 'admin']}
                            />
                        }
                    />

                    {/* Assignment / Module / Material / Content Detail (all require login) */}
                    <Route
                        path="/courses/:courseId/assignments/:assignmentId"
                        element={<AssignmentDetailPage />}
                    />
                    <Route
                        path="/courses/:courseId/modules/:moduleId"
                        element={<ModuleDetailPage />}
                    />
                    <Route
                        path="/courses/:courseId/modules/:moduleId/materials/:materialId"
                        element={<MaterialDetailPage />}
                    />
                    <Route
                        path="/courses/:courseId/modules/:moduleId/contents/:contentId"
                        element={
                            <PrivateRoute
                                element={<ContentDetailPage />}
                                allowedRoles={['student', 'instructor', 'admin']}
                            />
                        }
                    />


                    <Route path="/protected" element={<ErrorPage code={403} />} />

                    {/* Catch‐all for 404 (must be last) */}
                    <Route path="*" element={<ErrorPage code={404} />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
