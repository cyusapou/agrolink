import React, { useState, useEffect } from 'react';
import { farmersAPI } from '../../api/axios';
import toast from 'react-hot-toast';
import { Users, Plus, Edit3, Trash2, Power, Mail, Phone, MapPin } from 'lucide-react';
import FarmerForm from '../../components/FarmerForm';

interface Farmer {
  id: number;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  cooperative?: {
    name: string;
  };
}

const FarmersManagement: React.FC = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const response = await farmersAPI.getAll();
      console.log('Farmers from API:', response.data);
      setFarmers(response.data);
    } catch (error) {
      console.error('Failed to load farmers:', error);
      toast.error('Failed to load farmers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this farmer?')) return;
    
    try {
      await farmersAPI.delete(id);
      toast.success('Farmer deleted successfully');
      fetchFarmers();
    } catch (error) {
      toast.error('Failed to delete farmer');
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      await farmersAPI.update(id, { isActive: !currentStatus });
      toast.success(`Farmer ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchFarmers();
    } catch (error) {
      toast.error('Failed to update farmer status');
    }
  };

  if (loading) {
    return (
      <div className="section">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid var(--lime)', 
            borderTop: '4px solid var(--soil)', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <div style={{ marginTop: '16px', color: 'var(--muted)' }}>Loading farmers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      {/* Header */}
      <div className="dashboard-header" style={{ marginBottom: '40px', alignItems: 'flex-end' }}>
        <div>
          <div className="section-label">Farmers Directory</div>
          <h2 className="section-title">Manage your <em>Team</em></h2>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary"
          style={{ padding: '12px 24px', fontSize: '14px' }}
        >
          <Plus size={18} /> <span>Add Farmer</span>
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid cols-3" style={{ marginBottom: '48px', animation: 'fadeUp 0.6s ease both' }}>
        <div className="stat-card">
          <div>
            <div className="stat-card-label">Total Farmers</div>
            <div className="stat-card-value">{farmers.length}</div>
          </div>
          <div className="stat-card-icon"><Users size={20} /></div>
        </div>
        
        <div className="stat-card">
          <div>
            <div className="stat-card-label">Active Status</div>
            <div className="stat-card-value" style={{ color: 'var(--lime)' }}>
              {farmers.filter(f => f.isActive).length}
            </div>
          </div>
          <div className="stat-card-icon"><Power size={20} /></div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-card-label">Verified Percentage</div>
            <div className="stat-card-value">
              {farmers.length > 0 ? Math.round((farmers.filter(f => f.isActive).length / farmers.length) * 100) : 0}%
            </div>
          </div>
          <div className="stat-card-icon"><CheckCircle2 size={20} /></div>
        </div>
      </div>

      {/* Farmers List */}
      {farmers.length > 0 ? (
        <div className="grid-list" style={{ animation: 'fadeUp 0.8s ease both' }}>
          {farmers.map((farmer) => (
            <div key={farmer.id} className="horizontal-card">
              <div className="card-avatar">
                👨‍🌾
              </div>
              
              <div className="card-main-info">
                <div className="card-title-row">
                  <h3 className="card-h-title">{farmer.name}</h3>
                  <span className={`status-badge ${farmer.isActive ? 'active' : 'pending'}`}>
                    {farmer.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                
                <div className="card-sub-info">
                  <div className="info-item">
                    <Mail size={14} />
                    <span>{farmer.email}</span>
                  </div>
                  <div className="info-item">
                    <Phone size={14} />
                    <span>{farmer.phone}</span>
                  </div>
                  {farmer.cooperative && (
                    <div className="info-item">
                      <MapPin size={14} />
                      <span>{farmer.cooperative.name}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="card-actions-h">
                <button
                  onClick={() => handleToggleActive(farmer.id, farmer.isActive)}
                  className="btn-icon"
                  title={farmer.isActive ? 'Suspend Farmer' : 'Activate Farmer'}
                  style={{ color: farmer.isActive ? 'var(--gold)' : 'var(--lime)' }}
                >
                  <Power size={16} />
                </button>
                <button
                  className="btn-icon"
                  title="Edit Profile"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(farmer.id)}
                  className="btn-icon danger"
                  title="Remove Farmer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 48px', 
          background: 'var(--surface)', 
          border: '1px solid var(--border)',
          borderRadius: '12px',
          animation: 'fadeUp 0.8s ease both'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>👨‍🌾</div>
          <div className="section-title" style={{ fontSize: '24px', marginBottom: '8px' }}>
            No farmers registered <em>yet</em>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '16px' }}>
            Get started by adding your first team member to manage their produce listings.
          </p>
        </div>
      )}

      {/* Farmer Form Modal */}
      {showAddForm && (
        <FarmerForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            fetchFarmers();
          }}
        />
      )}
    </div>
  );
};

export default FarmersManagement;
