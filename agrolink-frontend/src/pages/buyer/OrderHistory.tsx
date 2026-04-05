import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ordersAPI } from '../../api/axios';
import toast from 'react-hot-toast';
import { Package, Calendar, MapPin, Phone, CheckCircle, Clock, Truck, XCircle, RefreshCw } from 'lucide-react';

interface Order {
  id: number;
  quantityKg: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled' | 'completed';
  deliveryAddress: string;
  expectedDeliveryDate?: string;
  createdAt: string;
  produce: {
    id: number;
    name: string;
    price: number;
    farmer: {
      name: string;
      cooperative: {
        name: string;
        district: string;
      };
    };
  };
}

const OrderHistory: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} className="text-yellow-500" />;
      case 'confirmed': return <CheckCircle size={16} className="text-blue-500" />;
      case 'dispatched': return <Truck size={16} className="text-purple-500" />;
      case 'delivered': 
      case 'completed': return <CheckCircle size={16} className="text-green-500" />;
      case 'cancelled': return <XCircle size={16} className="text-red-500" />;
      default: return <Package size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'confirmed': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'dispatched': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'delivered': 
      case 'completed': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending Confirmation';
      case 'confirmed': return 'Confirmed';
      case 'dispatched': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'active') {
      return ['pending', 'confirmed', 'dispatched'].includes(order.status);
    }
    if (filter === 'completed') {
      return ['delivered', 'completed', 'cancelled'].includes(order.status);
    }
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <div className="section-label">Purchase Records</div>
          <h2 className="section-title">Order <em>History</em></h2>
        </div>
        <div className="flex gap-4" style={{ marginBottom: '8px' }}>
          <button 
            className="btn-ghost"
            onClick={() => window.location.href = '/buyer/marketplace'}
            style={{ padding: '12px 24px', fontSize: '14px' }}
          >
            <RefreshCw size={18} /> <span>Refresh Listings</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-8 mb-12 border-b border-[var(--border)] overflow-x-auto no-scrollbar">
        {[
          { key: 'all', label: 'All Orders', count: orders.length },
          { key: 'active', label: 'Active Progress', count: orders.filter(o => ['pending', 'confirmed', 'dispatched'].includes(o.status)).length },
          { key: 'completed', label: 'Past Orders', count: orders.filter(o => ['delivered', 'completed', 'cancelled'].includes(o.status)).length }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            style={{ 
              paddingBottom: '16px', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              borderBottom: filter === tab.key ? '2px solid var(--lime)' : '2px solid transparent',
              color: filter === tab.key ? 'var(--cream)' : 'var(--muted)',
              fontWeight: filter === tab.key ? '600' : '400',
              fontSize: '14px',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
            {tab.count > 0 && (
              <span style={{ 
                background: filter === tab.key ? 'rgba(127,209,71,0.1)' : 'rgba(255,255,255,0.05)', 
                color: filter === tab.key ? 'var(--lime)' : 'var(--muted)',
                padding: '2px 8px', 
                borderRadius: '10px', 
                fontSize: '11px' 
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="grid-list" style={{ animation: 'fadeUp 0.8s ease both' }}>
        {filteredOrders.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '100px 48px', 
            background: 'var(--surface)', 
            border: '1px solid var(--border)',
            borderRadius: '16px',
            width: '100%'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>📦</div>
            <h3 className="section-title" style={{ fontSize: '24px', marginBottom: '8px' }}>
              No orders registerd <em>yet</em>
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '16px', marginBottom: '32px' }}>
              {filter === 'all' 
                ? 'Start sourcing premium produce from our cooperatives to see your orders here.'
                : `You don't have any ${filter} orders at this moment.`
              }
            </p>
            {filter === 'all' && (
              <button 
                className="btn-primary"
                onClick={() => window.location.href = '/buyer'}
              >
                Explore Marketplace
              </button>
            )}
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="horizontal-card" style={{ padding: '32px' }}>
              <div className="card-avatar" style={{ background: 'var(--soil)', fontSize: '24px' }}>
                🌾
              </div>
              
              <div className="card-main-info">
                <div className="card-title-row">
                  <h3 className="card-h-title">Order #{order.id.toString().padStart(6, '0')}</h3>
                  <span className={`status-badge ${
                    ['delivered', 'completed'].includes(order.status) ? 'active' : 
                    order.status === 'cancelled' ? 'failed' : 'pending'
                  }`}>
                    {getStatusLabel(order.status).toUpperCase()}
                  </span>
                </div>
                
                <div className="card-sub-info">
                  <div className="info-item">
                    <Package size={14} />
                    <span>{order.produce.name} — {order.quantityKg}kg</span>
                  </div>
                  <div className="info-item">
                    <Calendar size={14} />
                    <span>Placed on {formatDate(order.createdAt)}</span>
                  </div>
                  <div className="info-item">
                    <MapPin size={14} />
                    <span>{order.produce.farmer.cooperative.district}</span>
                  </div>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '24px' }}>
                  <div>
                    <div className="section-label" style={{ fontSize: '10px', marginBottom: '4px' }}>Total Amount</div>
                    <div style={{ color: 'var(--lime)', fontWeight: '700', fontSize: '18px' }}>
                      {order.totalAmount.toLocaleString()} <sub style={{ fontSize: '10px', fontWeight: '400' }}>RWF</sub>
                    </div>
                  </div>
                  <div>
                    <div className="section-label" style={{ fontSize: '10px', marginBottom: '4px' }}>Location</div>
                    <div style={{ color: 'var(--cream)', fontWeight: '500', fontSize: '14px' }}>
                      {order.produce.farmer.cooperative.name}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card-actions-h" style={{ flexDirection: 'column', gap: '8px' }}>
                <button
                  className="btn-icon"
                  title="View Details"
                >
                  <Clock size={16} />
                </button>
                {order.status === 'delivered' && (
                  <button className="btn-icon" title="Leave Review" style={{ color: 'var(--lime)' }}>
                    <CheckCircle size={16} />
                  </button>
                )}
                {['pending', 'confirmed'].includes(order.status) && (
                  <button className="btn-icon danger" title="Cancel Order">
                    <XCircle size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
