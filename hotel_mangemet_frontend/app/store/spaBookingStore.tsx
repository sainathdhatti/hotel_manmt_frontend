
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}
export enum BookingStatus {

  PENDING = "PENDING",
  DONE = "DONE",
  CANCELLED = "CANCELLED",

}

const API_URL = "http://localhost:5000"; // Update to your actual backend URL

interface SpaBooking {
  id: number;
  firstName: string;
  lastName: string;
  gender: Gender;
  booking_date: Date;
  status: BookingStatus;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    aadharCardNumber: string;
  };
  spaservice: {
    id: number;
    name: string;
    description: string;
    price: number;
  };
  timeslot: {
    id: number;
    startTime: Date;
    endTime: Date;
    maxCustomer: number;
    bookedCustomer: number;
  };
  staffmember: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    status: string;
    phoneNumber: string;
    gender: Gender;
    staffcategoryId: number;
    staffcategory: {
      id: number;
      name: string;
    };
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
    bookingId:number
  }) => Promise<void>;
  updateBooking: (
    id: number,
    updateBookingData: {
      status: BookingStatus;
    }
  ) => Promise<void>;
  deleteBooking: (id: number) => Promise<void>;
}

const useSpaBookingStore = create<SpaBookingStore>((set) => ({
  spabookings: [],
  spabooking: null,

  fetchBookings: async () => {
    try {
      const token = sessionStorage.getItem("token") ?? "";
      const response = await axios.get<SpaBooking[]>(
        `${API_URL}/spa_bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({ spabookings: response.data });
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  },

  fetchBookingById: async (id: number) => {
    try {
      const token = sessionStorage.getItem("token") ?? "";
      const response = await axios.get<SpaBooking>(
        `${API_URL}/spa_bookings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set((state) => ({
        spabooking: response.data,
      }));
      return response.data;
    } catch (error) {
      console.error("Error fetching booking by id:", error);
      return undefined;
    }
  },



  addBooking: async (bookingData) => {
    console.log("bookingData", bookingData);
    try {
      const token = sessionStorage.getItem("token") ?? "";
      const response = await axios.post<SpaBooking>(
        `${API_URL}/spa_bookings`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set((state) => ({
        spabookings: [...state.spabookings, response.data],
      }));
      toast.success("Booking created successfully!");

    } catch (error) {
      console.error("Failed to create booking:", error);
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message || "An unknown error occurred";
        alert(errorMessage);
      } else {
        alert("An unexpected error occurred");
      }
    }
  },

  updateBooking: async (id: number, updateBookingData) => {
    try {
      const token = sessionStorage.getItem("token") ?? "";
      const response = await axios.patch<SpaBooking>(
        `${API_URL}/spa_bookings/${id}`,
        updateBookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set((state) => ({
        spabookings: state.spabookings.map((b) =>
          b.id === id ? response.data : b
        ),
        spabooking:
          state.spabooking?.id === id ? response.data : state.spabooking,
      }));
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  },

  deleteBooking: async (id: number) => {
    try {
      const token = sessionStorage.getItem("token") ?? "";
      await axios.delete(`${API_URL}/spa_bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        spabookings: state.spabookings.filter((b) => b.id !== id),
        spabooking: state.spabooking?.id === id ? null : state.spabooking,
      }));

      toast.success('Booking cancelled successfully!');
    } catch (error:any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Failed to delete booking:', error.response.data.message);
        toast.error(error.response.data.message); // Display error message to the user
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Failed to delete booking:', error.request);
        alert('No response received from server.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Failed to delete booking:', error.message);
        alert('Error in setting up request.');
      }   
    }
  }
}));

export default useSpaBookingStore;
