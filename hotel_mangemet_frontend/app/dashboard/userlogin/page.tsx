"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/app/store/loginStore";
import useFoodOrderStore from "@/app/store/FoodOrderStore";
import useUserStore from "@/app/store/userRegisterStore";
import useBookingsStore, { Booking } from "@/app/store/bookingStore";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

  const { users, getAllUsers, updateUser, deleteUser, error } = useUserStore((state) => ({
    users: state.users,
    getAllUsers: state.getAllUsers,
    updateUser: state.updateUser,
    deleteUser: state.deleteUser,
    error: state.error,
  }));

  const { bookings, fetchBookingsByUserId, deleteBooking } = useBookingsStore((state) => ({
    bookings: state.bookings,
    fetchBookingsByUserId: state.fetchBookingsByUserId,
    deleteBooking: state.deleteBooking,
  }));

  const [currentView, setCurrentView] = useState("food-orders");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        await getAllOrders();
        await getAllUsers();
        if (userId) await fetchBookingsByUserId(userId);
      };
      fetchData();
    } else {
      router.push("/"); // Redirect if not authenticated
    }
  }, [isAuthenticated, getAllOrders, getAllUsers, fetchBookingsByUserId, userId, router]);

  useEffect(() => {
    if (userId) {
      setFilteredBookings(bookings.filter(booking => booking.user.id === userId));
    }
  }, [userId, bookings]);

  useEffect(() => {
    if (userId !== null) {
      fetchBookingsByUserId(userId);
    }
  }, [userId, fetchBookingsByUserId]);

  useEffect(() => {
    setFilteredBookings(bookings);
  }, [bookings]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      router.push("/");
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      await updateOrder(orderId, { status: "cancelled" });
      await getAllOrders();
    }
  };

  const handleUpdateUser = async () => {
    if (editingUser && userId) {
      try {
        await updateUser(userId, editingUser);
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
            <div className="w-full bg-white shadow-md rounded-lg p-6">
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
                      <td colSpan={10} className="text-center py-4">No bookings available.</td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking.bookingId} className="border-b">
                        <td className="px-4 py-2 text-center">{booking.user.firstName}</td>
                        <td className="px-4 py-2 text-center">{new Date(booking.checkInDate).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-center">{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-center">{booking.noOfAdults || "N/A"}</td>
                        <td className="px-4 py-2 text-center">{booking.noOfChildrens || "N/A"}</td>
                        <td className="px-4 py-2 text-center">{booking.noOfDays}</td>
                        <td className="px-4 py-2 text-center">{booking.room.roomNumber}</td>
                        <td className="px-4 py-2 text-center">₹{booking.TotalAmount}</td>
                        <td className="px-4 py-2 text-center">{booking.status}</td>
                        <td className="px-4 py-2 flex justify-center space-x-5">
                          <button
                            onClick={() => handleDelete(booking.bookingId)}
                            className="btn btn-warning btn-outline flex items-center justify-center bg-red-500 p-1 text-white"
                          >
                            cancel
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
        if (orders.length === 0) {
          return <div>No orders found</div>;
        }
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 border-b text-left text-gray-600">User Name</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600">Order Time</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600">Status</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600">Amount</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.filter(order => order.user?.id === userId && order.status !== 'cancelled').map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 px-4 border-b text-gray-800">{order.user?.firstName}</td>
                    <td className="py-3 px-4 border-b text-gray-800">{new Date(order.order_time).toLocaleString()}</td>
                    <td>{order.status}</td>
                    <td className="py-3 px-4 border-b text-gray-800">{order.totalAmount}</td>
                    <td className="py-3 px-4 border-b text-gray-800">
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={order.status === 'delivered'}
                        className={`py-1 px-2 rounded ${order.status === 'delivered' ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'}`}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "profile":
        return (
          <div className="bg-white shadow-md rounded-lg p-6 mt-10">
            <h1 className="text-2xl font-bold mb-4">Profile Information</h1>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={editingUser?.firstName || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={editingUser?.lastName || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editingUser?.email || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={editingUser?.phoneNumber || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Aadhar Card Number</label>
                <input
                  type="text"
                  name="aadharCardNumber"
                  value={editingUser?.aadharCardNumber || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleUpdateUser}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete Account
                </button>
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
                onClick={() => router.push('/forgetpassword')}
                className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mt-4 md:mt-0"
              >
                Reset Password
              </button>
            </div>
          </div>
        );

      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-200 p-2">
          <h2 className="text-lg font-bold mb-4">Dashboard</h2>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setCurrentView("bookings")}
                className="block w-full text-left p-2 text-gray-700 hover:bg-gray-300"
              >
                Bookings
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView("food-orders")}
                className="block w-full text-left p-2 text-gray-700 hover:bg-gray-300"
              >
                Food Orders
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView("spa")}
                className="block w-full text-left p-2 text-gray-700 hover:bg-gray-300"
              >
                Spa
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView("billing")}
                className="block w-full text-left p-2 text-gray-700 hover:bg-gray-300"
              >
                Billing Details
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView("profile")}
                className="block w-full text-left p-2 text-gray-700 hover:bg-gray-300"
              >
                Profile
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="block w-full text-left p-2 text-gray-700 hover:bg-gray-300"
              >
                Logout
              </button>
            </li>
          </ul>
        </aside>
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default UserDashboard;
