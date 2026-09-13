import axios from 'axios';
import { Product, Branch } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

export const ProductService = {
  getAll: () => api.get<Product[]>('/products').then(res => res.data),
  create: (data: Omit<Product, 'id'>) => api.post<Product>('/products', data).then(res => res.data),
};

export const BranchService = {
  getAll: () => api.get<Branch[]>('/branches').then(res => res.data),
};
