import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { produceAPI, farmersAPI } from '../../api/axios';
import toast from 'react-hot-toast';
import { Wheat, CheckCircle2, DollarSign, Plus, Edit3, Trash2, Power, X, Users } from 'lucide-react';
import FarmerForm from '../../components/FarmerForm';

interface Produce {
  id: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  farmer: {
    name: string;
    cooperative: {
      name: string;
      district: string;
    };
  };
  isActive: boolean;
}

const ProduceManagement: React.FC = () => {
  const { user } = useAuth();
  const [produce, setProduce] = useState<Produce[]>([]);
  const [farmers, setFarmers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFarmerForm, setShowFarmerForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Produce | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: 0,
    price: 0,
  });

  useEffect(() => {
    fetchProduce();
    fetchFarmers();
  }, []);

  const fetchProduce = async () => {
    try {
      const response = await produceAPI.getAll();
      console.log('All produce from API:', response.data);
      console.log('Setting produce state with:', response.data);
      // For now, show all produce (no filtering by cooperative)
      setProduce(response.data);
      console.log('Produce state after setting:', response.data);
    } catch (error) {
      console.error('Error fetching produce:', error);
      toast.error('Failed to load produce');
    } finally {
      setLoading(false);
    }
  };

  const fetchFarmers = async () => {
    try {
      const response = await farmersAPI.getAll();
      console.log('All farmers from API:', response.data);
      
      // Don't filter for now - show all farmers
      setFarmers(response.data);
    } catch (error) {
      console.error('Failed to load farmers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting produce data:', formData);
    
    try {
      if (editingItem) {
        await produceAPI.update(editingItem.id, formData);
        toast.success('Produce updated successfully');
      } else {
        console.log('Creating produce with data:', formData);
        const response = await produceAPI.create(formData);
        console.log('Produce creation response:', response);
        toast.success('Produce added successfully');
      }
      setShowAddForm(false);
      setEditingItem(null);
      setFormData({ name: '', description: '', quantity: 0, price: 0 });
      fetchProduce();
    } catch (error: any) {
      console.error('Produce creation error:', error);
      toast.error(error.response?.data?.message || 'Failed to save produce');
    }
  };

  const handleEdit = (item: Produce) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      price: item.price,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this produce?')) {
      try {
        await produceAPI.delete(id);
        toast.success('Produce deleted successfully');
        fetchProduce();
      } catch (error) {
        toast.error('Failed to delete produce');
      }
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      await produceAPI.update(id, { isActive: !currentStatus });
      toast.success(`Produce ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchProduce();
    } catch (error) {
      toast.error('Failed to update produce status');
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
    <div className="section">
      {/* Header */}
      <div className="dashboard-header" style={{ marginBottom: '40px', alignItems: 'flex-end' }}>
        <div>
          <div className="section-label">Inventory Management</div>
          <h2 className="section-title">Manage your cooperative's <em>listings</em></h2>
        </div>
        <div className="flex gap-4" style={{ marginBottom: '8px' }}>
          <button
            onClick={() => setShowFarmerForm(true)}
            className="btn-ghost"
            style={{ padding: '12px 24px', fontSize: '14px' }}
          >
            <Users size={18} /> <span>Add Farmer</span>
          </button>
          <button
            onClick={() => {
              setEditingItem(null);
              setFormData({ name: '', description: '', quantity: 0, price: 0 });
              setShowAddForm(true);
            }}
            className="btn-primary"
            style={{ padding: '12px 24px', fontSize: '14px' }}
          >
            <Plus size={18} /> <span>Add Produce</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid cols-4" style={{ animation: 'fadeUp 0.6s ease both', marginBottom: '48px' }}>
        <div className="stat-card">
          <div>
            <div className="stat-card-label">Total Items</div>
            <div className="stat-card-value">{produce.length}</div>
          </div>
          <div className="stat-card-icon"><Wheat size={20} /></div>
        </div>
        
        <div className="stat-card">
          <div>
            <div className="stat-card-label">Active Listings</div>
            <div className="stat-card-value" style={{ color: 'var(--lime)' }}>
              {produce.filter(p => p.isActive).length}
            </div>
          </div>
          <div className="stat-card-icon"><CheckCircle2 size={20} /></div>
        </div>
        
        <div className="stat-card">
          <div>
            <div className="stat-card-label">Registered Farmers</div>
            <div className="stat-card-value">
              {farmers.length}
            </div>
          </div>
          <div className="stat-card-icon"><Users size={20} /></div>
        </div>
        
        <div className="stat-card">
          <div>
            <div className="stat-card-label">Inventory Value</div>
            <div className="stat-card-value">
              {produce.reduce((sum, p) => sum + (p.price * p.quantity), 0).toLocaleString()} <sub style={{ fontSize: '11px', color: 'var(--muted)', verticalAlign: 'middle' }}>RWF</sub>
            </div>
          </div>
          <div className="stat-card-icon"><DollarSign size={20} /></div>
        </div>
      </div>

      {/* Produce Table */}
      <div className="table-container" style={{ animation: 'fadeUp 0.8s ease both' }}>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ minWidth: '280px' }}>Product Details</th>
                <th style={{ minWidth: '120px' }}>Quantity</th>
                <th style={{ minWidth: '150px' }}>Price/kg</th>
                <th style={{ minWidth: '150px' }}>Total Value</th>
                <th style={{ minWidth: '120px' }}>Status</th>
                <th style={{ minWidth: '160px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {produce.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="card-avatar" style={{ background: 'rgba(127,209,71,0.1)', flexShrink: 0 }}>
                        🌾
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ color: 'var(--cream)', fontWeight: '600', fontSize: '15px', marginBottom: '2px' }}>{item.name}</div>
                        <div style={{ color: 'var(--muted)', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="status-badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--cream)' }}>
                      {item.quantity} kg
                    </span>
                  </td>
                  <td>
                    <div style={{ color: 'var(--lime)', fontWeight: '600' }}>
                      {item.price.toLocaleString()} <span style={{ fontSize: '10px', color: 'var(--muted)' }}>RWF</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ color: 'var(--cream)', fontWeight: '600' }}>
                      {(item.price * item.quantity).toLocaleString()} <span style={{ fontSize: '10px', color: 'var(--muted)' }}>RWF</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${item.isActive ? 'active' : 'pending'}`}>
                      {item.isActive ? 'LISTED' : 'HIDDEN'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleEdit(item)}
                        className="btn-icon"
                        title="Edit Produce"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleToggleActive(item.id, item.isActive)}
                        className="btn-icon"
                        title={item.isActive ? 'Hide from marketplace' : 'Show in marketplace'}
                        style={{ color: item.isActive ? 'var(--gold)' : 'var(--lime)' }}
                      >
                        <Power size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="btn-icon danger"
                        title="Delete Produce"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {produce.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 48px' }}>
          <div className="section-label">Inventory Empty</div>
          <p className="text-[var(--muted)]" style={{ marginTop: '16px' }}>No produce listings found. Add your first produce to get started.</p>
        </div>
      )}

      {/* Form Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <div className="section-label">Inventory Update</div>
                <h3 className="section-title" style={{ fontSize: '28px' }}>{editingItem ? 'Edit' : 'Add'} <em>Produce</em></h3>
              </div>
              <button 
                onClick={() => {
                  setShowAddForm(false);
                  setEditingItem(null);
                }} 
                className="close-btn"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-control"
                  placeholder="E.g., Irish Potatoes"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-control"
                  style={{ minHeight: '120px', resize: 'none' }}
                  placeholder="Describe the quality, variety, and harvest date..."
                />
              </div>
              <div className="flex gap-6">
                <div className="form-group w-full">
                  <label className="form-label">Quantity Available (kg)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
                <div className="form-group w-full">
                  <label className="form-label">Price per Unit (RWF/kg)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn-primary w-full"
                style={{ marginTop: '8px' }}
              >
                {editingItem ? 'Save Changes' : 'Confirm & List Produce'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Farmer Form Modal */}
      {showFarmerForm && (
        <FarmerForm
          onClose={() => setShowFarmerForm(false)}
          onSuccess={() => {
            console.log('Farmer created successfully, refreshing data...');
            setShowFarmerForm(false);
            fetchFarmers();
            fetchProduce();
          }}
        />
      )}
    </div>
  );
};

export default ProduceManagement;
