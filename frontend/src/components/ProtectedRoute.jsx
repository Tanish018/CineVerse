import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';
import { ShieldAlert } from 'lucide-react';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading message="Checking authorization..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-[#0D1117] border border-red-500/20 rounded-2xl p-8 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            You do not have administrative permissions to access this area. If you believe this is an error, please contact support.
          </p>
          <a
            href="/"
            className="inline-block px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
