export const Role = {
  ADMIN: 'ROLE_ADMIN',
  BRANCH_MANAGER: 'ROLE_BRANCH_MANAGER',
  OPERATOR: 'ROLE_OPERATOR',
} as const;

export type RoleType = typeof Role[keyof typeof Role];

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  roles: RoleType[];
  branchId: number | null;
  branch?: {
    id: number;
    name: string;
    address?: string;
  } | null;
  active?: boolean;
}
