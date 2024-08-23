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
}

const useUserStore = create<UserStore>((set) => ({
  users: [],
  loading: false,
  registrationStatus: null,

  getAllUsers: async () => {
    set({ loading: true });
    try {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ users: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching users:', error);
      set({ loading: false });
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
      set({ registrationStatus: 'User registered successfully' });
    } catch (error:any) {
      console.error('Error registering user:', error);
      set({ registrationStatus: `Error registering user: ${error.message}` });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useUserStore;
