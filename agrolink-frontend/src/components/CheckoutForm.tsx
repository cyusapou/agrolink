import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { ordersAPI } from '../api/axios';
import toast from 'react-hot-toast';
import { MapPin, Calendar, Phone, User } from 'lucide-react';

interface CheckoutFormProps {
  onClose: () => void;
  onSuccess: (orderId: number) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onClose, onSuccess }) => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    deliveryAddress: user?.address || '',
    phoneNumber: user?.phone || '',
    expectedDeliveryDate: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('Your cart is empty');
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

      const orderResponses = await Promise.all(orderPromises);
      
      // Clear cart after successful order creation
      clearCart();
      
      toast.success(`Order created successfully! ${orderResponses.length} items ordered`);
      
      // Pass the first order ID for tracking
      onSuccess(orderResponses[0].data.id);
      onClose();
    } catch (error: any) {
      console.error('Order creation error:', error);
      toast.error(error.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const formatDeliveryDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="checkout-overlay">
      <div className="checkout-modal">
        <div className="checkout-header">
          <div>
            <div className="section-label">Checkout</div>
            <h3 className="section-title">Complete Your <em>Order</em></h3>
          </div>
          <button 
            onClick={onClose}
            className="close-btn"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          {/* Order Summary */}
          <div className="order-summary">
            <h4 className="summary-title">Order Summary</h4>
            <div className="summary-items">
              {items.map((item) => (
                <div key={item.produce.id} className="summary-item">
                  <div className="item-info">
                    <div className="item-name">{item.produce.name}</div>
                    <div className="item-details">
                      {item.quantity}kg × RWF {item.produce.price}/kg
                    </div>
                  </div>
                  <div className="item-total">
                    RWF {(item.quantity * item.produce.price).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <div className="total-row">
                <span>Total Amount:</span>
                <span className="total-amount">RWF {total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="delivery-section">
            <h4 className="section-title" style={{ fontSize: '18px' }}>
              Delivery <em>Information</em>
            </h4>
            
            <div className="form-group">
              <label className="form-label">
                <MapPin size={16} style={{ marginRight: '8px' }} />
                Delivery Address *
              </label>
              <textarea
                required
                value={formData.deliveryAddress}
                onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                className="form-control"
                placeholder="Enter your complete delivery address"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Phone size={16} style={{ marginRight: '8px' }} />
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="form-control"
                placeholder="07xxxxxxxx"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar size={16} style={{ marginRight: '8px' }} />
                Expected Delivery Date (Optional)
              </label>
              <input
                type="date"
                value={formData.expectedDeliveryDate}
                onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                className="form-control"
                min={formatDeliveryDate()}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Order Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="form-control"
                placeholder="Any special instructions for delivery..."
                rows={2}
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="payment-section">
            <h4 className="section-title" style={{ fontSize: '18px' }}>
              Payment <em>Method</em>
            </h4>
            <div className="payment-method">
              <label className="payment-option">
                <input type="radio" name="payment" defaultChecked readOnly />
                <div className="payment-info">
                  <div className="payment-name">MTN Mobile Money</div>
                  <div className="payment-desc">Pay securely with MTN MoMo</div>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="checkout-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {loading ? (
                <>
                  <div className="spinner-small" />
                  Processing...
                </>
              ) : (
                <>
                  Place Order • RWF {total.toLocaleString()}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
