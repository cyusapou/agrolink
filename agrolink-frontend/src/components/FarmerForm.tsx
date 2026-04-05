import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api, { farmersAPI } from '../api/axios';
import toast from 'react-hot-toast';
import { User, X, Plus } from 'lucide-react';

interface FarmerFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const FarmerForm: React.FC<FarmerFormProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await farmersAPI.create(formData);
      toast.success('Farmer added successfully');
      setFormData({ name: '', email: '', phone: '' });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Farmer creation error:', error);
      toast.error(error.response?.data?.message || 'Failed to add farmer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', zIndex: '10000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="form-container" style={{ width: '100%', maxWidth: '480px', animation: 'fadeUp 0.4s ease both', padding: '32px' }}>
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="section-label" style={{ color: 'var(--lime)' }}>Team Growth</div>
            <h3 className="section-title" style={{ fontSize: '28px' }}>Register <em>Farmer</em></h3>
          </div>
          <button 
            onClick={onClose} 
            disabled={loading}
            style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Farmer Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-control"
              placeholder="E.g., Jean de Dieu"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-control"
              placeholder="farmer@agrolink.rw"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="form-control"
              placeholder="07xxxxxxxx"
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {loading ? 'Processing...' : <><Plus size={18} /> Confirm Registration</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FarmerForm;
