import api from './api';
import type { AuthResponse, LoginCredentials, UserRegisterDTO } from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },
  
  register: async (data: UserRegisterDTO): Promise<string> => {
    const response = await api.post<string>('/auth/register', data);
    return response.data;
  }
};
