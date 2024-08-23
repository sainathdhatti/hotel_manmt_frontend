import { create } from "zustand";

export interface RoomCategoryStoreState {
  roomCategories: RoomCategory[];
  roomCategory: RoomCategory;
  getAllRoomCategories: () => Promise<void>;
  deleteRoomCategory: (id: number) => Promise<void>;
  updateRoomCategory: (data: { id: number; name: string; description?: string; price?: number; imageUrl?: string }) => Promise<void>;
  addRoomCategory: (data: { name: string; description?: string; price?: number; imageUrl?: string }) => Promise<void>;
  getRoomCategory: (id: number) => Promise<void>;
}

interface RoomCategory {
  id: number;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  amenities?: { id: number; name: string }[]; 
  noOfChildren?: number;
  noOfAdults?: number;
}


const baseUrl = "http://localhost:5000";

const useRoomCategoryStore = create<RoomCategoryStoreState>((set) => ({
  roomCategories: [],
  roomCategory: { id: 0, name: "" },
  getAllRoomCategories: async () => {
    try {
      const response = await fetch(`${baseUrl}/room-categories`);
      const data = await response.json();
      console.log("Fetched Room Categories:", data); // Add this line to verify the fetched data
      set(() => ({ roomCategories: data }));
    } catch (error) {
      console.error("Failed to fetch room categories:", error);
    }
  },
  deleteRoomCategory: async (id: number) => {
    try {
      const response = await fetch(`${baseUrl}/room-categories/${id}`, {
        method: "DELETE",
        headers: { authorization: sessionStorage.token || "" },
      });
      if (response.ok) {
        set((state) => ({
          roomCategories: state.roomCategories.filter((rc) => rc.id !== id),
        }));
      }
    } catch (error) {
      console.error("Failed to delete room category:", error);
    }
  },
  getRoomCategory: async (id: number) => {
    try {
      const response = await fetch(`${baseUrl}/room-categories/${id}`);
      const data = await response.json();
      set(() => ({ roomCategory: data }));
    } catch (error) {
      console.error("Failed to fetch room category:", error);
    }
  },
  addRoomCategory: async (data: { name: string; description?: string; price?: number; imageUrl?: string }) => {
    try {
      const response = await fetch(`${baseUrl}/room-categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: sessionStorage.token || "",
        },
        body: JSON.stringify(data),
      });
      const newRoomCategory = await response.json();
      set((state) => ({ roomCategories: [...state.roomCategories, newRoomCategory] }));
    } catch (error) {
      console.error("Failed to add room category:", error);
    }
  },
  updateRoomCategory: async (data: { id: number; name: string; description?: string; price?: number; imageUrl?: string }) => {
    try {
      const response = await fetch(`${baseUrl}/room-categories/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: sessionStorage.token || "",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const updatedRoomCategory = await response.json();
        set((state) => ({
          roomCategories: state.roomCategories.map((rc) =>
            rc.id === data.id ? updatedRoomCategory : rc
          ),
        }));
      }
    } catch (error) {
      console.error("Failed to update room category:", error);
    }
  },
}));

export default useRoomCategoryStore;
