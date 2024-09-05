"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faBed,
  faUtensils,
  faGlassCheers,
  faClock,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Navbar from "../navbar";
import Footer from "../footer/page";


const Overview = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "/images/OFrontview.png",
    "/images/ORoom.png",
    "/images/Orecepetint.png",
    "/images/Oroom1.jpeg",
  ];
  const [selectedCategory, setSelectedCategory] = useState("rooms");

  const categories: { [key: string]: string } = {
    rooms: "/images/room.jpg",
    dinner: "/images/dinner.jpg",
    banquets: "/images/banquets.jpg",
  };

  const handleCategoryClick = (category: React.SetStateAction<string>) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative bg-custom-light-gray">
      {/* Ensure content starts below navbar */}
      <div className="relative overflow-hidden bg-custom-light-gray">
        {/* Carousel Section */}
        <div className="carousel-container relative">
          {/* Navbar placed here with absolute positioning */}
          <Navbar className="absolute top-0 left-0 w-full z-50" />
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
                  className="opacity-70 "
                />
              </div>
            ))}
          </div>
          <style jsx>{`
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
        </div>

        {/* Contact Information Section */}
        <div className="bg-amber-900">
          {" "}
          {/* Brighter background color */}
          <div className="text-center text-white bg-custom-blue shadow-lg rounded-lg mx-auto max-w-lg px-4 py-6">
            <h2 className="text-3xl font-bold mb-4">Hotel Enhance</h2>
            <p className="text-lg mb-1">
              Mumbai-Bangalore Bypass Highway, Wakad, Pune, Maharashtra
              - 411057
            </p>
            <p className="text-lg mb-2 flex items-center justify-center">
              <FontAwesomeIcon icon={faPhone} className="text-white mr-2" />{" "}
              <span>Phone: 020 421212</span>
            </p>
            <p className="text-lg mb-2 flex items-center justify-center">
              <FontAwesomeIcon icon={faEnvelope} className="text-white mr-2" />
              <span>
                Email:{" "}
                <a
                  href="mailto:reservations@HotelEnhance.com"
                  className="text-white hover:underline"
                >
                  reservations@HotelEnhance.com
                </a>
              </span>
            </p>
          </div>
        </div>

        {/* Welcome Message Section */}
        <div className=" py-10 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Welcome to Hotel Enhance
            </h2>
            <p className="text-lg mb-4">
              As you enter Pune from the Mumbai-Bangalore Highway, you will
              witness a beacon of luxury, towering over others. Hotel Enhance
              Pune is a favourite 5-star destination of all the jet-setters who
              visit Pune to experience the famed hospitality of the city of the
              Peshwas. The iconic facade of the hotel welcomes you to a superior
              stay experience.
            </p>
            <p className="text-lg">
              Ultra-luxurious rooms, soul-pampering amenities, fine-dining
              experiences, and grand banquet halls, Pune's most popular business
              hotel rolls out the red carpet to welcome you. Book your luxurious
              stay today, and get ready to experience the next level of
              hospitality.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-center bg-white rounded-full shadow-lg p-6 w-36 flex flex-col items-center">
                <FontAwesomeIcon
                  icon={faBed}
                  className="text-blue-500 text-3xl"
                />
                <h3 className="mt-4 text-lg font-bold text-gray-800">Stay</h3>
              </div>
              <div className="text-center bg-white rounded-full shadow-lg p-6 w-36 flex flex-col items-center">
                <FontAwesomeIcon
                  icon={faUtensils}
                  className="text-green-500 text-3xl"
                />
                <h3 className="mt-4 text-lg font-bold text-gray-800">Dining</h3>
              </div>
              <div className="text-center bg-white rounded-full shadow-lg p-6 w-36 flex flex-col items-center">
                <FontAwesomeIcon
                  icon={faGlassCheers}
                  className="text-red-500 text-3xl"
                />
                <h3 className="mt-4 text-lg font-bold text-gray-800">
                  Banquet
                </h3>
              </div>
              <div className="text-center bg-white rounded-full shadow-lg p-6 w-36 flex flex-col items-center">
                <FontAwesomeIcon
                  icon={faClock}
                  className="text-purple-500 text-3xl"
                />
                <h3 className="mt-4 text-lg font-bold text-gray-800">24/7</h3>
              </div>
            </div>
            {/* Button and View All Amenities Link */}
            <div className="text-center mt-8">
              <Link
                href="/amenities"
                className="inline-block bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
              >
                View All Amenities
              </Link>
            </div>
          </div>

          {/* Offers Section */}
          <div className="relative">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-4 mx-4 md:mx-8">
              Offers
            </h2>
            <div className="flex flex-wrap ">
              {/* Left Image with Overlay Text */}
              <div className="relative w-1/3 lg:w-1/3 h-[75vh] m-2">
                <Image
                  src="/images/musiclive.jpg"
                  alt="Live Music Offer"
                  layout="fill"
                  objectFit="cover"
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white p-4">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">
                      Live Music Every Weekend
                    </h2>
                    <p className="text-lg">
                      Enjoy live music performances every weekend at our hotel.
                      Don’t miss out on the fun!
                    </p>
                  </div>
                </div>
              </div>
              {/* Right Image */}
              <div className="relative w-1/3 lg:w-1/3 h-[75vh] m-2">
                <Image
                  src="/images/brunchsunday.jpg"
                  alt="Sunday Brunch Offer"
                  layout="fill"
                  objectFit="cover"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="py-2">
          <div className="flex flex-wrap">
            {/* Left Side with Category Text */}
            <div className="w-full lg:w-1/4 flex flex-col bg-gray-100 p-4 h-[70vh] ">
              <p
                onClick={() => handleCategoryClick("rooms")}
                className=" cursor-pointer mb-4 hover:underline text-2xl hover:text-amber-900"
              >
                Rooms
              </p>
              <p
                onClick={() => handleCategoryClick("dinner")}
                className=" cursor-pointer mb-4 hover:underline text-2xl hover:text-amber-900"
              >
                Dining
              </p>
              <p
                onClick={() => handleCategoryClick("banquets")}
                className=" cursor-pointer mb-4 hover:underline text-2xl hover:text-amber-900"
              >
                Banquets
              </p>
            </div>
            {/* Right Side with Category Image and Description */}
            <div className="w-2/4 lg:w-2/3 relative">
              <Image
                src={categories[selectedCategory]}
                alt=""
                layout="fill"
                objectFit="cover"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="relative">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4 mx-4 md:mx-8">
            Gallery
          </h2>
          <div className="flex ">
            {/* Left Image with Overlay Text */}
            <div className="relative w-1/3  h-[75vh] m-2">
              <Image
                src="/images/gallery front desk.jpg"
                alt="Gallery Front Desk"
                layout="fill"
                objectFit="cover"
                className="object-cover"
              />
            </div>
            {/* Right Image */}
            <div className="relative w-1/3 lg:w-1/3 h-[75vh] m-2">
              <Image
                src="/images/galleryroom.jpg"
                alt="Gallery Room"
                layout="fill"
                objectFit="cover"
                className="object-cover"
              />
            </div>
            <div className="relative w-1/3 lg:w-1/3 h-[75vh] m-2">
              <Image
                src="/images/gympic.jpg"
                alt="Gym"
                layout="fill"
                objectFit="cover"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Overview;
