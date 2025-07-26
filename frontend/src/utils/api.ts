import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import Router from 'next/router';

// Create axios instance with proper error handling
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          toast.error('Access denied. You do not have permission to perform this action.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 422:
          // Validation errors
          if (data.errors) {
            Object.values(data.errors).forEach((error: any) => {
              toast.error(error[0]);
            });
          } else {
            toast.error(data.message || 'Validation error occurred.');
          }
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(data.message || 'An error occurred.');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  
  updateProfile: async (data: any) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
  
  changePassword: async (data: { current_password: string; new_password: string }) => {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// Vendor API
export const vendorAPI = {
  getSuppliers: async (params?: any) => {
    const response = await api.get('/vendor/suppliers', { params });
    return response.data;
  },
  
  getSupplierDetail: async (supplierId: number) => {
    const response = await api.get(`/vendor/suppliers/${supplierId}`);
    return response.data;
  },
  
  searchProducts: async (params?: any) => {
    const response = await api.get('/vendor/products', { params });
    return response.data;
  },
  
  placeOrder: async (data: any) => {
    const response = await api.post('/vendor/orders', data);
    return response.data;
  },
  
  getOrders: async (params?: any) => {
    const response = await api.get('/vendor/orders', { params });
    return response.data;
  },
  
  getOrderDetail: async (orderId: number) => {
    const response = await api.get(`/vendor/orders/${orderId}`);
    return response.data;
  },
  
  raiseDispute: async (data: any) => {
    const response = await api.post('/vendor/disputes', data);
    return response.data;
  },
  
  getDisputes: async (params?: any) => {
    const response = await api.get('/vendor/disputes', { params });
    return response.data;
  },
  
  submitReview: async (data: any) => {
    const response = await api.post('/vendor/reviews', data);
    return response.data;
  },
};

// Supplier API
export const supplierAPI = {
  getProducts: async (params?: any) => {
    const response = await api.get('/supplier/products', { params });
    return response.data;
  },
  
  addProduct: async (data: any) => {
    const response = await api.post('/supplier/products', data);
    return response.data;
  },
  
  updateProduct: async (productId: number, data: any) => {
    const response = await api.put(`/supplier/products/${productId}`, data);
    return response.data;
  },
  
  deleteProduct: async (productId: number) => {
    const response = await api.delete(`/supplier/products/${productId}`);
    return response.data;
  },
  
  getOrders: async (params?: any) => {
    const response = await api.get('/supplier/orders', { params });
    return response.data;
  },
  
  updateOrderStatus: async (orderId: number, data: any) => {
    const response = await api.put(`/supplier/orders/${orderId}`, data);
    return response.data;
  },
  
  getReviews: async (params?: any) => {
    const response = await api.get('/supplier/reviews', { params });
    return response.data;
  },
  
  respondToReview: async (reviewId: number, data: any) => {
    const response = await api.post(`/supplier/reviews/${reviewId}/respond`, data);
    return response.data;
  },
  
  getDisputes: async (params?: any) => {
    const response = await api.get('/supplier/disputes', { params });
    return response.data;
  },
  
  getAnalytics: async (params?: any) => {
    const response = await api.get('/supplier/analytics', { params });
    return response.data;
  },
};

// Common API
export const commonAPI = {
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  
  searchProducts: async (params?: any) => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  
  getProductDetail: async (productId: number) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },
  
  getSuppliers: async (params?: any) => {
    const response = await api.get('/suppliers', { params });
    return response.data;
  },
  
  getSupplierDetail: async (supplierId: number) => {
    const response = await api.get(`/suppliers/${supplierId}`);
    return response.data;
  },
  
  getPublicDisputes: async (params?: any) => {
    const response = await api.get('/disputes', { params });
    return response.data;
  },
  
  getNotifications: async (params?: any) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },
  
  markNotificationRead: async (notificationId: number) => {
    const response = await api.post(`/notifications/${notificationId}/read`);
    return response.data;
  },
  
  markAllNotificationsRead: async () => {
    const response = await api.post('/notifications/read-all');
    return response.data;
  },
  
  simulateNotification: async (data: any) => {
    const response = await api.post('/notify', data);
    return response.data;
  },
  
  globalSearch: async (params: { q: string }) => {
    const response = await api.get('/search', { params });
    return response.data;
  },
  
  getPlatformStats: async () => {
    const response = await api.get('/stats');
    return response.data;
  },
};

export default api;