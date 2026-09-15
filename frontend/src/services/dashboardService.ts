import api from './api';
import type { DashboardMetrics, StockValueByBranch, TopSellingProduct } from '../types/dashboard';

export const dashboardService = {
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    const response = await api.get<DashboardMetrics>('/dashboard/metrics');
    return response.data;
  },

  getInventoryValueByBranch: async (): Promise<StockValueByBranch[]> => {
    const response = await api.get<StockValueByBranch[]>('/dashboard/inventory-value');
    return response.data;
  },

  getTopSellingProducts: async (limit: number = 5): Promise<TopSellingProduct[]> => {
    const response = await api.get<TopSellingProduct[]>(`/dashboard/top-selling?limit=${limit}`);
    return response.data;
  }
};
