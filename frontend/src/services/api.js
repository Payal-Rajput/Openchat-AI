import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enables cookies/session handling
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    // console.log('API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    // console.log('API Error:', error.config?.url, error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      // ❌ don't redirect here → it causes flickering
      // just reject, AuthContext + PrivateRoute will handle it
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  resendOTP: (email) => api.post('/auth/resend-otp', { email }),
  getMe: () => api.get('/auth/me'),
};

export const chatAPI = {
  getChatHistory: () => api.get('/chat/chat-history'),

  createChat: (data) => {
    // Send as JSON instead of FormData for text messages
    return api.post('/chat/create', data, {
      headers: { "Content-Type": "application/json" },
    });
  },
  deleteAllChats: () => api.delete('/chat/delete-all'),
  deleteChat: (id) => api.delete(`/chat/${id}`),
};


export default api;
