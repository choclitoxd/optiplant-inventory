export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  unitOfMeasure: string;
  basePrice: number;
  weightedAverageCost: number;
}

export interface ProductRequest {
  sku: string;
  name: string;
  description: string;
  unitOfMeasure: string;
  basePrice: number;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  active: boolean;
}

export interface BranchRequest {
  name: string;
  address: string;
  active: boolean;
}

export interface Inventory {
  id: number;
  branchId: number;
  productId: number;
  stock: number;
  minStockThreshold: number;
  version: number;
}

export interface InventoryRequest {
  branchId: number;
  productId: number;
  stock: number;
  minStockThreshold: number;
}
