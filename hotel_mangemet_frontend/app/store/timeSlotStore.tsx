import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  maxCustomer?: number;
  bookedCustomer?: number;
}

interface TimeSlotStore {
  timeslots: TimeSlot[];
  timeslot: TimeSlot | null;
  getAllTimeSlots: () => Promise<void>;
  getTimeSlotById: (id: number) => Promise<TimeSlot | undefined>;
  addTimeSlot: (timeslotData: {
    startTime: string;
    endTime: string;
    maxCustomer?: number;
    bookedCustomer?: number;
  }) => Promise<void>;
  updateTimeSlot: (id: number, updateTimeSlotData: {
    startTime: string;
    endTime: string;
    maxCustomer?: number;
    bookedCustomer?: number;
  }) => Promise<void>;
  deleteTimeSlot: (id: number) => Promise<void>;
}

const useTimeSlotStore = create<TimeSlotStore>((set) => ({
  timeslots: [],
  timeslot: null,

  getAllTimeSlots: async () => {
    try {
      const token = sessionStorage.getItem('token') ?? '';
      const response = await axios.get<TimeSlot[]>(`${API_URL}/time-slot`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ timeslots: response.data });
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  },

  getTimeSlotById: async (id: number) => {
    try {
      const token = sessionStorage.getItem('token') ?? '';
      const response = await axios.get<TimeSlot>(`${API_URL}/time-slot/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ timeslot: response.data });
      return response.data;
    } catch (error) {
      console.error(`Error fetching time slot with id ${id}:`, error);
      return undefined;
    }
  },

  addTimeSlot: async (timeslotData: {
    startTime: string;
    endTime: string;
    maxCustomer?: number;
    bookedCustomer?: number;
  }) => {
    try {
      const token = sessionStorage.getItem('token') ?? '';
      await axios.post(`${API_URL}/time-slot`, timeslotData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Optionally, you can call getAllTimeSlots to refresh the list
      await useTimeSlotStore.getState().getAllTimeSlots();
    } catch (error) {
      console.error('Error adding time slot:', error);
    }
  },

  updateTimeSlot: async (id: number, updateTimeSlotData: {
    startTime: string;
    endTime: string;
    maxCustomer?: number;
    bookedCustomer?: number;
  }) => {
    try {
      const token = sessionStorage.getItem('token') ?? '';
      await axios.put(`${API_URL}/time-slot/${id}`, updateTimeSlotData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Optionally, you can call getAllTimeSlots to refresh the list
      await useTimeSlotStore.getState().getAllTimeSlots();
    } catch (error) {
      console.error(`Error updating time slot with id ${id}:`, error);
    }
  },

  deleteTimeSlot: async (id: number) => {
    try {
      const token = sessionStorage.getItem('token') ?? '';
      await axios.delete(`${API_URL}/time-slot/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Optionally, you can call getAllTimeSlots to refresh the list
      await useTimeSlotStore.getState().getAllTimeSlots();
    } catch (error) {
      console.error(`Error deleting time slot with id ${id}:`, error);
    }
  },
}));

export default useTimeSlotStore;
