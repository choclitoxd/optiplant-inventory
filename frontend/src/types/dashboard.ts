export interface DashboardMetrics {
  totalProducts: number;
  totalBranches: number;
  totalStockUnits: number;
  totalInventoryValue: number;
  totalMonthlySales: number;
  totalMonthlyPurchases: number;
}

export interface StockValueByBranch {
  branchId: number;
  branchName: string;
  totalItems: number;
  totalValue: number;
}

export interface TopSellingProduct {
  productId: number;
  productName: string;
  productSku: string;
  totalUnitsSold: number;
  totalRevenue: number;
}
