import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
export const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor - Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          // Try to refresh the token
          const response = await axios.post('http://localhost:3000/auth/refresh', {
            refreshToken,
          });

          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Don't automatically redirect, let the user handle it
        toast.error('Session expired. Please login again.');
      }
    }

    return Promise.reject(error);
  }
);

// Handle authentication errors
const handleAuthError = () => {
  // Clear tokens
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  
  // Show error message
  toast.error('Session expired. Please login again.');
  
  // Redirect to login
  window.location.href = '/login';
};

// Export specific API methods for convenience
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
    
  register: (userData: any) =>
    api.post('/auth/register', userData),
    
  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
    
  logout: () =>
    api.post('/auth/logout'),
};

export const ordersAPI = {
  create: (orderData: any) =>
    api.post('/orders', orderData),
    
  getMyOrders: () =>
    api.get('/orders/my'),
    
  getCooperativeOrders: () =>
    api.get('/orders/cooperative'),
    
  getAllOrders: () =>
    api.get('/orders'),
    
  confirmOrder: (id: number, data: any) =>
    api.patch(`/orders/${id}/confirm`, data),
    
  dispatchOrder: (id: number, data: any) =>
    api.patch(`/orders/${id}/dispatch`, data),
    
  receiveOrder: (id: number) =>
    api.patch(`/orders/${id}/received`),
    
  cancelOrder: (id: number) =>
    api.patch(`/orders/${id}/cancel`),
};

export const produceAPI = {
  getAll: () =>
    api.get('/produce'),
    
  create: (data: any) =>
    api.post('/produce', data),
    
  update: (id: number, data: any) =>
    api.patch(`/produce/${id}`, data),
    
  delete: (id: number) =>
    api.delete(`/produce/${id}`),
    
  getTotalsByCooperative: () =>
    api.get('/produce/totals/cooperatives'),
};

export const cooperativesAPI = {
  getAll: () =>
    api.get('/cooperatives'),
    
  create: (data: any) =>
    api.post('/cooperatives', data),
    
  update: (id: number, data: any) =>
    api.patch(`/cooperatives/${id}`, data),
    
  delete: (id: number) =>
    api.delete(`/cooperatives/${id}`),
};

export const farmersAPI = {
  getAll: () =>
    api.get('/farmers'),
    
  create: (data: any) =>
    api.post('/farmers', data),
    
  update: (id: number, data: any) =>
    api.patch(`/farmers/${id}`, data),
    
  delete: (id: number) =>
    api.delete(`/farmers/${id}`),
};

export const usersAPI = {
  getAll: () =>
    api.get('/users'),
    
  getProfile: (id: number) =>
    api.get(`/users/profile/${id}`),
    
  update: (id: number, data: any) =>
    api.patch(`/users/${id}`, data),
    
  delete: (id: number) =>
    api.delete(`/users/${id}`),
};

export const paymentsAPI = {
  initiate: (data: any) =>
    api.post('/payments/initiate', data),
    
  getStatus: (externalId: string) =>
    api.get(`/payments/${externalId}`),
};

export default api;
