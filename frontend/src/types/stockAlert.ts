export interface StockAlert {
  inventoryId: number;
  branchName: string;
  productName: string;
  productSku: string;
  currentStock: number;
  minStockThreshold: number;
  suggestedReorderQuantity: number;
  severity: 'CRITICAL' | 'WARNING';
}
