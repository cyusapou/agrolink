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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <div className="section-label">Team Growth</div>
            <h3 className="section-title" style={{ fontSize: '28px' }}>Register <em>Farmer</em></h3>
          </div>
          <button 
            onClick={onClose} 
            disabled={loading}
            className="close-btn"
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
            className="btn-primary w-full"
            disabled={loading}
            style={{ marginTop: '8px' }}
          >
            {loading ? 'Processing...' : <><Plus size={18} /> Confirm Registration</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FarmerForm;
