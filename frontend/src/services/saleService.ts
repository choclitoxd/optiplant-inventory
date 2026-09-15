import api from './api';
import type { SaleRequest, SaleResponse } from '../types/sale';

export const saleService = {
  processSale: async (data: SaleRequest): Promise<SaleResponse> => {
    const response = await api.post<SaleResponse>('/sales', data);
    return response.data;
  },
  
  getSalesByBranch: async (branchId: number): Promise<SaleResponse[]> => {
    const response = await api.get<SaleResponse[]>(`/sales/branch/${branchId}`);
    return response.data;
  }
};
