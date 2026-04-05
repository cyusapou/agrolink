import React, { useEffect, useState } from 'react';
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

  // Fallback data mapping to existing UI elements if backend is empty
  const defaultListings = [
    { id: 1, productName: 'Irish Potatoes', pricePerKg: 280, quantityKg: 500, cooperativeName: 'Musanze North Coop' },
    { id: 2, productName: 'Tomatoes', pricePerKg: 195, quantityKg: 150, cooperativeName: 'Huye South Coop' },
    { id: 3, productName: 'Arabica Coffee', pricePerKg: 1400, quantityKg: 300, cooperativeName: 'Cyato Coop' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Attempt to fetch from NestJS
        const res = await axios.get('http://localhost:3000/produce');
        // If empty, supply default visually matching data
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
      <div className="section-label" style={{ marginBottom: '8px' }}>Overview</div>
      <h2 className="section-title" style={{ fontSize: '32px', marginBottom: '32px' }}>Dashboard <em>Metrics</em></h2>

      <div className="trust-metrics" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '48px' }}>
        <div className="metric-card" style={{ padding: '24px' }}>
          <div className="metric-val" style={{ fontSize: '32px' }}>214</div>
          <div className="metric-desc">Total Cooperatives</div>
        </div>
        <div className="metric-card" style={{ padding: '24px' }}>
          <div className="metric-val" style={{ fontSize: '32px' }}>1.8<span>k</span></div>
          <div className="metric-desc">Active Farmers</div>
        </div>
        <div className="metric-card" style={{ padding: '24px' }}>
          <div className="metric-val" style={{ fontSize: '32px' }}>24<span>t</span></div>
          <div className="metric-desc">Produce Listed</div>
        </div>
        <div className="metric-card" style={{ padding: '24px' }}>
          <div className="metric-val" style={{ fontSize: '32px' }}>12.4<span>m</span></div>
          <div className="metric-desc">MoMo Processed (RWF)</div>
        </div>
      </div>

      <div style={{ background: 'var(--card)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '20px' }}>Recent Produce Listings</h3>
        </div>
        
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)' }}>Loading records...</div>
        ) : (
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
                  <td><span style={{ background: 'rgba(127,209,71,0.15)', color: 'var(--lime)', padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Active</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
