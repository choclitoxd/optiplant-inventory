import api from './api';
import type { StockAlert } from '../types/stockAlert';

export const alertService = {
  getLowStockAlerts: async (): Promise<StockAlert[]> => {
    const response = await api.get<StockAlert[]>('/alerts/low-stock');
    return response.data;
  },

  getLowStockAlertsByBranch: async (branchId: number): Promise<StockAlert[]> => {
    const response = await api.get<StockAlert[]>(`/alerts/branch/${branchId}/low-stock`);
    return response.data;
  },

  sendEmailReport: async (recipientEmail?: string): Promise<string> => {
    // Si el backend es modificado para aceptar un email, se enviaría en el body o query.
    // Actualmente el backend usa el email del admin por defecto configurado.
    const url = recipientEmail ? `/alerts/send-email-report?email=${encodeURIComponent(recipientEmail)}` : '/alerts/send-email-report';
    const response = await api.post<string>(url);
    return response.data;
  }
};
