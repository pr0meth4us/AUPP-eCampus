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
const App = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/admin-signup" element={<AdminSignup />} />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<PrivateRoute element={<AdminPage />} allowedRoles={['admin']} />} />
                    <Route path="/course-catalog" element={<CourseCatalog />} />
                    <Route path="/profile/:id" element={<ProfilePage />} />
                    <Route path="/edit-profile" element={<EditProfile />} />
                    <Route path="/course/success" element={<CourseSuccess />} />
                    <Route path="/course/confirmation" element={<CourseConfirmation />} />
                    <Route path="/my-courses" element={<MyCourse />}/>
                    <Route path="/course/:id" element={<CoursePage />} />
                    <Route path="/instructor/course/:id" element={<InstructorCoursePage/>}/>
                    <Route path="/instructor/course/create" element={<InstructorCourseCreate />}/>
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
