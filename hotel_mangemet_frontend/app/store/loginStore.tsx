import { create } from 'zustand';
import axios from 'axios';

interface AuthState {
  token: string;
  isAuthenticated: boolean;
  error: string | null;
  userId: number | null;
  login: (data: any, role: string) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => {
  // Initialize state from session storage (client-side only)
  let token = '';
  let userId: number | null = null;

  if (typeof window !== 'undefined') {
    token = sessionStorage.getItem('token') || '';
    userId = Number(sessionStorage.getItem('userId')) || null;
  }

  return {
    token: token,
    isAuthenticated: !!token,
    error: null,
    userId: userId,

    login: async (data, role) => {
      try {
        const response = await axios.post(`http://localhost:5000/${role}/login`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const accessToken = response.data.access_token;
        const userId = response.data.userId;
        console.log(userId);

        set({ 
          token: accessToken, 
          isAuthenticated: true, 
          error: null,
          userId: userId 
        });

        if (typeof window !== 'undefined') {
          sessionStorage.setItem('token', accessToken);
          sessionStorage.setItem('userId', userId);
        }

        console.log(sessionStorage);
      } catch (error: any) {
        console.error(error);
        set({ 
          token: '', 
          isAuthenticated: false, 
          error: error.response?.data?.message || 'Login failed',
          userId: null 
        });
        throw new Error(error.response?.data?.message || 'Login failed');
      }
    },

    logout: () => {
      set({ 
        token: '', 
        isAuthenticated: false, 
        error: null, 
        userId: null 
      });
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
      }
    },
  };
});

export default useAuthStore;