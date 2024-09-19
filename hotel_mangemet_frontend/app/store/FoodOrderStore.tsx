import { toast } from 'react-toastify';
import { create } from 'zustand';

export interface OrderItem {
  id: number;
  foodItemId: number;
  quantity: number;
  price: number;
  food_name:string
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}
interface FoodOrder {
  id: number; // Note the key here matches `order_id`
  totalAmount: string; // Note the type here is string
  order_time: string; // Date as ISO string
  delivered_time?: string | null; // Date as ISO string or null
  status: string;
  orderItems: OrderItem[]; // Adjust based on actual structure
  user: User; // User object
  bookingId: number;
}

interface FoodOrderStoreState {
  orders: FoodOrder[];
  currentOrder: FoodOrder | null;
  getAllOrders: () => Promise<void>;
  getOrderById: (id: number) => Promise<void>;
  createOrder: (userId: number, orderItems: { foodItemId: number; quantity: number }[],bookingId:number) => Promise<void>;
  updateOrder: (id: number, updatedOrder: Partial<FoodOrder>) => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;
  calculateTotalAmount: (orderItems: { price: number; quantity: number }[]) => number;
}

const baseUrl = 'http://localhost:5000'; // Change to your API base URL

const useFoodOrderStore = create<FoodOrderStoreState>((set) => ({
  orders: [],
  currentOrder: null,

  getAllOrders: async () => {
    const response = await fetch(`${baseUrl}/orders`);
    const data = await response.json();
    console.log('Orders in Store:', data); // Debugging line
    set({ orders: Array.isArray(data) ? data : [] });
  },
  

  getOrderById: async (id: number) => {
    const response = await fetch(`${baseUrl}/orders/${id}`);
    const data = await response.json();
    set({ currentOrder: data });
  },

  createOrder: async (userId: number, orderItems: { foodItemId: number; quantity: number }[], bookingId: number) => {
    try {
      const response = await fetch(`${baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, orderItems, bookingId }),
      });
  
      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        const errorData = await response.json(); // Attempt to parse error response
        throw new Error(errorData.message || 'Failed to create order'); // Customize based on your API's error structure
      }
  
      const newOrder = await response.json();
      set((state) => ({ orders: [...state.orders, newOrder] }));
      toast.success("Order placed successfully!");
    } catch (error:any) {
      console.error('Error creating order:', error);
      // You can also show a toast or alert with the error message here if you want
      toast.error(`you must be CHECKED_IN to order food.`);
    }
  },
  

  updateOrder: async (id: number, updatedOrder: Partial<FoodOrder>) => {
    const response = await fetch(`${baseUrl}/orders/${id}`, {
      method: 'PUT', // Fixed typo from 'PuT' to 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedOrder),
    });
    const updated = await response.json();
    set((state) => ({
      orders: state.orders.map((order) => (order.id === id ? updated : order)),
      currentOrder: state.currentOrder && state.currentOrder.id === id ? updated : state.currentOrder,
    }));
    
  },

  deleteOrder: async (id: number) => {
    const response = await fetch(`${baseUrl}/orders/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      set((state) => ({
        orders: state.orders.filter((order) => order.id !== id),
        currentOrder: state.currentOrder && state.currentOrder.id === id ? null : state.currentOrder,
      }));
    }
  },

  calculateTotalAmount: (orderItems: { price: number; quantity: number }[]) => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));

export default useFoodOrderStore;
