import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5020/api',
});

export const getMenu = () => api.get('/menu');
export const addMenuItem = (item) => api.post('/menu', item);
export const updateMenuItem = (id, item) => api.put(`/menu/${id}`, item);
export const deleteMenuItem = (id) => api.delete(`/menu/${id}`);

export const getOrders = () => api.get('/orders');
export const createOrder = (order) => api.post('/orders', order);

export const generateBill = (orderId) => api.post(`/bills/generate/${orderId}`);

export default api;
