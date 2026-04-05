import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import { ProtectedRoute } from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/buyer/Marketplace';
import OrderHistory from './pages/buyer/OrderHistory';
import CoopDashboard from './pages/coop/CoopDashboard';
import ProduceManagement from './pages/coop/ProduceManagement';
import FarmersManagement from './pages/coop/FarmersManagement';
import OrdersManagement from './pages/coop/OrdersManagement';
import Profile from './pages/buyer/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--surface)',
                color: 'var(--cream)',
                border: '1px solid var(--border)',
              },
              success: {
                iconTheme: {
                  primary: 'var(--lime)',
                  secondary: 'var(--surface)',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ff4d4f',
                  secondary: 'var(--surface)',
                },
              },
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
            </Route>

            {/* Buyer Portal */}
            <Route path="/buyer" element={<ProtectedRoute requiredRole="BUYER"><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<Marketplace />} />
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="orders" element={<OrderHistory />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Cooperative Portal */}
            <Route path="/coop" element={<ProtectedRoute requiredRole="COOP_MANAGER"><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<CoopDashboard />} />
              <Route path="produce" element={<ProduceManagement />} />
              <Route path="orders" element={<OrdersManagement />} />
              <Route path="farmers" element={<FarmersManagement />} />
            </Route>

            {/* Admin Portal */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminDashboard />} />
              <Route path="cooperatives" element={<AdminDashboard />} />
              <Route path="orders" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
