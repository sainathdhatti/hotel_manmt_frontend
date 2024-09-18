import { create } from "zustand";

export enum BookingStatus {
  AVAILABLE = "AVAILABLE",
  BOOKED = "BOOKED",
  CHECKED_OUT = "CHECKED_OUT",
  CANCELLED = "CANCELLED",
  CHECKED_IN = "CHECKED_IN",
}

const API_URL = "http://localhost:5000";
export interface FinalBilling {
  id: number;
  bookingAmount: number;
  spaAmount: number;
  foodAmount: number;
  totalAmount: number;
  booking: {
    bookingId: number;
    checkInDate: Date;
    checkOutDate: Date;
    status: BookingStatus;
    billPicUrl: string;
    noOfDays: number;
    noOfAdults: number;
    noOfChildrens: number;
    TotalAmount: number;
    user: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      password: string;
      aadharCardNumber: string;
      resetToken: string;
      resetTokenExpiry: Date
    };
    room: {
      id: number;
      roomNumber: number;
      status: string;
    };
  };
}

interface FinalBillingStore {
  finalBillings: FinalBilling[];
  getFinalBillings: () => Promise<void>;
  calculateFinalBillings: (userId:number,bookingId:number) => Promise<void>;
}

const useFinalBillingStore=create<FinalBillingStore>((set)=>({
  finalBillings: [],
  getFinalBillings: async () => {
    const response = await fetch(`${API_URL}/final-billings`);
    const data = await response.json();
    set({ finalBillings: data });
  },
  calculateFinalBillings: async (userId:number,bookingId:number) => {
    const response = await fetch(`${API_URL}/final_billing/users/${userId}/bookings/${bookingId}`);
    const data = await response.json();
    set({ finalBillings: data });
  },
}))
export default  useFinalBillingStore;
