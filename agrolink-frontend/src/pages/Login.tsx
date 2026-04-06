import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password, navigate);
    } catch (err) {
      setError('Invalid email or password');
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

      <section className="section flex items-center justify-center" style={{ minHeight: '100vh', paddingTop: '100px' }}>
        <div className="form-container">
          <div className="form-header">
            <div className="section-label">Portal Access</div>
            <h2 className="section-title">Welcome <em>Back</em></h2>
          </div>
          
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
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
              />
            </div>

            <button type="submit" className="btn-primary w-full mt-4">
              Sign In
            </button>
          </form>

          <div className="text-center mt-6" style={{ fontSize: '14px', color: 'var(--muted)' }}>
            Don't have an account? <Link to="/signup" style={{ color: 'var(--lime)', textDecoration: 'none' }}>Register Cooperative</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
