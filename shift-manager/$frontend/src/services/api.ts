import { supabase } from '../utils/supabase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Helper function to get the auth token
const getAuthToken = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
};

// Helper function to handle API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = await getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong with the API request');
  }

  return response.json();
};

// API service functions
export const api = {
  // Shifts
  getShifts: () => apiRequest('/shifts'),
  getShiftById: (id: string) => apiRequest(`/shifts/${id}`),
  createShift: (data: any) => apiRequest('/shifts', { method: 'POST', body: JSON.stringify(data) }),
  updateShift: (id: string, data: any) => apiRequest(`/shifts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteShift: (id: string) => apiRequest(`/shifts/${id}`, { method: 'DELETE' }),

  // Registrations
  registerForShift: (shiftId: string) => apiRequest('/registrations', { 
    method: 'POST', 
    body: JSON.stringify({ shift_id: shiftId }) 
  }),
  getMyRegistrations: () => apiRequest('/registrations/me'),
  cancelRegistration: (id: string) => apiRequest(`/registrations/${id}/cancel`, { method: 'PUT' }),
  updateRegistrationStatus: (id: string, status: string) => apiRequest(`/registrations/${id}/status`, { 
    method: 'PUT', 
    body: JSON.stringify({ status }) 
  }),

  // User
  getCurrentUser: () => apiRequest('/auth/me'),
  updateProfile: (data: any) => apiRequest('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
}; 