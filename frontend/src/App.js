import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Signin from './pages/Signin';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import {AuthProvider} from "./middleware/AuthContext";
import ProtectedRoute from "./middleware/ProtectedRoute";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/admin/dashboard" element={<ProtectedRoute element={<AdminDashboard />} isAdmin={true} />} />
                    <Route path="/"  element={<Home />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
