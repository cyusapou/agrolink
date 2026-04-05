import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Leaf, CreditCard, Settings, LogOut } from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('agrolink-token');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={18} /> },
    { name: 'Cooperatives', path: '/dashboard/cooperatives', icon: <Users size={18} /> },
    { name: 'Produce Listings', path: '/dashboard/produce', icon: <Leaf size={18} /> },
    { name: 'Payments', path: '/dashboard/payments', icon: <CreditCard size={18} /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <Link to="/" className="logo">Agro<span>Link</span></Link>
        <div className="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                {item.icon} {item.name}
              </Link>
            );
          })}
        </div>
        
        <div style={{ marginTop: 'auto' }}>
          <button 
            onClick={handleLogout}
            className="sidebar-link" 
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="topbar">
          <div style={{ fontSize: '18px', fontFamily: 'var(--serif)', fontWeight: 700 }}>
            Admin Portal
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>Super Admin</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--lime)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              SA
            </div>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
