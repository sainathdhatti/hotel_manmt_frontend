"use client";
import React, { useEffect, useState } from 'react';
import useSpaBookingStore from '@/app/store/spaBookingStore'; // Adjust the path if necessary
import { BookingStatus } from '@/app/store/spaBookingStore'; // Ensure the correct path for BookingStatus enum
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/app/store/loginStore';

const SpaBookings = () => {
  const router = useRouter();
  const { spabookings, fetchBookings, updateBooking } = useSpaBookingStore((state) => ({
    spabookings: state.spabookings,
    fetchBookings: state.fetchBookings,
    updateBooking: state.updateBooking,
  }));

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        await fetchBookings();
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadBookings();
  }, [fetchBookings]);

  const handleStatusChange = async (id: number) => {
    try {
      await updateBooking(id, { status: BookingStatus.DONE });
      toast.success('Booking status updated to DONE!');
    } catch (error) {
      console.error('Failed to update booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const handleLogout = () => {
    useAuthStore.getState().logout();
    router.push('/overview');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-300"
      >
        Logout
      </button>
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Spa Bookings</h1>
      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">First Name</th>
              <th className="px-6 py-4 text-left font-semibold">Last Name</th>
              <th className="px-6 py-4 text-left font-semibold">Service Name</th>
              <th className="px-6 py-4 text-left font-semibold">Date</th>
              <th className="px-6 py-4 text-left font-semibold">Time Slot</th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {spabookings.length > 0 ? (
              spabookings.map((booking) => (
                <tr key={booking.id} className="border-b hover:bg-gray-50 even:bg-gray-100">
                  <td className="px-6 py-4 text-gray-800">{booking.firstName}</td>
                  <td className="px-6 py-4 text-gray-800">{booking.lastName}</td>
                  <td className="px-6 py-4 text-gray-800">{booking.spaservice.name}</td>
                  <td className="px-6 py-4 text-gray-800">{formatDate(booking.booking_date)}</td>
                  <td className="px-6 py-4 text-gray-800">{booking.timeslot.startTime.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-800">{booking.status}</td>
                  <td className="px-6 py-4 text-center">
                    {booking.status === BookingStatus.PENDING && (
                      <button
                        onClick={() => handleStatusChange(booking.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition duration-300"
                      >
                        Mark as Done
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-600">
                  No bookings available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpaBookings;
