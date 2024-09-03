import { create } from 'zustand';

interface OrderItem {
  id: number;
  foodItemId: number;
  quantity: number;
  price: number;
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
}

interface FoodOrderStoreState {
  orders: FoodOrder[];
  currentOrder: FoodOrder | null;
  getAllOrders: () => Promise<void>;
  getOrderById: (id: number) => Promise<void>;
  createOrder: (userId: number, orderItems: { foodItemId: number; quantity: number }[]) => Promise<void>;
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
    set({ orders: data });
  },
  

  getOrderById: async (id: number) => {
    const response = await fetch(`${baseUrl}/orders/${id}`);
    const data = await response.json();
    set({ currentOrder: data });
  },

  createOrder: async (userId: number, orderItems: { foodItemId: number; quantity: number }[]) => {
    const response = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, orderItems }),
    });
    const newOrder = await response.json();
    set((state) => ({ orders: [...state.orders, newOrder] }));
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
