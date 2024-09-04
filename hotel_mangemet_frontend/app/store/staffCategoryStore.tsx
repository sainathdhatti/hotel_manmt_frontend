import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/staff_category'; // Adjust to your actual API endpoint

export interface StaffCategory {
  id: number;
  category: string;
}

export interface StaffCategoryStoreState {
  staffCategories: StaffCategory[];
  currentCategory: StaffCategory | null;
  fetchStaffCategories: () => Promise<void>;
  fetchStaffCategoryById: (id: number) => Promise<StaffCategory | undefined>;
  addStaffCategory: (categoryData: { category: string }) => Promise<void>;
  updateStaffCategory: (id: number, categoryData: { category: string }) => Promise<void>;
  deleteStaffCategory: (id: number) => Promise<void>;
}

const useStaffCategoryStore = create<StaffCategoryStoreState>((set) => ({
    staffCategories: [],
    currentCategory: null,

    fetchStaffCategories: async () => {
        try {
            const response = await axios.get<StaffCategory[]>(API_URL);
            set({ staffCategories: response.data });
        } catch (error) {
            console.error('Error fetching staff categories:', error);
        }
    },
  fetchStaffCategoryById: async (id: number) => {
    try {
      const response = await axios.get<StaffCategory>(`${API_URL}/${id}`);
      set({ currentCategory: response.data });
      return response.data;
    } catch (error) {
      console.error('Error fetching staff category by id:', error);
      return undefined;
    }
  },

  // Add a new staff category
  addStaffCategory: async (categoryData) => {
    try {
      const response = await axios.post<StaffCategory>(API_URL, categoryData);
      set((state) => ({
        staffCategories: [...state.staffCategories, response.data],
      }));
    } catch (error) {
      console.error('Failed to create staff category:', error);
    }
  },

  // Update an existing staff category
  updateStaffCategory: async (id, categoryData) => {
    try {
      const response = await axios.patch<StaffCategory>(`${API_URL}/${id}`, categoryData);
      set((state) => ({
        staffCategories: state.staffCategories.map((c) =>
          c.id === id ? response.data : c
        ),
        currentCategory: state.currentCategory?.id === id ? response.data : state.currentCategory,
      }));
    } catch (error) {
      console.error('Failed to update staff category:', error);
    }
  },

  // Delete a staff category by ID
  deleteStaffCategory: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      set((state) => ({
        staffCategories: state.staffCategories.filter((c) => c.id !== id),
        currentCategory: state.currentCategory?.id === id ? null : state.currentCategory,
      }));
    } catch (error) {
      console.error('Failed to delete staff category:', error);
    }
  },
}));

export default useStaffCategoryStore;
