import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Adjust if necessary

interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  aadharCardNumber: string;
}

interface UserStore {
  users: User[];
  loading: boolean;
  registrationStatus: string | null;
  error: string | null;
  getAllUsers: () => Promise<void>;
  checkEmailExists: (email: string) => Promise<boolean>;
  registerUser: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    aadharCardNumber: string;
  }) => Promise<void>;
  updateUser: (id: number, userData: Partial<User>) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
  forgetPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const useUserStore = create<UserStore>((set) => ({
  users: [],
  loading: false,
  registrationStatus: null,
  error: null,

  getAllUsers: async () => {
    set({ loading: true });
    try {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      set({ users: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching users:', error);
      set({ loading: false, error: 'Failed to fetch users.' });
    }
  },

  checkEmailExists: async (email: string): Promise<boolean> => {
    try {
      const response = await axios.get(`${API_URL}/users`, {
        params: { email },
      });
      return response.data.exists;
    } catch (error) {
      console.error('Error checking email existence:', error);
      set({ error: 'Error checking email existence.' });
      return false;
    }
  },

  registerUser: async (userData) => {
    set({ loading: true, registrationStatus: null });
    try {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('No token found');

      // Check if email already exists
      const emailExists = await useUserStore.getState().checkEmailExists(userData.email);
      if (emailExists) {
        throw new Error('Email already exists.');
      }

      await axios.post(`${API_URL}/users`, userData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      set({ registrationStatus: 'User registered successfully', error: null });
    } catch (error:any) {
      console.error('Error registering user:', error);
      set({ registrationStatus: `Error registering user: ${error.message}`, error: null });
    } finally {
      set({ loading: false });
    }
  },

  updateUser: async (id, userData) => {
    set({ loading: true });
    try {
      if (!id || !userData) {
        throw new Error('User ID and data are required');
      }

      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('No token found');

      await axios.put(`${API_URL}/users/${id}`, userData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      });

      set({ registrationStatus: 'User updated successfully', error: null });
    } catch (error:any) {
      console.error('Error updating user:', error);
      set({ error: `Error updating user: ${error.message}`, registrationStatus: null });
    } finally {
      set({ loading: false });
    }
  },

  deleteUser: async (userId) => {
    set({ loading: true });
    try {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('No token found');

      await axios.delete(`${API_URL}/users/${userId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      set({ registrationStatus: 'User deleted successfully', error: null });
    } catch (error:any) {
      console.error('Error deleting user:', error);
      set({ error: `Error deleting user: ${error.message}`, registrationStatus: null });
    } finally {
      set({ loading: false });
    }
  },

  forgetPassword: async (email: string) => {
    set({ loading: true });
    try {
      await axios.post(`${API_URL}/users/forgetpassword`, { email });
      set({ registrationStatus: 'Password reset email sent', error: null });
    } catch (error:any) {
      console.error('Error sending password reset email:', error);
      set({ error: `Error sending password reset email: ${error.message}`, registrationStatus: null });
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async (token: string, newPassword: string) => {
    set({ loading: true });
    try {
      await axios.post(`${API_URL}/users/reset-password`, { token, newPassword });
      set({ registrationStatus: 'Password reset successfully', error: null });
    } catch (error:any) {
      console.error('Error resetting password:', error);
      set({ error: `Error resetting password: ${error.message}`, registrationStatus: null });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useUserStore;
