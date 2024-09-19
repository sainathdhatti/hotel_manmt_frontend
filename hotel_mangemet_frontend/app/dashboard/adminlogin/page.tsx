"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/app/store/loginStore";
import useAmenitiesStore, { Amenity } from "@/app/store/amenitiesStore";
import useRoomCategoryStore, { RoomCategory } from "@/app/store/roomCategory";
import useContactStore, { Contact } from "@/app/store/contactStore";
import useFoodItemsStore, { FoodItem } from "@/app/store/foodItemsStore";
import useRoomStore, { Rooms } from "@/app/store/roomStore";
import useUserStore, { User } from "@/app/store/userRegisterStore";
import useSpaServiceStore, { SpaService } from "@/app/store/spaServiceStore";
import useStaffCategoryStore, {
  StaffCategory,
} from "@/app/store/staffCategoryStore";
import useStaffMemberStore, {
  StaffMember,
} from "@/app/store/staffMembersStore";
import useBookingsStore, { Booking } from "@/app/store/bookingStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Pagination from "./pagination/page";


const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<string>("bookings");
  const [roomFilter, setRoomFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [nameFilter, setNameFilter] = useState<string>("");

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
  const { spaServices, getAllSpaServices, deleteSpaService } =
    useSpaServiceStore();
  const { staffCategories, fetchStaffCategories, deleteStaffCategory } =
    useStaffCategoryStore();
  const { staffMembers, getAllStaffMembers, deleteStaffMember } =
    useStaffMemberStore();

  const bookings = useBookingsStore((state) => state.bookings);
  const getAllBookings = useBookingsStore((state) => state.fetchBookings);
  const deleteBooking = useBookingsStore((state) => state.deleteBooking);
  const updateBooking = useBookingsStore((state) => state.updateBookingStatus);
  // const { isAuthenticated, userId } = useAuthStore((state) => ({
  //   isAuthenticated: state.isAuthenticated,
  //   userId: state.userId,
  // }));

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
    } else if (activeSection === "spaServices") {
      getAllSpaServices();
    } else if (activeSection === "staffCategories") {
      fetchStaffCategories();
    } else if (activeSection === "staffMembers") {
      getAllStaffMembers();
    } else if (activeSection === "bookings") {
      getAllBookings();
    }
  }, [
    activeSection,
    getAllAmenities,
    getAllRoomCategories,
    getAllContacts,
    getAllFoodItems,
    getAllRooms,
    getAllUsers,
    getAllBookings,
    getAllSpaServices,
    fetchStaffCategories,
    getAllStaffMembers,
    getAllBookings,
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

  const handleDeleteSpaService = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteSpaService(id);
        alert("Service deleted successfully");
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteStaffCategory(id);
        alert("Category deleted successfully");
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleDeleteStaffMember = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await deleteStaffMember(id);
        alert("Member deleted successfully");
      } catch (error) {
        console.error("Error deleting member:", error);
      }
    }
  };

  const handleDeleteBooking = async (bookingId: number) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteBooking(bookingId);
        alert("Booking deleted successfully");
        await getAllBookings(); // Refresh the list
      } catch (error) {
        console.error("Error deleting booking:", error);
      }
    }
  };

  const isCancelled = (status: string) => status === "CANCELLED";

  const filteredBookings = bookings.filter((booking) => {
    // Convert filters to lowercase for case-insensitive comparison
    const roomFilterLower = roomFilter.toLowerCase();
    const nameFilterLower = nameFilter.toLowerCase();

    // Get values to filter
    const roomNumber = booking.room?.roomNumber ?? "";
    const customerName = booking.user?.firstName ?? "";

    // Check if the room number starts with the room filter value
    const roomMatches =
      roomFilterLower === "" ||
      roomNumber.toString().toLowerCase().startsWith(roomFilterLower);

    // Check if the customer name starts with the name filter value
    const nameMatches =
      nameFilterLower === "" ||
      customerName.toLowerCase().startsWith(nameFilterLower);

    // Check if the booking status matches the selected status filter
    const statusMatches =
      statusFilter === "" ||
      booking.status.toLowerCase() === statusFilter.toLowerCase();

    return roomMatches && nameMatches && statusMatches;
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const getCurrentItems = (data: any) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return data.slice(indexOfFirstItem, indexOfLastItem);
  };

  const renderContent = () => {
    const tableColorClass =
      activeSection === "dashboard" ? "bg-blue-50" : "bg-white";
    const data: { [key: string]: any } = {
      bookings: bookings,
      roomCategories: roomCategories,
      rooms: rooms,
      contacts: contacts,
      foodItems: foodItems,
      amenities: amenities,
      spaServices: spaServices,
      staffCategories: staffCategories,
      staffMembers: staffMembers,
      users: users,
      UserQueries: contacts,
    };

    const currentItems = getCurrentItems(data[activeSection]);
    const totalPages = Math.ceil(data[activeSection].length / itemsPerPage);
    switch (activeSection) {
      case "bookings":
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full bg-white shadow-md rounded-lg p-2">
              <h1 className="text-2xl font-bold mb-4">Bookings List</h1>

              {/* Filter Inputs */}
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  placeholder="RoomNumber"
                  value={roomFilter}
                  onChange={(e) => setRoomFilter(e.target.value)}
                  className="px-1 py-1 border border-gray-300 rounded w-[135px]"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2 py-2 border border-gray-300 rounded w-[135px]"
                >
                  <option value="">All</option>
                  <option value="booked">booked</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="checked_in">checked_in</option>
                  <option value="checked_out">checked_out</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <input
                  type="text"
                  placeholder="Name"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  className="px-2 py-2 border border-gray-300 rounded w-[135px]"
                />
              </div>

              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-center">Customer</th>
                    <th className="px-4 py-2 text-center">Room</th>
                    <th className="px-4 py-2 text-center">Adults</th>
                    <th className="px-4 py-2 text-center">Children</th>
                    <th className="px-4 py-2 text-center">Arrival</th>
                    <th className="px-4 py-2 text-center">Departure</th>
                    <th className="px-4 py-2 text-center">Total Days</th>
                    <th className="px-4 py-2 text-center">Total Amount</th>
                    <th className="px-4 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((booking: Booking) => (
                      <tr key={booking.bookingId} className="border-b">
                        <td className="px-4 py-2 text-center">
                          {booking.user.firstName ?? "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {booking.room?.roomNumber ?? "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {booking.noOfAdults ?? "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {booking.noOfChildrens ?? 0}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {new Date(booking.checkInDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {new Date(booking.checkOutDate).toLocaleDateString()}
                        </td>

                        <td className="px-4 py-2 text-center">
                          {booking.noOfDays ?? "N/A"}
                        </td>

                        <td className="px-4 py-2 text-center">
                          &#x20B9;{booking.TotalAmount ?? "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {booking.status ?? "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="px-4 py-2 text-center">
                        No bookings available
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
                <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                  <thead className=" text-gray-700">
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
                    {currentItems.map((data: RoomCategory) => (
                      <tr key={data.id} className="border-b">
                        <td className="px-4 py-2 text-gray-900">{data.name}</td>
                        <td className="px-4 py-2 text-gray-900">
                          {data.description || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {data.price ? `${data.price}` : "N/A"}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {data.imageUrl ? (
                            <img
                              src={data.imageUrl}
                              alt="Room"
                              className="w-10 h-10 object-cover"
                            />
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {data.noOfAdults || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {data.noOfChildren || 0}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {data.amenities && data.amenities.length > 0 ? (
                            <ul className="list-disc pl-5">
                              {data.amenities.map((amenity: Amenity) => (
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        );

      case "rooms":
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-3xl">
              <div className="mb-6 flex justify-center">
                <button
                  onClick={() => router.push("/dashboard/adminlogin/rooms/new")}
                  className="bg-blue-500 text-white px-6 py-1.5 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                >
                  Add Rooms
                </button>
              </div>
              <div className="flex justify-center">
                <table
                  className={`w-full border border-gray-300 ${tableColorClass} rounded-lg overflow-hidden`}
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
                    {currentItems.map((r: Rooms) => (
                      <tr key={r.id} className="border-b hover:bg-gray-100">
                        <td className="px-6 py-1.5 text-gray-900 ">
                          {r.roomNumber || "N/A"}
                        </td>
                        <td className="px-6 py-1.5 text-gray-900">
                          {r.status || "N/A"}
                        </td>
                        <td className="px-6 py-1.5 text-gray-900">
                          {r.roomCategory?.name || "N/A"}
                        </td>
                        <td className="px-6 py-1.5 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() =>
                                router.push(
                                  `/dashboard/adminlogin/rooms/${r.id}`
                                )
                              }
                              className="bg-yellow-500 text-white px-4 py-1.5 rounded-md shadow-md hover:bg-yellow-600 transition duration-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(r.id)}
                              className="bg-red-500 text-white px-4 py-1.5 rounded-md shadow-md hover:bg-red-600 transition duration-300"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        );

      case "amenities":
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-3xl">
              <div className="mb-6 flex justify-center">
                <button
                  onClick={() =>
                    router.push("/dashboard/adminlogin/amenities/add")
                  }
                  className="bg-blue-500 text-white px-6 py-1.5 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                >
                  Add Amenities
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
                    {currentItems.map((a: Amenity) => (
                      <tr key={a.id} className="border-b hover:bg-gray-100">
                        <td className="px-6 py-1.5 text-gray-900">
                          {a.name || "N/A"}
                        </td>
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        );
      case "foodItems":
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-3xl">
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
                    {currentItems.map((item: FoodItem) => (
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        );

      case "spaServices":
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl">
              <div className="mb-6 flex justify-center">
                <button
                  onClick={() =>
                    router.push("/dashboard/adminlogin/spaServices/new")
                  }
                  className="bg-blue-500 text-white px-6 py-1.5 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                >
                  Add Spa Service
                </button>
              </div>
              <div className="flex justify-center">
                <table
                  className={`w-full border border-gray-300 ${tableColorClass} rounded-lg overflow-hidden`}
                >
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="px-4 py-1.5 text-left font-semibold">
                        Name
                      </th>
                      <th className="px-4 py-1.5 text-left font-semibold">
                        Description
                      </th>
                      <th className="px-4 py-1.5 text-left font-semibold">
                        Price
                      </th>
                      <th className="px-4 py-1.5 text-center font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((service: SpaService) => (
                      <tr
                        key={service.id}
                        className="border-b hover:bg-gray-100"
                      >
                        <td className="px-6 py-1.5 text-gray-900">
                          {service.name || "N/A"}
                        </td>
                        <td className="px-6 py-1.5 text-gray-900">
                          {service.description || "N/A"}
                        </td>
                        <td className="px-6 py-1.5 text-gray-900">
                          {service.price ? `₹${service.price}` : "N/A"}
                        </td>
                        <td className="px-6 py-1.5 text-center">
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/adminlogin/spaServices/${service.id}`
                              )
                            }
                            className="bg-yellow-500 text-white px-4 py-1.5 rounded-md shadow-md hover:bg-yellow-600 transition duration-300 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSpaService(service.id)}
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        );

      case "staffCategories":
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl">
              <div className="mb-6 flex justify-center">
                <button
                  onClick={() =>
                    router.push("/dashboard/adminlogin/staffcategories/new")
                  }
                  className="bg-blue-500 text-white px-6 py-1.5 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                >
                  Add Staff Category
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
                    {currentItems.map((sc: StaffCategory) => (
                      <tr key={sc.id} className="border-b hover:bg-gray-100">
                        <td className="px-6 py-1.5 text-gray-900">
                          {sc.category || "N/A"}
                        </td>
                        <td className="px-6 py-1.5 text-center">
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/adminlogin/staffcategories/${sc.id}`
                              )
                            }
                            className="bg-yellow-500 text-white px-4 py-1.5 rounded-md shadow-md hover:bg-yellow-600 transition duration-300 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(sc.id)}
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        );

      case "staffMembers":
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl">
              <div className="mb-6 flex justify-center">
                <button
                  onClick={() =>
                    router.push("/dashboard/adminlogin/staffmembers/new")
                  }
                  className="bg-blue-500 text-white px-6 py-1.5 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                >
                  Add Staff Member
                </button>
              </div>
              <div className="flex justify-center">
                <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="px-6 py-1.5 text-left font-semibold">
                        First Name
                      </th>
                      <th className="px-6 py-1.5 text-left font-semibold">
                        Last Name
                      </th>
                      <th className="px-6 py-1.5 text-left font-semibold">
                        Email
                      </th>
                      <th className="px-6 py-1.5 text-left font-semibold">
                        Phone
                      </th>
                      <th className="px-6 py-1.5 text-left font-semibold">
                        Gender
                      </th>
                      <th className="px-6 py-1.5 text-left font-semibold">
                        Category
                      </th>
                      <th className="px-6 py-1.5 text-center font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4">
                          No staff members found
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((member: StaffMember) => (
                        <tr
                          key={member.id}
                          className="border-b hover:bg-gray-100"
                        >
                          <td className="px-6 py-1.5 text-gray-900">
                            {member.firstName}
                          </td>
                          <td className="px-6 py-1.5 text-gray-900">
                            {member.lastName}
                          </td>
                          <td className="px-6 py-1.5 text-gray-900">
                            {member.email}
                          </td>
                          <td className="px-6 py-1.5 text-gray-900">
                            {member.phone}
                          </td>
                          <td className="px-6 py-1.5 text-gray-900">
                            {member.gender}
                          </td>
                          <td className="px-6 py-1.5 text-gray-900">
                            {member.staffcategory?.category ?? "N/A"}
                          </td>
                          <td className="px-6 py-1.5 text-center flex">
                            <button
                              onClick={() =>
                                router.push(
                                  `/dashboard/adminlogin/staffmembers/${member.id}`
                                )
                              }
                              className="bg-yellow-500 text-white px-4 py-1.5 rounded-md shadow-md hover:bg-yellow-600 transition duration-300 mr-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteStaffMember(member.id)}
                              className="bg-red-500 text-white px-4 py-1.5 rounded-md shadow-md hover:bg-red-600 transition duration-300"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        );

      case "users": 
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl  ">
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
                    {currentItems.map((u: User) => (
                      <tr key={u.id} className="border-b hover:bg-gray-100">
                        <td className="px-4 py-2 text-gray-900">
                          {u.firstName}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {u.lastName}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {u.phoneNumber}
                        </td>
                        <td className="px-4 py-2 text-gray-900">{u.email}</td>
                        <td className="px-4 py-2 text-gray-900">
                          {u.aadharCardNumber}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        );
      case "UserQueries":
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-6xl p-6">
              <div className="flex justify-center">
                <table className="w-full border border-gray-300 bg-blue-50 rounded-lg overflow-hidden">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="px-2 py-2 text-left font-semibold">
                        First Name
                      </th>
                      <th className="px-2 py-2 text-left font-semibold">
                        Last Name
                      </th>
                      <th className="px-2 py-2 text-left font-semibold">
                        PhoneNumber
                      </th>
                      <th className="px-2 py-2 text-left font-semibold">
                        Email
                      </th>
                      <th className="px-2 py-2 text-left font-semibold">
                        Subject
                      </th>
                      <th className="px-6 py-2 text-left font-semibold w-2/5">
                        Message
                      </th>{" "}
                      {/* Adjusted padding and width */}
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((contact: Contact) => (
                      <tr
                        key={contact.id}
                        className="border-b hover:bg-gray-100"
                      >
                        <td className="px-2 py-2 text-gray-900">
                          {contact.firstName}
                        </td>
                        <td className="px-2 py-2 text-gray-900">
                          {contact.lastName}
                        </td>
                        <td className="px-2 py-2 text-gray-900">
                          {contact.phone}
                        </td>
                        <td className="px-2 py-2 text-gray-900">
                          {contact.Email}
                        </td>
                        <td className="px-2 py-2 text-gray-900">
                          {contact.Subject}
                        </td>
                        <td className="px-6 py-2 text-gray-900 w-2/5">
                          {contact.Message}
                        </td>{" "}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-slate-900 text-white p-2 z-10 flex justify-between items-center">
        <div className="text-xl font-bold">Hotel Enhance</div>
        <div className="text-xl font-bold">Admin Dashboard</div>
        <button className="bg-red-500 px-4 py-2 rounded" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="flex h-screen pt-14">
        <nav className="fixed w-60 bg-slate-900  p-2 ">
          <ul className="space-y-2 text-teal-400">
            {[
              { name: "Dashboard", key: "dashboard" },
              { name: "Bookings", key: "bookings" },
              { name: "Room Categories", key: "roomCategories" },
              { name: "Amenities", key: "amenities" },
              { name: "Rooms", key: "rooms" },
              { name: "Food Items", key: "foodItems" },
              { name: "Spa Services", key: "spaServices" },
              { name: "Staff Categories", key: "staffCategories" },
              { name: "Staff Members", key: "staffMembers" },
              { name: "Users", key: "users" },
              { name: "User Queries", key: "UserQueries" },
            ].map(({ name, key }) => (
              <li
                key={key}
                className={`cursor-pointer p-2 ${
                  activeSection === key ? "bg-gray-700" : ""
                }`}
                onClick={() => setActiveSection(key)}
              >
                {name}
              </li>
            ))}
          </ul>
        </nav>
        <main className="flex-1 p-4 overflow-auto ml-60">
          {renderContent()}
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
