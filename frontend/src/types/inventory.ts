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
