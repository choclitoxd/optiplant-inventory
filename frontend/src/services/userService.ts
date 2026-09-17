import api from './api';
import type { User } from '../types/user';

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  deactivateUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  updateUser: async (id: number, data: any): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },
  
  searchUsers: async (query: string): Promise<User[]> => {
    // Si el backend no tiene un endpoint de búsqueda específico,
    // podemos traer todos y filtrar localmente, o idealmente
    // llamar a un endpoint como /users/search?q=query
    try {
      const response = await api.get<User[]>('/users');
      const lowerQuery = query.toLowerCase();
      return response.data.filter(u => 
        u.username?.toLowerCase().includes(lowerQuery) || 
        u.fullName?.toLowerCase().includes(lowerQuery) ||
        u.id?.toString() === query.replace('#', '')
      );
    } catch (error) {
      console.error("Error searching users:", error);
      return [];
    }
  }
};
