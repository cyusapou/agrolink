import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Signup: React.FC = () => {
  const [cooperativeName, setCooperativeName] = useState('');
  const [district, setDistrict] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Simulating signup to backend since public registration might require specific DTOs
    try {
      // In a real scenario, you'd post to a registration endpoint
      // await axios.post('http://localhost:3000/auth/register', { cooperativeName, district, phone });
      
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('An error occurred during registration.');
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
              <label className="form-label">Phone Number (MoMo)</label>
              <input 
                type="tel" 
                className="form-control" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="078..."
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }}>
              Create Account
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
