import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { produceAPI, ordersAPI } from '../../api/axios';
import { Wheat, CheckCircle2, DollarSign, Package, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const CoopDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProduce: 0,
    activeListings: 0,
    totalValue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [produceRes, ordersRes] = await Promise.all([
        produceAPI.getAll(),
        ordersAPI.getAll(),
      ]);

      const coopProduce = produceRes.data.filter((p: any) => 
        p.farmer.cooperative.name === user?.cooperative?.name || 
        p.farmer.cooperative.district === user?.district
      );

      // Filtering orders for this coop's produce
      const coopOrders = ordersRes.data.filter((o: any) => 
        o.produce.farmer.cooperative.name === user?.cooperative?.name
      );

      setStats({
        totalProduce: coopProduce.length,
        activeListings: coopProduce.filter((p: any) => p.isActive).length,
        totalValue: coopProduce.reduce((sum: number, p: any) => sum + (p.price * p.quantity), 0),
        pendingOrders: coopOrders.filter((o: any) => o.status === 'pending').length,
      });

      setRecentOrders(coopOrders.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
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
    <div className="section" style={{ animation: 'fadeUp 0.6s ease both' }}>
      {/* Header */}
      <div className="mb-12">
        <div className="section-label">Cooperative Portal</div>
        <h2 className="section-title">Welcome back, <em>{user?.name || 'Manager'}</em></h2>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid cols-4">
        <div className="stat-card">
          <div>
            <div className="stat-card-label">My Produce</div>
            <div className="stat-card-value font-bold">{stats.totalProduce}</div>
          </div>
          <div className="stat-card-icon"><Wheat size={20} /></div>
        </div>
        
        <div className="stat-card">
          <div>
            <div className="stat-card-label">Active Listings</div>
            <div className="stat-card-value" style={{ color: 'var(--lime)' }}>{stats.activeListings}</div>
          </div>
          <div className="stat-card-icon"><CheckCircle2 size={20} /></div>
        </div>
        
        <div className="stat-card">
          <div>
            <div className="stat-card-label">Pending Orders</div>
            <div className="stat-card-value" style={{ color: 'var(--gold)' }}>{stats.pendingOrders}</div>
          </div>
          <div className="stat-card-icon"><Package size={20} /></div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-card-label">Inventory Value</div>
            <div className="stat-card-value" style={{ fontSize: '24px' }}>{stats.totalValue.toLocaleString()} <sub style={{ fontSize: '12px', verticalAlign: 'middle', marginLeft: '4px' }}>RWF</sub></div>
          </div>
          <div className="stat-card-icon"><DollarSign size={20} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="card" style={{ padding: '32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="section-label" style={{ marginBottom: '0' }}>Incoming Orders</h3>
            <Link to="/coop/orders" className="view-all">View All</Link>
          </div>
          <div className="space-y-4">
            {recentOrders.length > 0 ? recentOrders.map((order) => (
              <div key={order.id} className="flex justify-between items-center p-4 bg-[var(--card)] rounded-lg border border-transparent hover:border-[var(--border)] transition-all">
                <div>
                  <p className="text-[var(--cream)] font-semibold">{order.produce.name}</p>
                  <p className="text-[var(--muted)] text-sm">Qty: {order.quantity}kg</p>
                </div>
                <div className="text-right">
                  <p className="text-[var(--lime)] font-bold">{order.totalAmount.toLocaleString()} RWF</p>
                  <span className={`status-badge ${order.status === 'completed' ? 'active' : 'pending'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-12">
                <p className="text-[var(--muted)]">No active orders found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Insights */}
        <div className="card" style={{ padding: '32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
          <h3 className="section-label" style={{ marginBottom: '24px' }}>Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4">
            <Link to="/coop/produce" className="stat-card" style={{ textDecoration: 'none', padding: '16px 24px', color: 'var(--cream)' }}>
              <div className="flex items-center gap-4">
                <div className="stat-card-icon" style={{ background: 'rgba(127,209,71,0.1)' }}><Wheat size={18} /></div>
                <div>
                  <div className="text-[var(--cream)] font-semibold">Manage Produce</div>
                  <div className="text-[var(--muted)] text-xs">Add, edit, or remove listings</div>
                </div>
              </div>
              <ArrowRight size={16} color="var(--muted)" />
            </Link>

            <Link to="/coop/farmers" className="stat-card" style={{ textDecoration: 'none', padding: '16px 24px', color: 'var(--cream)' }}>
              <div className="flex items-center gap-4">
                <div className="stat-card-icon" style={{ background: 'rgba(245,168,50,0.1)' }}><Users size={18} /></div>
                <div>
                  <div className="text-[var(--cream)] font-semibold">My Farmers</div>
                  <div className="text-[var(--muted)] text-xs">Manage farmer memberships</div>
                </div>
              </div>
              <ArrowRight size={16} color="var(--muted)" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoopDashboard;
