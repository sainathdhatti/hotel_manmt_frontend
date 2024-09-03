import { create } from "zustand";
import axios from "axios";
import { StaffCategory } from "./staffCategoryStore"; // Ensure correct path

const baseUrl = "http://localhost:5000/staff_members";

interface StaffMember {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    staffcategory: StaffCategory 
    password: string;
    gender: string;
}

interface StaffMemberStore {
    staffMembers: StaffMember[];
    staffMember: StaffMember | null;
    error: string | null;
    getAllStaffMembers: () => Promise<void>;
    getStaffMemberById: (id: number) => Promise<void>;
    createStaffMember: (staffMember: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        staffcategory: number; // Assuming staffcategory is a number when sending to the API
        password: string;
        gender: string;
    }) => Promise<void>;
    updateStaffMember: (id: number, staffMemberUpdate: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        staffcategory?: number; // Adjust based on your needs
        password?: string;
        gender?: string;
    }) => Promise<void>;
    deleteStaffMember: (id: number) => Promise<void>;
}

const useStaffMemberStore = create<StaffMemberStore>((set) => ({
    staffMembers: [],
    staffMember: null,
    error: null,

    getAllStaffMembers: async () => {
        try {
            const response = await axios.get<StaffMember[]>(baseUrl);
            set({ staffMembers: response.data });
        } catch (error) {
            console.error("Error fetching staff members:", error);
            set({ error: "Error fetching staff members" });
        }
    },

    getStaffMemberById: async (id: number) => {
        try {
            if (isNaN(id)) {
                console.error('Invalid ID:', id);
                return;
            }
            const response = await axios.get<StaffMember>(`${baseUrl}/${id}`);
            set({ staffMember: response.data });
        } catch (error) {
            console.error("Error fetching staff member by ID:", error);
            set({ error: "Error fetching staff member" });
        }
    },

    createStaffMember: async (staffMember) => {
        try {
            const response = await axios.post<StaffMember>(baseUrl, staffMember);
            set((state) => ({
                staffMembers: [...state.staffMembers, response.data],
            }));
        } catch (error) {
            console.error("Error creating staff member:", error);
            set({ error: "Error creating staff member" });
        }
    },

    updateStaffMember: async (id: number, staffMemberUpdate) => {
        try {
            const response = await axios.patch<StaffMember>(`${baseUrl}/${id}`, staffMemberUpdate);
            set((state) => ({
                staffMembers: state.staffMembers.map((member) =>
                    member.id === id ? response.data : member
                ),
                staffMember: (state.staffMember?.id === id) ? response.data : state.staffMember
            }));
        } catch (error) {
            console.error("Error updating staff member:", error);
            set({ error: "Error updating staff member" });
        }
    },

    deleteStaffMember: async (id: number) => {
        try {
            await axios.delete(`${baseUrl}/${id}`);
            set((state) => ({
                staffMembers: state.staffMembers.filter((member) => member.id !== id),
                staffMember: (state.staffMember?.id === id) ? null : state.staffMember
            }));
        } catch (error) {
            console.error("Error deleting staff member:", error);
            set({ error: "Error deleting staff member" });
        }
    },
}));

export default useStaffMemberStore;
