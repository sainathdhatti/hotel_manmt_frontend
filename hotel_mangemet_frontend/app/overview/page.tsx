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
  faStar,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import Link from "next/link";
import Navbar from "../navbar";
import Footer from "../footer/page";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useReviewStore from "../store/reviewStore";

// Utility function to get start of the day
const getStartOfDay = (date: Date) => {
  return new Date(date.setHours(0, 0, 0, 0));
};

const Overview = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [checkInDate, setCheckInDate] = useState(getStartOfDay(new Date()));
  const [checkOutDate, setCheckOutDate] = useState(getStartOfDay(new Date()));
  const [numberOfAdults, setNumberOfAdults] = useState(1);
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const { reviews, getAllReviews } = useReviewStore();
  const [showAll, setShowAll] = useState(false);
  const reviewsToShow = showAll ? reviews : reviews.slice(0, 4);
  const [currentIndexx, setCurrentIndexx] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    getAllReviews();
  }, [getAllReviews]);

  useEffect(() => {
    setTotalReviews(reviews.length);
  }, [reviews]);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
    }
  }, [isFirstRender]);

  const handlePrev = () => {
    setCurrentIndexx((prevIndex) =>
      prevIndex === 0 ? totalReviews - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndexx((prevIndex) => (prevIndex + 1) % totalReviews);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className={`text-lg ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };
  const images = [
    "/images/OFrontview.png",
    "/images/ORoom.png",
    "/images/Orecepetint.png",
    "/images/Oroom1.jpeg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const today = getStartOfDay(new Date());

  return (
    <div className="relative bg-gray-100">
      <Navbar />
      <div className="relative overflow-hidden">
        {/* Carousel Container */}
        <div className="carousel-container relative">
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
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <style jsx>{`
            .carousel-container {
              position: relative;
              width: 100%;
              overflow: hidden;
              border-bottom: 4px solid #e5e7eb; /* Light border */
            }

            .carousel-wrapper {
              display: flex;
              transition: transform 1s ease-in-out;
            }

            .carousel-slide {
              min-width: 100%;
              position: relative;
              height: 500px;
            }
          `}</style>
        </div>

        {/* Booking Form Section */}
        <div className="relative bg-white p-6 mx-4 md:mx-10 shadow-lg rounded-lg inset-x-0 bottom-10 border border-black">
          <div className="max-w-6xl mx-auto">
            <form className="flex flex-wrap gap-6">
              {/* Check-in Date */}
              <div className="flex-1 min-w-[200px]">
                <label
                  className="block text-gray-700 mb-2 text-sm font-semibold"
                  htmlFor="check-in"
                >
                  Check-in
                </label>
                <DatePicker
                  id="check-in"
                  selected={checkInDate}
                  onChange={(date: Date | null) => date && setCheckInDate(date)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  dateFormat="MMMM d, yyyy"
                  minDate={today}
                />
              </div>

              {/* Check-out Date */}
              <div className="flex-1 min-w-[200px]">
                <label
                  className="block text-gray-700 mb-2 text-sm font-semibold"
                  htmlFor="check-out"
                >
                  Check-out
                </label>
                <DatePicker
                  id="check-out"
                  selected={checkOutDate}
                  onChange={(date: Date | null) => {
                    if (date && checkInDate && date <= checkInDate) {
                      alert("Check-out date must be after the check-in date.");
                    } else if (date !== null) {
                      // Add this null check
                      setCheckOutDate(date);
                    }
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  dateFormat="MMMM d, yyyy"
                  minDate={
                    new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000)
                  } // +1 day
                />
              </div>

              {/* Number of Adults */}
              <div className="flex-1 min-w-[200px]">
                <label
                  className="block text-gray-700 mb-2 text-sm font-semibold"
                  htmlFor="adults"
                >
                  Number of Adults
                </label>
                <input
                  id="adults"
                  type="number"
                  value={numberOfAdults}
                  onChange={(e) => setNumberOfAdults(parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>

              {/* Number of Children */}
              <div className="flex-1 min-w-[200px]">
                <label
                  className="block text-gray-700 mb-2 text-sm font-semibold"
                  htmlFor="children"
                >
                  Number of Children
                </label>
                <input
                  id="children"
                  type="number"
                  value={numberOfChildren}
                  onChange={(e) =>
                    setNumberOfChildren(parseInt(e.target.value))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              {/* Submit Button */}
              <div className="flex-1 min-w-[200px]">
                <button
                  type="submit"
                  className="bg-customBlue mt-8 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition-colors w-full text-sm font-semibold"
                >
                  <a href="/rooms">Check Availability</a>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="bg-customBlue ">
          <div className="text-center text-white bg-customBlue shadow-lg rounded-lg py-5">
            <h2 className="text-3xl font-semibold mb-2">Hotel Enhance</h2>
            <span className="font-sm">
              Mumbai-Bangalore Bypass Highway, Wakad, Pune, Maharashtra - 411057
            </span>
            <p className="text-base mt-2 flex items-center justify-center space-x-4">
              <span className="flex items-center font-semibold">
                <FontAwesomeIcon icon={faPhone} className="text-white mr-2" />
                Phone: 020 421212
              </span>
              <span>|</span>
              <span className="flex items-center">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-white mr-2"
                />
                Email:{" "}
                <a
                  href="mailto:reservations@HotelEnhance.com"
                  className="text-white hover:underline font-semibold"
                >
                  reservations@HotelEnhance.com
                </a>
              </span>
            </p>
          </div>
        </div>

        {/* Welcome Message Section */}
        <div className="py-10 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
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

        {/* Amenities Section */}
        <div className="py-5">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-8 mb-8">
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
            <div className="text-center">
              <Link
                href="/amenities"
                className="inline-block bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
              >
                View All Amenities
              </Link>
            </div>
          </div>
        </div>

        <div className="relative py-10">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-6 mx-4 md:mx-8 text-center">
            Gallery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 m-6">
            <div className="relative w-full h-[30vh]">
              <Image
                src="/images/gallery front desk.jpg"
                alt="Gallery Front Desk"
                layout="fill"
                objectFit="cover"
                className="object-cover rounded-lg"
              />
            </div>
            <div className="relative w-full h-[30vh]">
              <Image
                src="/images/galleryroom.jpg"
                alt="Gallery Room"
                layout="fill"
                objectFit="cover"
                className="object-cover rounded-lg"
              />
            </div>
            <div className="relative w-full h-[30vh]">
              <Image
                src="/images/gympic.jpg"
                alt="Gym"
                layout="fill"
                objectFit="cover"
                className="object-cover rounded-lg"
              />
            </div>
            <div className="relative w-full h-[30vh]">
              <Image
                src="/images/Aspa.jpeg"
                alt="Spa"
                layout="fill"
                objectFit="cover"
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative py-4 px-2 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Reviews</h2>

          {/* Carousel Container */}
          <div className="relative overflow-hidden">
            {/* Carousel Inner */}
            <div
              className={`flex transition-transform duration-500 ease-in-out ${
                isFirstRender ? "opacity-0" : "opacity-100"
              }`}
              style={{ transform: `translateX(-${currentIndexx * 100}%)` }}
            >
              {reviews.length > 0 ? (
                reviews
                  .filter((review) => review.rating && review.description) // Filter out reviews with empty rating or description
                  .map((review) => (
                    <div
                      key={review.id}
                      className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 h-[30vh] p-4"
                    >
                      <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
                        <h3 className="text-sm font-semibold mb-2">
                          {review.booking.user.firstName}
                        </h3>
                        <div className="flex items-center mb-2 pl-20">
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-gray-800 text-sm line-clamp-4">
                          {review.description}
                        </p>
                      </div>
                    </div>
                  ))
              ) : (
                <p>No reviews available.</p>
              )}
            </div>

            {/* Previous Button */}
          </div>
          <button
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10"
            onClick={handlePrev}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          {/* Next Button */}
          <button
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10"
            onClick={handleNext}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Overview;
