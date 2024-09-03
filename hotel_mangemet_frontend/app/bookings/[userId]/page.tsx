"use client";
import React, { useEffect, useState } from "react";
import useBookingsStore from "@/app/store/bookingStore";
import useAuthStore from "@/app/store/loginStore";
import { Booking } from "@/app/store/bookingStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash,faEdit } from '@fortawesome/free-solid-svg-icons';

const Page = () => {
  const { isAuthenticated, userId } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    userId: state.userId,
  }));

  const bookings = useBookingsStore((state) => state.bookings);
  const fetchBookingsByUserId = useBookingsStore(
    (state) => state.fetchBookingsByUserId
  );
  const deleteBooking = useBookingsStore((state) => state.deleteBooking);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (userId !== null) {
      // Fetch bookings for the specific user ID
      fetchBookingsByUserId(userId);
    }
  }, [userId, fetchBookingsByUserId]);
  useEffect(() => {
    if (userId !== null) {
      // Fetch bookings for the specific user ID
      fetchBookingsByUserId(userId);
    }
  }, [userId, fetchBookingsByUserId]);
  useEffect(() => {
    // Update filtered bookings when bookings data changes
    setFilteredBookings(bookings);
  }, [bookings]);
  const handleDelete = async (bookingId: number) => {
    try {
      await deleteBooking(bookingId);
      alert("Booking deleted successfully");
      if (userId !== null) {
        await fetchBookingsByUserId(userId); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full bg-white shadow-md rounded-lg p-6 mt-10">
        <h1 className="text-2xl font-bold mb-4 text-center">Your Bookings</h1>
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-center">Customer Name</th>
              <th className="px-4 py-2 text-center">Check-in Date</th>
              <th className="px-4 py-2 text-center">Check-out Date</th>
              <th className="px-4 py-2 text-center">No. of Adults</th>
              <th className="px-4 py-2 text-center">No. of Children</th>
              <th className="px-4 py-2 text-center">No. of Days</th>
              <th className="px-4 py-2 text-center">Room Number</th>
              <th className="px-4 py-2 text-center">Total Amount</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  No bookings available.
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking.bookingId} className="border-b">
                  <td className="px-4 py-2 text-center">
                    {booking.user.firstName}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {booking.noOfAdults}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {booking.noOfChildren}
                  </td>
                  <td className="px-4 py-2 text-center">{booking.noOfDays}</td>
                  <td className="px-4 py-2 text-center">
                    {booking.room.roomNumber}
                  </td>
                  <td className="px-4 py-2 text-center">
                    &#x20B9;{booking.TotalAmount}
                  </td>
                  <td className="px-4 py-2 text-center">{booking.status}</td>
                  <td className="px-4 py-2 flex justify-center space-x-5">
                    <button
                      className="btn btn-warning btn-outline"
                      onClick={() => handleDelete(booking.bookingId)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="btn btn-warning btn-outline flex items-center justify-center"
                      onClick={() => handleDelete(booking.bookingId)}
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-red-500"/>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
