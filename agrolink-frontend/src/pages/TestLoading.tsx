import React, { useState } from 'react';
import RegistrationLoading from '../components/RegistrationLoading';
import { useNavigate } from 'react-router-dom';

const TestLoading: React.FC = () => {
  const [show, setShow] = useState(true);
  const navigate = useNavigate();

  const handleComplete = () => {
    setShow(false);
    // After it completes, show a button to restart it so they can keep testing
  };

  return (
    <div style={{ background: '#060f08', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {show ? (
        <RegistrationLoading userName="Test User" onComplete={handleComplete} />
      ) : (
        <div style={{ textAlign: 'center', color: 'var(--cream)' }}>
          <h2 style={{ marginBottom: '24px' }}>Loading Sequence Finished!</h2>
          <button 
            onClick={() => setShow(true)}
            className="btn-primary"
          >
            Restart Animation
          </button>
          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={() => navigate('/')}
              className="btn-ghost"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestLoading;
