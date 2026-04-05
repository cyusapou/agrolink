import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        username,
        password,
      });
      // Store token (in a real app, use Context or Redux)
      localStorage.setItem('agrolink-token', response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
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
          <div className="section-label" style={{ textAlign: 'center' }}>Portal Access</div>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '32px', fontSize: '32px' }}>Welcome <em>Back</em></h2>
          
          {error && <div style={{ color: '#ff4d4f', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input 
                type="text" 
                className="form-control" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
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

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }}>
              Sign In
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--muted)' }}>
            Don't have an account? <Link to="/signup" style={{ color: 'var(--lime)', textDecoration: 'none' }}>Register Cooperative</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
