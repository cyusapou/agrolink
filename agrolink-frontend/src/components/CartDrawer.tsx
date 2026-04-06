import React from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Produce {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  farmer?: {
    cooperative: {
      name: string;
    }
  };
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
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/buyer/checkout');
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
          <div>
            <h2 className="cart-title">Your <em>Basket</em></h2>
            <p className="text-[10px] text-[var(--muted)] uppercase font-bold tracking-widest mt-1">
              {items.length} {items.length === 1 ? 'Product' : 'Products'} Selected
            </p>
          </div>
          <button className="close-cart-btn" onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-cart-state">
              <div className="empty-cart-icon">🛒</div>
              <h3 className="empty-cart-title">Your basket is empty</h3>
              <p className="empty-cart-text">Looks like you haven't added any fresh produce to your basket yet.</p>
              <button className="btn-primary mt-6" onClick={onClose}>
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.produce.id} className="cart-item">
                <div className="cart-item-img">
                  {getEmoji(item.produce.category)}
                </div>
                <div className="cart-item-content">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="cart-item-name">{item.produce.name}</h4>
                      {item.produce.farmer?.cooperative?.name && (
                        <p className="cart-item-vendor">
                          Sold by <span>{item.produce.farmer.cooperative.name}</span>
                        </p>
                      )}
                    </div>
                    <button 
                      className="remove-item-btn"
                      onClick={() => onRemove(item.produce.id)}
                      title="Remove"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  
                  <div className="cart-item-footer">
                    <div className="cart-item-pricing">
                      <span className="price-tag">RWF {item.produce.price.toLocaleString()}</span>
                      <span className="price-unit">/ kg</span>
                    </div>
                    
                    <div className="qty-control">
                      <button 
                        className="qty-action"
                        onClick={() => onUpdateQuantity(item.produce.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="qty-number">{item.quantity}</span>
                      <button 
                        className="qty-action"
                        onClick={() => onUpdateQuantity(item.produce.id, item.quantity + 1)}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal ({items.length} items)</span>
                <span>RWF {total.toLocaleString()}</span>
              </div>
              <div className="summary-row text-[var(--lime)] font-bold">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="divider-dashed" />
              <div className="summary-row total">
                <span>Estimated Total</span>
                <span className="total-value">RWF {total.toLocaleString()}</span>
              </div>
            </div>
            
            <button 
              className="btn-primary w-full py-4 mt-6 flex items-center justify-center gap-3 group"
              onClick={handleCheckout}
            >
              <ShoppingBag size={18} className="transition-transform group-hover:scale-110" /> 
              Secure Checkout 
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
