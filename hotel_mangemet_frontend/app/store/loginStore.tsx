import { create } from 'zustand';
import axios from 'axios';

interface AuthState {
  token: string;
  isAuthenticated: boolean;
  error: string | null;
  userId: number | null;
  userName: string | null;
  login: (data: any, role: string) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => {
  let token = '';
  let userId: number | null = null;
  let userName: string | null = null;

  if (typeof window !== 'undefined') {
    token = sessionStorage.getItem('token') || '';
    userId = Number(sessionStorage.getItem('userId')) || null;
    userName = sessionStorage.getItem('userName') || null;
  }

  return {
    token,
    isAuthenticated: !!token,
    error: null,
    userId,
    userName,

    login: async (data, role) => {
      try {
        const response = await axios.post(`http://localhost:5000/${role}/login`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const accessToken = response.data.access_token;
        const userId = response.data.userId;
        const userName = response.data.userName;

        set({ 
          token: accessToken, 
          isAuthenticated: true, 
          error: null,
          userId, 
          userName
        });

        if (typeof window !== 'undefined') {
          sessionStorage.setItem('token', accessToken);
          sessionStorage.setItem('userId', String(userId));
          sessionStorage.setItem('userName', userName);
        }
        console.log(userId, userName);
      } catch (error: any) {
        console.error(error);
        set({ 
          token: '', 
          isAuthenticated: false, 
          error: error.response?.data?.message || 'Login failed',
          userId: null,
          userName: null
        });
        throw new Error(error.response?.data?.message || 'Login failed');
      }
    },

    logout: () => {
      set({ 
        token: '', 
        isAuthenticated: false, 
        error: null, 
        userId: null, 
        userName: null
      });
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('userName');
      }
    },
  };
});

export default useAuthStore;
