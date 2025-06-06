import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/Auth/login', credentials);
  return response.data;
};

export const getToken = () => localStorage.getItem('token');

export const setToken = (token) => localStorage.setItem('token', token);

export const clearToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};

export const getUserRole = () => {
  // First check localStorage
  const storedRole = localStorage.getItem('role');
  if (storedRole) return storedRole;

  // If not in localStorage, try to get from token
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Check for both standard and Microsoft-style role claims
    return payload.role || 
           payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 
           null;
  } catch (err) {
    console.error("Error decoding token", err);
    return null;
  }
};

// Helper function to decode and log token contents
export const debugToken = () => {
  const token = getToken();
  if (!token) {
    console.log('No token found');
    return null;
  }
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token payload:', payload);
    return payload;
  } catch (err) {
    console.error("Error decoding token", err);
    return null;
  }
};
