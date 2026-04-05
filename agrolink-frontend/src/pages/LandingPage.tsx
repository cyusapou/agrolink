import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <nav>
        <Link to="/" className="logo">Agro<span>Link</span></Link>
        <ul className="nav-links">
          <li><a href="#listings">Marketplace</a></li>
          <li><a href="#how">How it works</a></li>
          <li><a href="#trust">Why AgroLink</a></li>
        </ul>
        <Link to="/login" className="nav-cta">Login / Signup</Link>
      </nav>

      <section className="hero">
        <div className="hero-bg">
          <div className="hero-bg-circle c1"></div>
          <div className="hero-bg-circle c2"></div>
        </div>

        <div className="hero-tag">🌱 Live in 3 districts · Kigali, Musanze, Huye</div>

        <h1>Rwanda's Farm<br/>to <em>Table</em><br/>Marketplace</h1>

        <p className="hero-sub">
          Cooperative managers list produce. Hotels, restaurants, and schools buy directly.
          No middlemen. Fair prices. MTN MoMo payments.
        </p>

        <div className="hero-actions">
          <a href="#listings" className="btn-primary">Browse Produce</a>
          <a href="#how" className="btn-ghost">How it works &rarr;</a>
        </div>

        <div className="hero-stats">
          <div>
            <div className="stat-num">214<span>+</span></div>
            <div className="stat-label">Cooperatives</div>
          </div>
          <div>
            <div className="stat-num">1,800<span>+</span></div>
            <div className="stat-label">Farmers reached</div>
          </div>
          <div>
            <div className="stat-num">48<span>h</span></div>
            <div className="stat-label">Avg. order fulfillment</div>
          </div>
          <div>
            <div className="stat-num">34<span>%</span></div>
            <div className="stat-label">Better price for farmers</div>
          </div>
        </div>
      </section>

      <div className="marquee-wrap">
        <div className="marquee-track">
          <div className="marquee-item"><span className="dot"></span>Tomatoes · Musanze</div>
          <div className="marquee-item"><span className="dot"></span>Irish Potatoes · Ruhango</div>
          <div className="marquee-item"><span className="dot"></span>Maize · Nyanza</div>
          <div className="marquee-item"><span className="dot"></span>Avocado · Nyamasheke</div>
          <div className="marquee-item"><span className="dot"></span>Beans · Gatsibo</div>
          <div className="marquee-item"><span className="dot"></span>Coffee · Nyamagabe</div>
          <div className="marquee-item"><span className="dot"></span>Sorghum · Kayonza</div>
          <div className="marquee-item"><span className="dot"></span>Cassava · Kirehe</div>
          {/* Duplicate for infinite loop visual */}
          <div className="marquee-item"><span className="dot"></span>Tomatoes · Musanze</div>
          <div className="marquee-item"><span className="dot"></span>Irish Potatoes · Ruhango</div>
        </div>
      </div>

      <section className="section" id="listings">
        <div className="section-header">
          <div>
            <div className="section-label">Live Stock</div>
            <div className="section-title">Fresh <em>from</em><br/>the field</div>
          </div>
          <button className="view-all">View all listings</button>
        </div>

        <div className="listings-grid">
          <div className="listing-card featured">
            <span className="card-badge badge-bulk">Bulk available</span>
            <div className="card-district">Musanze District</div>
            <div className="card-produce">Irish Potatoes</div>
            <div className="card-coop">Musanze North Coop · <span>Verified ✓</span></div>
            <div style={{display:'flex', gap:'24px', margin:'20px 0', fontSize:'13px', color:'var(--muted)'}}>
              <span>🌿 Organically grown</span>
              <span>📦 500kg available</span>
              <span>🚚 Delivery in 24h</span>
            </div>
            <div className="card-details">
              <div>
                <div className="card-volume">Per kilogram</div>
                <div className="card-price">280 <sub>RWF/kg</sub></div>
              </div>
              <button className="card-order-btn">Place Order &rarr;</button>
            </div>
          </div>

          <div className="listing-card">
            <span className="card-badge badge-fresh">Just listed</span>
            <div className="card-district">Huye District</div>
            <div className="card-produce">Tomatoes</div>
            <div className="card-coop">Huye South Coop · <span>Verified ✓</span></div>
            <div className="card-details">
              <div>
                <div className="card-volume">Per kilogram</div>
                <div className="card-price">195 <sub>RWF/kg</sub></div>
              </div>
              <button className="card-order-btn">Order</button>
            </div>
          </div>
          
          <div className="listing-card">
            <span className="card-badge badge-exp">Export grade</span>
            <div className="card-district">Nyamasheke</div>
            <div className="card-produce">Arabica Coffee</div>
            <div className="card-coop">Cyato Coop · <span>Verified ✓</span></div>
            <div className="card-details">
              <div>
                <div className="card-volume">Per kilogram (raw)</div>
                <div className="card-price">1,400 <sub>RWF/kg</sub></div>
              </div>
              <button className="card-order-btn">Order</button>
            </div>
          </div>
        </div>
      </section>

      <section className="flow-section" id="how">
        <div className="section-label" style={{marginBottom:'12px'}}>Simple process</div>
        <div className="section-title">From field<br/><em>to your kitchen</em></div>

        <div className="flow-grid">
          <div className="flow-step">
            <div className="flow-num">01</div>
            <div className="flow-icon">🌾</div>
            <div className="flow-title">Coop lists produce</div>
            <div className="flow-desc">Cooperative managers list available stock — quantity, price, location — via the mobile PWA in Kinyarwanda.</div>
            <div className="flow-arrow">›</div>
          </div>
          <div className="flow-step">
            <div className="flow-num">02</div>
            <div className="flow-icon">🔍</div>
            <div className="flow-title">Buyer browses</div>
            <div className="flow-desc">Hotels, restaurants, schools filter produce by type, location, and quantity. Live market reference prices shown.</div>
            <div className="flow-arrow">›</div>
          </div>
          <div className="flow-step">
            <div className="flow-num">03</div>
            <div className="flow-icon">💳</div>
            <div className="flow-title">Pay via MoMo</div>
            <div className="flow-desc">Payment is held in escrow via MTN MoMo. The cooperative is notified via SMS instantly.</div>
            <div className="flow-arrow">›</div>
          </div>
          <div className="flow-step">
            <div className="flow-num">04</div>
            <div className="flow-icon">🚚</div>
            <div className="flow-title">Deliver & release</div>
            <div className="flow-desc">On delivery confirmation, escrow releases automatically to the cooperative. Both parties rate the transaction.</div>
          </div>
        </div>
      </section>

      <section className="trust-section" id="trust">
        <div>
          <div className="section-label">Why AgroLink</div>
          <blockquote className="trust-quote">
            "Before, we sold tomatoes at <strong>100 RWF/kg</strong> to intermediaries.
            Now our cooperative earns <strong>190 RWF/kg</strong> directly."
          </blockquote>
          <div className="trust-attribution">— Jean-Paul M., Musanze North Cooperative</div>
        </div>
        <div className="trust-metrics">
          <div className="metric-card">
            <div className="metric-val">34<span>%</span></div>
            <div className="metric-desc">Higher farmer income</div>
          </div>
          <div className="metric-card">
            <div className="metric-val">0<span>%</span></div>
            <div className="metric-desc">Middleman cut</div>
          </div>
          <div className="metric-card">
            <div className="metric-val">48<span>h</span></div>
            <div className="metric-desc">Order fulfillment</div>
          </div>
          <div className="metric-card">
            <div className="metric-val">3<span>%</span></div>
            <div className="metric-desc">Platform fee only</div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-label">Join AgroLink Rwanda</div>
        <h2 className="cta-title">Ready to cut<br/><em>the middleman?</em></h2>
        <p className="cta-sub">Whether you're a cooperative manager or a Kigali restaurant, AgroLink connects you to the freshest produce at fair prices.</p>
        <div className="cta-btns">
          <button onClick={() => navigate('/login')} className="btn-primary">Join as a Buyer</button>
          <button onClick={() => navigate('/login')} className="btn-ghost">Register Cooperative</button>
        </div>
      </section>

      <footer>
        <Link to="/" className="footer-logo">Agro<span>Link</span> Rwanda</Link>
        <div className="footer-copy">© 2025 DOCKS Corporation · Built in Kigali 🇷🇼</div>
      </footer>
    </>
  );
};

export default LandingPage;
