import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../../api/axios';
import { Package, Calendar, User, Clock, CheckCircle, Truck, XCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface Order {
  id: number;
  createdAt: string;
  totalAmount: number;
  status: string;
  quantityKg: number;
  buyer: {
    email: string;
    profile?: { name: string };
  };
  produce: {
    name: string;
  };
}

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'dispatched' | 'delivered'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getCooperativeOrders();
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: number, action: 'confirm' | 'dispatch') => {
    try {
      const promise = action === 'confirm' 
        ? ordersAPI.confirmOrder(id, {}) 
        : ordersAPI.dispatchOrder(id, {});
      
      await toast.promise(promise, {
        loading: `${action === 'confirm' ? 'Confirming' : 'Dispatching'} order...`,
        success: `Order ${action === 'confirm' ? 'confirmed' : 'dispatched'}!`,
        error: `Failed to ${action} order`,
      });
      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'New Order';
      case 'confirmed': return 'Processing';
      case 'dispatched': return 'In Transit';
      case 'delivered': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = order.id.toString().includes(searchTerm) || 
                         order.produce.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.buyer.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
      <div className="dashboard-header" style={{ marginBottom: '40px' }}>
        <div>
          <div className="section-label">Sales Operations</div>
          <h2 className="section-title">Order <em>Management</em></h2>
        </div>
        <div className="flex gap-4">
          <div className="search-container" style={{ minWidth: '300px' }}>
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by order #, produce or buyer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-8 mb-12 border-b border-[var(--border)] overflow-x-auto no-scrollbar">
        {['all', 'pending', 'confirmed', 'dispatched', 'delivered'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab as any)}
            style={{ 
              paddingBottom: '16px', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              borderBottom: filter === tab ? '2px solid var(--lime)' : '2px solid transparent',
              color: filter === tab ? 'var(--cream)' : 'var(--muted)',
              fontWeight: filter === tab ? '600' : '400',
              fontSize: '14px',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="table-container" style={{ animation: 'fadeUp 0.8s ease both' }}>
        {filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <h3 style={{ color: 'var(--cream)', marginBottom: '8px' }}>No orders found</h3>
            <p style={{ color: 'var(--muted)' }}>Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Order Details</th>
                <th>Buyer Info</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600 }}>#{order.id.toString().padStart(6, '0')}</td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 500, color: 'var(--cream)' }}>{order.produce.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Package size={11} /> {order.quantityKg}kg
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 500, color: 'var(--cream)' }}>{order.buyer.profile?.name || 'Customer'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{order.buyer.email}</div>
                    </div>
                  </td>
                  <td>
                    <div style={{ color: 'var(--lime)', fontWeight: 600 }}>
                      {order.totalAmount.toLocaleString()} RWF
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${
                      order.status === 'delivered' ? 'active' : 
                      order.status === 'pending' ? 'pending' : 
                      order.status === 'cancelled' ? 'failed' : 'pending'
                    }`}>
                      {getStatusLabel(order.status).toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <button 
                          className="btn-icon" 
                          title="Confirm Order"
                          onClick={() => handleAction(order.id, 'confirm')}
                          style={{ color: 'var(--lime)' }}
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button 
                          className="btn-icon" 
                          title="Dispatch Order"
                          onClick={() => handleAction(order.id, 'dispatch')}
                          style={{ color: 'var(--gold)' }}
                        >
                          <Truck size={16} />
                        </button>
                      )}
                      <button className="btn-icon" title="View Details">
                        <Clock size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrdersManagement;
