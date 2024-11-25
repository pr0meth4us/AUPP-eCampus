import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const PrivateRoute = ({ element, allowedRoles }) => {
    const { user } = useAuth();
    const hasAccess = user && allowedRoles.includes(user.role);

    if (!user) {
        // Redirect to login if user is not authenticated
        return <Navigate to="/login" replace />;
    }

    if (!hasAccess) {
        // Redirect to unauthorized page if the user doesn't have the required role
        return <Navigate to="/unauthorized" replace />;
    }

    return element;
};

export default PrivateRoute;
