"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
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
import Navbar from "../navbar";

const amenitiesData = [
  {
    icon: faDumbbell,
    name: "Fitness Center",
    description: "Stay fit with our fully equipped fitness center.",
    colorClass: "text-red-500",
  },
  {
    icon: faUtensils,
    name: "Restaurant",
    description: "Enjoy delicious meals at our on-site restaurant.",
    colorClass: "text-green-500",
  },
  {
    icon: faSwimmingPool,
    name: "Swimming Pool",
    description: "Relax and swim in our outdoor swimming pool.",
    colorClass: "text-blue-500",
  },
  {
    icon: faBed,
    name: "Room Service",
    description: "Convenient room service available for your comfort.",
    colorClass: "text-yellow-500",
  },
  {
    icon: faWifi,
    name: "Wi-Fi",
    description: "Stay connected with free high-speed Wi-Fi.",
    colorClass: "text-purple-500",
  },
  {
    icon: faTv,
    name: "TV",
    description: "Watch your favorite shows on our flat-screen TVs.",
    colorClass: "text-pink-500",
  },
  {
    icon: faThermometerHalf,
    name: "Heating",
    description: "Stay warm with in-room heating.",
    colorClass: "text-orange-500",
  },
  {
    icon: faBed,
    name: "Air Conditioning",
    description: "Keep cool with air conditioning in every room.",
    colorClass: "text-teal-500",
  },
  {
    icon: faParking,
    name: "Valet Parking",
    description: "Enjoy hassle-free valet parking service.",
    colorClass: "text-indigo-500",
  },
  {
    icon: faCreditCard,
    name: "Credit Cards Accepted",
    description: "We accept all major credit cards for your convenience.",
    colorClass: "text-gray-500",
  },
  {
    icon: faLeaf,
    name: "Garden",
    description: "Relax in our beautifully maintained garden.",
    colorClass: "text-lime-500",
  },
  {
    icon: faSpa,
    name: "Spa & Wellness Services",
    description: "Pamper yourself with our spa and wellness services.",
    colorClass: "text-cyan-500",
  },
];

const images = [
  "/images/swmimmgpolamities.jpg",
  "/images/Aspa.jpeg",
  "/images/Agym.jpg",
  "/images/Adinning.jpg",
  "/images/Aroomservice.jpg",
];

const Amenities = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <Navbar className="absolute top-0 left-0 w-full z-10"/>
      <div className="relative">
        {/* Ensure content starts below navbar */}
        <div className="relative overflow-hidden">
          {/* Carousel Section */}
          <div className="carousel-container">
            <div
              className="carousel-wrapper"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((src, index) => (
                <div key={index} className="carousel-slide">
                  <Image
                    src={src}
                    alt={`Image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="h-auto w-full object-cover opacity-70"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center mt-5 px-6 md:px-10 lg:px-20">
            <div className="p-6 mb-10">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
                Hotel Amenities
              </h2>
              <p className="text-gray-600 pl-32 pr-32 text-center">
                Our hotel offers a wide range of premium amenities designed to
                ensure a comfortable and enjoyable stay. Indulge in our
                luxurious spa and wellness services, including relaxing massages
                and rejuvenating treatments. Stay active in our state-of-the-art
                fitness center or take a refreshing dip in the swimming pool.
                Enjoy delicious meals at our on-site restaurant or savor room
                service from the comfort of your room. Stay connected with
                high-speed Wi-Fi, watch your favorite shows on our flat-screen
                TVs, and rest easy in our well-appointed rooms with air
                conditioning and heating. For your convenience, we provide valet
                parking, accept major credit cards, and offer a garden. Explore
                our beautiful garden or take advantage of our 24-hour front desk
                service. Experience all the comforts and conveniences of home
                with us.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-10">
              {amenitiesData.map((amenity, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg p-10 flex flex-col items-center transition-transform transform hover:scale-105 hover:bg-gray-100"
                >
                  <FontAwesomeIcon
                    icon={amenity.icon}
                    className={`text-4xl mb-5 ${amenity.colorClass} animate-pulse`}
                  />
                  <h3 className="text-2xl font-bold mb-5 text-gray-800 text-center">
                    {amenity.name}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {amenity.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-pulse {
          animation: pulse 1.5s infinite;
        }

        .carousel-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          margin-top: 0;
        }

        .carousel-wrapper {
          display: flex;
          transition: transform 2s ease-in-out;
          will-change: transform;
        }

        .carousel-slide {
          min-width: 100%;
          position: relative;
          height: 500px;
        }
      `}</style>
    </>
  );
};

export default Amenities;
