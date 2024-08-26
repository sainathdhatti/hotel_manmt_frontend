import { create } from 'zustand';
import axios from 'axios';

interface Input {
  email: string;
  password: string;
}

interface AuthState {
  token: string;
  isAuthenticated: boolean;
  error: string | null;
  login: (data: Input, role: string) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: "",
  isAuthenticated: false,
  error: null,

  login: async (data, role) => {
    try {
      const response = await axios.post(`http://localhost:5000/${role}/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const accessToken = response.data.access_token;
      set({ token: accessToken, isAuthenticated: true, error: null });
      sessionStorage.setItem("token", accessToken);
    } catch (error: any) {
      console.error(error);
      set({ token: "", isAuthenticated: false, error: error.response?.data?.message || 'Login failed' });
      throw new Error(error.response?.data?.message || 'Login failed'); // Throw an error
    }
  },

  logout: () => {
    set({ token: "", isAuthenticated: false, error: null });
    sessionStorage.removeItem("token");
  },
}));

export default useAuthStore;
