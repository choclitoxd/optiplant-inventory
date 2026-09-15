import api from './api';
import type { TransferSendRequest, TransferReceiveRequest, TransferResponse } from '../types/transfer';

export const transferService = {
  sendTransfer: async (data: TransferSendRequest): Promise<TransferResponse> => {
    const response = await api.post<TransferResponse>('/transfers/send', data);
    return response.data;
  },
  
  receiveTransfer: async (id: number, data: TransferReceiveRequest): Promise<TransferResponse> => {
    const response = await api.put<TransferResponse>(`/transfers/${id}/receive`, data);
    return response.data;
  },

  getTransfersByBranch: async (branchId: number): Promise<TransferResponse[]> => {
    const response = await api.get<TransferResponse[]>(`/transfers/branch/${branchId}`);
    return response.data;
  }
};
