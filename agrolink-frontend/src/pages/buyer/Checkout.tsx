import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { ordersAPI } from '../../api/axios';
import toast from 'react-hot-toast';
import { MapPin, Calendar, Phone, CreditCard, ArrowLeft, ShoppingBag, Truck, Info } from 'lucide-react';
import './Checkout.css';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    deliveryAddress: user?.address || '',
    phoneNumber: user?.phone || '',
    expectedDeliveryDate: '',
    notes: '',
  });

  useEffect(() => {
    // If cart is empty, redirect back to marketplace
    if (items.length === 0 && !loading) {
      toast.error('Your basket is empty');
      navigate('/buyer/marketplace');
    }
  }, [items, navigate, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('Your basket is empty');
      return;
    }

    if (!formData.deliveryAddress || !formData.phoneNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Create orders for each item in cart
      const orderPromises = items.map(item => {
        const orderData = {
          quantityKg: item.quantity,
          produceId: item.produce.id,
          deliveryAddress: formData.deliveryAddress,
          expectedDeliveryDate: formData.expectedDeliveryDate ? 
            new Date(formData.expectedDeliveryDate) : undefined,
        };
        return ordersAPI.create(orderData);
      });

      await Promise.all(orderPromises);
      
      // Clear cart after successful order creation
      clearCart();
      
      toast.success(`Purchase successful! Your order has been placed.`);
      navigate('/buyer/orders');
    } catch (error: any) {
      console.error('Order creation error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="checkout-page">
      <Link to="/buyer/marketplace" className="back-to-market">
        <ArrowLeft size={18} /> Back to Marketplace
      </Link>

      <div className="section-label">Complete Purchase</div>
      <h1 className="hero-title" style={{ fontSize: '24px', marginBottom: '16px' }}>
        Checkout <em>Process</em>
      </h1>

      <div className="checkout-grid">
        <div className="checkout-main">
          {/* Delivery Information */}
          <section className="checkout-section">
            <div className="checkout-section-header">
                <Truck className="text-[var(--lime)]" size={24} />
                <h2 className="checkout-section-title">Delivery <em>Information</em></h2>
            </div>
            
            <form id="checkout-form" onSubmit={handleSubmit} className="checkout-form-grid">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">
                  <MapPin size={16} /> Delivery Address
                </label>
                <textarea
                  required
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  className="form-control"
                  placeholder="Street name, Building, Apartment number, City..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone size={16} /> Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="form-control"
                  placeholder="e.g., 078XXXXXXX"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Calendar size={16} /> Preferred Delivery Date
                </label>
                <input
                  type="date"
                  value={formData.expectedDeliveryDate}
                  onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                  className="form-control"
                  min={getTomorrowDate()}
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">
                  Order Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="form-control"
                  placeholder="Special instructions for the delivery person..."
                  rows={2}
                />
              </div>
            </form>
          </section>

          {/* Payment Method */}
          <section className="checkout-section">
            <div className="checkout-section-header">
                <CreditCard className="text-[var(--lime)]" size={24} />
                <h2 className="checkout-section-title">Payment <em>Method</em></h2>
            </div>
            
            <div className="payment-options">
              <div className="payment-card active">
                <div className="payment-icon">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/MTN_Logo.svg" alt="MTN" style={{ width: '24px' }} />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-[var(--cream)]">MTN Mobile Money</div>
                  <div className="text-sm text-[var(--muted)]">Pay securely with MoMo</div>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-[var(--lime)] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--lime)]"></div>
                </div>
              </div>

              <div className="payment-card opacity-50 cursor-not-allowed">
                <div className="payment-icon">
                  <ShoppingBag size={20} className="text-[var(--muted)]" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-[var(--muted)]">Card Payment</div>
                  <div className="text-sm text-[var(--muted)]">Coming soon</div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[var(--surface-light)] border border-[var(--border)] rounded-2xl flex gap-3">
              <Info size={20} className="text-[var(--lime)] shrink-0" />
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Payment prompt will be sent to your mobile phone after you place the order. 
                Please ensure your MoMo account has sufficient balance.
              </p>
            </div>
          </section>
        </div>

        {/* Sidebar Summary */}
        <aside className="checkout-sidebar">
          <div className="order-summary-card">
            <h3 className="checkout-section-title" style={{ fontSize: '24px' }}>
              Order <em>Summary</em>
            </h3>
            
            <div className="summary-items-list">
              {items.map((item) => (
                <div key={item.produce.id} className="summary-item-row">
                  <div>
                    <div className="summary-item-name">{item.produce.name}</div>
                    <div className="summary-item-qty">{item.quantity} kg × RWF {item.produce.price.toLocaleString()}</div>
                  </div>
                  <div className="summary-item-price">
                    RWF {(item.quantity * item.produce.price).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="flex justify-between text-sm text-[var(--muted)] mb-2">
                <span>Subtotal</span>
                <span>RWF {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-[var(--muted)] mb-4">
                <span>Delivery Fee</span>
                <span className="text-[var(--lime)] font-bold">FREE</span>
              </div>
              
              <div className="total-row">
                <span className="total-label">Total</span>
                <span className="total-amount">RWF {total.toLocaleString()}</span>
              </div>
            </div>

            <button 
              type="submit" 
              form="checkout-form"
              disabled={loading}
              className="btn-primary place-order-btn"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="spinner-small" /> Processing...
                </div>
              ) : (
                <>Place Order Now</>
              )}
            </button>
            <p className="text-center text-[11px] text-[var(--muted)] mt-4">
              By placing your order, you agree to AgroLink's Terms of Service and Privacy Policy.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
