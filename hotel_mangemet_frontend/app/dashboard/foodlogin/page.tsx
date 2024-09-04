'use client';
import React, { useEffect, useState } from 'react';
import useFoodOrderStore from '@/app/store/FoodOrderStore';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/app/store/loginStore';

interface UpdatedData {
  status: string;
}

const Food = () => {
  const router = useRouter();
  const { orders, getAllOrders, updateOrder } = useFoodOrderStore((state) => ({
    orders: state.orders,
    getAllOrders: state.getAllOrders,
    updateOrder: state.updateOrder
  }));

  const [sortedOrders, setSortedOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      await getAllOrders();
    };
    fetchOrders();
  }, [getAllOrders]);

  useEffect(() => {
    // Sort orders by order_time in descending order
    const sorted = [...orders].sort((a, b) => new Date(b.order_time).getTime() - new Date(a.order_time).getTime());
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
    useAuthStore.getState().logout();
    router.push('/overview');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-300"
      >
        Logout
      </button>
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Food Orders</h1>
      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Customer Name</th>
              <th className="px-6 py-4 text-left font-semibold">Customer Number</th>
              <th className="px-6 py-4 text-left font-semibold">Food Name</th>
              <th className="px-6 py-4 text-left font-semibold">Quantity</th>
              <th className="px-6 py-4 text-left font-semibold">Price</th>
              <th className="px-6 py-4 text-left font-semibold">Order Time</th>
              <th className="px-6 py-4 text-left font-semibold">Delivered Time</th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-left font-semibold">Total</th>
              <th className="px-6 py-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.length > 0 ? (
              sortedOrders.flatMap(order => 
                order.orderItems.map((item: any, index: number) => (
                  <tr key={`${order.id}-${item.foodItemId}-${index}`} className="border-b hover:bg-gray-50 even:bg-gray-100">
                    {index === 0 && (
                      <>
                        <td rowSpan={order.orderItems.length} className="px-6 py-4 text-gray-800">{order.user?.firstName || 'Unknown'}</td>
                        <td rowSpan={order.orderItems.length} className="px-6 py-4 text-gray-800">{order.user?.phoneNumber || 'Unknown'}</td>
                      </>
                    )}
                    <td className="px-6 py-4 text-gray-800">{item.food_name}</td>
                    <td className="px-6 py-4 text-gray-800">{item.quantity}</td>
                    <td className="px-6 py-4 text-gray-800">${item.price}</td>
                    {index === 0 && (
                      <>
                        <td rowSpan={order.orderItems.length} className="px-6 py-4 text-gray-800">{new Date(order.order_time).toLocaleString()}</td>
                        <td rowSpan={order.orderItems.length} className="px-6 py-4 text-gray-800">{order.delivered_time ? new Date(order.delivered_time).toLocaleString() : 'N/A'}</td>
                        <td rowSpan={order.orderItems.length} className="px-6 py-4 text-gray-800">{order.status}</td>
                        <td rowSpan={order.orderItems.length} className="px-6 py-4 text-gray-800">${order.totalAmount}</td>
                      </>
                    )}
                    {index === 0 && (
                      <td rowSpan={order.orderItems.length} className="px-6 py-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleStatusChange(order.id, 'cancelled')}
                            disabled={order.status === 'delivered'}
                            className={`bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-300 ${order.status === 'delivered' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleStatusChange(order.id, 'confirmed')}
                            disabled={order.status === 'delivered' || order.status === 'cancelled'}
                            className={`bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-300 ${order.status === 'delivered' || order.status === 'cancelled' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleStatusChange(order.id, 'delivered')}
                            disabled={order.status === 'delivered'}
                            className={`bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition duration-300 ${order.status === 'delivered' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            Deliver
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td colSpan={10} className="px-6 py-4 text-center text-gray-600">
                  No orders available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Food;
