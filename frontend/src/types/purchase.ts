export interface PurchaseDetailRequest {
  productId: number;
  quantity: number;
  unitCost: number;
}

export interface PurchaseRequest {
  branchId: number;
  supplierId: number;
  responsibleUser: string;
  details: PurchaseDetailRequest[];
}

export interface PurchaseDetailResponse {
  productId: number;
  productSku: string;
  productName: string;
  quantity: number;
  unitCost: number;
}

export interface PurchaseResponse {
  id: number;
  supplierId: number;
  supplierName: string;
  branchId: number;
  purchaseDate: string;
  totalAmount: number;
  responsibleUser: string;
  details: PurchaseDetailResponse[];
}
