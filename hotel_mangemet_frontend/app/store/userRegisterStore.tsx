import { create } from "zustand";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000"; // Adjust if necessary


export interface User {

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
  getUserById: (id: number) => Promise<void>;
  checkEmailExists: (email: string) => Promise<boolean>;

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
}

const useUserStore = create<UserStore>((set) => ({
  users: [],
  loading: false,
  registrationStatus: null,
  error: null,

  getAllUsers: async () => {
    set({ loading: true });
    try {
      // const token = sessionStorage.getItem("token");
      // if (!token) throw new Error("No token found");

      const response = await axios.get(`${API_URL}/users`, {

        // headers: { Authorization: `Bearer ${token}` },

      });
      set({ users: response.data, loading: false });
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error fetching users:", axiosError);
      set({ loading: false, error: "Failed to fetch users." });
    }
  },

  getUserById: async (id: number) => {
    set({ loading: true });
    try {

      const response = await axios.get(`${API_URL}/users/${id}`);
      set({ users: [response.data], loading: false });
      return response.data; // Ensure this line is included
    } catch (error) {
      console.error("Error fetching user:", error);
      set({ loading: false, error: "Failed to fetch user." });
      return null; // or handle error appropriately

      
    }
  },
  

  checkEmailExists: async (email: string): Promise<boolean> => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get(`${API_URL}/users/check-email`, {
        params: { email },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.exists; // Assuming the API returns { exists: boolean }
    } catch (error) {

      const axiosError = error as AxiosError;
      
      console.error("Error checking email:", error);

      return false; // Default to false if there's an error
    }
  },

  registerUser: async (userData) => {
    set({ loading: true, registrationStatus: null });
    try {
      await axios.post(`${API_URL}/users`, userData, {

        headers: { "Content-Type": "application/json" },
      });
      set({ registrationStatus: "User registered successfully", error: null });
      toast.success("User registered successfully");
    } catch (error: any) {
      console.error("Error registering user:", error);
      toast.error(error.response?.data?.message || "Error registering user");

      set({
        registrationStatus: `Error registering user: ${AxiosError}`,
        error: AxiosError.ERR_BAD_RESPONSE,
      });
    } finally {
      set({ loading: false });
    }
  },


  updateUser: async (id, userData) => {

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
          Authorization: `Bearer ${token}`,
        },
      });

      set({ registrationStatus: "User updated successfully", error: null });
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error updating user:", axiosError);
      set({
        error: `Error updating user: ${axiosError.message}`,
        registrationStatus: null,
      });
    } finally {
      set({ loading: false });
    }
  },

  deleteUser: async (userId: number) => {
    set({ loading: true });
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await axios.delete(`${API_URL}/users/${userId}`, {

        headers: { Authorization: `Bearer ${token}` },
      });
      set({ registrationStatus: "User deleted successfully", error: null });
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error deleting user:", axiosError);
      set({
        error: `Error deleting user: ${axiosError.message}`,
        registrationStatus: null,
      });
    } finally {
      set({ loading: false });
    }
  },

  forgetPassword: async (email) => {
    set({ loading: true });
    try {
      await axios.post(`${API_URL}/users/forgetpassword`, { email });
      set({ registrationStatus: "Password reset email sent", error: null });
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error sending password reset email:", axiosError);
      set({
        error: `Error sending password reset email: ${axiosError.message}`,
        registrationStatus: null,
      });
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async (token, newPassword) => {
    set({ loading: true });
    try {
      await axios.post(`${API_URL}/users/reset-password`, { token, newPassword });
      set({ registrationStatus: "Password reset successfully", error: null });
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error resetting password:", axiosError);
      set({
        error: `Error resetting password: ${axiosError.message}`,
        registrationStatus: null,
      });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useUserStore;
