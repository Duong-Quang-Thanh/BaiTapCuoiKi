import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response error handling
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.data?.detail) {
      console.error('API Error:', error.response.data.detail);
    }
    return Promise.reject(error);
  }
);

export default API;