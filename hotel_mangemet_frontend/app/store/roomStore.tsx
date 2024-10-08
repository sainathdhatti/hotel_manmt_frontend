import { ReactNode } from 'react';
import { create } from 'zustand';

const baseUrl = "http://localhost:5000";

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

export interface Rooms {
    id: number;
    roomNumber: number;
    roomCategory: RoomCategory;
    status: string;
}

interface RoomStoreState {
    rooms: Rooms[];
    room: Rooms;
    getAllRooms: () => Promise<void>;
    deleteRoom: (id: number) => Promise<void>;
    updateRoom: (data: { id: number; roomNumber: number; roomCategoryId: number }) => Promise<void>;
    addRoom: (data: { roomNumber: number; roomCategoryId: number }) => Promise<void>;
    getRoom: (id: number) => Promise<void>;
}

const useRoomStore = create<RoomStoreState>((set) => ({
    rooms: [],
    room: { id: 0, roomNumber: 0, roomCategory: { id: 0, name: "" }, status: "" },
    getAllRooms: async () => {
        const response = await fetch(`${baseUrl}/rooms`);
        const data = await response.json();
        set({ rooms: data });
    },
    deleteRoom: async (id: number) => {
        const response = await fetch(`${baseUrl}/rooms/${id}`, {
            method: "DELETE",
            // headers: { authorization: sessionStorage.token || "" },
        });
        if (response.ok) {
            set((state) => ({
                rooms: state.rooms.filter((room) => room.id !== id),
            }));
        }
    },
    updateRoom: async (data: { id: number; roomNumber: number; roomCategoryId: number }) => {
        const response = await fetch(`${baseUrl}/rooms/${data.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                // authorization: sessionStorage.token || "",
            },
            body: JSON.stringify({
                roomNumber: data.roomNumber,
                roomCategoryId: data.roomCategoryId
            }),
        });
        const updatedRoom = await response.json();
        set((state) => ({
            rooms: state.rooms.map((room) =>
                room.id === data.id ? updatedRoom : room
            ),
        }));
    },
    addRoom: async (data: { roomNumber: number; roomCategoryId: number }) => {
        try {
            const response = await fetch(`${baseUrl}/rooms`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // authorization: sessionStorage.token || "",
                },
                body: JSON.stringify({
                    roomNumber: data.roomNumber,
                    roomCategoryId: data.roomCategoryId
                }),
            });
    
            if (!response.ok) {
                // If the response is not ok, throw an error
                const errorData = await response.json();
                alert(errorData.message || "Failed to add room");
                return; // Exit the function if there's an error
            }
    
            const newRoom = await response.json();
            set((state) => ({
                rooms: [...state.rooms, newRoom],
            }));
        } catch (error) {
            // Handle unknown error type
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            alert("An error occurred while adding the room: " + errorMessage);
        }
    },
    
    
    getRoom: async (id: number) => {
        const response = await fetch(`${baseUrl}/rooms/${id}`);
        const data = await response.json();
        set({ room: data });
    },
}));

export default useRoomStore;
