"use client";
import useRoomCategoryStore from "../store/roomCategory";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faVectorSquare } from "@fortawesome/free-solid-svg-icons";
import Footer from "../footer/page";
import useAuthStore from "../store/loginStore";

const Rooms = () => {
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

  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const { isAuthenticated, userId } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    userId: state.userId,
  }));

  console.log(userId);

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);

      try {
        await getAllRoomCategories();

        if (roomCategories.length > 0 && !roomCategory) {
          const firstCategoryId = roomCategories[0].id;
          setSelectedCategoryId(firstCategoryId);
          await getRoomCategory(firstCategoryId);
        }
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [getAllRoomCategories, getRoomCategory, roomCategories, roomCategory]);

  const handleCategoryClick = (id: number) => {
    getRoomCategory(id);
    setSelectedCategoryId(id);
  };

  const displayRoomCategory = roomCategory || (roomCategories.length > 0 ? roomCategories[0] : null);

  return (
    <>
      <div className="flex pt-24 overflow-hidden justify-center min-h-screen">
        <nav className="w-1/4 min-h-screen p-4 py-5">
          <h2 className="text-2xl font-semibold mb-6 ml-10">Enhance Your Stay</h2>
          <ul className="space-y-4">
            {roomCategories.length > 0 ? (
              roomCategories.map((category) => (
                <li key={category.id} className="mb-4">
                  <button
                    onClick={() => handleCategoryClick(category.id)}
                    className="text-xl font-semibold hover:text-red-500 transition duration-300 ease-in-out ml-10"
                  >
                    {category.name}
                  </button>
                </li>
              ))
            ) : (
              <li className="text-lg">Loading categories...</li>
            )}
          </ul>
        </nav>
        <main className="ml-1/4 w-3/4 p-6 flex flex-col relative">
          {isLoading ? (
            <p className="text-lg">Loading...</p>
          ) : displayRoomCategory ? (
            <div className="flex-0">
              {displayRoomCategory.imageUrl ? (
                <img
                  src={displayRoomCategory.imageUrl}
                  alt={displayRoomCategory.name}
                  className="w-full h-[70vh] mb-4"
                />
              ) : (
                <p className="text-lg text-center">Image not available</p>
              )}
              <div className="flex items-center space-x-10 mb-6 pr-10">
                <div className="flex-0">
                  <h1 className="text-2xl font-bold">
                    {displayRoomCategory.name}
                  </h1>
                </div>
                <div>
                  <p className="text-2xl flex items-center font-bold">
                    Price: ${displayRoomCategory.price}
                  </p>
                </div>
                <div>
                  <p className="text-2xl flex items-center font-bold">
                    <FontAwesomeIcon icon={faBed} className="mr-2 text-xl" />
                    {displayRoomCategory.noOfAdults} Adults + {displayRoomCategory.noOfChildren} Children
                  </p>
                </div>
                <div>
                  <p className="text-2xl flex items-center">
                    <strong>Size:</strong>{" "}
                    <FontAwesomeIcon
                      icon={faVectorSquare}
                      className="mr-2 text-xl"
                    />{" "}
                    424 Sq. Ft.
                  </p>
                </div>
              </div>
              <p className="text-lg mb-4">{displayRoomCategory.description}</p>
              <div className="mt-8 border-t pt-4 border-gray-300 flex justify-between">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="check-in"
                    checked
                    readOnly
                    className="form-checkbox h-5 w-5 text-green-600"
                  />
                  <label htmlFor="check-in" className="ml-2 text-lg">
                    Check-in: 12:00 NOON
                  </label>
                </div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="check-out"
                    checked
                    readOnly
                    className="form-checkbox h-5 w-5 text-green-600"
                  />
                  <label htmlFor="check-out" className="ml-2 text-lg">
                    Check-out: 10:00 AM
                  </label>
                </div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="cancellation"
                    checked
                    readOnly
                    className="form-checkbox h-5 w-5 text-green-600"
                  />
                  <label htmlFor="cancellation" className="ml-2 text-lg">
                    Cancellation: 48 Hours
                  </label>
                </div>
              </div>
              <div className="mt-8 flex-1">
                <h2 className="text-xl font-semibold mb-2">Amenities:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {displayRoomCategory.amenities?.length ? (
                    displayRoomCategory.amenities.map((amenity) => (
                      <div
                        key={amenity.id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          id={`amenity-${amenity.id}`}
                          checked
                          readOnly
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <label
                          htmlFor={`amenity-${amenity.id}`}
                          className="text-lg"
                        >
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
                <a
                  href={`/bookingForm/${selectedCategoryId}`}
                  className="bg-red-500 text-white text-lg font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-red-600 transition duration-300"
                >
                  Book Now
                </a>
              </div>
            </div>
          ) : (
            <p className="text-lg">Please select a category</p>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Rooms;
