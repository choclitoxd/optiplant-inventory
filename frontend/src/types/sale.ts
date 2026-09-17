export interface SaleDetailRequest {
  productId: number;
  quantity: number;
  discountPercentage?: number;
}

export interface SaleRequest {
  branchId: number;
  details: SaleDetailRequest[];
}

export interface SaleDetailResponse {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  discountPercentage: number;
  subtotal: number;
}

export interface SaleResponse {
  id: number;
  branchId: number;
  branchName: string;
  saleDate: string;
  totalAmount: number;
  responsibleUser: string;
  details: SaleDetailResponse[];
}
