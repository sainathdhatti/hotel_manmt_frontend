"use client";

import React, { useEffect, useState } from 'react';
import useSpaBookingStore from '@/app/store/spaBookingStore'; // Adjust the path if necessary
import { BookingStatus } from '@/app/store/spaBookingStore'; // Ensure the correct path for BookingStatus enum
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/app/store/loginStore';
import LoadingSpinner from '@/app/loading';

const SpaBookings = () => {
  const router = useRouter();
  const { spabookings, fetchBookings, updateBooking } = useSpaBookingStore((state) => ({
    spabookings: state.spabookings,
    fetchBookings: state.fetchBookings,
    updateBooking: state.updateBooking,
  }));

  const { login, isAuthenticated } = useAuthStore((state) => ({
    login: state.login,
    isAuthenticated: state.isAuthenticated,
    //errorMessage: state.errorMessage,
  }));

  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    if (isAuthenticated) {
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
    } else {
      setLoading(false); // Set loading to false when not authenticated
    }
  }, [isAuthenticated, fetchBookings]);

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
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      useAuthStore.getState().logout();
      router.push("/dashboard/spalogin");
    }
  };
  

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password }, "spalogin");
      setEmail(""); // Clear email on successful login
      setPassword(""); // Clear password on successful login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div><LoadingSpinner/></div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      {!isAuthenticated ? (
        <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url("/images/login.jpeg")' }}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg">
          <h2 className="text-xl font-bold mb-4">Login</h2>
          <form onSubmit={handleLoginSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mb-4 p-2 border rounded w-full"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mb-4 p-2 border rounded w-full"
            />
            {/* {errorMessage && <p className="text-red-500">{errorMessage}</p>} */}
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Login
            </button>
          </form>
        </div>
      </div>
      
      ) : (
        <>
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
                      <td className="px-6 py-4 text-gray-800">{booking.spaservice.name || "N/A"}</td>
                      <td className="px-6 py-4 text-gray-800">{formatDate(booking.booking_date)}</td>
                      <td className="px-6 py-4 text-gray-800">{formatTime(booking.timeslot.startTime)}</td>
                      <td className="px-6 py-4 text-gray-800">{booking.status}</td>
                      <td className="px-6 py-4 text-center">
                        {(booking.status === BookingStatus.DONE ||
                          booking.status === BookingStatus.CANCELLED) ? (
                          <button
                            disabled
                            className="bg-gray-400 text-white px-4 py-2 rounded-lg shadow cursor-not-allowed"
                          >
                            Mark as Done
                          </button>
                        ) : (
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
        </>
      )}
    </div>
  );
};

export default SpaBookings;
