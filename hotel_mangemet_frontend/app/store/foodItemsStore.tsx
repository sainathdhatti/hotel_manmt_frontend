
import { create } from "zustand";

const baseUrl = "http://localhost:5000/fooditem";

export interface FoodItemsStoreState {
  foodItems: FoodItem[];
  foodItem: FoodItem | null; // Make this nullable to handle cases when no food item is selected
  getAllFoodItems: () => Promise<void>;
  getFoodItem: (id: number) => Promise<void>;
  addFoodItem: (data: {
    food_name: string;
    food_price: number;
    food_description: string;
    food_image: string;
   // bookingId:number;
  }) => Promise<void>;
  updateFoodItem: (data: FoodItem) => Promise<void>;
  deleteFoodItem: (id: number) => Promise<void>;
}

export interface FoodItem {
  food_id: number;
  food_name: string;
  food_price: number;
  food_description: string;
  food_image: string;
 // bookingId:number;
}

const useFoodItemsStore = create<FoodItemsStoreState>((set) => ({
  foodItems: [],
  foodItem: null,

  getAllFoodItems: async () => {
    const response = await fetch(`${baseUrl}`);
    if (!response.ok) {
      console.error("Failed to fetch food items");
      return;
    }
    const data = await response.json();
    set(() => ({ foodItems: data }));
  },

  getFoodItem: async (id: number) => {
    const response = await fetch(`${baseUrl}/${id}`);
    if (!response.ok) {
      console.error(`Failed to fetch food item with id ${id}`);
      return;
    }
    const data = await response.json();
    set(() => ({ foodItem: data }));
  },

  addFoodItem: async (data: {
    food_name: string;
    food_price: number;
    food_description: string;
    food_image: string;

   // bookingId:number;

  

  }) => {
    const response = await fetch(`${baseUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: sessionStorage.token || "",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      console.error("Failed to add food item");
      return;
    }
    const newFoodItem = await response.json();
    set((state) => ({ foodItems: [...state.foodItems, newFoodItem] }));
  },

  updateFoodItem: async (data: FoodItem) => {
    const response = await fetch(`${baseUrl}/${data.food_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: sessionStorage.token || "",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      console.error("Failed to update food item");
      return;
    }
    const updatedFoodItem = await response.json();
    set((state) => ({
      foodItems: state.foodItems.map((item) =>
        item.food_id === data.food_id ? updatedFoodItem : item
      ),
      //foodItem: state.foodItem?.food_id === data.food_id ? updatedFoodItem : state.foodItem,
    }));
  },

  deleteFoodItem: async (id: number) => {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: "DELETE",
      headers: { authorization: sessionStorage.token || "" },
    });
    if (!response.ok) {
      console.error("Failed to delete food item");
      return;
    }
    set((state) => ({
      foodItems: state.foodItems.filter((item) => item.food_id !== id),
    }));
  },
}));

export default useFoodItemsStore;
