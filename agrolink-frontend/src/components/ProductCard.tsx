import React from 'react';
import { ShoppingCart, Eye, MapPin } from 'lucide-react';

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
  category?: string;
}

interface ProductCardProps {
  item: Produce;
  onAddToCart: (item: Produce) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, onAddToCart }) => {
  const getEmoji = (category: string = '') => {
    switch (category.toLowerCase()) {
      case 'vegetables': return '🥬';
      case 'fruits': return '🍎';
      case 'grains': return '🌾';
      default: return '📦';
    }
  };

  const getBadgeClass = (quantity: number) => {
    if (quantity > 500) return 'badge-bulk';
    if (quantity < 50) return 'badge-exp';
    return 'badge-fresh';
  };

  const getBadgeText = (quantity: number) => {
    if (quantity > 500) return 'Bulk Available';
    if (quantity < 50) return 'Low Stock';
    return 'Fresh Harvest';
  };

  return (
    <div className="listing-card">
      <div className="card-district">
        <MapPin size={10} /> {item.farmer.cooperative.district}
      </div>
      
      <div className="card-badge-wrap" style={{ marginBottom: '16px' }}>
        <span className={`card-badge ${getBadgeClass(item.quantity)}`}>
          {getBadgeText(item.quantity)}
        </span>
      </div>

      <div className="card-image-wrap">
        <div style={{ fontSize: '64px' }}>{getEmoji(item.category)}</div>
        <div className="card-quick-actions">
          <button className="action-btn" onClick={() => onAddToCart(item)}>
            <ShoppingCart size={14} style={{ marginRight: '6px' }} /> Buy Now
          </button>
          <button className="action-btn">
            <Eye size={14} style={{ marginRight: '6px' }} /> Details
          </button>
        </div>
      </div>

      <h3 className="card-produce">{item.name}</h3>
      <p className="card-coop">
        by <span>{item.farmer.cooperative.name}</span>
      </p>

      <div className="card-details">
        <div>
          <div className="card-volume">{item.quantity}kg available</div>
          <div className="card-price">
            RWF {item.price.toLocaleString()}<sub>/kg</sub>
          </div>
        </div>
        <button 
          className="card-order-btn"
          onClick={() => onAddToCart(item)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
