import { useState, useEffect, useContext, createContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

interface User {
  id: number;
  email: string;
  role: 'ADMIN' | 'COOP_MANAGER' | 'BUYER';
  phone: string;
  address?: string;
  cooperative?: any;
}

interface AuthContextType {
  user: User | null;
  role: 'ADMIN' | 'COOP_MANAGER' | 'BUYER' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, navigate?: any) => Promise<void>;
  logout: (navigate?: any) => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;
  const role = user?.role || null;

  // Check for existing tokens on mount
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken) {
        try {
          const decoded = jwtDecode<{ sub: number; email: string; role: string; exp: number }>(accessToken);
          
          // Check if token is expired
          if (decoded.exp * 1000 > Date.now()) {
            setUser({
              id: decoded.sub,
              email: decoded.email,
              role: decoded.role as 'ADMIN' | 'COOP_MANAGER' | 'BUYER',
              phone: '', // Will be populated from API
            });
          } else if (refreshToken) {
            // Try to refresh the token
            await refreshAccessToken();
          } else {
            // Token expired and no refresh token
            logout();
          }
        } catch (error) {
          console.error('Invalid token:', error);
          logout();
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, navigate?: any) => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      // Set user data
      setUser(data.user);
      
      toast.success('Login successful!');
      
      // Role-based redirect
      const roleRedirectMap: Record<string, string> = {
        'ADMIN': '/admin',
        'COOP_MANAGER': '/coop',
        'BUYER': '/buyer',
      };
      
      const redirectPath = roleRedirectMap[data.user.role] || '/dashboard';
      if (navigate) {
        navigate(redirectPath, { replace: true });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    }
  };

  const logout = (navigate?: any) => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    toast.success('Logged out successfully');
    if (navigate) {
      navigate('/login', { replace: true });
    }
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      
      // Update user info from new token
      const decoded = jwtDecode<{ sub: number; email: string; role: string }>(data.accessToken);
      setUser(prev => prev ? { 
        ...prev, 
        id: decoded.sub, 
        email: decoded.email, 
        role: decoded.role as 'ADMIN' | 'COOP_MANAGER' | 'BUYER'
      } : null);
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  const refreshToken = async () => {
    await refreshAccessToken();
  };

  const value: AuthContextType = {
    user,
    role,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
