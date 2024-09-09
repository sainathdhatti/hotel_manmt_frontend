"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/app/store/loginStore";
import useFoodOrderStore from "@/app/store/FoodOrderStore";
import useUserStore from "@/app/store/userRegisterStore";
import useBookingsStore, { Booking } from "@/app/store/bookingStore";
import {
  CalendarIcon,
  ShoppingBagIcon,
  CollectionIcon,
  CreditCardIcon,
  UserIcon,
  LogoutIcon,
} from "@heroicons/react/outline";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  aadharCardNumber: string;
}

const UserDashboard = () => {
  const router = useRouter();
  const { userId, isAuthenticated, logout } = useAuthStore((state) => ({
    userId: state.userId,
    isAuthenticated: state.isAuthenticated,
    logout: state.logout,
  }));

  const { getAllOrders, orders, updateOrder } = useFoodOrderStore((state) => ({
    getAllOrders: state.getAllOrders,
    orders: state.orders,
    updateOrder: state.updateOrder,
  }));

  const { users, getAllUsers, updateUser, deleteUser, getUserById } =
    useUserStore((state) => ({
      users: state.users,
      getAllUsers: state.getAllUsers,
      updateUser: state.updateUser,
      deleteUser: state.deleteUser,
      getUserById: state.getUserById,
    }));

  const { bookings, fetchBookingsByUserId, deleteBooking } = useBookingsStore(
    (state) => ({
      bookings: state.bookings,
      fetchBookingsByUserId: state.fetchBookingsByUserId,
      deleteBooking: state.deleteBooking,
    })
  );

  const [currentView, setCurrentView] = useState("bookings");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          await getAllOrders();
          await getAllUsers();
          if (userId) {
            await fetchBookingsByUserId(userId);
            const userDetails = await getUserById(userId); // Ensure this returns data
            console.log("userDetails", userDetails);
            setEditingUser(userDetails ?? null);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    } else {
      router.push("/");
    }
  }, [
    isAuthenticated,
    getAllOrders,
    getAllUsers,
    fetchBookingsByUserId,
    userId,
    getUserById,
  ]);

  useEffect(() => {
    if (userId) {
      setFilteredBookings(
        bookings.filter((booking) => booking.user.id === userId)
      );
    }
  }, [userId, bookings]);

  const [showConfirm, setShowConfirm] = useState(false);
  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    router.push("/");
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };

  const handleCancelOrder = async (orderId: number) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      await updateOrder(orderId, { status: "cancelled" });
      await getAllOrders();
    }
  };

  const handleUpdateUser = async () => {
    if (editingUser && userId) {
      const { aadharCardNumber, phoneNumber, firstName, lastName } =
        editingUser;

      const updatedUserData = {
        aadharCardNumber,
        phoneNumber,
        firstName,
        lastName,
      };

      try {
        await updateUser(userId, updatedUserData);
        alert("Profile updated successfully!");
      } catch (error) {
        alert("Failed to update profile.");
        console.error("Update error:", error);
      }
    }
  };

  const handleDeleteUser = async () => {
    if (editingUser) {
      try {
        await deleteUser(editingUser.id);
        alert("Account deleted successfully.");
        router.push("/login");
      } catch (error) {
        alert("Failed to delete account.");
        console.error("Delete error:", error);
      }
    }
  };

  const handleDelete = async (bookingId: number) => {
    try {
      await deleteBooking(bookingId);
      if (userId !== null) {
        await fetchBookingsByUserId(userId); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingUser) {
      setEditingUser({ ...editingUser, [name]: value });
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case "bookings":
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full border-2 border-gray-200   p-6">
              <h1 className="text-2xl font-bold mb-4  text-teal-500">
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
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="text-center py-4 text-gray-500"
                      >
                        No bookings available.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr
                        key={booking.bookingId}
                        className="border-b hover:bg-gray-100"
                      >
                        <td className="px-4 py-2 text-center text-blue-500">
                          {booking.user.firstName}
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
                          {booking.noOfChildrens || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center text-indigo-500">
                          {booking.noOfDays}
                        </td>
                        <td className="px-4 py-2 text-center text-yellow-500">
                          {booking.room.roomNumber}
                        </td>
                        <td className="px-4 py-2 text-center text-orange-500">
                          ₹{booking.TotalAmount}
                        </td>
                        <td className="px-4 py-2 text-center text-pink-500">
                          {booking.status}
                        </td>
                        <td className="px-4 py-2 flex justify-center space-x-2">
                          <button
                            onClick={() => handleDelete(booking.bookingId)}
                            className="bg-red-500 text-white py-1 px-2 rounded-md shadow-sm hover:bg-red-600"
                          >
                            Cancel
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
        case "food-orders":
          return(
            <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-2 py-2 text-center font-semibold">Customer Name</th>
                  <th className="px-2 py-2 text-center font-semibold">Customer Number</th>
                  <th className="px-2 py-2 text-center font-semibold">Food Name</th>
                  <th className="px-2 py-2 text-center font-semibold">Quantity</th>
                  <th className="px-2 py-2 text-center font-semibold">Price</th>
                  <th className="px-2 py-2 text-center font-semibold">Order Time</th>
                  <th className="px-2 py-2 text-center font-semibold">Delivered Time</th>
                  <th className="px-2 py-2 text-center font-semibold">Status</th>
                  <th className="px-2 py-2 text-center font-semibold">Total Amount</th>
                  <th className="px-2 py-2 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.flatMap((order) => {
                    const orderItems = Array.isArray(order.orderItems)
                      ? order.orderItems
                      : [];
          
                    return orderItems.map((item: any, index: number) => (
                      <tr
                        key={`${order.id}-${item.foodItemId}-${index}`}
                        className="border-b hover:bg-gray-50 even:bg-gray-100"
                      >
                        {index === 0 && (
                          <>
                            <td
                              rowSpan={order.orderItems.length}
                              className="px-2 py-2 text-gray-800"
                            >
                              {order.user?.firstName || "Unknown"}
                            </td>
                            <td
                              rowSpan={order.orderItems.length}
                              className="px-2 py-2 text-gray-800"
                            >
                              {order.user?.phoneNumber || "Unknown"}
                            </td>
                          </>
                        )}
                        <td className="px-2 py-2 text-gray-800">{item.food_name}</td>
                        <td className="px-2 py-2 text-gray-800">{item.quantity}</td>
                        <td className="px-2 py-2 text-gray-800">${item.price}</td>
                        {index === 0 && (
                          <>
                            <td
                              rowSpan={order.orderItems.length}
                              className="px-2 py-2 text-gray-800"
                            >
                              {new Date(order.order_time).toLocaleString()}
                            </td>
                            <td
                              rowSpan={order.orderItems.length}
                              className="px-2 py-2 text-gray-800"
                            >
                              {order.delivered_time
                                ? new Date(order.delivered_time).toLocaleString()
                                : "N/A"}
                            </td>
                            <td
                              rowSpan={order.orderItems.length}
                              className="px-6 py-4 text-gray-800"
                            >
                              {order.status}
                            </td>
                            <td
                              rowSpan={order.orderItems.length}
                              className="px-6 py-4 text-gray-800"
                            >
                              ${order.totalAmount}
                            </td>
                          </>
                        )}
                        {index === 0 && (
                          <td
                            rowSpan={order.orderItems.length}
                            className="px-6 py-4 text-center"
                          >
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              disabled={order.status === "delivered"}
                              className={`bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-300 ${
                                order.status === "delivered"
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              Cancel
                            </button>
                          </td>
                        )}
                      </tr>
                    ));
                  })
                ) : (
                  <tr>
                    <td colSpan={10} className="text-center py-4 text-gray-500">
                      No food orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
        
            );
        

      case "profile":
        return (
          <div className="overflow-x-auto w-full border-2 border-gray-200 p-6 bg-white shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-teal-500">
              Profile Information
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={editingUser?.firstName || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border text-blue-500 border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={editingUser?.lastName || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border p-2 text-blue-500 border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editingUser?.email || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border text-gray-500 border-gray-300 rounded-md shadow-sm"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={editingUser?.phoneNumber || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border text-blue-500 border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 font-bold">
                  Aadhar Card Number
                </label>
                <input
                  type="text"
                  name="aadharCardNumber"
                  value={editingUser?.aadharCardNumber || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border text-gray-500 border-gray-300 rounded-md shadow-sm"
                  disabled
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-4 mt-6">
              <button
                onClick={handleUpdateUser}
                className="bg-green-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Update Profile
              </button>
              <button
                onClick={handleDeleteUser}
                className="bg-red-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mt-4 md:mt-0"
              >
                Delete Account
              </button>
              <button
                onClick={() => router.push("/forgetpassword")}
                className="bg-teal-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 mt-4 md:mt-0"
              >
                Reset Password
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-400">Content not found</div>
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
                <CalendarIcon className="w-6 h-6 mr-3 text-teal-300" />
                Bookings
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView("food-orders")}
                className="flex items-center w-full text-left p-3 text-teal-300 hover:bg-gray-700 rounded-md transition"
              >
                <ShoppingBagIcon className="w-6 h-6 mr-3 text-teal-300" />
                Food Orders
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView("spa")}
                className="flex items-center w-full text-left p-3 text-teal-300 hover:bg-gray-700 rounded-md transition"
              >
                <CollectionIcon className="w-6 h-6 mr-3 text-teal-300" />
                Spa
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView("billing")}
                className="flex items-center w-full text-left p-3 text-teal-300 hover:bg-gray-700 rounded-md transition"
              >
                <CreditCardIcon className="w-6 h-6 mr-3 text-teal-300" />
                Billing Details
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView("profile")}
                className="flex items-center w-full text-left p-3 text-teal-300 hover:bg-gray-700 rounded-md transition"
              >
                <UserIcon className="w-6 h-6 mr-3 text-teal-300" />
                Profile
              </button>
            </li>
            <li>
              <div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left p-3 text-teal-300 hover:bg-gray-700 rounded-md transition"
                >
                  <LogoutIcon className="w-6 h-6 mr-3 text-teal-300" />
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
              </div>
            </li>
          </ul>
        </aside>
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default UserDashboard;
