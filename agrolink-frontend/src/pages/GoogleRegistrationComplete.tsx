import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import RoleSelectionDialog from '../components/RoleSelectionDialog';

interface GoogleUserData {
  email: string;
  name: string;
  avatarUrl: string;
  googleId: string;
}

const GoogleRegistrationComplete: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [userData, setUserData] = useState<GoogleUserData | null>(null);
  const [role, setRole] = useState<'COOP_MANAGER' | 'BUYER'>('COOP_MANAGER');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [cooperativeName, setCooperativeName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [district, setDistrict] = useState('');
  const [momoNumber, setMomoNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [existingUser, setExistingUser] = useState<any>(null);

  useEffect(() => {
    // Get user data from localStorage
    const storedData = localStorage.getItem('googleUserData');
    
    if (storedData) {
      const googleUserData = JSON.parse(storedData);
      setUserData(googleUserData);
      setManagerName(googleUserData.name || '');
    } else {
      // No user data, redirect to Google signup
      navigate('/google-signup');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    setLoading(true);

    try {
      // Complete Google registration with all additional info
      const registrationData = {
        ...userData,
        role,
        phone,
        businessName: role === 'BUYER' ? businessName : undefined,
        cooperativeName: role === 'COOP_MANAGER' ? cooperativeName : undefined,
        managerName: role === 'COOP_MANAGER' ? (managerName || userData.name) : undefined,
        district: role === 'COOP_MANAGER' ? district : undefined,
        momoNumber: role === 'COOP_MANAGER' ? momoNumber : undefined,
      };

      const response = await fetch('http://localhost:3000/auth/google-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();

      if (response.ok) {
        // Store tokens
        localStorage.setItem('accessToken', result.accessToken);
        localStorage.setItem('refreshToken', result.refreshToken);
        
        console.log('🔍 Registration result:', result);
        
        // Check if user existed before (has multiple roles)
        if (result.user && result.user.existingUser) {
          // Show role selection dialog for existing users
          setExistingUser({
            email: result.user.email,
            name: result.user.name,
            roles: result.user.roles || [role]
          });
          setShowRoleDialog(true);
        } else {
          // New user - direct to dashboard
          localStorage.removeItem('googleUserData');
          toast.success('Registration successful! Welcome to AgroLink!');
          console.log('🚀 New user - navigating to dashboard...');
          navigate('/dashboard');
        }
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '18px',
        color: 'var(--muted)'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: 'var(--lime)', fontSize: '24px' }}>←</span>
          <span 
            onClick={() => navigate('/google-signup')} 
            style={{ cursor: 'pointer', color: 'var(--lime)' }}
          >
            Back
          </span>
        </div>
      </nav>

      <section className="section flex items-center justify-center" style={{ minHeight: '100vh', paddingTop: '100px' }}>
        <div className="form-container">
          <div className="form-header">
            <div className="section-label">Complete Registration</div>
            <h2 className="section-title">Welcome <em>{userData.name}</em>!</h2>
            <p style={{ color: 'var(--muted)', marginTop: '10px' }}>
              Just a few more details to complete your profile
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Google Info Display */}
            <div style={{ 
              background: 'var(--surface)', 
              padding: '15px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {userData.avatarUrl && (
                  <img 
                    src={userData.avatarUrl} 
                    alt="Profile" 
                    style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                )}
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--text)' }}>{userData.name}</div>
                  <div style={{ fontSize: '14px', color: 'var(--muted)' }}>{userData.email}</div>
                  <div style={{ fontSize: '12px', color: 'var(--lime)' }}>✓ Connected with Google</div>
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">I am a</label>
              <div className="radio-group">
                <label className={`radio-option ${role === 'COOP_MANAGER' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="COOP_MANAGER"
                    checked={role === 'COOP_MANAGER'}
                    onChange={(e) => setRole(e.target.value as 'COOP_MANAGER')}
                  />
                  <span>Cooperative Manager</span>
                </label>
                <label className={`radio-option ${role === 'BUYER' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="BUYER"
                    checked={role === 'BUYER'}
                    onChange={(e) => setRole(e.target.value as 'BUYER')}
                  />
                  <span>Buyer</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+250 7XX XXX XXX"
                required
              />
            </div>

            {role === 'BUYER' && (
              <div className="form-group">
                <label className="form-label">Business Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your business name"
                />
              </div>
            )}

            {role === 'COOP_MANAGER' && (
              <>
                <div className="form-group">
                  <label className="form-label">Cooperative Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={cooperativeName}
                    onChange={(e) => setCooperativeName(e.target.value)}
                    placeholder="Cooperative name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">District</label>
                  <input
                    type="text"
                    className="form-control"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="District"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">MoMo Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    placeholder="250 7XX XXX XXX"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        </div>
      </section>

      {/* Role Selection Dialog */}
      {showRoleDialog && existingUser && (
        <RoleSelectionDialog
          isOpen={showRoleDialog}
          onClose={() => setShowRoleDialog(false)}
          user={existingUser}
        />
      )}
    </>
  );
};

export default GoogleRegistrationComplete;
