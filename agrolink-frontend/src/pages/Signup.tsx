import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/axios';

const Signup: React.FC = () => {
  const [role, setRole] = useState<'COOP_MANAGER' | 'BUYER'>('COOP_MANAGER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  // Cooperative fields
  const [cooperativeName, setCooperativeName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [district, setDistrict] = useState('');
  const [momoNumber, setMomoNumber] = useState('');
  
  // Buyer fields
  const [businessName, setBusinessName] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const userData: any = {
        email,
        password,
        phone,
        role,
      };

      // Add role-specific fields
      if (role === 'COOP_MANAGER') {
        userData.cooperativeName = cooperativeName;
        userData.managerName = managerName;
        userData.district = district;
        userData.momoNumber = momoNumber || phone;
      } else {
        userData.businessName = businessName;
      }

      const response = await authAPI.register(userData);
      
      // Registration successful - user is automatically logged in
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <nav>
        <Link to="/" className="logo">Agro<span>Link</span></Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
        </ul>
      </nav>

      <section className="section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', paddingTop: '100px' }}>
        <div className="form-container" style={{ width: '100%' }}>
          <div className="section-label" style={{ textAlign: 'center' }}>Registration</div>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '32px', fontSize: '32px' }}>Join <em>AgroLink</em></h2>
          
          {error && <div style={{ color: '#ff4d4f', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}
          {success && <div style={{ color: 'var(--lime)', marginBottom: '16px', fontSize: '14px', textAlign: 'center', background: 'rgba(127,209,71,0.1)', padding: '12px', borderRadius: '4px' }}>Registration success! Redirecting to login...</div>}

          <form onSubmit={handleSignup}>
            {/* Role Selector */}
            <div className="form-group">
              <label className="form-label">I am a</label>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="COOP_MANAGER"
                    checked={role === 'COOP_MANAGER'}
                    onChange={(e) => setRole(e.target.value as 'COOP_MANAGER')}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ color: 'var(--cream)' }}>Cooperative Manager</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="BUYER"
                    checked={role === 'BUYER'}
                    onChange={(e) => setRole(e.target.value as 'BUYER')}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ color: 'var(--cream)' }}>Buyer</span>
                </label>
              </div>
            </div>

            {/* Common Fields */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input 
                type="password" 
                className="form-control" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                type="tel" 
                className="form-control" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="078..."
                required
              />
            </div>

            {/* Role-specific fields */}
            {role === 'COOP_MANAGER' ? (
              <>
                <div className="form-group">
                  <label className="form-label">Cooperative Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={cooperativeName}
                    onChange={(e) => setCooperativeName(e.target.value)}
                    placeholder="E.g., Musanze North Coop"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Manager Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">District</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="E.g., Kigali"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">MoMo Number</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    placeholder="078... (optional)"
                  />
                </div>
              </>
            ) : (
              <div className="form-group">
                <label className="form-label">Business Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your business name"
                  required
                />
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', marginTop: '16px' }}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--muted)' }}>
            Already registered? <Link to="/login" style={{ color: 'var(--lime)', textDecoration: 'none' }}>Log in here</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
