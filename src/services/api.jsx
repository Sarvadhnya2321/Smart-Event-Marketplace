import axios from 'axios';

// Create a configured Axios instance pointing to your Cloud Run URL
export const api = axios.create({
  baseURL: 'https://event-backend-473234681844.us-central1.run.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically intercept requests and attach the JWT token if it exists
api.interceptors.request.use(
  (config) => {
    // Grab the token we saved during login in AuthContext
    const token = localStorage.getItem('token');
    
    // If we have a token, attach it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
