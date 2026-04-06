import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

interface GoogleAuthProps {
  mode: 'login' | 'register';
  role?: 'COOP_MANAGER' | 'BUYER';
  onGoogleSuccess?: (userData: any) => void;
  onGoogleData?: (userData: any) => void; // New callback for form data
}

const GoogleAuthComponent: React.FC<GoogleAuthProps> = ({ mode, role, onGoogleSuccess, onGoogleData }) => {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const token = credentialResponse.credential;
      
      // Decode the JWT token to get user info
      const decoded = JSON.parse(atob(token.split('.')[1]));
      
      console.log('🔍 Current origin:', window.location.origin);
      console.log('🔍 Google token payload:', decoded);
      
      const userData = {
        email: decoded.email,
        name: decoded.name,
        avatarUrl: decoded.picture,
        googleId: decoded.sub,
        role: role || 'BUYER'
      };

      console.log('Google user data:', userData);

      if (mode === 'register') {
        // For registration, just pass the data to the parent form
        if (onGoogleData) {
          onGoogleData(userData);
        }
        toast.success('Google account connected! Please complete your registration.');
      } else {
        // Login with Google
        const response = await fetch('http://localhost:3000/auth/google-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          
          toast.success('Login successful!');
          
          // Check if user has multiple roles
          if (data.user.roles && data.user.roles.length > 1) {
            // Show role selection dialog
            if (onGoogleData) {
              onGoogleData({
                ...data.user,
                existingUser: true,
                roles: data.user.roles
              });
            }
          } else {
            // Single role - navigate directly to dashboard
            console.log('🚀 Navigating to dashboard...');
            navigate('/dashboard');
          }
        } else {
          const error = await response.json();
          toast.error(error.message || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error('Authentication failed');
    }
  };

  const handleGoogleError = () => {
    toast.error('Google authentication failed');
  };

  return (
    <div className="google-auth-container">
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "191596805900-7meegcopjkvpsu8s1vhkibsjqvtjh4rr.apps.googleusercontent.com"}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap
          text={mode === 'register' ? 'signup_with' : 'signin_with'}
          shape="rectangular"
          theme="filled_blue"
          size="large"
          width="100%"
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default GoogleAuthComponent;
