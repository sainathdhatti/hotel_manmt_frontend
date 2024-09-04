import { create } from 'zustand';
import axios from 'axios';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
} 
export enum BookingStatus {
  PENDING = 'pending',
  DONE = 'done',
}

const API_URL = 'http://localhost:5000'; // Update to your actual backend URL

interface SpaBooking{
    id:number;
    firstName:string;
    lastName:string;
    gender:Gender;
    booking_date:Date;
    status:BookingStatus;
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      phoneNumber: string;
      aadharCardNumber: string;
    };
    spaService:{
        id:number;
        name:string;
        description:string;
    }
    timeSlot:{
        id:number;
        startTime:Date;
        endTime:Date;
        maxCustomer:number;
        bookedCustomer:number;
    }
    staffmember:{
        id:number;
        firstName:string;
        lastName:string;
        email:string;
        password:string;
        status:string;
        phoneNumber:string;
        gender:Gender;
        staffcategoryId:number;
        staffcategory:{
            id:number;
            name:string;
        }
    }
}

interface SpaBookingStore {
  spabookings: SpaBooking[];
  spabooking: SpaBooking | null;
  fetchBookings: () => Promise<void>;
  fetchBookingById: (id: number) => Promise<SpaBooking | undefined>;
  addBooking: (bookingData: {
    firstName: string;
    lastName: string;
    gender: Gender;
    booking_date: Date;
    userId: number;
    spaserviceId: number;
    timeslotId: number;
  }) => Promise<void>;
  updateBooking: (id: number, updateBookingData: {
    status: BookingStatus;
  }) => Promise<void>;
  deleteBooking: (id: number) => Promise<void>;
}

const useSpaBookingStore = create<SpaBookingStore>((set) => ({
  spabookings: [],
  spabooking: null,

  fetchBookings: async () => {
    try {
      const token = sessionStorage.getItem('token') ?? '';
      const response = await axios.get<SpaBooking[]>(`${API_URL}/spa_bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ spabookings: response.data });
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  },

  fetchBookingById: async (id: number) => {
    try {
      const token = sessionStorage.getItem('token') ?? '';
      const response = await axios.get<SpaBooking>(`${API_URL}/spa_bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        spabooking: response.data,
      }));
      return response.data;
    } catch (error) {
      console.error('Error fetching booking by id:', error);
      return undefined;
    }
  },

  addBooking: async (bookingData) => {
    try {
      const token = sessionStorage.getItem('token') ?? '';
      const response = await axios.post<SpaBooking>(`${API_URL}/spa_bookings`, bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        spabookings: [...state.spabookings, response.data],
      }));
    } catch (error) {
      console.error('Failed to create booking:', error);
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || 'An unknown error occurred';
        alert(errorMessage);
      } else {
        alert('An unexpected error occurred');
      }
    }
  },

  updateBooking: async (id: number, updateBookingData) => {
    try {
      const token = sessionStorage.getItem('token') ?? '';
      const response = await axios.patch<SpaBooking>(`${API_URL}/spa_bookings/${id}`, updateBookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        spabookings: state.spabookings.map((b) =>
          b.id === id ? response.data : b
        ),
        spabooking: state.spabooking?.id === id ? response.data : state.spabooking,
      }));
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  },

  deleteBooking: async (id: number) => {
    try {
      const token = sessionStorage.getItem('token') ?? '';
      await axios.delete(`${API_URL}/spa_bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        spabookings: state.spabookings.filter((b) => b.id !== id),
        spabooking: state.spabooking?.id === id ? null : state.spabooking,
      }));
    } catch (error) {
      console.error('Failed to delete booking:', error);
    }
  },
}));

export default useSpaBookingStore;