import axios from 'axios';

// URL du backend (port 3001, même que dans `Serveur/server.js`)
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Intercepteur pour ajouter automatiquement le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
