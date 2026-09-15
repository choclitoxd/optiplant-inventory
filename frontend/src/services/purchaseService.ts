import api from './api';
import type { Supplier } from '../types/supplier';
import type { PurchaseRequest, PurchaseResponse } from '../types/purchase';

export const purchaseService = {
  getSuppliers: async (): Promise<Supplier[]> => {
    const { data } = await api.get('/suppliers');
    return data;
  },
  createSupplier: async (supplier: Supplier): Promise<Supplier> => {
    const { data } = await api.post('/suppliers', supplier);
    return data;
  },
  getPurchases: async (): Promise<PurchaseResponse[]> => {
    const { data } = await api.get('/purchases');
    return data;
  },
  registerPurchase: async (purchase: PurchaseRequest): Promise<PurchaseResponse> => {
    const { data } = await api.post('/purchases', purchase);
    return data;
  }
};
