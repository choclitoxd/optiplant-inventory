import api from './api';
import type { Product, ProductRequest } from '../types';

export const productService = {
  getAll: () => api.get<Product[]>('/products').then(r => r.data),
  create: (data: ProductRequest) => api.post<Product>('/products', data).then(r => r.data),
  update: (id: number, data: ProductRequest) => api.put<Product>(`/products/${id}`, data).then(r => r.data),
};
