"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/app/store/loginStore";
import useAmenitiesStore from "@/app/store/amenitiesStore";
import useRoomCategoryStore from "@/app/store/roomCategory";
import useContactStore from "@/app/store/contactStore";
import useFoodItemsStore from "@/app/store/foodItemsStore";
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

  const { amenities, getAllAmenities, deleteAmenity } = useAmenitiesStore();
  const { roomCategories, getAllRoomCategories, deleteRoomCategory } =
    useRoomCategoryStore();
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
    }
    else if(activeSection === "users"){
      getAllUsers();
    }
  }, [
    activeSection,
    getAllAmenities,
    getAllRoomCategories,
    getAllContacts,
    getAllFoodItems,
    getAllRooms,
  ]);

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
    const tableColorClass =
      activeSection === "dashboard" ? "bg-blue-50" : "bg-white";
    switch (activeSection) {
      case "dashboard":
        return <div>Dashboard Details</div>;
      case "bookings":
        return <div>Bookings Details</div>;
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
                      <th className="px-4 py-2 text-left font-semibold">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Description
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Price
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Image
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Adults
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Children
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Amenities
                      </th>
                      <th className="px-4 py-2 text-center font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomCategories.map((data) => (
                      <tr key={data.id} className="border-b hover:bg-gray-100">
                        <td className="px-4 py-2 text-gray-900">{data.name}</td>
                        <td className="px-4 py-2 text-gray-900">
                          {data.description || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {data.price ? `${data.price}` : "N/A"}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {data.imageUrl ? (
                            typeof data.imageUrl === "string" ? (
                              <img
                                src={data.imageUrl}
                                alt="Room"
                                className="w-10 h-10 object-cover "
                              />
                            ) : (
                              <img
                                src={URL.createObjectURL(data.imageUrl)}
                                alt="Room"
                                className="w-20 h-10 object-cover rounded"
                              />
                            )
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {data.noOfAdults || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {data.noOfChildren || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {data.amenities && data.amenities.length > 0 ? (
                            <ul className="list-disc pl-5">
                              {data.amenities.map((amenity) => (
                                <li key={amenity.id}>{amenity.name}</li>
                              ))}
                            </ul>
                          ) : (
                            "No Amenities"
                          )}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/adminlogin/roomcategory/${data.id}`
                              )
                            }
                            className="bg-yellow-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-yellow-600 transition duration-300 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteRoomCategory(data.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition duration-300"
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
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl ">
              <div className="mb-6 flex justify-center">
                <button
                  onClick={() =>
                    router.push("/dashboard/adminlogin/rooms/new")
                  }
                  className="bg-blue-500 text-white px-6 py-1.5 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                >
                  Add Rooms
                </button>
              </div>

              <div className="flex justify-center">
                <table
                  className={`w-3/4 border border-gray-300 ${tableColorClass} rounded-lg overflow-hidden`}
                >
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="px-6 py-1.5 text-left font-semibold">
                        Room Number
                      </th>
                      <th className="px-6 py-1.5 text-left font-semibold">
                        Room Status
                      </th>
                      <th className="px-6 py-1.5 text-left font-semibold">
                        Room Category Name
                      </th>
                      <th className="px-6 py-1.5 text-center font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((r) => (
                      <tr key={r.id} className="border-b hover:bg-gray-100">
                        <td className="px-6 py-1.5 text-gray-900">{r.roomNumber}</td>
                        <td className="px-6 py-1.5 text-gray-900">{r.status}</td>
                        <td className="px-6 py-1.5 text-gray-900">{r.roomCategory.name}</td>
                        <td className="px-6 py-1.5 text-center flex">
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/adminlogin/rooms/${r.id}`
                              )
                            }
                            className="bg-yellow-500 text-white px-4 py-1.5 rounded-md shadow-md hover:bg-yellow-600 transition duration-300 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(r.id)}
                            className="bg-red-500 text-white px-4 py-1.5 rounded-md shadow-md hover:bg-red-600 transition duration-300"
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
      case "amenities":
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl ">
              <div className="mb-6 flex justify-center">
                <button
                  onClick={() =>
                    router.push("/dashboard/adminlogin/amenities/add")
                  }
                  className="bg-blue-500 text-white px-6 py-1.5 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                >
                  Add Amenity
                </button>
              </div>

              <div className="flex justify-center">
                <table
                  className={`w-3/4 border border-gray-300 ${tableColorClass} rounded-lg overflow-hidden`}
                >
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="px-6 py-1.5 text-left font-semibold">
                        Name
                      </th>
                      <th className="px-6 py-1.5 text-center font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {amenities.map((a) => (
                      <tr key={a.id} className="border-b hover:bg-gray-100">
                        <td className="px-6 py-1.5 text-gray-900">{a.name}</td>
                        <td className="px-6 py-1.5 text-center">
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/adminlogin/amenities/${a.id}`
                              )
                            }
                            className="bg-yellow-500 text-white px-4 py-1.5 rounded-md shadow-md hover:bg-yellow-600 transition duration-300 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(a.id)}
                            className="bg-red-500 text-white px-4 py-1.5 rounded-md shadow-md hover:bg-red-600 transition duration-300"
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
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl">
              <div className="mb-6 flex justify-center">
                <button
                  onClick={() =>
                    router.push("/dashboard/adminlogin/foodItems/new")
                  }
                  className="bg-blue-500 text-white px-6 py-1.5 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                >
                  Add Food Item
                </button>
              </div>

              <div className="flex justify-center">
                <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Description
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Price
                      </th>
                      <th className="px-6 py-1.5 text-center font-semibold">
                        Image
                      </th>
                      <th className="px-6 py-1.5 text-center font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {foodItems.map((item) => (
                      <tr
                        key={item.food_id}
                        className="border-b hover:bg-gray-100"
                      >
                        <td className="px-6 py-1.5 text-gray-900">
                          {item.food_name}
                        </td>
                        <td className="px-6 py-1.5 text-gray-900">
                          {item.food_description}
                        </td>
                        <td className="px-6 py-1.5 text-gray-900">
                          {item.food_price}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {item.food_image ? (
                            <img
                              src={item.food_image}
                              alt={item.food_name}
                              className="w-10 h-10 object-cover"
                            />
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td className="px-6 py-1.5 text-center flex space-x-2">
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/adminlogin/foodItems/${item.food_id}`
                              )
                            }
                            className="bg-yellow-500 text-white px-4 py-1.5 rounded-md shadow-md hover:bg-yellow-600 transition duration-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteFood(item.food_id)}
                            className="bg-red-500 text-white px-4 py-1.5 rounded-md shadow-md hover:bg-red-600 transition duration-300"
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
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl p-6 ">
              <div className="flex justify-center">
                <table className="w-full border border-gray-300 bg-blue-50 rounded-lg overflow-hidden">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">
                        First Name
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Last Name
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        PhoneNumber
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                      aadharCardNumber
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr
                        key={u.id}
                        className="border-b hover:bg-gray-100"
                      >
                        <td className="px-4 py-2 text-gray-900">
                          {u.firstName}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {u.lastName}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {u.phoneNumber}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {u.email}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {u.aadharCardNumber}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "UserQueries":
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl p-6 ">
              <div className="flex justify-center">
                <table className="w-full border border-gray-300 bg-blue-50 rounded-lg overflow-hidden">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">
                        First Name
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Last Name
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        PhoneNumber
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Subject
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Message
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr
                        key={contact.id}
                        className="border-b hover:bg-gray-100"
                      >
                        <td className="px-4 py-2 text-gray-900">
                          {contact.firstName}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {contact.lastName}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {contact.phone}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {contact.Email}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {contact.Subject}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {contact.Message}
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
        return <div>Select a section</div>;
    }
  };

  return (
    <>
      <header className="flex items-center justify-between p-4 bg-blue-600 text-white">
        <div className="text-xl font-bold">Hotel Enhance</div>
        <button className="bg-red-500 px-4 py-2 rounded" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <div className="flex h-screen">
        <nav className="w-1/4 bg-gray-200 p-4">
          <ul className="space-y-2">
            <li
              className={`cursor-pointer p-2 ${
                activeSection === "dashboard" ? "bg-blue-100" : ""
              }`}
              onClick={() => setActiveSection("dashboard")}
            >
              Dashboard
            </li>
            <li
              className={`cursor-pointer p-2 ${
                activeSection === "bookings" ? "bg-blue-100" : ""
              }`}
              onClick={() => setActiveSection("bookings")}
            >
              Bookings
            </li>
            <li
              className={`cursor-pointer p-2 ${
                activeSection === "roomCategories" ? "bg-blue-100" : ""
              }`}
              onClick={() => setActiveSection("roomCategories")}
            >
              Room Categories
            </li>
            <li
              className={`cursor-pointer p-2 ${
                activeSection === "amenities" ? "bg-blue-100" : ""
              }`}
              onClick={() => setActiveSection("amenities")}
            >
              Amenities
            </li>
            <li
              className={`cursor-pointer p-2 ${
                activeSection === "rooms" ? "bg-blue-100" : ""
              }`}
              onClick={() => setActiveSection("rooms")}
            >
              Rooms
            </li>
            <li
              className={`cursor-pointer p-2 ${
                activeSection === "foodItems" ? "bg-blue-100" : ""
              }`}
              onClick={() => setActiveSection("foodItems")}
            >
              FoodItems
            </li>
            <li
              className={`cursor-pointer p-2 ${
                activeSection === "users" ? "bg-blue-100" : ""
              }`}
              onClick={() => setActiveSection("users")}
            >
              UserDetails
            </li>
            <li
              className={`cursor-pointer p-2 ${
                activeSection === "UserQueries" ? "bg-blue-100" : ""
              }`}
              onClick={() => setActiveSection("UserQueries")}
            >
              User Queries
            </li>
          </ul>
        </nav>
        <main className="flex-1 p-4 overflow-auto">{renderContent()}</main>
      </div>
    </>
  );
};

export default AdminDashboard;
