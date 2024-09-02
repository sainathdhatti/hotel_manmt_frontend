"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/app/store/loginStore";
import useFoodOrderStore from "@/app/store/FoodOrderStore";
import useUserStore from "@/app/store/userRegisterStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import useBookingsStore from "@/app/store/bookingStore";
import { Booking } from "@/app/store/bookingStore";

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
  const { userId, isAuthenticated } = useAuthStore((state) => ({
    userId: state.userId,
    isAuthenticated: state.isAuthenticated,
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

  const [currentView, setCurrentView] = useState("food-orders");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);

  const bookings = useBookingsStore((state) => state.bookings);
  const fetchBookingsByUserId = useBookingsStore((state) => state.fetchBookingsByUserId);
  const deleteBooking = useBookingsStore((state) => state.deleteBooking);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        await getAllOrders();
        await getAllUsers();
      };
      fetchData();
    } else {
      router.push("/"); // Redirect if not authenticated
    }
  }, [isAuthenticated, getAllOrders, getAllUsers, router]);

  useEffect(() => {
    if (userId) {
      const user = users.find((u) => u.id === userId) || null;
      setEditingUser(user);
    }
  }, [users, userId]);

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
      useAuthStore.getState().logout();
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
    if (editingUser && userId !== null) {
      try {
        await updateUser(userId, { ...editingUser });
        alert("Profile updated successfully!");
      } catch (error) {
        alert("Failed to update profile.");
        console.error("Update error:", error);
      }
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm("Are you sure you want to delete your account?") && editingUser) {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingUser) {
      setEditingUser({ ...editingUser, [name]: value });
    }
  };

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

  const handleUpdateBooking = async (bookingId: number) => {
    if (bookingId) {
      try {
        router.push(`/dashboard/userlogin/booking/${bookingId}`);
        if (userId !== null) {
          await fetchBookingsByUserId(userId);
        }
      } catch (error) {
        console.error("Error updating booking:", error);
        alert("Failed to update booking.");
      }
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case "bookings":
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
                      <td colSpan={10} className="text-center py-4">No bookings available.</td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking.bookingId} className="border-b">
                        <td className="px-4 py-2 text-center">{booking.user.firstName}</td>
                        <td className="px-4 py-2 text-center">{new Date(booking.checkInDate).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-center">{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-center">{booking.noOfAdults}</td>
                        <td className="px-4 py-2 text-center">{booking.noOfChildrens}</td>
                        <td className="px-4 py-2 text-center">{booking.noOfDays}</td>
                        <td className="px-4 py-2 text-center">{booking.room.roomNumber}</td>
                        <td className="px-4 py-2 text-center">&#x20B9;{booking.TotalAmount}</td>
                        <td className="px-4 py-2 text-center">{booking.status}</td>
                        <td className="px-4 py-2 flex justify-center space-x-5">
                          <button
                            className="btn btn-warning btn-outline"
                            onClick={() => handleUpdateBooking(booking.bookingId)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            className="btn btn-warning btn-outline flex items-center justify-center"
                            onClick={() => handleDelete(booking.bookingId)}
                          >
                            <FontAwesomeIcon icon={faTrash} className="text-red-500" />
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
                  <th className="py-3 px-4 border-b text-left text-gray-600">Items</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600">Total Amount</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600">Status</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-2 px-4 border-b text-gray-700">{order.userName}</td>
                    <td className="py-2 px-4 border-b text-gray-700">{new Date(order.orderTime).toLocaleString()}</td>
                    <td className="py-2 px-4 border-b text-gray-700">
                      {order.items.map((item) => (
                        <div key={item.id}>
                          {item.name} - {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="py-2 px-4 border-b text-gray-700">&#x20B9;{order.totalAmount}</td>
                    <td className="py-2 px-4 border-b text-gray-700">{order.status}</td>
                    <td className="py-2 px-4 border-b text-gray-700">
                      {order.status !== "cancelled" && (
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          Cancel
                        </button>
                      )}
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
          </div>
        );

      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <div className="p-6">
      <nav className="mb-4">
        <button onClick={() => setCurrentView("food-orders")} className="mr-4">Food Orders</button>
        <button onClick={() => setCurrentView("bookings")} className="mr-4">Bookings</button>
        <button onClick={() => setCurrentView("profile")}>Profile</button>
        <button onClick={handleLogout} className="ml-4 bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </nav>
      {renderContent()}
    </div>
  );
};

export default UserDashboard;
