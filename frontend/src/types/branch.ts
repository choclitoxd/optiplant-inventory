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
