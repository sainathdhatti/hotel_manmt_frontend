import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000"; // Adjust if necessary

interface User {
  role: ReactNode;
  phone: ReactNode;
  name: ReactNode;
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
interface UserService {
  getUserById: (id: any) => Promise<void>;
  checkEmailExists: (email: string) => Promise<boolean>;
  // Add any additional methods or properties here
}

  registerUser: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    aadharCardNumber: string;
  }) => Promise<void>;
  updateUser: (
    id: number,
    userData: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phoneNumber?: string;
      aadharCardNumber?: string;
    }
  ) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
  forgetPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  fetchUserById: (id: number) => Promise<User | undefined>;
}

const useUserStore = create<UserStore>((set) => ({
  users: [],
  loading: false,
  registrationStatus: null,
  error: null,

  getAllUsers: async () => {
    set({ loading: true });
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      set({ users: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching users:", error);
      set({ loading: false, error: "Failed to fetch users." });
    }
  },
const userService = {
  getUserById: async (id: number) => {
    set({ loading: true });
    try {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get(`${API_URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ users: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching user:', error);
      set({ loading: false, error: 'Failed to fetch user.' });
    }
  },

  checkEmailExists: async (email: string): Promise<boolean> => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get(`${API_URL}/users/check-email`, {
        params: { email },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.exists; // Assuming the API returns { exists: boolean }
    } catch (error) {
      console.error('Error checking email:', error);
      return false; // Default to false if there's an error
    }
  },

  fetchUserById: async (id: number) => {
    console.log(id);
    set({ loading: true });
    try {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get(`${API_URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ users: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching user:', error);
      set({ loading: false, error: 'Failed to fetch user.' });
    }
  },
};

    try {
      // const token = sessionStorage.getItem('token');
      // if (!token) throw new Error('No token found');

      const response = await axios.get(`${API_URL}/users/${id}`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });
      return response.data; // Return the user data
    } catch (error: any) {
      console.error("Error fetching user by ID:", error);
      set({ error: `Error fetching user by ID: ${error.message}` });
      throw error; // Re-throw the error to be handled by the caller
    } finally {
      set({ loading: false });
    }
  },

  registerUser: async (userData) => {
    set({ loading: true, registrationStatus: null });
    try {
      await axios.post(`${API_URL}/users`, userData, {
        // headers: {
        //   'Content-Type': 'application/json',
        //   Authorization: `Bearer ${token}`,
        // },
      });
      set({ registrationStatus: "User registered successfully", error: null });
      toast.success("User registered successfully");
    } catch (error: any) {
      if (error.response) {
        console.error("Failed to delete booking:", error.response.data.message);
        toast.error(error.response.data.message);
      }
      console.error("Error registering user:", error);
      set({
        registrationStatus: `Error registering user: ${error.message}`,
        error: error.message,
      });
    } finally {
      set({ loading: false });
    }
  },
  updateUser: async (
    id,
    userData: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phoneNumber?: string;
      aadharCardNumber?: string;
    }
  ) => {
    set({ loading: true });
    try {
      if (!id || !userData) {
        throw new Error("User ID and data are required");
      }

      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await axios.put(`${API_URL}/users/${id}`, userData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      set({ registrationStatus: "User updated successfully", error: null });
    } catch (error: any) {
      console.error("Error updating user:", error);
      set({
        error: `Error updating user: ${error.message}`,
        registrationStatus: null,
      });
    } finally {
      set({ loading: false });
    }
  },

  deleteUser: async (userId) => {
    set({ loading: true });
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await axios.delete(`${API_URL}/users/${userId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      set({ registrationStatus: "User deleted successfully", error: null });
    } catch (error: any) {
      console.error("Error deleting user:", error);
      set({
        error: `Error deleting user: ${error.message}`,
        registrationStatus: null,
      });
    } finally {
      set({ loading: false });
    }
  },

  forgetPassword: async (email: string) => {
    set({ loading: true });
    try {
      await axios.post(`${API_URL}/users/forgetpassword`, { email });
      set({ registrationStatus: "Password reset email sent", error: null });
    } catch (error: any) {
      console.error("Error sending password reset email:", error);
      set({
        error: `Error sending password reset email: ${error.message}`,
        registrationStatus: null,
      });
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async (token: string, newPassword: string) => {
    set({ loading: true });
    try {
      await axios.post(`${API_URL}/users/reset-password`, {
        token,
        newPassword,
      });
      set({ registrationStatus: "Password reset successfully", error: null });
    } catch (error: any) {
      console.error("Error resetting password:", error);
      set({
        error: `Error resetting password: ${error.message}`,
        registrationStatus: null,
      });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useUserStore;
