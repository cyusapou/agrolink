import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { cooperativesAPI, usersAPI, ordersAPI, produceAPI } from '../../api/axios';
import { Users, Building2, Package, Wheat, DollarSign, Plus, UserCheck, UserX } from 'lucide-react';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalUsers: number;
  totalCooperatives: number;
  totalOrders: number;
  totalProduce: number;
  totalRevenue: number;
}

interface RecentOrder {
  id: number;
  createdAt: string;
  totalAmount: number;
  status: string;
  buyer: {
    email: string;
    role: string;
  };
  produce: {
    name: string;
  };
}

interface RecentUser {
  id: number;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCooperatives: 0,
    totalOrders: 0,
    totalProduce: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'cooperatives' | 'orders'>('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, cooperativesRes, ordersRes, produceRes] = await Promise.all([
        usersAPI.getAll(),
        cooperativesAPI.getAll(),
        ordersAPI.getAll(),
        produceAPI.getAll(),
      ]);

      const users = usersRes.data;
      const cooperatives = cooperativesRes.data;
      const orders = ordersRes.data;
      const produce = produceRes.data;

      setStats({
        totalUsers: users.length,
        totalCooperatives: cooperatives.length,
        totalOrders: orders.length,
        totalProduce: produce.length,
        totalRevenue: orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0),
      });

      setRecentOrders(orders.slice(0, 5));
      setRecentUsers(users.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: number, isActive: boolean) => {
    try {
      await usersAPI.update(userId, { isActive });
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update user status');
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
      <div className="section-label">Admin Dashboard</div>
      <h2 className="section-title">System administration <em>overview</em></h2>

      {/* Navigation Tabs */}
      <div className="portal-tabs" style={{ marginTop: '32px' }}>
        {['overview', 'users', 'cooperatives', 'orders'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8" style={{ animation: 'fadeUp 0.6s ease both' }}>
          {/* Stats Cards */}
          <div className="stats-grid cols-5">
            <div className="stat-card">
              <div>
                <div className="stat-card-label">Total Users</div>
                <div className="stat-card-value text-xl font-bold text-[var(--cream)]">{stats.totalUsers}</div>
              </div>
              <div className="stat-card-icon"><Users size={20} /></div>
            </div>
            
            <div className="stat-card">
              <div>
                <div className="stat-card-label">Cooperatives</div>
                <div className="stat-card-value">{stats.totalCooperatives}</div>
              </div>
              <div className="stat-card-icon"><Building2 size={20} /></div>
            </div>
            
            <div className="stat-card">
              <div>
                <div className="stat-card-label">Total Orders</div>
                <div className="stat-card-value">{stats.totalOrders}</div>
              </div>
              <div className="stat-card-icon"><Package size={20} /></div>
            </div>
            
            <div className="stat-card">
              <div>
                <div className="stat-card-label">Produce Types</div>
                <div className="stat-card-value">{stats.totalProduce}</div>
              </div>
              <div className="stat-card-icon"><Wheat size={20} /></div>
            </div>
            
            <div className="stat-card">
              <div>
                <div className="stat-card-label">Gross Revenue</div>
                <div className="stat-card-value" style={{ fontSize: '20px' }}>{stats.totalRevenue.toLocaleString()} <sub>RWF</sub></div>
              </div>
              <div className="stat-card-icon"><DollarSign size={20} /></div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <div className="card" style={{ padding: '32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
              <h3 className="section-label" style={{ marginBottom: '24px' }}>Recent Orders</h3>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center p-4 bg-[var(--card)] rounded-lg border border-transparent hover:border-[var(--border)] transition-all">
                    <div>
                      <p className="text-[var(--cream)] font-semibold">{order.produce.name}</p>
                      <p className="text-[var(--muted)] text-sm">{order.buyer.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[var(--lime)] font-bold">{order.totalAmount.toLocaleString()} RWF</p>
                      <span className={`status-badge ${order.status === 'completed' ? 'active' : 'pending'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Users */}
            <div className="card" style={{ padding: '32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
              <h3 className="section-label" style={{ marginBottom: '24px' }}>New Members</h3>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex justify-between items-center p-4 bg-[var(--card)] rounded-lg border border-transparent hover:border-[var(--border)] transition-all">
                    <div>
                      <p className="text-[var(--cream)] font-semibold">{user.email}</p>
                      <p className="text-[var(--muted)] text-sm">{user.role}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`status-badge ${user.isActive ? 'active' : 'danger'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-[var(--muted)] text-xs">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div style={{ animation: 'fadeUp 0.6s ease both' }}>
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="section-label">User Management</div>
              <h3 className="section-title" style={{ fontSize: '24px' }}>System <em>Access</em></h3>
            </div>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} /> Add User
            </button>
          </div>
          
          <div className="form-container" style={{ padding: '0', overflow: 'hidden' }}>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id}>
                      <td style={{ fontWeight: 600 }}>{user.email}</td>
                      <td style={{ color: 'var(--muted)' }}>{user.role}</td>
                      <td>
                        <span className={`status-badge ${user.isActive ? 'active' : 'danger'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--muted)' }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          onClick={() => toggleUserStatus(user.id, !user.isActive)}
                          className="view-all"
                          style={{ color: user.isActive ? '#ff4d4f' : 'var(--lime)', border: 'none', padding: '0' }}
                        >
                          {user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                          <span style={{ marginLeft: '6px' }}>{user.isActive ? 'Deactivate' : 'Activate'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Cooperatives Tab */}
      {activeTab === 'cooperatives' && (
        <div style={{ animation: 'fadeUp 0.6s ease both' }}>
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="section-label">Partner Networks</div>
              <h3 className="section-title" style={{ fontSize: '24px' }}>Active <em>Cooperatives</em></h3>
            </div>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} /> Register Cooperative
            </button>
          </div>
          
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cooperative Name</th>
                  <th>District</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Using a mock mapping or deriving from a fetch if available */}
                {recentUsers.filter(u => u.role === 'COOP_MANAGER').map((u, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{u.email.split('@')[0].toUpperCase()} COOP</td>
                    <td>{['Musanze', 'Kayonza', 'Huye', 'Rubavu'][i % 4]}</td>
                    <td style={{ color: 'var(--muted)' }}>Sector {i + 1}, Cell {i*2 + 1}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn-icon" title="Edit"><Clock size={16} /></button>
                        <button className="btn-icon danger" title="Delete"><UserX size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div style={{ animation: 'fadeUp 0.6s ease both' }}>
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="section-label">Global Commerce</div>
              <h3 className="section-title" style={{ fontSize: '24px' }}>System <em>Orders</em></h3>
            </div>
            <div className="search-container" style={{ minWidth: '300px' }}>
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search global orders..." className="search-input" />
            </div>
          </div>
          
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Buyer</th>
                  <th>Produce</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600 }}>#{order.id.toString().padStart(6, '0')}</td>
                    <td style={{ color: 'var(--muted)' }}>{order.buyer.email}</td>
                    <td>{order.produce.name}</td>
                    <td style={{ color: 'var(--lime)', fontWeight: 600 }}>{order.totalAmount.toLocaleString()} RWF</td>
                    <td>
                      <span className={`status-badge ${order.status === 'completed' ? 'active' : 'pending'}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <button className="btn-icon"><Clock size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
