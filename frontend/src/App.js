import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Home/Login';
import AdminPage from './pages/AdminPage';
import PrivateRoute from './components/PrivateRoute';
import Signup from "./components/Home/Signup";
import Home from "./pages/Home";
import AdminSignup from "./admin/AdminSignup";
import AdminLogin from "./admin/AdminLogin";
import 'bootstrap-icons/font/bootstrap-icons.css';

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
