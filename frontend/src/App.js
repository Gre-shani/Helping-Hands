import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import ProfileSetupFlow from './components/ProfileSetupFlow';
import IncompleteProfileBanner from './components/IncompleteProfileBanner';
import AdminDashboard from './services/components/AdminDashboard';

// --- Protected Route Wrapper ---
const ProtectedRoute = ({ children, allowedRole }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/login" />;
  
  const normalizedRole = user?.role?.toString().trim().toUpperCase();
  if (allowedRole && normalizedRole !== allowedRole.toUpperCase()) return <Navigate to="/" />;
  return children;
};

// --- User Dashboard Component (For Donors / Verified users) ---
const UserDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [profileComplete] = React.useState(user?.profileCompletionStatus === 'COMPLETED');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">🤝 Helping Hands</h1>
          <button
            onClick={() => {
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.fullName || 'User'}!</h2>
        <p className="text-gray-600 mb-8">You're signed in as a <strong>{user?.role?.replace(/_/g, ' ')}</strong></p>

        <IncompleteProfileBanner isComplete={profileComplete} userId={user?.userId} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h3>
            <p className="text-gray-600 mb-4">Complete your profile to access all features.</p>
            <button
              onClick={() => window.location.href = '/profile/setup'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-gray-600">Profile Status:</dt>
                <dd className={`font-bold ${profileComplete ? 'text-green-600' : 'text-yellow-600'}`}>
                  {profileComplete ? '✓ Complete' : 'Incomplete'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Security Guard Redirect ---
const DashboardRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/login" replace />;
  
  const normalizedRole = user?.role?.toString().trim().toUpperCase();
  
  if (normalizedRole === 'ADMIN') return <Navigate to="/admin" replace />;
  
  if (user?.profileCompletionStatus === 'NEW' || !user?.profileCompletionStatus) {
    return <Navigate to="/profile/setup" replace />;
  }

  if (
    (normalizedRole === 'CHILDRENS_HOME' || normalizedRole === 'SERVICE_PROVIDER') && 
    user?.profileCompletionStatus !== 'COMPLETED'
  ) {
    return <Navigate to="/pending-approval" replace />;
  }

  return <UserDashboard />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardRedirect />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/setup"
          element={
            <ProtectedRoute>
              <ProfileSetupFlow />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;