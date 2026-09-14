export interface Supplier {
  id: number;
  taxId: string;
  companyName: string;
  contactName: string;
  phone: string;
}

export type SupplierRequest = Omit<Supplier, 'id'>;
