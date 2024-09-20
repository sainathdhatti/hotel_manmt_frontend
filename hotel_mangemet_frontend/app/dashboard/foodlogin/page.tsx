"use client";

import React, { useEffect, useState } from "react";
import useFoodOrderStore from "@/app/store/FoodOrderStore";
import { useRouter } from "next/navigation";
import useAuthStore from "@/app/store/loginStore";
import Pagination from "../adminlogin/pagination/page";

interface UpdatedData {
  status: string;
}

const Food = () => {
  const router = useRouter();
  const { orders, getAllOrders, updateOrder } = useFoodOrderStore((state) => ({
    orders: state.orders,
    getAllOrders: state.getAllOrders,
    updateOrder: state.updateOrder,
  }));

  const { login, isAuthenticated } = useAuthStore((state) => ({
    login: state.login,
    isAuthenticated: state.isAuthenticated,
  }));

  const [sortedOrders, setSortedOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isAuthenticated) {
      getAllOrders();
    }
    setLoading(false); 
  }, [isAuthenticated, getAllOrders]);

  useEffect(() => {
    const sorted = [...orders].sort(
      (a, b) =>
        new Date(b.order_time).getTime() - new Date(a.order_time).getTime()
    );
    setSortedOrders(sorted);
  }, [orders]);

  const handleStatusChange = async (orderId: number, status: string) => {
    const updatedData: UpdatedData = { status };
    try {
      await updateOrder(orderId, updatedData);
      await getAllOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      useAuthStore.getState().logout();
      router.push("/dashboard/foodlogin");
    }
  };

  const filteredOrders = sortedOrders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  const totalPages = Math.ceil(filteredOrders.length / 5);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * 5,
    currentPage * 5
  );

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password }, "foodlogin");
      if (isAuthenticated) {
        setEmail(""); // Clear email on successful login
        setPassword(""); // Clear password on successful login
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Render loading state until authentication is confirmed
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      {!isAuthenticated ? (
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/login.jpeg")' }}
        >
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
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
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
          <h1 className="text-4xl font-bold mb-8 text-gray-800">Food Orders</h1>

          <div className="mb-4 flex justify-start">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800"
            >
              <option value="all">Filter</option>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                
                  <th className="px-2 py-2 text-center font-semibold">
                    Customer Name
                  </th>
                  <th className="px-2 py-2 text-center font-semibold">
                    Customer Number
                  </th>
                  <th className="px-2 py-2 text-center font-semibold">
                    Food Name
                  </th>
                  <th className="px-2 py-2 text-center font-semibold">
                    Quantity
                  </th>
                  <th className="px-2 py-2 text-center font-semibold">Price</th>
                  <th className="px-2 py-2 text-center font-semibold">
                    Order Time
                  </th>
                  <th className="px-2 py-2 text-center font-semibold">
                    Delivered Time
                  </th>
                  <th className="px-2 py-2 text-center font-semibold">
                    Status
                  </th>
                  <th className="px-2 py-2 text-center font-semibold">
                    Total Amount
                  </th>
                  <th className="px-2 py-2 text-center font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.flatMap((order) => {
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
                        <td className="px-2 py-2 text-gray-800">
                          {item.food_name}
                        </td>
                        <td className="px-2 py-2 text-gray-800">
                          {item.quantity}
                        </td>
                        <td className="px-2 py-2 text-gray-800">
                          ${item.price}
                        </td>
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
                                ? new Date(
                                    order.delivered_time
                                  ).toLocaleString()
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
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() =>
                                  handleStatusChange(order.id, "cancelled")
                                }
                                disabled={order.status === "delivered"}
                                className={`bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-300 ${
                                  order.status === "delivered"
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusChange(order.id, "confirmed")
                                }
                                disabled={
                                  order.status === "delivered" ||
                                  order.status === "cancelled"
                                }
                                className={`bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-300 ${
                                  order.status === "delivered" ||
                                  order.status === "cancelled"
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusChange(order.id, "delivered")
                                }
                                disabled={order.status === "delivered"}
                                className={`bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition duration-300 ${
                                  order.status === "delivered"
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                Deliver
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ));
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-6 py-4 text-center text-gray-600"
                    >
                      No orders available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default Food;
