import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [role, setRole] = useState(null);

    const handleRoleChange = (newRole) => {
        setRole(newRole);
    };

    return (
        <AuthContext.Provider value={{ role, handleRoleChange }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
