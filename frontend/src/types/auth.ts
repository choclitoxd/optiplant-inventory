import type { RoleType, User } from './user';
export { Role } from './user';
export type { RoleType, User };

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  fullName: string;
  roles: RoleType[];
  branchId: number | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface UserRegisterDTO {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: string;
  branchId: number | null;
}

export interface UserUpdateDTO {
  username: string;
  email: string;
  fullName: string;
  role: string;
  branchId: number | null;
}
