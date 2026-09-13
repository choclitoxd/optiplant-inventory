export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string;
  basePrice: number;
}

export interface Branch {
  id: number;
  name: string;
  address?: string;
}

export interface Inventory {
  branchId: number;
  productId: number;
  stock: number;
  minStockThreshold: number;
}
