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
    advancePayment:number;
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
  calculateTotalAmount: (userId:number, bookingId:number) => Promise<void>;
  getFinalBillingsByUser:(userId:number)=>Promise<void>;
}

const useFinalBillingStore=create<FinalBillingStore>((set)=>({
  finalBillings: [],
  getFinalBillings: async () => {
    const response = await fetch(`${API_URL}/final_billing`);
    const data = await response.json();
    set({ finalBillings: data });
  },
  calculateTotalAmount: async (userId:number, bookingId:number) => {
    const response = await fetch(`${API_URL}/final_billing/user/${userId}/booking/${bookingId}`);
    //const response= await fetch(`http://localhost:5000/final_billing/user/${userId}/booking/${bookingId}`);
    const data = await response.json();
    set({ finalBillings: data });
  },


  getFinalBillingsByUser: async (userId:number) => {
    const response = await fetch(`${API_URL}/final_billing/user/${userId}`);
    const data = await response.json();
    set({ finalBillings: data });
  }
}))
export default  useFinalBillingStore;
