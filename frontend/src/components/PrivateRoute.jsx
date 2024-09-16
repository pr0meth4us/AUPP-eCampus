import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const PrivateRoute = ({ element, allowedRoles }) => {
    const { user } = useAuth();
    console.log(user); // Logs the current user
    console.log(useAuth()); // Logs the entire auth context

    const hasAccess = user && allowedRoles.includes(user.role);

    return hasAccess ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
