"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Update based on your Next.js version
import useAuthStore from "@/app/store/loginStore";
import useAmenitiesStore from "@/app/store/amenitiesStore";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const { logout } = useAuthStore();
  const router = useRouter();
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      router.push("/"); // Redirect to home page
    }
  };

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentAmenity, setCurrentAmenity] = useState<any>(null);

  const {
    amenities,
    getAllAmenities,
    updateAmenity,
    deleteAmenity,
    addAmenity,
  } = useAmenitiesStore();

  useEffect(() => {
    if (activeSection === "amenities") {
      getAllAmenities();
    }
  }, [activeSection, getAllAmenities]);

  const handleAdd = async (data: any, section: string) => {
    if (section === "amenities") {
      await addAmenity(data);
    }
    setIsEditing(false);
  };

  const handleUpdate = async (
    data: { id: number; name: string },
    section: string
  ) => {
    if (section === "amenities") {
      await updateAmenity(data);
    }
    setIsEditing(false);
  };
  const handleDelete = async (id: number, section: string) => {
    if (section === "amenities") {
      await deleteAmenity(id);
    }
  };
  // Render different content based on activeSection
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <div>Dashboard Details</div>;
      case "bookings":
        return <div>bookings Details</div>;
      case "roomCategories":
        return <div>Room Categories Details</div>;
      case "rooms":
        return <div>Rooms Details</div>;
      case "amenities":
        return (
          <div className="p-2">
            <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
            <button
              onClick={() => {
                setIsEditing(true);
                setCurrentAmenity(null);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300 mb-4"
            >
              Add Amenity
            </button>
            <table className="w-3/4 bg-white border border-gray-200 rounded-md shadow-md">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-6 text-left text-gray-600">ID</th>
                  <th className="py-3 px-6 text-left text-gray-600">Name</th>
                  <th className="py-3 px-6 text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {amenities.map((amenity) => (
                  <tr key={amenity.id} className="border-b border-gray-200">
                    <td className="py-3 px-6 text-gray-700">{amenity.id}</td>
                    <td className="py-3 px-6 text-gray-700">{amenity.name}</td>
                    <td className="py-3 px-6 flex space-x-2">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setCurrentAmenity(amenity);
                        }}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-yellow-600 transition duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(amenity.id, "amenities")}
                        className="bg-red-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-red-600 transition duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {isEditing && (
              <div className="mt-6 p-4 border border-gray-200 rounded-md shadow-md bg-white">
                <h3 className="text-xl font-semibold mb-4">
                  {currentAmenity ? "Edit Amenity" : "Add Amenity"}
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const data = {
                      name: formData.get("name") as string,
                    };
                    if (currentAmenity) {
                      handleUpdate(
                        { ...data, id: currentAmenity.id },
                        "amenities"
                      );
                    } else {
                      handleAdd(data, "amenities");
                    }
                  }}
                >
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="name">
                      Name:
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      defaultValue={currentAmenity?.name || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                  >
                    {currentAmenity ? "Update" : "Add"}
                  </button>
                </form>
              </div>
            )}
          </div>
        );
      default:
        return <div>Dashboard Details</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen ">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-blue-600 text-white">
        <div className="text-xl font-bold">Hotel Name</div>
        <button className="bg-red-500 px-4 py-2 rounded" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <nav className="w-64 bg-gray-200 p-4">
          <ul className="space-y-2">
            <li className="text-xl font-bold">Admin panel</li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${
                  activeSection === "dashboard"
                    ? "bg-blue-500 text-white"
                    : "text-blue-500"
                }`}
                onClick={() => setActiveSection("dashboard")}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${
                  activeSection === "bookings"
                    ? "bg-blue-500 text-white"
                    : "text-blue-500"
                }`}
                onClick={() => setActiveSection("bookings")}
              >
                Bookings
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${
                  activeSection === "roomCategories"
                    ? "bg-blue-500 text-white"
                    : "text-blue-500"
                }`}
                onClick={() => setActiveSection("roomCategories")}
              >
                Room Categories
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${
                  activeSection === "rooms"
                    ? "bg-blue-500 text-white"
                    : "text-blue-500"
                }`}
                onClick={() => setActiveSection("rooms")}
              >
                Rooms
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${
                  activeSection === "amenities"
                    ? "bg-blue-500 text-white"
                    : "text-blue-500"
                }`}
                onClick={() => setActiveSection("amenities")}
              >
                Amenities
              </button>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-100">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
