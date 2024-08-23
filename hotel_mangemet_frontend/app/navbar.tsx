"use client";
import Link from "next/link";
import React, { useState } from "react";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div>
      {/* Main Navigation Bar */}
      <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
        <div className="container mx-auto flex items-center justify-between p-4 relative">
          {/* Mobile Menu Button */}
          <button
            aria-label="Toggle menu"
            className="absolute left-4 md:hidden text-black focus:outline-none"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>

          {/* Logo */}
          <div className="flex-1 text-center text-2xl text-black font-bold">
            <Link href="/">MySite</Link>
          </div>

          {/* Login/Signup Links (visible on larger screens) */}
          <div className="absolute right-4 hidden md:flex space-x-4">
            <Link href="/login" className="text-black text-xl hover:text-gray-600">
              Login
            </Link>
            <Link href="/userRegister" className="text-black text-xl hover:text-gray-600">
              Signup
            </Link>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="bg-slate-800">
          <div className="hidden md:flex justify-center text-white">
            <ul className="flex space-x-8 p-4">
              {["OVERVIEW", "ROOMS", "DINING", "SPA", "GALLERY", "AMENITIES", "LOCATION", "CONTACT", "ABOUT US"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                    className="no-underline hover:underline hover:text-gray-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Menu (conditionally rendered) */}
      <div
        className={`fixed inset-0 bg-blue-900 text-white transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } z-50`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center p-4 border-b border-blue-700">
            <div className="text-xl font-bold">Menu</div>
            <button
              aria-label="Close menu"
              className="text-white hover:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="p-4 flex-grow overflow-y-auto">
            <div className="grid grid-cols-2 gap-8">
              {/* Left Side Menu Items */}
              <div className="space-y-5">
                <h2 className="text-xl font-bold">Our Locations</h2>
                <ul className="space-y-1">
                  <li><Link href="/our-locations" className="no-underline hover:underline hover:text-gray-300">Our Locations</Link></li>
                  <li><Link href="/our-hotels" className="no-underline hover:underline hover:text-gray-300">Our Hotels</Link></li>
                  <li><Link href="/our-brands" className="no-underline hover:underline hover:text-gray-300">Our Brands</Link></li>
                  <li><Link href="/offers" className="no-underline hover:underline hover:text-gray-300">Offers</Link></li>
                </ul>

                <h2 className="text-xl font-bold">Rooms</h2>
                <ul className="space-y-1">
                  <li><Link href="/rooms/grande-room" className="no-underline hover:underline hover:text-gray-300">Grande Room</Link></li>
                  <li><Link href="/rooms/studio-room" className="no-underline hover:underline hover:text-gray-300">Studio Room</Link></li>
                  <li><Link href="/rooms/premium-grande-room" className="no-underline hover:underline hover:text-gray-300">Premium Grande Room</Link></li>
                  <li><Link href="/rooms/suite-room" className="no-underline hover:underline hover:text-gray-300">Suite Room</Link></li>
                  <li><Link href="/rooms/premium-suite-room" className="no-underline hover:underline hover:text-gray-300">Premium Suite Room</Link></li>
                </ul>

                <h2 className="text-xl font-bold">Dining</h2>
                <ul className="space-y-1">
                  <li><Link href="/dining" className="no-underline hover:underline hover:text-gray-300">Dining</Link></li>
                  <li><Link href="/banquets" className="no-underline hover:underline hover:text-gray-300">Banquets</Link></li>
                </ul>
              </div>

              {/* Right Side Menu Items */}
              <div className="space-y-5">
                <h2 className="text-xl font-bold">About Us</h2>
                <ul className="space-y-1">
                  <li><Link href="/about-us" className="no-underline hover:underline hover:text-gray-300">About Us</Link></li>
                  <li><Link href="/contact-us" className="no-underline hover:underline hover:text-gray-300">Contact Us</Link></li>
                  <li><Link href="/partner-with-us" className="no-underline hover:underline hover:text-gray-300">Partner with Us</Link></li>
                  <li><Link href="/factsheet" className="no-underline hover:underline hover:text-gray-300">Factsheet</Link></li>
                  <li><Link href="/investors" className="no-underline hover:underline hover:text-gray-300">Investors</Link></li>
                  <li><Link href="/news-events" className="no-underline hover:underline hover:text-gray-300">News & Events</Link></li>
                  <li><Link href="/blog" className="no-underline hover:underline hover:text-gray-300">Blog</Link></li>
                  <li><Link href="/careers" className="no-underline hover:underline hover:text-gray-300">Careers</Link></li>
                </ul>

                <h2 className="text-xl font-bold">Book Now</h2>
                <div className="mt-2">
                  <p className="text-sm">+91-7880098008</p>
                  <p className="text-sm">enquiry@sayajigroup.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content opacity toggle for mobile menu */}
      <div
        className={`transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-0" : "opacity-100"
        }`}
      ></div>
    </div>
  );
};

export default Navbar;
