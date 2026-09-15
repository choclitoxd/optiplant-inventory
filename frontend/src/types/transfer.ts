export interface TransferDetailRequest {
  productId: number;
  quantitySent: number;
}

export interface TransferSendRequest {
  originBranchId: number;
  destinationBranchId: number;
  responsibleUser: string;
  details: TransferDetailRequest[];
}

export interface TransferReceiveDetail {
  detailId: number;
  quantityReceived: number;
}

export interface TransferReceiveRequest {
  responsibleUser: string;
  details: TransferReceiveDetail[];
}

export interface TransferDetailResponse {
  id: number;
  productId: number;
  productName: string;
  quantitySent: number;
  quantityReceived: number | null;
}

export type TransferStatus = 'IN_TRANSIT' | 'COMPLETED' | 'PARTIAL' | 'CANCELLED';

export interface TransferResponse {
  id: number;
  originBranchId: number;
  originBranchName: string;
  destinationBranchId: number;
  destinationBranchName: string;
  sendDate: string;
  receiveDate: string | null;
  status: TransferStatus;
  responsibleUser: string;
  details: TransferDetailResponse[];
}
