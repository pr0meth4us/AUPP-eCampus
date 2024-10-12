import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Home/Login';
import AdminPage from './pages/AdminPage';
import PrivateRoute from './components/PrivateRoute';
import Signup from "./components/Home/Signup";
import Home from "./pages/Home";
import 'bootstrap-icons/font/bootstrap-icons.css';
import AdminSignup from "./components/Admin/AdminSignup";
import AdminLogin from "./components/Admin/AdminLogin";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin-signup" element={<AdminSignup />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin/dashboard" element={<PrivateRoute element={<AdminPage />} allowedRoles={['admin']} />} />
            </Routes>
        </Router>
    );
};

export default App;
