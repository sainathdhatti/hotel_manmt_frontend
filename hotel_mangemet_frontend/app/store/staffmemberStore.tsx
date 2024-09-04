import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export interface StaffMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  status: string;
  phoneNumber: string;
  gender: string;
  staffcategoryId: number; // Assuming the relationship to StaffCategory
}

interface StaffMemberStore {
  staffMembers: StaffMember[];
  fetchStaffMembers: () => Promise<void>;
  fetchStaffMemberById: (id: number) => Promise<StaffMember | undefined>;
  addStaffMember: (staffMemberData: StaffMember) => Promise<void>;
  updateStaffMember: (id: number, updateData: Partial<StaffMember>) => Promise<void>;
  deleteStaffMember: (id: number) => Promise<void>;
}

const useStaffMemberStore = create<StaffMemberStore>((set) => ({
  staffMembers: [],

  fetchStaffMembers: async () => {
    try {
      const response = await axios.get<StaffMember[]>(`${API_URL}/staff_members`);
      set({ staffMembers: response.data });
    } catch (error) {
      console.error('Error fetching staff members:', error);
    }
  },

  fetchStaffMemberById: async (id: number) => {
    try {
      const response = await axios.get<StaffMember>(`${API_URL}/staff_members/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching staff member by id:', error);
      return undefined;
    }
  },

  addStaffMember: async (staffMemberData) => {
    try {
      const response = await axios.post<StaffMember>(`${API_URL}/staff_members`, staffMemberData);
      set((state) => ({
        staffMembers: [...state.staffMembers, response.data],
      }));
    } catch (error) {
      console.error('Failed to create staff member:', error);
    }
  },

  updateStaffMember: async (id: number, updateData: Partial<StaffMember>) => {
    try {
      const response = await axios.patch<StaffMember>(`${API_URL}/staff_members/${id}`, updateData);
      set((state) => ({
        staffMembers: state.staffMembers.map((member) =>
          member.id === id ? response.data : member
        ),
      }));
    } catch (error) {
      console.error('Failed to update staff member:', error);
    }
  },

  deleteStaffMember: async (id: number) => {
    try {
      await axios.delete(`${API_URL}/staff_members/${id}`);
      set((state) => ({
        staffMembers: state.staffMembers.filter((member) => member.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete staff member:', error);
    }
  },
}));

export default useStaffMemberStore;
