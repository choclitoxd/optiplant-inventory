import api from './api';
import type { Branch, BranchRequest, Inventory, InventoryRequest } from '../types';

export const branchService = {
  getAll: () => api.get<Branch[]>('/branches').then(r => r.data),
  create: (data: BranchRequest) => api.post<Branch>('/branches', data).then(r => r.data),
  update: (id: number, data: BranchRequest) => api.put<Branch>(`/branches/${id}`, data).then(r => r.data),
};

export const inventoryService = {
  getByBranch: (branchId: number) => api.get<Inventory[]>(`/inventories/branch/${branchId}`).then(r => r.data),
  setupOrUpdate: (data: InventoryRequest) => api.post<Inventory>('/inventories', data).then(r => r.data),
};
