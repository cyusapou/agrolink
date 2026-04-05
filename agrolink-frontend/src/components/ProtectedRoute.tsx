import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'COOP_MANAGER' | 'BUYER';
}

// Simple loading spinner component
const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizeClasses[size]} border-4 border-[var(--lime)] border-t-transparent rounded-full animate-spin`}></div>
  );
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, isLoading, role, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--soil)]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with return path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // User is authenticated but doesn't have required role
    // Redirect them to their appropriate dashboard
    const redirectMap = {
      'ADMIN': '/admin',
      'COOP_MANAGER': '/coop',
      'BUYER': '/buyer',
    };
    
    return <Navigate to={redirectMap[role]} replace />;
  }

  return <>{children}</>;
};
