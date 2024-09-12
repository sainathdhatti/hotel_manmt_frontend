"use client";
import useRoomCategoryStore from "../store/roomCategory";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faVectorSquare } from "@fortawesome/free-solid-svg-icons";
import Footer from "../footer/page";
import Navbar from "../navbar";
import { useRouter } from "next/navigation";

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
      const sessionItem = sessionStorage.getItem('token');
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
      <div className="relative flex overflow-hidden justify-center min-h-screen ">
        {/* Remove or comment out the following block to eliminate the background image */}
        {/* <div className="absolute inset-0">
          <img
            src='images/Oroom1.jpeg'
            className="opacity-80 w-full h-full object-cover"
          />
        </div> */}
        <div className="flex w-full max-w-screen-xl mx-auto  ">
          <nav className="w-1/4 min-h-screen p-6 py-8">
            <h1 className="text-3xl font-bold mb-6 ml-4 text-black">Enhance Your Stay</h1>
            <ul className="space-y-2 font-bold">
              {roomCategories.length > 0 ? (
                roomCategories.map((category) => (
                  <li key={category.id} className="mb-4">
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className={`relative text-xl font-bold ${
                        selectedCategoryId === category.id
                          ? "text-red-500"
                          : "text-gray-800"
                      } transition duration-300 ease-in-out ml-4 pb-2`}
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
                <li className="text-lg">Loading categories...</li>
              )}
            </ul>
          </nav>
          <main className="ml-4 w-3/4 p-6 flex flex-col relative rounded-lg bg-white shadow-lg">
            {displayRoomCategory ? (
              <div className="flex flex-col">
                {displayRoomCategory.imageUrl ? (
                  <img
                    src={displayRoomCategory.imageUrl}
                    alt={displayRoomCategory.name}
                    className="w-full h-[70vh] object-cover mb-4 rounded-lg shadow-md"
                  />
                ) : (
                  <p className="text-lg text-center">Image not available</p>
                )}
                <div className="flex items-center space-x-8 mb-6">
                  <div>
                    <h1 className="text-2xl font-bold">{displayRoomCategory.name}</h1>
                  </div>
                  <div>
                    <p className="text-xl font-bold">
                      Price: <span className="text-red-500">&#8377;{displayRoomCategory.price}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xl flex items-center">
                      <FontAwesomeIcon icon={faBed} className="mr-2 text-xl" />
                      {displayRoomCategory.noOfAdults} Adults + {displayRoomCategory.noOfChildren} Children
                    </p>
                  </div>
                  <div>
                    <p className="text-xl flex items-center">
                      <FontAwesomeIcon icon={faVectorSquare} className="mr-2 text-xl" />
                      424 Sq. Ft.
                    </p>
                  </div>
                </div>
                <p className="text-lg mb-4">{displayRoomCategory.description}</p>
                <div className="mt-8 border-t pt-4 border-black flex flex-wrap justify-between">
                  <div className="flex items-center mb-2 space-x-2">
                    <input
                      type="checkbox"
                      id="check-in"
                      checked
                      readOnly
                      className="form-checkbox h-5 w-5 text-green-600"
                    />
                    <label htmlFor="check-in" className="text-lg">Check-in: 12:00 NOON</label>
                  </div>
                  <div className="flex items-center mb-2 space-x-2">
                    <input
                      type="checkbox"
                      id="check-out"
                      checked
                      readOnly
                      className="form-checkbox h-5 w-5 text-green-600"
                    />
                    <label htmlFor="check-out" className="text-lg">Check-out: 10:00 AM</label>
                  </div>
                  <div className="flex items-center mb-2 space-x-2">
                    <input
                      type="checkbox"
                      id="cancellation"
                      checked
                      readOnly
                      className="form-checkbox h-5 w-5 text-green-600"
                    />
                    <label htmlFor="cancellation" className="text-lg">Cancellation: 48 Hours</label>
                  </div>
                </div>
                <div className="mt-8 flex-1">
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
