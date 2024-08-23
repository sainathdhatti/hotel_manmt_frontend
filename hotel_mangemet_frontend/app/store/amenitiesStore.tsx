import { create } from "zustand";

export interface AmenitiesStoreState {
  amenities: Amenity[];
  amenity: Amenity;
  getAllAmenities: () => Promise<void>;
  deleteAmenity: (id: number) => Promise<void>;
  updateAmenity: (data: { id: number; name: string }) => Promise<void>;
  addAmenity: (data: { name: string }) => Promise<void>;
  getAmenity: (id: any) => Promise<void>;
}

interface Amenity {
  id: number;
  name: string;
}

const baseUrl = "http://localhost:5000";

const useAmenitiesStore = create<AmenitiesStoreState>((set) => ({
  amenities: [],
  amenity: { id: 0, name: "" },
  getAllAmenities: async () => {
    const response = await fetch(`${baseUrl}/amenities`);
    const data = await response.json();
    console.log(data)
    set(() => ({ amenities: data }));
  },
  deleteAmenity: async (id: number) => {
    const response = await fetch(`${baseUrl}/amenities/${id}`, {
      method: "DELETE",
      headers: { authorization: sessionStorage.token || "" },
    });
    if (response.ok) {
      set((state) => ({
        amenities: state.amenities.filter((a) => a.id !== id),
      }));
    }
  },
  getAmenity: async (id: string) => {
    const response = await fetch(`${baseUrl}/amenities/${id}`);
    const data = await response.json();
    set(() => ({ amenity: data }));
  },
  addAmenity: async (data: { name: string }) => {
    const response = await fetch(`${baseUrl}/amenities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: sessionStorage.token || "",
      },
      body: JSON.stringify(data),
    });
    const newAmenity = await response.json();
    set((state) => ({ amenities: [...state.amenities, newAmenity] }));
  },
  updateAmenity: async (data: { id: number; name: string }) => {
    const response = await fetch(`${baseUrl}/amenities/${data.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: sessionStorage.token || "",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const updatedAmenity = await response.json();
      set((state) => ({
        amenities: state.amenities.map((a) => (a.id === data.id ? updatedAmenity : a)),
      }));
    }
  },
}));

export default useAmenitiesStore;
