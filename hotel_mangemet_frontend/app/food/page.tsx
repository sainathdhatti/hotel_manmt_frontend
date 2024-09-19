"use client";
import React, { useEffect, useState } from "react";
import useFoodItemsStore from "../store/foodItemsStore";
import useFoodOrderStore from "../store/FoodOrderStore";
import FoodItemCard from "../FoodItemCard/page";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useAuthStore from "../store/loginStore";
import Navbar from "../navbar";
import axios from "axios";
import { log } from "node:console";
import { Booking } from "../store/bookingStore";

const FoodOrderPage = () => {
  const { foodItems, getAllFoodItems } = useFoodItemsStore();
  const { createOrder } = useFoodOrderStore((state) => ({
    createOrder: state.createOrder,
  }));

  const { isAuthenticated, userId } = useAuthStore();
  const [selectedItems, setSelectedItems] = useState<
    { foodItemId: number; quantity: number }[]
  >([]);
  const [itemQuantities, setItemQuantities] = useState<{
    [key: number]: number;
  }>({});
  const [selectedFoodItems, setSelectedFoodItems] = useState<Set<number>>(
    new Set()
  );
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getAllFoodItems(); // Fetch all food items when the component mounts
  }, [getAllFoodItems]);

  const handleSelectItem = (
    id: number,
    quantity: number,
    isSelected: boolean
  ) => {
    setItemQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities, [id]: quantity };
      setSelectedFoodItems((prevItems) => {
        const updatedItems = new Set(prevItems);
        if (isSelected && quantity > 0) {
          updatedItems.add(id);
        } else {
          updatedItems.delete(id);
        }
        handleAddToOrder(updatedQuantities, updatedItems); // Call handleAddToOrder with updated quantities and selected items
        return updatedItems;
      });
      return updatedQuantities;
    });
  };

  const handleAddToOrder = (
    quantities: { [key: number]: number },
    items: Set<number>
  ) => {
    const itemsToAdd = Array.from(items)
      .map((id) => ({
        foodItemId: id,
        quantity: quantities[id] || 0,
      }))
      .filter((item) => item.quantity > 0); // Filter out items with quantity 0

    setSelectedItems(itemsToAdd);
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated || userId === null) {
      toast.error("You must be logged in to place an order.");
      router.push("/food");
      return;
    }

    try {
      // Prepare the data in the correct format
      const orderData = {
        userId,
        orderItems: selectedItems,
        bookingId:bookingId
      };

      console.log(orderData);
      await createOrder(userId, orderData.orderItems,bookingId ||0);

      // Clear selected items and other states
      setSelectedItems([]);
      setSelectedFoodItems(new Set());
      setItemQuantities({});
      setShowPopup(false); // Hide the popup after placing the order

      // Refresh food items
      await getAllFoodItems();

      //toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  const getTotalAmount = () => {
    return selectedItems.reduce((total, item) => {
      const foodItem = foodItems.find((fi) => fi.food_id === item.foodItemId);
      const price = foodItem ? foodItem.food_price : 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getItemDetails = (itemId: number) => {
    const foodItem = foodItems.find((fi) => fi.food_id === itemId);
    return foodItem
      ? { name: foodItem.food_name, price: foodItem.food_price }
      : { name: "Unknown", price: 0 };
  };
  const [bookingId, setBookingId] = useState<number | null>(null);
  useEffect(() => {
    if (isAuthenticated && userId !== undefined) {
      axios.get(`http://localhost:5000/bookings/users/${userId}?t=${Date.now()}`)
        .then(response => {
          const bookings: Booking[] = response.data; // Assuming this is an array of booking objects
          console.log('Bookings:', bookings);
  
          // Filter for checked-in bookings
          const checkedInBookings = bookings.filter(booking => booking.status === "CHECKED_IN");
  
          if (checkedInBookings.length > 0) {
            const bookingId = checkedInBookings[0].bookingId; // Use the first checked-in booking ID
            setBookingId(bookingId); // Set the bookingId state
            console.log('Booking ID set:', bookingId);
          } else {
            console.error('No bookings found with status "checked-in".');
            setBookingId(null); // Clear the booking ID if none found
          }
        })
        .catch(error => {
          console.error('Error fetching booking IDs:', error);
        });
    }
  }, [isAuthenticated, userId]);
  
  

  return (
    <div className="relative container mx-auto ">
      <Navbar />
      <div className="relative w-full h-[60vh] ">
        <img
          src="/images/orderFood.jpg"
          alt="Order Food"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-black text-center">
          <h1 className="text-4xl font-bold mb-4">Delicious Food Awaits!</h1>
          <p className="text-lg">
            Choose your favorite dishes and place your order now.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 py-5">
        {foodItems.map((foodItem) => (
          <FoodItemCard
            key={foodItem.food_id}
            foodItem={foodItem}
            onAdd={(id: number, quantity: number) =>
              handleSelectItem(id, quantity, true)
            }
            onRemove={(id: number, quantity: number) =>
              handleSelectItem(id, quantity, quantity > 0)
            }
            onSelect={handleSelectItem}
            isSelected={selectedFoodItems.has(foodItem.food_id)}
          />
        ))}
      </div>

      {/* Place Order Button */}
      <button
        className="fixed pt-96 top-5 right-12 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors transform rotate-90 origin-bottom-right"
        onClick={() => setShowPopup(true)}
        style={{ transformOrigin: "bottom right" }}
      >
        Place Order
      </button>

      {/* Order Details Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <ul className="space-y-2">
              {selectedItems.map((item) => {
                const { name, price } = getItemDetails(item.foodItemId);
                return (
                  <li key={item.foodItemId} className="flex justify-between">
                    <span>{name}</span>
                    <span>
                      ${price} x {item.quantity}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex justify-between font-bold">
              <span>Total Amount:</span>
              <span>${getTotalAmount()}</span>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={handlePlaceOrder}
              >
                Submit Order
              </button>
            </div>
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={() => setShowPopup(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodOrderPage;
