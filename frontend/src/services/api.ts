import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication services
export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

// Inventory services
export const inventoryService = {
  getAllProducts: async () => {
    const response = await api.get('/inventory/');
    return response.data;
  },
  getProduct: async (productId: string) => {
    const response = await api.get(`/inventory/${productId}`);
    return response.data;
  },
  addProduct: async (productData: any) => {
    const response = await api.post('/inventory/', productData);
    return response.data;
  },
  updateProduct: async (productId: string, productData: any) => {
    const response = await api.put(`/inventory/${productId}`, productData);
    return response.data;
  },
  deleteProduct: async (productId: string) => {
    const response = await api.delete(`/inventory/${productId}`);
    return response.data;
  },
  recordTransaction: async (transactionData: any) => {
    const response = await api.post('/inventory/transaction', transactionData);
    return response.data;
  },
};

// Prediction services
export const predictionService = {
  getDemandForecast: async (productId: string, days: number = 30) => {
    const response = await api.get(`/predictions/forecast/${productId}?days=${days}`);
    return response.data;
  },
  getRestockRecommendation: async (productId: string, isTrending: boolean = false) => {
    const response = await api.get(`/predictions/restock/${productId}?trending=${isTrending}`);
    return response.data;
  },
  getLLMInsights: async (query: string, productId?: string) => {
    const payload = productId ? { query, product_id: productId } : { query };
    const response = await api.post('/predictions/insights', payload);
    return response.data;
  },
};

export default api;