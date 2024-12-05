import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const PrivateRoute = ({ element, allowedRoles }) => {
    const { user } = useAuth();
    const hasAccess = user && allowedRoles.includes(user.role);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!hasAccess) {
        return <Navigate to="/unauthorized" replace />;
    }

    return element;
};

export default PrivateRoute;
