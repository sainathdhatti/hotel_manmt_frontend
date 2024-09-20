import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';


export enum BookingStatuss {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED',
  CHECKED_IN = 'CHECKED_IN'
}

// types.ts or interfaces.ts
export interface AvailableRoom {
  roomId: number;
  roomNumber: number;
  roomCategory: string;
  bookingStatus: string;
  noOfAdults: number,
  noOfChildren: number,
  price: number,
}

const API_URL = 'http://localhost:5000';

export interface Booking {
  bookingId: number;
  checkInDate: Date;
  checkOutDate: Date;
  status: BookingStatuss;
  billPicUrl?: string;
  noOfDays: number;
  TotalAmount: number;
  noOfAdults: number;
  noOfChildrens: number;
  reviewLinkSent: boolean;
  advancePayment:number;
  userId:number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    aadharCardNumber: string;
  };
  room: {
    id: number;
    roomNumber: number;
    room_categories: {
      id: number;
      name: string;
      noOfChildren: number;
      noOfAdults: number;
      price: number;
      description: string;
    };
  };
}

// interface BookingStore {
//   bookings: Booking[];
//   booking: Booking | null;
//   availableRooms:AvailableRoom[]
//   fetchBookings: () => Promise<void>;
//   fetchBookingsByUserId: (userId: number) => Promise<void>; 
//   fetchBookingById: (bookingId: number) => Promise<Booking | undefined>;
//   addBooking: (bookingData: {
//     checkInDate: Date;
//     checkOutDate: Date;
//     noOfAdults: number;
//     noOfChildrens: number;
//     userId: number;
//     categoryId: number;
//   }) => Promise<void>;
//   updateBookingStatus: (bookingId: number, updateBookingData: {
//     status: BookingStatuss
//   }) => Promise<void>;
//   deleteBooking: (bookingId: number) => Promise<void>;
//   getAvailableRooms: (checkInDate: string, checkOutDate: string) => Promise<Booking[]>;
// }


interface BookingStore {
  bookings: Booking[];
  booking: Booking | null;
  availableRooms: AvailableRoom[]; // Use AvailableRoom[] here
  fetchBookings: () => Promise<void>;
  fetchBookingsByUserId: (userId: number) => Promise<void>;
  fetchBookingById: (bookingId: number) => Promise<Booking | undefined>;
  addBooking: (bookingData: {
    checkInDate: Date;
    checkOutDate: Date;
    noOfAdults: number;
    noOfChildrens: number;
    userId: number;
    categoryId: number;
  }) => Promise<void>;
  updateBookingStatus: (bookingId: number, updateBookingData: {
    status: BookingStatuss
  }) => Promise<void>;
  deleteBooking: (bookingId: number) => Promise<void>;
  getAvailableRooms: (checkInDate: string, checkOutDate: string) => Promise<AvailableRoom[]>; // Update the return type here
  setAvailableRooms: (rooms: AvailableRoom[]) => void; // New method

}


const useBookingsStore = create<BookingStore>((set) => ({
  bookings: [],
  booking: null,
  availableRooms:[], 
  setAvailableRooms: (rooms) => set({ availableRooms: rooms }), // Store available rooms

  fetchBookings: async () => {
    try {
      const token = sessionStorage.getItem('token') ?? '';
      const response = await axios.get<Booking[]>(`${API_URL}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ bookings: response.data });
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  },

  fetchBookingById: async (bookingId: number) => {
    try {
      //const token = sessionStorage.getItem('token') ?? '';
      const response = await axios.get<Booking>(`${API_URL}/bookings/${bookingId}`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });
      set((state) => ({
        booking: response.data,
      }));
      return response.data;
    } catch (error) {
      console.error('Error fetching booking by id:', error);
      return undefined;
    }
  },

  fetchBookingsByUserId: async (userId: number) => {
    try {
      //const token = sessionStorage.getItem('token') ?? '';
      const response = await axios.get<Booking[]>(`${API_URL}/bookings/users/${userId}`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });
      set({ bookings: response.data });
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching bookings by user ID:', error);
    }
  },


  addBooking: async (bookingData) => {
    try {
      const token = sessionStorage.getItem('token') ?? '';
      const response = await axios.post<Booking>(`${API_URL}/bookings`, bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({ bookings: [...state.bookings, response.data] }));
      toast.success('Booking created successfully!');
    } catch (error) {
      console.error('Failed to create booking:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        // Construct a detailed error message from backend response
        const errorMessage = error.response.data.message || 'An unknown error occurred';
        alert(errorMessage);
      } else {
        alert('An unexpected error occurred');
      }
    }
  },


  updateBookingStatus: async (bookingId: number, updateBookingData: { status: BookingStatuss }) => {
    try {
      const token = sessionStorage.getItem('token') ?? '';
      const response = await axios.patch<Booking>(`${API_URL}/bookings/${bookingId}`, updateBookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.bookingId === bookingId ? response.data : b
        ),
        booking: state.booking?.bookingId === bookingId ? response.data : state.booking,
      }));
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  },
  

  deleteBooking: async (bookingId) => {
    try {
      const token = sessionStorage.getItem('token') ?? '';
      await axios.delete(`${API_URL}/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        bookings: state.bookings.filter((b) => b.bookingId !== bookingId),
        booking: state.booking?.bookingId === bookingId ? null : state.booking,
      }));
    } catch (error:any) {
      if (error.response) {
        console.error('Failed to delete booking:', error.response.data.message);
        toast.error(error.response.data.message); 
      } else if (error.request) {
        console.error('Failed to delete booking:', error.request);
        alert('No response received from server.');
      } else {
        console.error('Failed to delete booking:', error.message);
        alert('Error in setting up request.');
      }
    }
  },

  getAvailableRooms: async (checkInDate: string, checkOutDate: string): Promise<AvailableRoom[]> => {
    console.log("checkindate", checkInDate, "checkoutdate", checkOutDate);
    try {
      const token = sessionStorage.getItem('token') || '';
      const response = await axios.get<AvailableRoom[]>(`${API_URL}/bookings/available/${checkInDate}/${checkOutDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data); // Log the response data to check structure
      set({ availableRooms: response.data }); // Store result in availableRooms
      return response.data;
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      return [];
    }
  },
  
}));

export default useBookingsStore;
