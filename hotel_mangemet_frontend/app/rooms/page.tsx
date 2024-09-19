"use client";
import useRoomCategoryStore from "../store/roomCategory";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faVectorSquare } from "@fortawesome/free-solid-svg-icons";
import Footer from "../footer/page";
import Navbar from "../navbar";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../loading";

const Rooms = () => {
  const router = useRouter();
  const {
    roomCategories,
    roomCategory,
    getAllRoomCategories,
    getRoomCategory,
  } = useRoomCategoryStore((state) => ({
    roomCategories: state.roomCategories,
    roomCategory: state.roomCategory,
    getAllRoomCategories: state.getAllRoomCategories,
    getRoomCategory: state.getRoomCategory,
  }));

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    const initializeData = async () => {
      await getAllRoomCategories();
    };
    initializeData();
  }, [getAllRoomCategories]);

  useEffect(() => {
    if (roomCategories.length > 0) {
      const firstCategoryId = selectedCategoryId || roomCategories[0].id;
      setSelectedCategoryId(firstCategoryId);
      getRoomCategory(firstCategoryId);
    }
  }, [roomCategories, selectedCategoryId, getRoomCategory]);

  useEffect(() => {
    setIsClient(true); // Ensure that sessionStorage is accessed only on the client side
  }, []);

  const handleCategoryClick = (id: number) => {
    setSelectedCategoryId(id);
    getRoomCategory(id);
  };

  const handleClick = () => {
    if (isClient) {
      const sessionItem = sessionStorage.getItem("token");
      if (sessionItem) {
        router.push(`/bookingForm/${selectedCategoryId}`);
      } else {
        alert("Please login first");
        router.push(`login/userlogin`);
      }
    }
  };

  const displayRoomCategory = roomCategory || (roomCategories.length > 0 ? roomCategories[0] : null);

  return (
    <>
      <Navbar />
      <div className="relative flex justify-center min-h-screen bg-gray-100">
        <div className="flex w-full max-w-screen-xl mx-auto flex-col lg:flex-row">
          {/* Sidebar for Categories */}
          <nav className="w-full lg:w-1/4 p-6 py-8 bg-white shadow-md lg:min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-black">Enhance Your Stay</h1>
            <ul className="space-y-2 font-bold">
              {roomCategories.length > 0 ? (
                roomCategories.map((category) => (
                  <li key={category.id} className="mb-4">
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className={`relative text-lg lg:text-xl font-bold ${
                        selectedCategoryId === category.id
                          ? "text-red-500"
                          : "text-gray-800"
                      } transition duration-300 ease-in-out pb-2`}
                    >
                      {category.name}
                      <span
                        className={`absolute bottom-0 left-0 w-full ${
                          selectedCategoryId === category.id
                            ? "border-b-2 border-red-500"
                            : "border-b-2 border-gray-800"
                        }`}
                      />
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-lg">
                  <LoadingSpinner />
                </li>
              )}
            </ul>
          </nav>

          {/* Main Content Area */}
          <main className="w-full lg:w-3/4 p-6 flex flex-col bg-white shadow-lg rounded-lg">
            {displayRoomCategory ? (
              <div className="flex flex-col">
                {/* Image */}
                {displayRoomCategory.imageUrl ? (
                  <img
                    src={displayRoomCategory.imageUrl}
                    alt={displayRoomCategory.name}
                    className="w-full h-64 lg:h-[70vh] object-cover mb-4 rounded-lg shadow-md"
                  />
                ) : (
                  <p className="text-lg text-center">Image not available</p>
                )}

                {/* Room Info */}
                <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-8 mb-6">
                  <h1 className="text-2xl font-bold">{displayRoomCategory.name}</h1>
                  <p className="text-xl font-bold">
                    Price: <span className="text-red-500">&#8377;{displayRoomCategory.price}</span>
                  </p>
                  <p className="text-xl flex items-center">
                    <FontAwesomeIcon icon={faBed} className="mr-2 text-xl" />
                    {displayRoomCategory.noOfAdults} Adults + {displayRoomCategory.noOfChildren} Children
                  </p>
                  <p className="text-xl flex items-center">
                    <FontAwesomeIcon icon={faVectorSquare} className="mr-2 text-xl" />
                    424 Sq. Ft.
                  </p>
                </div>

                {/* Description */}
                <p className="text-lg mb-4">{displayRoomCategory.description}</p>

                {/* Room Details */}
                <div className="mt-8 border-t pt-4 border-gray-300 flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0">
                  {[
                    { id: "check-in", label: "Check-in: 12:00 NOON" },
                    { id: "check-out", label: "Check-out: 10:00 AM" },
                    { id: "cancellation", label: "Cancellation: 48 Hours" },
                  ].map((item) => (
                    <div className="flex items-center space-x-2" key={item.id}>
                      <input
                        type="checkbox"
                        id={item.id}
                        checked
                        readOnly
                        className="form-checkbox h-5 w-5 text-green-600"
                      />
                      <label htmlFor={item.id} className="text-lg">
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Amenities */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-2">Amenities:</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {displayRoomCategory.amenities?.length ? (
                      displayRoomCategory.amenities.map((amenity) => (
                        <div key={amenity.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`amenity-${amenity.id}`}
                            checked
                            readOnly
                            className="form-checkbox h-5 w-5 text-blue-600"
                          />
                          <label htmlFor={`amenity-${amenity.id}`} className="text-lg">
                            {amenity.name}
                          </label>
                        </div>
                      ))
                    ) : (
                      <p className="text-lg">No amenities listed</p>
                    )}
                  </div>
                </div>

                {/* Book Now Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleClick}
                    className="bg-red-500 text-white text-lg font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-red-600 transition duration-300"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-lg">Please select a category</p>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Rooms;
