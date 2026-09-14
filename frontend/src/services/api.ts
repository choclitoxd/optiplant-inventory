import axios from 'axios';
import { Product, ProductRequest, Branch, BranchRequest, Inventory, InventoryRequest } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data?.error || error.message);
    return Promise.reject(error);
  }
);

export const ProductService = {
  getAll: () => api.get<Product[]>('/products').then(r => r.data),
  create: (data: ProductRequest) => api.post<Product>('/products', data).then(r => r.data),
  update: (id: number, data: ProductRequest) => api.put<Product>(`/products/${id}`, data).then(r => r.data),
};

export const BranchService = {
  getAll: () => api.get<Branch[]>('/branches').then(r => r.data),
  create: (data: BranchRequest) => api.post<Branch>('/branches', data).then(r => r.data),
  update: (id: number, data: BranchRequest) => api.put<Branch>(`/branches/${id}`, data).then(r => r.data),
};

export const InventoryService = {
  getByBranch: (branchId: number) => api.get<Inventory[]>(`/inventories/branch/${branchId}`).then(r => r.data),
  setupOrUpdate: (data: InventoryRequest) => api.post<Inventory>('/inventories', data).then(r => r.data),
};
