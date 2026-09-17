export interface TransferDetailRequest {
  productId: number;
  quantitySent: number;
}

export interface TransferSendRequest {
  originBranchId: number;
  destinationBranchId: number;
  estimatedArrival?: string;
  transporter?: string;
  routePriority?: string;
  details: TransferDetailRequest[];
}

export interface TransferReceiveDetail {
  detailId: number;
  quantityReceived: number;
}

export interface TransferReceiveRequest {
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
  estimatedArrival: string | null;
  receiveDate: string | null;
  transporter: string | null;
  routePriority: string | null;
  status: TransferStatus;
  responsibleUser: string;
  details: TransferDetailResponse[];
}
