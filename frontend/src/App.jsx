import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Providers & Layout
import LoadingProvider from "context/LoadingContext";
import Layout from './context/Layout';
import PrivateRoute from './constants/PrivateRoute';

// Pages
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminDashboardPage';
import ProfilePage from './pages/ProfilePage';
import EditProfile from './pages/EditProfilePage';
import CourseCreate from './pages/CourseCreatePage';
import MyCourse from './pages/MyCourse';
import EditCourse from './pages/InstructorCourseDashboardPage';
import CoursePage from './pages/CoursePreviewPage';
import CourseCatalogPage from './pages/CourseCatalogPage';
import CourseSuccessPage from './pages/CourseSuccessPage';
import CourseConfirmationPage from './pages/CourseConfirmationPage';
import CourseDashboardPage from './pages/CourseDashboardPage';
import { AssignmentDetailPage } from './pages/AssignmentPage';
import { ModuleDetailPage } from './pages/ModulePage';
import { MaterialDetailPage } from './pages/MaterialPage';
import { ContentDetailPage } from './pages/ContentPage';
import ErrorPage from './pages/ErrorPage';

// Auth Pages
import LoginPage from "./pages/AuthPages/LoginPage";
import AdminLogin from './pages/AuthPages/AdminLogin';
import AdminSignup from './pages/AuthPages/AdminSignup';
import AuthCallbackPage from "./pages/AuthCallbackPage";
import ForgotPasswordPage from "./pages/AuthPages/ForgotPasswordPage";
import RegisterPage from "./pages/AuthPages/RegisterPage";

const App = () => {
    return (
        <Router>
            <LoadingProvider>
                <Layout>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/auth/callback" element={<AuthCallbackPage />} />
                        <Route path="/admin-login" element={<AdminLogin />} />
                        <Route path="/admin-signup" element={<AdminSignup />} />

                        {/* Course Routes */}
                        <Route path="/course-catalog" element={<CourseCatalogPage />} />
                        <Route path="/course/preview/:id" element={<CoursePage mode="preview" />} />
                        <Route path="/course/success" element={<CourseSuccessPage />} />
                        <Route path="/course/confirmation" element={<CourseConfirmationPage />} />

                        {/* Protected Student/Instructor Routes */}
                        <Route path="/profile/:id" element={<PrivateRoute element={<ProfilePage />} allowedRoles={['student', 'instructor', 'admin']} />} />
                        <Route path="/edit-profile" element={<PrivateRoute element={<EditProfile />} allowedRoles={['student', 'instructor', 'admin']} />} />
                        <Route path="/my-courses" element={<PrivateRoute element={<MyCourse role="student" />} allowedRoles={['student', 'instructor', 'admin']} />} />

                        {/* Instructor Specific */}
                        <Route path="/course-i-teach" element={<PrivateRoute element={<MyCourse role="instructor" />} allowedRoles={['instructor', 'admin']} />} />
                        <Route path="/instructor/course/create" element={<PrivateRoute element={<CourseCreate />} allowedRoles={['instructor', 'admin']} />} />
                        <Route path="/instructor/course/:id" element={<PrivateRoute element={<EditCourse />} allowedRoles={['instructor', 'admin']} />} />

                        {/* Learning Dashboard */}
                        <Route path="/course/:id" element={<PrivateRoute element={<CourseDashboardPage />} allowedRoles={['student', 'instructor', 'admin']} />} />
                        <Route path="/courses/:courseId/assignments/:assignmentId" element={<AssignmentDetailPage />} />
                        <Route path="/courses/:courseId/modules/:moduleId" element={<ModuleDetailPage />} />
                        <Route path="/courses/:courseId/modules/:moduleId/materials/:materialId" element={<MaterialDetailPage />} />
                        <Route path="/courses/:courseId/modules/:moduleId/contents/:contentId" element={<PrivateRoute element={<ContentDetailPage />} allowedRoles={['student', 'instructor', 'admin']} />} />

                        {/* Admin Only */}
                        <Route path="/admin/dashboard" element={<PrivateRoute element={<AdminPage />} allowedRoles={['admin']} />} />

                        {/* Utilities */}
                        <Route path="/unauthorized" element={<ErrorPage code={403} />} />
                        <Route path="/under-construction" element={<ErrorPage type="construction" />} />
                        <Route path="*" element={<ErrorPage code={404} />} />
                    </Routes>
                </Layout>
            </LoadingProvider>
        </Router>
    );
};

export default App;