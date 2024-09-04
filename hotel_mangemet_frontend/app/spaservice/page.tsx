"use client";
import useSpaServiceStore from "../store/spaServiceStore";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "../footer/page";
import Navbar from "../navbar";
import { useRouter } from "next/navigation";

const SpaService = () => {
  const router = useRouter();
  const {
    spaServices,
    spaService,
    getAllSpaServices,
    getSpaServiceById,
  } = useSpaServiceStore((state) => ({
    spaServices: state.spaServices,
    spaService: state.spaService,
    getAllSpaServices: state.getAllSpaServices,
    getSpaServiceById: state.getSpaServiceById,
  }));

  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    const initializeData = async () => {
      await getAllSpaServices();
    };
    initializeData();
  }, [getAllSpaServices]);

  useEffect(() => {
    if (spaServices.length > 0) {
      const firstServiceId = selectedServiceId || spaServices[0].id;
      setSelectedServiceId(firstServiceId);
      getSpaServiceById(firstServiceId);
    }
  }, [spaServices, selectedServiceId, getSpaServiceById]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleServiceClick = (id: number) => {
    setSelectedServiceId(id);
    getSpaServiceById(id);
  };

  const handleClick = () => {
    if (isClient) {
      const sessionItem = sessionStorage.getItem("token");
      if (sessionItem) {
        router.push(`/spaBookingForm/${selectedServiceId}`);
      } else {
        alert("Please login first");
        router.push(`login/userlogin`);
      }
    }
  };

  const displaySpaService =
    spaService || (spaServices.length > 0 ? spaServices[0] : null);

  return (
    <>
      <Navbar className="absolute top-0 left-0 w-full z-10" />
      <div className="relative flex overflow-hidden justify-center min-h-screen pt-16">
        <div className="absolute inset-0">
          <img
            src="images/abc.jpg"
            className="opacity-35 w-full h-full object-cover"
          />
        </div>
        <div className="flex w-full max-w-screen-xl mx-auto pt-10">
          <nav className="w-1/4 min-h-screen p-6 py-8">
            <h1 className="text-3xl font-bold mb-6 ml-4 text-black">
              Enhance Your Service
            </h1>
            <ul className="space-y-2 font-bold">
              {spaServices.length > 0 ? (
                spaServices.map((service) => (
                  <li key={service.id} className="mb-4">
                    <button
                      onClick={() => handleServiceClick(service.id)}
                      className={`relative text-xl font-bold ${
                        selectedServiceId === service.id
                          ? "text-red-500"
                          : "text-gray-800"
                      } transition duration-300 ease-in-out ml-4 pb-2`}
                    >
                      {service.name}
                      <span
                        className={`absolute bottom-0 left-0 w-full ${
                          selectedServiceId === service.id
                            ? "border-b-2 border-red-500"
                            : "border-b-2 border-gray-800"
                        }`}
                      />
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-lg">Loading services...</li>
              )}
            </ul>
          </nav>
          <main className="ml-4 w-3/4 p-6 flex flex-col relative rounded-lg">
            {displaySpaService ? (
              <div className="flex flex-col">
                {displaySpaService.service_image ? (
                  <img
                    src={displaySpaService.service_image}
                    alt={displaySpaService.name}
                    className="w-full h-[70vh] object-cover mb-4 rounded-lg shadow-md"
                  />
                ) : (
                  <p className="text-lg text-center">Image not available</p>
                )}
                <div className="flex items-center space-x-8 mb-6">
                  <div>
                    <h1 className="text-3xl font-bold">
                      {displaySpaService.name}
                    </h1>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      Price:{" "}
                      <span className="text-red-500">
                        &#8377;{displaySpaService.price}
                      </span>
                    </p>
                  </div>
                </div>
                <p className="text-lg mb-4">{displaySpaService.description}</p>
                <div className="mt-8 border-t pt-4 border-black ">
                  <div className="flex items-center mb-2 space-x-16">
                    <div>
                      <input
                        type="checkbox"
                        id="cancellation"
                        checked
                        readOnly
                        className="form-checkbox h-5 w-5 text-green-600"
                      />
                      <label htmlFor="cancellation" className="text-lg ml-3">
                        Cancellation: 1 Hour
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="cancellation"
                        checked
                        readOnly
                        className="form-checkbox h-5 w-5 text-green-600 "
                      />
                      <label htmlFor="cancellation" className="text-lg ml-3 ">
                        You can book up to 3 spa appointments per user
                      </label>
                    </div>
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
              <p className="text-lg">Please select a service</p>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SpaService;
