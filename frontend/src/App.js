import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminDashboardPage';
import PrivateRoute from './constants/PrivateRoute';
import HomePage from 'pages/HomePage';
import ProfilePage from 'pages/ProfilePage';
import EditProfile from 'pages/EditProfilePage';
import Layout from "./context/Layout";
import UnauthorizedPage from "pages/UnauthorizedPage";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import CourseCreate from "pages/CourseCreatePage";
import AdminSignup from "pages/AdminSignup";
import AdminLogin from "pages/AdminLogin";
import MyCourse from "pages/MyCourse";
import EditCoursePage from "./pages/EditCoursePage";
import CoursePage from "./pages/CoursePage";
import CourseCatalogPage from "pages/CourseCatalogPage";
import CourseSuccessPage from "pages/CourseSuccessPage";
import CourseConfirmationPage from "pages/CourseConfirmationPage";
import CourseStudyPage from "./pages/CourseStudyPage";
import {AssignmentDetailPage} from "./pages/AssignmentPage";
import {ModuleDetailPage} from "./pages/ModulePage";
import {MaterialDetailPage} from "./pages/MaterialPage";

const App = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/admin-signup" element={<AdminSignup />} />
                    <Route path="/admin-login" element={<AdminLogin />} />

                    <Route path="/admin/dashboard"
                           element={<PrivateRoute element={<AdminPage />} allowedRoles={['admin']} />}
                    />
                    <Route path="/profile/:id"
                           element={<PrivateRoute element={<ProfilePage />} allowedRoles={['student', 'instructor', 'admin']} />}
                    />
                    <Route path="/edit-profile"
                           element={<PrivateRoute element={<EditProfile />} allowedRoles={['student', 'instructor', 'admin']} />}
                    />
                    <Route path="/my-courses"
                           element={<PrivateRoute element={<MyCourse role="student" />} allowedRoles={['student', 'instructor', 'admin']} />}
                    />
                    <Route path="/course-i-teach"
                           element={<PrivateRoute element={<MyCourse role="instructor" />} allowedRoles={['instructor', 'admin']} />}
                    />
                    <Route path="/courseoverview/:id"
                           element={<CoursePage />}
                    />
                    <Route path="/instructor/course/:id"
                           element={<PrivateRoute element={<EditCoursePage />} allowedRoles={['instructor', 'admin']} />}
                    />
                    <Route path="/instructor/course/create"
                           element={<PrivateRoute element={<CourseCreate />} allowedRoles={['instructor', 'admin']} />}
                    />

                     Public Routes
                    <Route path="/course-catalog" element={<CourseCatalogPage />} />
                    <Route path="/course/success" element={<CourseSuccessPage />} />
                    <Route path="/course/confirmation" element={<CourseConfirmationPage />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />
                    <Route path="/course/:id"
                           element={<PrivateRoute element={<CourseStudyPage />} allowedRoles={['student', 'instructor', 'admin']} />}
                    />
                    <Route
                        path="/courses/:courseId/assignments/:assignmentId"
                        element={<AssignmentDetailPage
                        />}
                    />
                    <Route
                        path="/courses/:courseId/modules/:moduleId"
                        element={<ModuleDetailPage
                        />}
                    />
                    <Route path="/courses/:courseId/modules/:moduleId/materials/:materialId" element={<MaterialDetailPage />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
