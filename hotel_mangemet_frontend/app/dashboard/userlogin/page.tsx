"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/app/store/loginStore";
import useFoodOrderStore from "@/app/store/FoodOrderStore";
import useUserStore from "@/app/store/userRegisterStore";

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

  const { users, getAllUsers, updateUser, deleteUser, error } = useUserStore(
    (state) => ({
      users: state.users,
      getAllUsers: state.getAllUsers,
      updateUser: state.updateUser,
      deleteUser: state.deleteUser,
      error: state.error,
    })
  );

  const [currentView, setCurrentView] = useState("food-orders");
  const [editingUser, setEditingUser] = useState<User | null>(null);

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
        let userdata={...editingUser}
        await updateUser(userId, userdata);
        alert("Profile updated successfully!");
      } catch (error) {
        alert("Failed to update profile.");
        console.error("Update error:", error);
      }
    }
  };

  const handleDeleteUser = async () => {
    if (
      window.confirm("Are you sure you want to delete your account?") &&
      editingUser
    ) {
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

  const filteredOrders = orders.filter(
    (order) =>
      order.user && order.user.id === userId && order.status !== "cancelled"
  );

  const renderContent = () => {
    switch (currentView) {
      case "bookings":
        return <div>No bookings found</div>;
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
                    status
                  </th>
                  <th className="py-3 px-4 border-b text-left text-gray-600">
                    Amount
                  </th>
                  <th className="py-3 px-4 border-b text-left text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 px-4 border-b text-gray-800">
                      {order.user?.firstName}
                    </td>
                    <td className="py-3 px-4 border-b text-gray-800">
                      {new Date(order.order_time).toLocaleString()}
                    </td>
                    <td>{order.status}</td>
                    <td className="py-3 px-4 border-b text-gray-800">
                      {order.totalAmount}
                    </td>
                    <td className="py-3 px-4 border-b text-gray-800">
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="bg-red-500 text-white py-1 px-2 rounded"
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
      case "spa":
        return <div>No spa bookings found</div>;
      case "billing":
        return <div>No billing found</div>;
      case "profile":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">User Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-4">
                  <span className="text-gray-700">First Name</span>
                  <input
                    type="text"
                    name="firstName"
                    value={editingUser?.firstName || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 p-3 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </label>
                <label className="block mb-4">
                  <span className="text-gray-700">Last Name</span>
                  <input
                    type="text"
                    name="lastName"
                    value={editingUser?.lastName || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 p-3 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </label>
                <label className="block mb-4">
                  <span className="text-gray-700">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={editingUser?.email || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 p-3 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </label>
              </div>
              <div>
                <label className="block mb-4">
                  <span className="text-gray-700">Phone Number</span>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={editingUser?.phoneNumber || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 p-3 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </label>
                <label className="block mb-4">
                  <span className="text-gray-700">Aadhar Card Number</span>
                  <input
                    type="text"
                    name="aadharCardNumber"
                    value={editingUser?.aadharCardNumber || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 p-3 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </label>
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
                onClick={() =>
                  router.push('/forgetpassword')
                }
                className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mt-4 md:mt-0"
              >
                Reset Password
              </button>
            </div>
          </div>
        );
      default:
        return <div>Select a view</div>;
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-200 p-4">
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
                spa
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView("billing")}
                className="block w-full text-left p-2 text-gray-700 hover:bg-gray-300"
              >
                Billing details
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
