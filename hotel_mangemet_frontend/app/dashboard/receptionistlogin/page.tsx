"use client";




import useBookingsStore, {
  AvailableRoom,
  Booking,
  BookingStatuss,
} from "@/app/store/bookingStore";

import useFinalBillingStore from "@/app/store/final_billingStore";
import useAuthStore from "@/app/store/loginStore";
import useRoomCategoryStore from "@/app/store/roomCategory";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Receptionist = () => {
  const router = useRouter();
  const { userId, isAuthenticated, logout } = useAuthStore((state) => ({
    userId: state.userId,
    isAuthenticated: state.isAuthenticated,
    logout: state.logout,
  }));

  const [currentView, setCurrentView] = useState("bookings");
  const [showConfirm, setShowConfirm] = useState(false);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const [availableRooms, setAvailableRooms] = useState<AvailableRoom[]>([]);
  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState(tomorrow);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const { roomCategories, getAllRoomCategories } = useRoomCategoryStore(state => ({
    roomCategories: state.roomCategories,
    getAllRoomCategories: state.getAllRoomCategories,
  }));

  useEffect(() => {
    const fetchRoomCategories = async () => {
      await getAllRoomCategories();
    };
    fetchRoomCategories();
  }, [getAllRoomCategories]);

  const {
    finalBillings,
    fetchBillings,
    calculateFinalBillings,
  } = useFinalBillingStore((state) => ({
    finalBillings: state.finalBillings,
    fetchBillings: state.getFinalBillings,
    calculateFinalBillings: state.calculateTotalAmount,
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchBillings();
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [fetchBillings]);

  const {
    bookings,
    fetchBookings,
    updateBookingStatus,
    getAvailableRooms,
  } = useBookingsStore((state) => ({
    bookings: state.bookings,
    fetchBookings: state.fetchBookings,
    updateBookingStatus: state.updateBookingStatus,
    getAvailableRooms: state.getAvailableRooms,
  }));

  const cancelLogout = () => {
    setShowConfirm(false);
  };

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    router.push("/");
  };

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      if (checkInDate && checkOutDate) {
        try {
          const formattedCheckInDate = checkInDate.toISOString().split("T")[0]; // YYYY-MM-DD
          const formattedCheckOutDate = checkOutDate.toISOString().split("T")[0]; // YYYY-MM-DD
          
          const rooms = await getAvailableRooms(formattedCheckInDate, formattedCheckOutDate);
          console.log(rooms);
          setAvailableRooms(rooms);
        } catch (error) {
          console.error("Error fetching available rooms:", error);
        }
      }
    };
    
    fetchAvailableRooms();
  }, [checkInDate, checkOutDate, getAvailableRooms]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchBookings();
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [fetchBookings]);


 

  const handleStatusChange = async (
    bookingId: number,
    status: BookingStatuss
  ) => {

    try {
      await updateBookingStatus(bookingId, { status });
      toast.success("Booking status updated successfully.");
      if (status === BookingStatuss.CHECKED_OUT) {
        const booking = bookings.find((b) => b.bookingId === bookingId);
        if (booking && booking.user.id) {
          await calculateFinalBillings(booking.user.id, bookingId);
        }
      }
    } catch (error) {
      console.error("Failed to update booking status", error);
    }
  };


  console.log(finalbillings);

  const statusOptions = Object.values(BookingStatuss);

 
  console.log("availableRooms",availableRooms);


  const renderContent = () => {
    switch (currentView) {
      case "bookings":
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full border-2 border-gray-200 p-6">
              <h1 className="text-2xl font-bold mb-4 text-teal-500">
                Bookings List
              </h1>
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-100 text-teal-600">
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
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {bookings.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-center py-4 text-gray-500"
                      >
                        No bookings available.
                      </td>
                    </tr>
                  ) : (
                    bookings.map((booking) => (
                      <tr
                        key={booking.bookingId}
                        className="border-b hover:bg-gray-100"
                      >
                        <td className="px-4 py-2 text-center text-blue-500">
                          {booking.user?.firstName || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center text-green-500">
                          {new Date(booking.checkInDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-center text-red-500">
                          {new Date(booking.checkOutDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-center text-purple-500">
                          {booking.noOfAdults || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center text-teal-500">
                          {booking.noOfChildrens || 0}
                        </td>
                        <td className="px-4 py-2 text-center text-indigo-500">
                          {booking.noOfDays || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center text-yellow-500">
                          {booking.room?.roomNumber || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center text-orange-500">
                          ₹{booking.TotalAmount || "0.00"}
                        </td>
                        <td className="px-4 py-2 text-center text-pink-500">
                         <select
  value={booking.status}
  onChange={(e) => {
    const newStatus = e.target.value as BookingStatuss;
    if (
      booking.status !== BookingStatuss.CHECKED_OUT &&
      booking.status !== BookingStatuss.CANCELLED
    ) {
      handleStatusChange(booking.bookingId, newStatus);
    }
  }}
  className={`border border-gray-300 rounded-md p-1 ${
    booking.status === BookingStatuss.CHECKED_OUT
      ? "bg-gray-200 cursor-not-allowed"
      : ""
  }`}
  disabled={
    booking.status === BookingStatuss.CHECKED_OUT ||
    booking.status === BookingStatuss.CANCELLED
  }
>
  {statusOptions.map((status) => (
    <option key={status as string} value={status as string}>
      {status as string}
    </option>
  ))}
</select>

                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "billings":
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full border-2 border-gray-200 p-6">
              <h1 className="text-2xl font-bold mb-4 text-teal-500">
                Billing List
              </h1>
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-100 text-teal-600">
                  <tr>
                    <th className="px-4 py-2 text-center">First Name</th>
                    <th className="px-4 py-2 text-center">Last Name</th>
                    <th className="px-4 py-2 text-center">Booking Amount</th>
                    <th className="px-4 py-2 text-center">Spa Amount</th>
                    <th className="px-4 py-2 text-center">Food Amount</th>
                    <th className="px-4 py-2 text-center">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {finalBillings.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-4 text-gray-500"
                      >
                        No billings available.
                      </td>
                    </tr>
                  ) : (
                    finalBillings.map((billing) => (
                      <tr
                        key={billing.id}
                        className="border-b hover:bg-gray-100"
                      >
                        <td className="px-4 py-2 text-center text-blue-500">
                          {billing.booking?.user?.firstName || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center text-green-500">
                          {billing.booking?.user?.lastName || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center text-red-500">
                          {billing.bookingAmount || "0.00"}
                        </td>
                        <td className="px-4 py-2 text-center text-purple-500">
                          {billing.spaAmount || "0.00"}
                        </td>
                        <td className="px-4 py-2 text-center text-teal-500">
                          {billing.foodAmount || "0.00"}
                        </td>
                        <td className="px-4 py-2 text-center text-orange-500">
                          {billing.totalAmount || "0.00"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

        case "rooms_available":
          return (
            <div className="flex flex-col items-center justify-center">
              <div className="w-full border-2 border-gray-200 p-6">
                <h1 className="text-2xl font-bold mb-4 text-teal-500">
                  Available Rooms
                </h1>
  
                <div className="flex items-center mb-4">
                  {" "}
                  {/* Flex container */}
                  {/* Check-In Date Picker */}
                  <div className="mr-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Check-In Date
                    </label>
                    <input
                      type="date"
                      value={checkInDate.toISOString().split("T")[0]}
                      onChange={(e) => setCheckInDate(new Date(e.target.value))}
                      min={today.toISOString().split("T")[0]} // Set minimum to today
                      className="border border-gray-300 p-2 rounded"
                    />
                  </div>
                  {/* Check-Out Date Picker */}
                  <div className="mr-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Check-Out Date
                    </label>
                    <input
                      type="date"
                      value={checkOutDate.toISOString().split("T")[0]}
                      onChange={(e) => setCheckOutDate(new Date(e.target.value))}
                      min={checkInDate.toISOString().split("T")[0]} // Set minimum to selected check-in date
                      className="border border-gray-300 p-2 rounded"
                    />
                  </div>
                  {/* Room Category Dropdown */}
                  <div className="flex-1 mr-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Room Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="border border-gray-300 p-2 rounded w-60"
                    >
                      <option value="">All Categories</option>
                      {roomCategories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
  
                {/* Available Rooms Table */}
                <table className="min-w-full bg-white border border-gray-300">
                  <thead className="bg-gray-100 text-teal-600">
                    <tr>
                      <th className="px-4 py-2 text-center">Room Number</th>
                      <th className="px-4 py-2 text-center">Room Type</th>
                      <th className="px-4 py-2 text-center">No Of Adults</th>
                      <th className="px-4 py-2 text-center">No Of Children</th>
                      <th className="px-4 py-2 text-center">Price per Night</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-800">
                    {availableRooms.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-4 text-gray-500"
                        >
                          No rooms available.
                        </td>
                      </tr>
                    ) : (
                      availableRooms
                        .filter((room) =>
                          selectedCategory
                            ? room.roomCategory === selectedCategory
                            : true
                        )
                        .map((room) => (
                          <tr
                            key={room.roomId}
                            className="border-b hover:bg-gray-100"
                          >
                            <td className="px-4 py-2 text-center text-blue-500">
                              {room.roomNumber || "N/A"}
                            </td>
                            <td className="px-4 py-2 text-center text-green-500">
                              {room.roomCategory || "N/A"}
                            </td>
                            <td className="px-4 py-2 text-center text-red-500">
                              {room.noOfAdults || "0"}
                            </td>
                            <td className="px-4 py-2 text-center text-purple-500">
                              {room.noOfChildren || "N/A"}
                            </td>
                            <td className="px-4 py-2 text-center text-teal-500">
                              ₹{room.price || "Available"}
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );

      default:
        return (
          <div className="text-center text-gray-500">
            Select a view from the sidebar.
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen flex-col border-l-cyan-700">
      <div className="flex flex-1">
        <aside className="w-64 bg-slate-800 p-4 shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-teal-400">Dashboard</h2>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setCurrentView("bookings")}
                className="flex items-center w-full text-left p-3 text-teal-300 hover:bg-slate-700 rounded-md transition"
              >
                Bookings
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView("billings")}
                className="flex items-center w-full text-left p-3 text-teal-300 hover:bg-gray-700 rounded-md transition"
              >
                Billings
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView("rooms_available")}
                className="flex items-center w-full text-left p-3 text-teal-300 hover:bg-gray-700 rounded-md transition"
              >
                Rooms Available
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left p-3 text-teal-300 hover:bg-gray-700 rounded-md transition"
              >
                Logout
              </button>
              {showConfirm && (
                <div className="fixed top-0 left-0 right-0 flex items-start justify-center z-50 p-4">
                  <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                    <h3 className="text-lg font-semibold mb-4">
                      Confirm Logout
                    </h3>
                    <p className="mb-4">Are you sure you want to log out?</p>
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={cancelLogout}
                        className="bg-gray-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmLogout}
                        className="bg-red-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-red-600"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          </ul>
        </aside>
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Receptionist;
