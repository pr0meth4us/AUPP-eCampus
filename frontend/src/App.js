import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import AdminSignup from './components/Admin/AdminSignup';
import AdminLogin from './components/Admin/AdminLogin';
import ProfilePage from './pages/ProfilePage';
import EditProfile from './pages/EditProfile';
import Layout from "./context/Layout";
import CourseCatalog from "./components/Course/CourseCatalog";
import CourseSuccess from "./components/Course/CourseSuccess";
import CourseConfirmation from "./components/Course/CourseConfirmation";
import MyCourse from "./components/Course/MyCourse";
import CoursePage from "./components/Course/CoursePage";
import InstructorCoursePage from "./components/Course/InstructorCoursePage";
import InstructorCourseCreate from "./components/Course/InstructorCourseCreate";
import MyCourseInstructor from "./components/Course/MyCourseInstructor";
import Unauthorized from "./pages/Unauthorized";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const App = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
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
                           element={<PrivateRoute element={<MyCourse />} allowedRoles={['student', 'instructor', 'admin']} />}
                    />
                    <Route path="/course-i-teach"
                           element={<PrivateRoute element={<MyCourseInstructor />} allowedRoles={['instructor', 'admin']} />}
                    />
                    <Route path="/course/:id"
                           element={<PrivateRoute element={<CoursePage />} allowedRoles={['student', 'instructor', 'admin']} />}
                    />
                    <Route path="/instructor/course/:id"
                           element={<PrivateRoute element={<InstructorCoursePage />} allowedRoles={['instructor', 'admin']} />}
                    />
                    <Route path="/instructor/course/create"
                           element={<PrivateRoute element={<InstructorCourseCreate />} allowedRoles={['instructor', 'admin']} />}
                    />

                    {/* Public Routes */}
                    <Route path="/course-catalog" element={<CourseCatalog />} />
                    <Route path="/course/success" element={<CourseSuccess />} />
                    <Route path="/course/confirmation" element={<CourseConfirmation />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />

                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
