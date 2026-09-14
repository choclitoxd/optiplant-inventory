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
