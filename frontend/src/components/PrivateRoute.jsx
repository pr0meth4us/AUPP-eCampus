import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const PrivateRoute = ({ element, allowedRoles }) => {
    const { user } = useAuth();
    const hasAccess = user && allowedRoles.includes(user.role);
    return hasAccess ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
