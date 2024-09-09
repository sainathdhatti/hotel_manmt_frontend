import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export interface SpaService {
  id: number;
  name: string;
  description: string;
  price: number;
  service_image: string;
}

interface SpaServiceStore {
  spaServices: SpaService[];
  spaService: SpaService | null;
  getAllSpaServices: () => Promise<void>;
  getSpaServiceById: (id: number) => Promise<void>;
  addSpaService: (service: {name: string; description: string; price: number}) => Promise<void>;
  updateSpaService: (data: SpaService) => Promise<void>;
  deleteSpaService: (id: number) => Promise<void>;
}

const useSpaServiceStore = create<SpaServiceStore>((set) => ({
  spaServices: [],
  spaService: null,
  getAllSpaServices: async () => {
    try {
      const { data } = await axios.get<SpaService[]>(`${API_URL}/spa-service`);
      set({ spaServices: data });
    } catch (error) {
      console.error('Failed to fetch spa services:', error);
    }
  },
  getSpaServiceById: async (id: number) => {
    try {
      const { data } = await axios.get<SpaService>(`${API_URL}/spa-service/${id}`);
      set({ spaService: data });
    } catch (error) {
      console.error('Failed to fetch spa service by ID:', error);
    }
  },
  addSpaService: async (service: {name: string; description: string; price: number}) => {
    try {
      const { data } = await axios.post<SpaService>(`${API_URL}/spa-service`, service);
      set((state) => ({
        spaServices: [...state.spaServices, data]
      }));
    } catch (error) {
      console.error('Failed to add spa service:', error);
    }
  },
  updateSpaService: async (data: SpaService) => {
    try {
      const { data: updatedService } = await axios.put<SpaService>(`${API_URL}/spa-service/${data.id}`, data);
      set((state) => ({
        spaServices: state.spaServices.map((service) =>
          service.id === data.id ? updatedService : service
        ),
        spaService: state.spaService?.id === data.id ? updatedService : state.spaService
      }));
    } catch (error) {
      console.error('Failed to update spa service:', error);
    }
  },
  deleteSpaService: async (id: number) => {
    try {
      await axios.delete(`${API_URL}/spa-service/${id}`);
      set((state) => ({
        spaServices: state.spaServices.filter(service => service.id !== id),
        spaService: state.spaService?.id === id ? null : state.spaService
      }));
    } catch (error) {
      console.error('Failed to delete spa service:', error);
    }
  },
}));

export default useSpaServiceStore;
