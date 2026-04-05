import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { produceAPI } from '../../api/axios';
import toast from 'react-hot-toast';
import { Search, SortAsc, SortDesc, Leaf } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import './Marketplace.css';

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

const CATEGORIES = [
  { id: 'all', name: 'All Produce', icon: '🌽' },
  { id: 'vegetables', name: 'Vegetables', icon: '🥬' },
  { id: 'fruits', name: 'Fruits', icon: '🍎' },
  { id: 'grains', name: 'Grains', icon: '🌾' },
];

const Marketplace: React.FC = () => {
  const { } = useAuth();
  const { addItem } = useCart();
  const [produce, setProduce] = useState<Produce[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchProduce();
  }, []);

  const fetchProduce = async () => {
    try {
      const response = await produceAPI.getAll();
      // Mocking categories for now as they might not be in the backend yet
      const mapped = response.data.map((p: any) => ({
        ...p,
        category: p.name.toLowerCase().includes('grain') ? 'grains' : 
                 p.name.toLowerCase().includes('apple') || p.name.toLowerCase().includes('banana') ? 'fruits' : 'vegetables'
      }));
      setProduce(mapped.filter((p: Produce) => p.isActive && p.quantity > 0));
    } catch (error) {
      toast.error('Failed to load produce');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedProduce = produce
    .filter(item => {
      const nameMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const descMatch = item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const coopMatch = item.farmer?.cooperative?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const distMatch = item.farmer?.cooperative?.district?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      
      const matchesSearch = nameMatch || descMatch || coopMatch || distMatch;
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'quantity-desc') return b.quantity - a.quantity;
      return 0; // newest/default
    });

  const isSearching = searchTerm !== '' || selectedCategory !== 'all';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--lime)]"></div>
      </div>
    );
  }

  return (
    <div className="marketplace-container">
      {/* Hero Section */}
      <section className="marketplace-hero">
        <div className="marketplace-hero-content">
          <div className="section-label">Buyer Portal</div>
          <h1 className="hero-title">Fresh <em>Harvest</em> Delivered</h1>
          <p className="hero-subtitle">Discover premium produce directly from local cooperatives</p>
          
          <div className="hero-search-container">
            <div className="search-wrapper">
              <Search className="search-icon" size={24} />
              <input
                type="text"
                placeholder="Search for produce, coop, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="hero-search-input"
              />
            </div>
          </div>

          <div className="hero-filter-pills">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`pill ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span>{cat.icon}</span> {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="marketplace-main">
        <div className="marketplace-toolbar">
          <h2 className="toolbar-title">
            {isSearching ? `Search Results (${filteredAndSortedProduce.length})` : 'Recent Listings'}
          </h2>
          
          <div className="sort-wrapper" style={{ position: 'relative' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-control"
              style={{ borderRadius: '100px', cursor: 'pointer', appearance: 'none', paddingRight: '48px', height: '44px', background: 'var(--surface)' }}
            >
              <option value="newest">Latest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="quantity-desc">Highest Stock First</option>
            </select>
            <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted)' }}>
              {sortBy.includes('asc') ? <SortAsc size={18} /> : <SortDesc size={18} />}
            </div>
          </div>
        </div>

        {/* Produce Grid */}
        <div className="listings-grid">
          {filteredAndSortedProduce.map((item) => (
            <ProductCard 
              key={item.id} 
              item={item} 
              onAddToCart={addItem} 
            />
          ))}
        </div>

        {isSearching && filteredAndSortedProduce.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon-wrap">
              <Search size={48} className="text-[var(--muted)]" />
            </div>
            <h3 className="empty-title">No results found</h3>
            <p className="empty-desc">
              We couldn't find any listings matching your current search. 
              Try a different keyword or browse all categories.
            </p>
            <button 
              className="btn-ghost"
              style={{ marginTop: '32px' }}
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSortBy('newest'); }}
            >
              Clear Search
            </button>
          </div>
        )}

        {!isSearching && produce.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon-wrap">
              <Leaf size={48} className="text-[var(--muted)]" />
            </div>
            <h3 className="empty-title">Marketplace is quiet</h3>
            <p className="empty-desc">
              New produce listings are added daily. Check back soon for fresh harvest from our cooperatives!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
