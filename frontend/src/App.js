import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import AdminSignup from './components/Admin/AdminSignup';
import AdminLogin from './components/Admin/AdminLogin';
import CourseCatalog from './pages/CourseCatalog';
import ProfilePage from './pages/ProfilePage';
import EditProfile from './pages/EditProfile';
import Layout from "./context/Layout";

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
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
