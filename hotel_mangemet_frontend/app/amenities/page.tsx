"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDumbbell,
  faUtensils,
  faSwimmingPool,
  faBed,
  faWifi,
  faTv,
  faThermometerHalf,
  faParking,
  faCreditCard,
  faLeaf,
  faSpa,
} from "@fortawesome/free-solid-svg-icons";
import Footer from "../footer/page";

const amenitiesData = [
  {
    icon: faDumbbell,
    name: "Fitness Center",
    description: "Stay fit with our fully equipped fitness center.",
  },
  {
    icon: faUtensils,
    name: "Restaurant",
    description: "Enjoy delicious meals at our on-site restaurant.",
  },
  {
    icon: faSwimmingPool,
    name: "Swimming Pool",
    description: "Relax and swim in our outdoor swimming pool.",
  },
  {
    icon: faBed,
    name: "Room Service",
    description: "Convenient room service available for your comfort.",
  },
  {
    icon: faWifi,
    name: "Wi-Fi",
    description: "Stay connected with free high-speed Wi-Fi.",
  },
  {
    icon: faTv,
    name: "TV",
    description: "Watch your favorite shows on our flat-screen TVs.",
  },
  {
    icon: faThermometerHalf,
    name: "Heating",
    description: "Stay warm with in-room heating.",
  },
  {
    icon: faBed,
    name: "Air Conditioning",
    description: "Keep cool with air conditioning in every room.",
  },
  {
    icon: faParking,
    name: "Valet Parking",
    description: "Enjoy hassle-free valet parking service.",
  },
  {
    icon: faCreditCard,
    name: "Credit Cards Accepted",
    description: "We accept all major credit cards for your convenience.",
  },
  {
    icon: faLeaf,
    name: "Garden",
    description: "Relax in our beautifully maintained garden.",
  },
  {
    icon: faSpa,
    name: "Spa & Wellness Services",
    description: "Pamper yourself with our spa and wellness services.",
  },
];


const Amenities = () => {
  return (
    <>
      <img
        src="/images/swmimmgpolamities.jpg"
        alt=""
        className="w-full h-[90vh]  py-2"
      />
      <div className="flex flex-col items-center mt-10">
        <div className="bg-white rounded-lg shadow-lg p-5">
          <h2 className="text-3xl font-bold mb-10 text-gray-800 text-center">
            Hotel Amenities
          </h2>
          <p className="text-gray-600">
            Our hotel offers a wide range of premium amenities designed to
            ensure a comfortable and enjoyable stay. Indulge in our luxurious
            spa and wellness services, including relaxing massages and
            rejuvenating treatments. Stay active in our state-of-the-art fitness
            center or take a refreshing dip in the swimming pool. Enjoy
            delicious meals at our on-site restaurant or savor room service from
            the comfort of your room. Stay connected with high-speed Wi-Fi,
            watch your favorite shows on our flat-screen TVs, and rest easy in
            our well-appointed rooms with air conditioning and heating. For your
            convenience, we provide valet parking, accept major credit cards,
            and offer a garden. Explore our beautiful garden
            or take advantage of our 24-hour front desk service. Experience all
            the comforts and conveniences of home with us.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-10">
          {amenitiesData.map((amenity, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-10">
              <h3 className="text-2xl font-bold mb-5 text-gray-800 flex items-center">
                <FontAwesomeIcon icon={amenity.icon} className="mr-2" />
                {amenity.name}
              </h3>
              <p className="text-gray-600">{amenity.description}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Amenities;
