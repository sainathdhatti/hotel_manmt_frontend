"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/app/store/loginStore";
import useAmenitiesStore from "@/app/store/amenitiesStore";
import useRoomCategoryStore from "@/app/store/roomCategory";
import useContactStore from "@/app/store/contactStore";
import useFoodItemsStore from "@/app/store/foodItemsStore";
import useBookingsStore from "@/app/store/bookingStore";
import useRoomStore from "@/app/store/roomStore";
import useUserStore from "@/app/store/userRegisterStore";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      router.push("/");
    }
  };

  const bookings = useBookingsStore((state) => state.bookings);
  const getAllBookings = useBookingsStore((state) => state.fetchBookings);
  const { amenities, getAllAmenities, deleteAmenity } = useAmenitiesStore();
  const { roomCategories, getAllRoomCategories, deleteRoomCategory } = useRoomCategoryStore();
  const { contacts, getAllContacts } = useContactStore();
  const { foodItems, getAllFoodItems, deleteFoodItem } = useFoodItemsStore();
  const { rooms, getAllRooms, deleteRoom } = useRoomStore();
  const { users, getAllUsers } = useUserStore();

  useEffect(() => {
    if (activeSection === "amenities") {
      getAllAmenities();
    } else if (activeSection === "roomCategories") {
      getAllRoomCategories();
    } else if (activeSection === "UserQueries") {
      getAllContacts();
    } else if (activeSection === "foodItems") {
      getAllFoodItems();
    } else if (activeSection === "rooms") {
      getAllRooms();
    } else if (activeSection === "users") {
      getAllUsers();
    }
  }, [
    activeSection,
    getAllAmenities,
    getAllRoomCategories,
    getAllContacts,
    getAllFoodItems,
    getAllRooms,
    getAllUsers
  ]);

  useEffect(() => {
    getAllBookings();
  }, [getAllBookings]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this amenity?")) {
      await deleteAmenity(id);
    }
  };

  const handleDeleteRoomCategory = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this room category?")) {
      await deleteRoomCategory(id);
    }
  };

  const handleDeleteFood = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this food item?")) {
      await deleteFoodItem(id);
    }
  };

  const handleDeleteRoom = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      await deleteRoom(id);
    }
  };

  const renderContent = () => {
    const tableColorClass = activeSection === "dashboard" ? "bg-blue-50" : "bg-white";
    switch (activeSection) {
      case "dashboard":
        return <div>Dashboard Details</div>;
      case "bookings":
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full bg-white shadow-md rounded-lg p-6 mt-10">
              <h1 className="text-2xl font-bold mb-4 text-center">Bookings</h1>
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
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.bookingId} className="border-b">
                      <td className="px-4 py-2 text-center">
                        {booking.user.firstName ?? "N/A"}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {new Date(booking.checkInDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {new Date(booking.checkOutDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {booking.noOfAdults ?? "N/A"}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {booking.noOfChildrens ?? "N/A"}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {booking.noOfDays ?? "N/A"}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {booking.room?.roomNumber ?? "N/A"}
                      </td>
                      <td className="px-4 py-2 text-center">
                        &#x20B9;{booking.TotalAmount ?? "N/A"}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {booking.status ?? "N/A"}
                      </td>
                      <td className="px-4 py-2 flex justify-center space-x-5">
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "roomCategories":
        return (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-6xl p-6 bg-white shadow-lg rounded-lg">
              <div className="mb-6 flex justify-center">
                <button
                  onClick={() =>
                    router.push("/dashboard/adminlogin/roomcategory/new")
                  }
                  className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                >
                  Add Room Category
                </button>
              </div>
              <div className="flex justify-center">
                <table className="w-full border border-gray-300 bg-blue-50 rounded-lg overflow-hidden">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Name</th>
                      <th className="px-4 py-2 text-left font-semibold">Description</th>
                      <th className="px-4 py-2 text-left font-semibold">Price</th>
                      <th className="px-4 py-2 text-left font-semibold">Image</th>
                      <th className="px-4 py-2 text-left font-semibold">Adults</th>
                      <th className="px-4 py-2 text-left font-semibold">Children</th>
                      <th className="px-4 py-2 text-left font-semibold">Amenities</th>
                      <th className="px-4 py-2 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomCategories.map((data) => (
                      <tr key={data.id} className="border-b hover:bg-gray-100">
                        <td className="px-4 py-2 text-gray-900">{data.name}</td>
                        <td className="px-4 py-2 text-gray-900">{data.description || "N/A"}</td>
                        <td className="px-4 py-2 text-gray-900">&#x20B9;{data.price ? `${data.price}` : "N/A"}</td>
                        <td className="px-4 py-2 text-gray-900">
                          {data.imageUrl ? (
                            typeof data.imageUrl === "string" && data.imageUrl.startsWith("http") ? (
                              <img src={data.imageUrl} alt="room category" className="w-20 h-20 object-cover" />
                            ) : (
                              "Image not available"
                            )
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td className="px-4 py-2 text-gray-900">{data.noOfAdults || "N/A"}</td>
                        <td className="px-4 py-2 text-gray-900">{data.noOfChildren || "N/A"}</td>
                        <td className="px-4 py-2 text-gray-900">
                          {data.amenities ? data.amenities.join(", ") : "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => handleDeleteRoomCategory(data.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "foodItems":
        return (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-6xl p-6 bg-white shadow-lg rounded-lg">
              <div className="mb-6 flex justify-center">
                <button
                  onClick={() => router.push("/dashboard/adminlogin/food/new")}
                  className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                >
                  Add Food Item
                </button>
              </div>
              <div className="flex justify-center">
                <table className="w-full border border-gray-300 bg-blue-50 rounded-lg overflow-hidden">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Name</th>
                      <th className="px-4 py-2 text-left font-semibold">Description</th>
                      <th className="px-4 py-2 text-left font-semibold">Price</th>
                      <th className="px-4 py-2 text-left font-semibold">Image</th>
                      <th className="px-4 py-2 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foodItems.map((data) => (
                      <tr key={data.id} className="border-b hover:bg-gray-100">
                        <td className="px-4 py-2 text-gray-900">{data.name}</td>
                        <td className="px-4 py-2 text-gray-900">{data.description || "N/A"}</td>
                        <td className="px-4 py-2 text-gray-900">&#x20B9;{data.price ? `${data.price}` : "N/A"}</td>
                        <td className="px-4 py-2 text-gray-900">
                          {data.imageUrl ? (
                            typeof data.imageUrl === "string" && data.imageUrl.startsWith("http") ? (
                              <img src={data.imageUrl} alt="food item" className="w-20 h-20 object-cover" />
                            ) : (
                              "Image not available"
                            )
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => handleDeleteFood(data.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "rooms":
        return (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-6xl p-6 bg-white shadow-lg rounded-lg">
              <div className="mb-6 flex justify-center">
                <button
                  onClick={() => router.push("/dashboard/adminlogin/room/new")}
                  className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                >
                  Add Room
                </button>
              </div>
              <div className="flex justify-center">
                <table className="w-full border border-gray-300 bg-blue-50 rounded-lg overflow-hidden">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Room Number</th>
                      <th className="px-4 py-2 text-left font-semibold">Room Category</th>
                      <th className="px-4 py-2 text-left font-semibold">Description</th>
                      <th className="px-4 py-2 text-left font-semibold">Price</th>
                      <th className="px-4 py-2 text-left font-semibold">Image</th>
                      <th className="px-4 py-2 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((data) => (
                      <tr key={data.id} className="border-b hover:bg-gray-100">
                        <td className="px-4 py-2 text-gray-900">{data.roomNumber}</td>
                        <td className="px-4 py-2 text-gray-900">{data.roomCategory?.name || "N/A"}</td>
                        <td className="px-4 py-2 text-gray-900">{data.description || "N/A"}</td>
                        <td className="px-4 py-2 text-gray-900">&#x20B9;{data.price || "N/A"}</td>
                        <td className="px-4 py-2 text-gray-900">
                          {data.imageUrl ? (
                            typeof data.imageUrl === "string" && data.imageUrl.startsWith("http") ? (
                              <img src={data.imageUrl} alt="room" className="w-20 h-20 object-cover" />
                            ) : (
                              "Image not available"
                            )
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => handleDeleteRoom(data.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "users":
        return (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-6xl p-6 bg-white shadow-lg rounded-lg">
              <div className="mb-6 flex justify-center">
                <button
                  onClick={() => router.push("/dashboard/adminlogin/user/new")}
                  className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                >
                  Add User
                </button>
              </div>
              <div className="flex justify-center">
                <table className="w-full border border-gray-300 bg-blue-50 rounded-lg overflow-hidden">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Name</th>
                      <th className="px-4 py-2 text-left font-semibold">Email</th>
                      <th className="px-4 py-2 text-left font-semibold">Role</th>
                      <th className="px-4 py-2 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((data) => (
                      <tr key={data.id} className="border-b hover:bg-gray-100">
                        <td className="px-4 py-2 text-gray-900">{data.name}</td>
                        <td className="px-4 py-2 text-gray-900">{data.email}</td>
                        <td className="px-4 py-2 text-gray-900">{data.role}</td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => handleDeleteUser(data.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Invalid Section</div>;
    }
  };

  return (
    <div>
      <nav className="bg-gray-800 text-white p-4">
        <ul className="flex space-x-4">
          <li>
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`p-2 ${activeSection === "dashboard" ? "bg-gray-700" : "hover:bg-gray-600"} rounded-md`}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection("roomCategories")}
              className={`p-2 ${activeSection === "roomCategories" ? "bg-gray-700" : "hover:bg-gray-600"} rounded-md`}
            >
              Room Categories
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection("foodItems")}
              className={`p-2 ${activeSection === "foodItems" ? "bg-gray-700" : "hover:bg-gray-600"} rounded-md`}
            >
              Food Items
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection("rooms")}
              className={`p-2 ${activeSection === "rooms" ? "bg-gray-700" : "hover:bg-gray-600"} rounded-md`}
            >
              Rooms
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection("users")}
              className={`p-2 ${activeSection === "users" ? "bg-gray-700" : "hover:bg-gray-600"} rounded-md`}
            >
              Users
            </button>
          </li>
        </ul>
      </nav>
      <main className="p-4">
        {renderSection()}
      </main>
    </div>
  );
}

export default AdminDashboard;
