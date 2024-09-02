"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/navbar";
import useFoodOrderStore from "@/app/store/FoodOrderStore";
import useAuthStore from "@/app/store/loginStore";
import useUserStore from "@/app/store/userRegisterStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import useBookingsStore from "@/app/store/bookingStore";
import { Booking } from "@/app/store/bookingStore";

// Define the User type to use with editingUser
interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  aadharCardNumber: string;
}

const UserDashboard = () => {
  const [currentView, setCurrentView] = useState("food-orders");
  const router = useRouter();
  const { userId, isAuthenticated } = useAuthStore((state) => ({
    token: state.token,
    userId: state.userId,
    isAuthenticated: state.isAuthenticated,
  }));
  const { getAllOrders, orders, updateOrder } = useFoodOrderStore((state) => ({
    getAllOrders: state.getAllOrders,
    orders: state.orders,
    updateOrder: state.updateOrder,
  }));
  const {
    user,
    getAllUsers,
    updateUser,
    loading,
    error,
    deleteUser,
  } = useUserStore((state) => ({
    user: state.users.find((u) => u.id === userId) || null,
    getAllUsers: state.getAllUsers,
    updateUser: state.updateUser,
    deleteUser: state.deleteUser,
    loading: state.loading,
    error: state.error,
  }));

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showForm,setShowForm]=useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        await getAllOrders();
        await getAllUsers();
      };
      fetchData();
    }
  }, [isAuthenticated, getAllOrders, getAllUsers]);

  useEffect(() => {
    if (user) {
      setEditingUser({ ...user });
    }
  }, [user]);

  const handleNavigation = (view: string) => {
    setCurrentView(view);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userId");
      router.push("/");
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (confirmCancel) {
      await updateOrder(orderId, { status: "cancelled" });
      await getAllOrders();
    }
  };

  const handleUpdateUser = async () => {
    if (editingUser && userId !== null) {
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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (confirmDelete && editingUser) {
      try {
        await deleteUser(editingUser.id);
        alert("Account deleted successfully.");
        router.push("/");
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

  // Filter out orders with status 'cancelled'
  const filteredOrders = orders.filter(
    (order) =>
      order.user && order.user.id === userId && order.status !== "cancelled"
  );

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

  const handleUpdateBooking = async (bookingId:number) => {
    if (bookingId) {
      try {
        // Implement the booking update logic here
        //setShowForm(false);
        router.push(`/dashboard/userlogin/booking/${bookingId}`)
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
        // return <div>Bookings Content Here</div>;
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full bg-white shadow-md rounded-lg p-6 mt-10">
              <h1 className="text-2xl font-bold mb-4 text-center">
                Your Bookings
              </h1>
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
                          {booking.noOfChildrens}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {booking.noOfDays}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {booking.room.roomNumber}
                        </td>
                        <td className="px-4 py-2 text-center">
                          &#x20B9;{booking.TotalAmount}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {booking.status}
                        </td>
                        <td className="px-4 py-2 flex justify-center space-x-5">
                          <button
                            className="btn btn-warning btn-outline"
                            onClick={() => handleUpdateBooking(booking.bookingId)
                              // router.push(`/dashboard/userlogin/booking/${booking.bookingId}`)
                            }
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>

                          <button
                            className="btn btn-warning btn-outline flex items-center justify-center"
                            onClick={() => handleDelete(booking.bookingId)}
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="text-red-500"
                            />
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
        if (filteredOrders.length === 0) {
          return <div>No orders found</div>;
        }
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 border-b text-left text-gray-600">
                    User Name
                  </th>
                  <th className="py-3 px-4 border-b text-left text-gray-600">
                    Order Time
                  </th>
                  <th className="py-3 px-4 border-b text-left text-gray-600">
                    Status
                  </th>
                  <th className="py-3 px-4 border-b text-left text-gray-600">
                    Total Amount
                  </th>
                  <th className="py-3 px-4 border-b text-left text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">
                      {order.user ? order.user.firstName : "Unknown"}
                    </td>
                    <td className="py-3 px-4 border-b">
                      {new Date(order.order_time).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 border-b">{order.status}</td>
                    <td className="py-3 px-4 border-b">${order.totalAmount}</td>
                    <td className="py-3 px-4 border-b">
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 font-semibold py-1 px-3 rounded"
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

      case "spa-orders":
        return <div>Spa Orders Content Here</div>;

      case "profile":
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error}</div>;
        if (!editingUser) return <div>No user details available</div>;

        return (
          <div className="space-y-6 p-4 bg-white shadow-md rounded-lg">
            {/* Profile Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Profile Settings
              </h2>
              <form className="space-y-4">
                {/* Grid layout for two columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={editingUser?.firstName || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={editingUser?.lastName || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editingUser?.email || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={editingUser?.phoneNumber || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Aadhar Card Number
                    </label>
                    <input
                      type="text"
                      name="aadharCardNumber"
                      value={editingUser?.aadharCardNumber || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Update and Delete Buttons */}
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={handleUpdateUser}
                    className="bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 font-semibold py-2 px-4 rounded-lg"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteUser}
                    className="bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 font-semibold py-2 px-4 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </form>
            </div>

            {/* Password Reset Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800">
                Change Password
              </h2>
              <form className="space-y-4">
                {/* <div>
                <label className="block text-gray-700 font-medium mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={newPassword || ""}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div> */}

                {/* Password Reset Button */}
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    //onClick={handleUpdatePassword}
                    className="bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 font-semibold py-2 px-4 rounded-lg"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      default:
        return <div>Select a view</div>;
    }
  };

  return (
    <div className="flex h-screen pt-28">
      <Navbar />
      <div className="bg-gray-200 w-64 p-4">
        <div className="mb-4 text-lg font-semibold">Dashboard</div>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => handleNavigation("bookings")}
              className={`w-full text-left p-2 hover:bg-gray-300 rounded ${
                currentView === "bookings" ? "bg-gray-300" : ""
              }`}
            >
              Bookings
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("food-orders")}
              className={`w-full text-left p-2 hover:bg-gray-300 rounded ${
                currentView === "food-orders" ? "bg-gray-300" : ""
              }`}
            >
              Food Orders
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("spa-orders")}
              className={`w-full text-left p-2 hover:bg-gray-300 rounded ${
                currentView === "spa-orders" ? "bg-gray-300" : ""
              }`}
            >
              Spa Orders
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("profile")}
              className={`w-full text-left p-2 hover:bg-gray-300 rounded ${
                currentView === "profile" ? "bg-gray-300" : ""
              }`}
            >
              Profile Settings
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full text-left p-2 hover:bg-red-500 text-black rounded"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      <main className="flex-1 p-4 overflow-auto">{renderContent()}</main>
    </div>
  );
};

export default UserDashboard;
