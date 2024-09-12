import { create } from 'zustand';
import axios from 'axios';
import { Booking } from './bookingStore';

const baseUrl = "http://localhost:5000";

interface Review {
  id: number;
  rating: number;
  description: string;
  linkToken: string;
  booking: Booking;
}

interface ReviewState {
  reviews: any[];
  error: string | null;
  fetchReviews: () => Promise<void>;
  sendReviewLink: (bookingId: number) => Promise<void>;
  submitReview: (data: { linkToken: string; rating: number; description: string }) => Promise<void>;
  getAllReviews: () => Promise<void>;
}

export const useReviewStore = create<ReviewState>((set) => ({
  reviews: [],
  error: null,

  fetchReviews: async () => {
    try {
      const response = await axios.get(`${baseUrl}/reviews`);
      set({ reviews: response.data });
    } catch (error) {
      set({ error: 'Failed to fetch reviews' });
    }
  },

  sendReviewLink: async (bookingId: number) => {
    console.log(bookingId);
    try {
      await axios.post(`${baseUrl}/reviews/send-link`, { bookingId });
    } catch (error) {
      set({ error: 'Failed to send review link' });
      console.error('Error sending review link:', error);
    }
  },

  submitReview: async (data: { linkToken: string; rating: number; description: string }) => {
    try {
      await axios.post(`${baseUrl}/reviews/submit`, data);
    } catch (error) {
      set({ error: 'Failed to submit review' });
    }
  },

  getAllReviews: async () => {
    try {
      const response = await axios.get(`${baseUrl}/reviews`);
      set({ reviews: response.data });
      console.log(response.data);
    } catch (error) {
      set({ error: 'Failed to fetch reviews' });
    }
  },
}));

export default useReviewStore;
