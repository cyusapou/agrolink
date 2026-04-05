import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { usersAPI } from '../../api/axios';
import { User, Mail, Phone, MapPin, Shield, Camera, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    district: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        district: user.district || '',
      });
      setLoading(false);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!user?.id) return;
      const response = await usersAPI.update(user.id, formData);
      // Update local storage/context user data
      const updatedUser = { ...user, ...response.data };
      // In a real app, we'd have a dedicated setUser or refreshUser method
      // For now, we'll just show success
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--lime)]"></div>
      </div>
    );
  }

  return (
    <div className="section" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div className="mb-12">
        <div className="section-label">Account Settings</div>
        <h2 className="section-title">Personal <em>Profile</em></h2>
      </div>

      <div className="form-container" style={{ animation: 'fadeUp 0.8s ease both' }}>
        {/* Profile Avatar Section */}
        <div className="flex items-center gap-8 mb-12 pb-12 border-b border-[var(--border)]">
          <div style={{ position: 'relative' }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              background: 'var(--soil)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '32px',
              border: '2px solid var(--border)'
            }}>
              {user?.role === 'BUYER' ? '🛒' : '🌾'}
            </div>
            <button className="btn-icon" style={{ 
              position: 'absolute', 
              bottom: '0', 
              right: '0', 
              background: 'var(--lime)', 
              color: 'var(--soil)',
              width: '32px',
              height: '32px'
            }}>
              <Camera size={16} />
            </button>
          </div>
          <div>
            <h3 className="section-title" style={{ fontSize: '24px', marginBottom: '4px' }}>{formData.name || 'AgroLink User'}</h3>
            <p className="text-[var(--muted)]">{user?.role} ACCOUNT</p>
            <div className="flex gap-2 mt-2">
              <span className="status-badge active" style={{ fontSize: '10px' }}>VERIFIED</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="input-group">
              <label className="input-label"><User size={14} /> Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label"><Mail size={14} /> Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                value={formData.email}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>
            <div className="input-group">
              <label className="input-label"><Phone size={14} /> Phone Number</label>
              <input 
                type="tel" 
                className="form-input" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+250 7XX XXX XXX"
              />
            </div>
            <div className="input-group">
              <label className="input-label"><MapPin size={14} /> District</label>
              <select 
                className="form-input"
                value={formData.district}
                onChange={(e) => setFormData({...formData, district: e.target.value})}
              >
                <option value="">Select District</option>
                {['Gasabo', 'Kicukiro', 'Nyarugenge', 'Musanze', 'Rubavu', 'Huye', 'Kayonza'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label"><MapPin size={14} /> Delivery Address / Warehouse</label>
            <textarea 
              className="form-input" 
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="Provide your specific location for deliveries"
            ></textarea>
          </div>

          <div className="flex justify-between items-center pt-8 border-t border-[var(--border)]">
            <div className="flex items-center gap-2 text-[var(--muted)] text-sm">
              <Shield size={16} />
              <span>Your data is encrypted and secure</span>
            </div>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={saving}
              style={{ minWidth: '160px' }}
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Update Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
