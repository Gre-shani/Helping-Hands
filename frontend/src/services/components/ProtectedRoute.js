import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
    // We will get the user data from localStorage (we'll save it there during login)
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        // Not logged in at all? Back to login!
        return <Navigate to="/login" />;
    }

    if (allowedRole && user.role !== allowedRole) {
        // Logged in but wrong role? Back to home/login!
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;