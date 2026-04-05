import React, { useEffect, useState } from 'react';
import { Home, Users, Wheat, CreditCard } from 'lucide-react';
import axios from 'axios';

interface ProduceDef {
  id: number;
  productName: string;
  pricePerKg: number;
  quantityKg: number;
  cooperativeName: string;
}

const Dashboard: React.FC = () => {
  const [produce, setProduce] = useState<ProduceDef[]>([]);
  const [loading, setLoading] = useState(true);

  const defaultListings = [
    { id: 1, productName: 'Irish Potatoes', pricePerKg: 280, quantityKg: 500, cooperativeName: 'Musanze North Coop' },
    { id: 2, productName: 'Tomatoes', pricePerKg: 195, quantityKg: 150, cooperativeName: 'Huye South Coop' },
    { id: 3, productName: 'Arabica Coffee', pricePerKg: 1400, quantityKg: 300, cooperativeName: 'Cyato Coop' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3000/produce');
        setProduce(res.data.length > 0 ? res.data : defaultListings);
      } catch (e) {
        setProduce(defaultListings);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="section-label">Overview</div>
      <h2 className="section-title">Dashboard <em>Metrics</em></h2>

      <div className="stats-grid" style={{ animation: 'fadeUp 0.6s ease both' }}>
        <div className="stat-card">
          <div>
            <div className="stat-card-label">Cooperatives</div>
            <div className="stat-card-value">214</div>
          </div>
          <div className="stat-card-icon"><Home size={20} /></div>
        </div>
        
        <div className="stat-card">
          <div>
            <div className="stat-card-label">Active Farmers</div>
            <div className="stat-card-value">1,800</div>
          </div>
          <div className="stat-card-icon"><Users size={20} /></div>
        </div>
        
        <div className="stat-card">
          <div>
            <div className="stat-card-label">Produce Listed</div>
            <div className="stat-card-value">24 <sub>tons</sub></div>
          </div>
          <div className="stat-card-icon"><Wheat size={20} /></div>
        </div>
        
        <div className="stat-card">
          <div>
            <div className="stat-card-label">Total Volume</div>
            <div className="stat-card-value" style={{ fontSize: '20px' }}>12.4M <sub>RWF</sub></div>
          </div>
          <div className="stat-card-icon"><CreditCard size={20} /></div>
        </div>
      </div>

      <div className="form-container" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '20px', color: 'var(--cream)' }}>Recent Produce Listings</h3>
        </div>
        
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)' }}>Loading records...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Produce Type</th>
                  <th>Cooperative</th>
                  <th>Quantity</th>
                  <th>Asking Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {produce.map((item) => (
                  <tr key={item.id}>
                    <td>#{String(item.id).padStart(4, '0')}</td>
                    <td style={{ fontWeight: 600 }}>{item.productName}</td>
                    <td style={{ color: 'var(--muted)' }}>{item.cooperativeName}</td>
                    <td>{item.quantityKg} kg</td>
                    <td>{item.pricePerKg} RWF/kg</td>
                    <td><span className="status-badge active">Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
