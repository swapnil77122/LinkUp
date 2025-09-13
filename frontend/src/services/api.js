// frontend/src/services/api.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 5000
});

export const fetchContacts = () => api.get('/contacts').then(r => r.data);
export const createContact = (data) => api.post('/contacts', data).then(r => r.data);
export const fetchMessages = (contactId) => api.get(`/messages/${contactId}`).then(r => r.data);
export const postMessage = (contactId, message) => api.post(`/messages/${contactId}`, message).then(r => r.data);
