"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/app/store/loginStore";
import useAmenitiesStore from "@/app/store/amenitiesStore";
import useRoomCategoryStore, { RoomCategory } from "@/app/store/roomCategory";
import useContactStore from "@/app/store/contactStore";
import useFoodItemsStore from "@/app/store/foodItemsStore";
import useRoomStore from "@/app/store/roomStore";
import useUserStore from "@/app/store/userRegisterStore";
import useSpaServiceStore from "@/app/store/spaServiceStore";
import useStaffCategoryStore from "@/app/store/staffCategoryStore";
import useStaffMemberStore from "@/app/store/staffMembersStore";
import useBookingsStore, { Booking } from "@/app/store/bookingStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<string>("bookings");
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      router.push("/");
    }
  };

  const { amenities, getAllAmenities, deleteAmenity } = useAmenitiesStore();
  const {
    roomCategories,
    getAllRoomCategories,
    deleteRoomCategory,
  } = useRoomCategoryStore();

  const { contacts, getAllContacts } = useContactStore();
  const { foodItems, getAllFoodItems, deleteFoodItem } = useFoodItemsStore();
  const { rooms, getAllRooms, deleteRoom } = useRoomStore();
  const { users, getAllUsers } = useUserStore();
  const {
    spaServices,
    getAllSpaServices,
    deleteSpaService,
  } = useSpaServiceStore();
  const {
    staffCategories,
    fetchStaffCategories,
    deleteStaffCategory,
  } = useStaffCategoryStore();
  const {
    staffMembers,
    getAllStaffMembers,
    deleteStaffMember,
  } = useStaffMemberStore();

  const bookings = useBookingsStore((state) => state.bookings);
  const getAllBookings = useBookingsStore((state) => state.fetchBookings);
  const deleteBooking = useBookingsStore((state) => state.deleteBooking);
  const updateBooking = useBookingsStore((state) => state.updateBookingStatus);
  const { isAuthenticated, userId } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    userId: state.userId,
  }));
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

  const renderContent = () => {
    const tableColorClass =
      activeSection === "dashboard" ? "bg-blue-50" : "bg-white";
    switch (activeSection) {
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
                    <th className="px-4 py-2 text-center">Actions</th>
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
                      {/* <td className="px-4 py-2 flex justify-center space-x-5">
                        <Link href={`/bookings/${booking.bookingId}`}>
                          <button
                            className={`btn ${
                              isCancelled(booking.status)
                                ? "btn-disabled"
                                : "btn-warning"
                            } btn-outlin`}
                            disabled={isCancelled(booking.status)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        </Link>
                        <button
                          className={`btn ${
                            isCancelled(booking.status)
                              ? "btn-disabled"
                              : "btn-error"
                          } btn-outlin`}
                          onClick={() => handleDeleteBooking(booking.bookingId)}
                          disabled={isCancelled(booking.status)}
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="text-red-500"
                          />
                        </button>
                      </td> */}
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
                          {data.noOfAdults || 0}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {data.noOfChildren || 0}
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
                            className=" text-black"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={() => handleDeleteRoomCategory(data.id)}
                            className=" text-white"
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="text-red-500 pl-3"
                            />
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
            <div className="w-full ">
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
                        <td className="px-6 py-1.5 text-gray-900">
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
                              className=" text-black "
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button onClick={() => handleDeleteRoom(r.id)}>
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="text-red-500 pl-3"
                              />
                            </button>
                          </div>
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
            <div className="w-full">
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
                    {amenities.map((a) => (
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
                            className="text-black"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={() => deleteAmenity(a.id)}
                            className=" text-white"
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="text-red-500 pl-7"
                            />
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
            <div className="w-full">
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
                            className=" text-black" 
                          >
                            <FontAwesomeIcon icon={faEdit} />

                          </button>
                          <button
                            onClick={() => handleDeleteFood(item.food_id)}
                          >
                             <FontAwesomeIcon
                              icon={faTrash}
                              className="text-red-500 pl-4"
                            />
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

     case "spaServices":
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full">
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
          <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-6 py-1.5 text-left font-semibold">Name</th>
                <th className="px-6 py-1.5 text-left font-semibold">Description</th>
                <th className="px-6 py-1.5 text-left font-semibold">Price</th>
                <th className="px-6 py-1.5 text-center font-semibold">Image</th>
                <th className="px-6 py-1.5 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {spaServices.map((service) => (
                <tr key={service.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-1.5 text-gray-900">
                    {service.name || "N/A"}
                  </td>
                  <td className="px-6 py-1.5 text-gray-900">
                    {service.description || "N/A"}
                  </td>
                  <td className="px-6 py-1.5 text-gray-900">
                    {service.price ? `₹${service.price}` : "N/A"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {service.service_image ? (
                      <img
                        src={service.service_image}
                        alt={service.name}
                        className="w-10 h-10 object-cover"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="px-6 py-1.5 text-center flex space-x-2 mt-7">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/adminlogin/spaServices/${service.id}`)
                      }
                      className="text-black"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDeleteSpaService(service.id)}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-red-500 pl-4"
                      />
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


      case "staffCategories":
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full">
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
                    {staffCategories.map((sc) => (
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
                            className=" text-black"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button onClick={() => handleDeleteCategory(sc.id)}>
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="text-red-500 pl-4"
                            />
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

      case "staffMembers":
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full ">
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
                    {staffMembers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4">
                          No staff members found
                        </td>
                      </tr>
                    ) : (
                      staffMembers.map((member) => (
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
                              className=" text-black "
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              onClick={() => handleDeleteStaffMember(member.id)}
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="text-red-500 pl-4"
                              />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "users":
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full p-6 ">
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
          </div>
        );
      case "UserQueries":
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full  p-6">
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
                    {contacts.map((contact) => (
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
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <>
      <header className="flex items-center justify-between p-2 bg-blue-600 text-white">
        <div className="text-xl font-bold">Hotel Enhance</div>
        <button className="bg-red-500 px-4 py-2 rounded" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <div className="flex h-screen">
        <nav className="w-60 bg-gray-200 p-2">
          <ul className="space-y-2">
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
                  activeSection === key ? "bg-blue-100" : ""
                }`}
                onClick={() => setActiveSection(key)}
              >
                {name}
              </li>
            ))}
          </ul>
        </nav>
        <main className="flex-1 p-4 overflow-auto">{renderContent()}</main>
      </div>
    </>
  );
};

export default AdminDashboard;
