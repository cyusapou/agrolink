import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Leaf, CreditCard, Settings, LogOut, ShoppingCart, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import CartDrawer from '../components/CartDrawer';

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { items, total, itemCount, isDrawerOpen, setIsDrawerOpen, updateQuantity, removeItem } = useCart();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout(navigate);
  };

  const getMenuItems = () => {
    if (user?.role === 'ADMIN') {
      return [
        { name: 'Dashboard', path: '/admin', icon: <Home size={18} /> },
        { name: 'Users', path: '/admin/users', icon: <Users size={18} /> },
        { name: 'Cooperatives', path: '/admin/cooperatives', icon: <Users size={18} /> },
        { name: 'Orders', path: '/admin/orders', icon: <CreditCard size={18} /> },
        { name: 'Produce', path: '/admin/produce', icon: <Leaf size={18} /> },
        { name: 'Settings', path: '/admin/settings', icon: <Settings size={18} /> },
      ];
    } else if (user?.role === 'COOP_MANAGER') {
      return [
        { name: 'Dashboard', path: '/coop', icon: <Home size={18} /> },
        { name: 'My Produce', path: '/coop/produce', icon: <Leaf size={18} /> },
        { name: 'Orders', path: '/coop/orders', icon: <CreditCard size={18} /> },
        { name: 'Farmers', path: '/coop/farmers', icon: <Users size={18} /> },
        { name: 'Settings', path: '/coop/settings', icon: <Settings size={18} /> },
      ];
    } else if (user?.role === 'BUYER') {
      return [
        { name: 'Marketplace', path: '/buyer', icon: <Leaf size={18} /> },
        { name: 'My Orders', path: '/buyer/orders', icon: <CreditCard size={18} /> },
        { name: 'Profile', path: '/buyer/profile', icon: <Settings size={18} /> },
      ];
    }

    return [
      { name: 'Dashboard', path: '/dashboard', icon: <Home size={18} /> },
      { name: 'Settings', path: '/dashboard/settings', icon: <Settings size={18} /> },
    ];
  };

  const getPortalTitle = () => {
    switch (user?.role) {
      case 'ADMIN': return 'Admin Portal';
      case 'COOP_MANAGER': return 'Cooperative Portal';
      case 'BUYER': return 'Buyer Portal';
      default: return 'Dashboard';
    }
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'ADMIN': return 'Super Admin';
      case 'COOP_MANAGER': return 'Cooperative Manager';
      case 'BUYER': return 'Buyer';
      default: return 'User';
    }
  };

  const getRoleInitial = () => {
    switch (user?.role) {
      case 'ADMIN': return 'SA';
      case 'COOP_MANAGER': return 'CM';
      case 'BUYER': return 'BY';
      default: return 'U';
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR OVERLAY */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* SIDEBAR */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="flex items-center justify-between w-full">
            <Link to="/" className="logo">Agro<span>Link</span></Link>
            <button 
              className="sidebar-close-btn"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="sidebar-content">
          <div className="sidebar-nav">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {item.icon} {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="sidebar-footer">
          <button 
            onClick={handleLogout}
            className="sidebar-footer-btn"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="topbar">
          <div className="flex items-center gap-4">
            <button 
              className="menu-toggle-btn"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="portal-title">
              {getPortalTitle()}
            </div>
          </div>
          <div className="flex items-center gap-6">
            {user?.role === 'BUYER' && (
              <button 
                className="cart-toggle-btn"
                onClick={() => setIsDrawerOpen(true)}
              >
                <ShoppingCart size={18} />
                <span className="cart-btn-text">Basket</span>
                {itemCount > 0 && (
                  <div className="cart-count-badge">
                    {itemCount}
                  </div>
                )}
              </button>
            )}
            
            <div className="user-profile-summary">
              <span className="role-label">
                {getRoleLabel()}
              </span>
              <div className="user-initials">
                {getRoleInitial()}
              </div>
            </div>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>

      {/* Global Cart Drawer */}
      <CartDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
        total={total}
      />
    </div>
  );
};

export default DashboardLayout;
