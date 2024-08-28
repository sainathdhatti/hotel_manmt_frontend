"use client";
import React, { useEffect, useState } from 'react';
import useBookingsStore from '../store/bookingStore';
import Link from 'next/link';
import useAuthStore from '../store/loginStore';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash,faEdit } from '@fortawesome/free-solid-svg-icons';

const Page = () => {
    const bookings = useBookingsStore((state) => state.bookings);
    const getAllBookings = useBookingsStore((state) => state.fetchBookings);
    const deleteBooking = useBookingsStore((state) => state.deleteBooking);
    const updateBooking = useBookingsStore((state) => state.updateBooking);
    const { isAuthenticated, userId } = useAuthStore((state) => ({
        isAuthenticated: state.isAuthenticated,
        userId: state.userId
    }));

    useEffect(() => {
        getAllBookings();
    }, [getAllBookings]);

    // Handler for deleting booking
    const handleDelete = async (bookingId: number) => {
        try {
            await deleteBooking(bookingId);
            alert('Booking deleted successfully');
            await getAllBookings(); // Refresh the list
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    // Helper function to check if a booking is cancelled
    const isCancelled = (status: string) => status === 'CANCELLED';

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full bg-white shadow-md rounded-lg p-6 mt-10">
                <h1 className="text-2xl font-bold mb-4 text-center">Bookings</h1>
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
                        {bookings.map((booking) => (
                            <tr key={booking.bookingId} className="border-b">
                                <td className="px-4 py-2 text-center">
                                    {booking.user.firstName ?? "N/A"}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    {new Date(booking.checkInDate).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    {new Date(booking.checkOutDate).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    {booking.noOfAdults ?? "N/A"}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    {booking.noOfChildren ?? "N/A"}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    {booking.noOfDays ?? "N/A"}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    {booking.room?.roomNumber ?? "N/A"}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    &#x20B9;{booking.TotalAmount ?? "N/A"}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    {booking.status ?? "N/A"}
                                </td>
                                <td className="px-4 py-2 flex justify-center space-x-5">
                                    <Link href={`/bookings/${userId}`}>
                                        <button
                                            className={`btn ${isCancelled(booking.status) ? 'btn-disabled' : 'btn-warning'} btn-outlin`}
                                            disabled={isCancelled(booking.status)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                    </Link>
                                    <button
                                        className={`btn ${isCancelled(booking.status) ? 'btn-disabled' : 'btn-error'} btn-outlin`}
                                        onClick={() => handleDelete(booking.bookingId)}
                                        disabled={isCancelled(booking.status)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="text-red-500"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Page;
