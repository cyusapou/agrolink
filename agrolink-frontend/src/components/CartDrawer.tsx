import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import CheckoutForm from './CheckoutForm';
import './CheckoutForm.css';

interface Produce {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}

interface CartItem {
  produce: Produce;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
  total: number;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemove, 
  total 
}) => {
  const [showCheckout, setShowCheckout] = useState(false);

  const handleCheckoutSuccess = (orderId: number) => {
    // Order successful, cart is cleared by CheckoutForm
    setShowCheckout(false);
    onClose();
    // You could navigate to order tracking page here
    console.log('Order created with ID:', orderId);
  };

  const getEmoji = (category: string = '') => {
    switch (category.toLowerCase()) {
      case 'vegetables': return '🥬';
      case 'fruits': return '🍎';
      case 'grains': return '🌾';
      default: return '📦';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`cart-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose} 
      />

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div className="flex items-center gap-3">
            <h2 className="cart-title">Your Basket</h2>
            <span className="badge-fresh px-3 py-1 rounded-full text-xs font-bold">
              {items.length} Items
            </span>
          </div>
          <button className="close-cart" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-[var(--surface)] border border-[var(--border)] rounded-full flex items-center justify-center text-2xl">
                🛒
              </div>
              <div>
                <p className="text-[var(--cream)] font-bold">Your basket is empty</p>
                <p className="text-[var(--muted)] text-sm mt-1">Start adding some fresh produce!</p>
              </div>
              <button className="btn-ghost mt-4" onClick={onClose}>
                Browse Marketplace
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.produce.id} className="cart-item">
                <div className="cart-item-img">
                  {getEmoji(item.produce.category)}
                </div>
                <div className="cart-item-info">
                  <h4 className="cart-item-name">{item.produce.name}</h4>
                  <p className="cart-item-price">
                    RWF {item.produce.price.toLocaleString()} / kg
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="cart-item-actions">
                      <button 
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(item.produce.id, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-[var(--cream)] font-bold text-sm min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(item.produce.id, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[var(--cream)] font-bold">
                    RWF {(item.produce.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <div>
                <div className="total-label">Subtotal</div>
                <div className="text-[var(--muted)] text-xs">Excludes delivery fees</div>
              </div>
              <div className="total-value">RWF {total.toLocaleString()}</div>
            </div>
            <button 
              className="btn-primary w-full flex items-center justify-center gap-2 py-4"
              onClick={() => setShowCheckout(true)}
            >
              <ShoppingBag size={18} /> Checkout <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Checkout Form Modal */}
      {showCheckout && (
        <CheckoutForm
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </>
  );
};

export default CartDrawer;
