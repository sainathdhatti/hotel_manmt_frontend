'use client';
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname(); // Get the current path
  const router = useRouter();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if the current path starts with "/dashboard"
  //const shouldHideNavbar = pathname.startsWith('/dashboard');

  // if (shouldHideNavbar) {
  //   return null; // Do not render the Navbar if the path starts with "/dashboard"
  // }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = event.target.value;
    if (selectedCategory) {
      router.push(`/login/${selectedCategory}`);
    }
  };

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
            <a href="/">MySite</a>
          </div>

          {/* Login/Signup Links (visible on larger screens) */}
          <div className="absolute right-4 hidden md:flex space-x-4">
            <label
              htmlFor="login-select"
              className="block text-lg font-medium mb-2"
            ></label>
            <select
              id="login-select"
              onChange={handleSelectChange}
              className="p-1"
            >
              <option value="">Login</option>
              <option value="adminlogin">Admin</option>
              <option value="spalogin">SPA</option>
              <option value="foodlogin">Food</option>
              <option value="userlogin">User</option>
            </select>
            <a
              href="/userRegister"
              className="text-black text-xl hover:text-gray-600"
            >
              Signup
            </a>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="bg-slate-800">
          <div className="hidden md:flex justify-center text-white">
            <ul className="flex space-x-8 p-4">
              {[
                "OVERVIEW",
                "ROOMS",
                "Food",
                "SPA",
                "Bookings",
                "GALLERY",
                "AMENITIES",
                "LOCATION",
                "CONTACT",
                "ABOUT US",
              ].map((item) => (
                <li key={item}>
                  <a
                    href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                    className="no-underline hover:underline hover:text-gray-300"
                  >
                    {item}
                  </a>
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
                  <li>
                    <a
                      href="/our-locations"
                      className="no-underline hover:underline hover:text-gray-300"
                    >
                      Our Locations
                    </a>
                  </li>
                  <li>
                    <a
                      href="/our-hotels"
                      className="no-underline hover:underline hover:text-gray-300"
                    >
                      Our Hotels
                    </a>
                  </li>
                  <li>
                    <a
                      href="/our-brands"
                      className="no-underline hover:underline hover:text-gray-300"
                    >
                      Our Brands
                    </a>
                  </li>
                  <li>
                    <a
                      href="/offers"
                      className="no-underline hover:underline hover:text-gray-300"
                    >
                      Offers
                    </a>
                  </li>
                </ul>

                <h2 className="text-xl font-bold">Rooms</h2>
                <ul className="space-y-1">
                  <li>
                    <a
                      href="/rooms/grande-room"
                      className="no-underline hover:underline hover:text-gray-300"
                    >
                      Grande Room
                    </a>
                  </li>
                  <li>
                    <a
                      href="/rooms/studio-room"
                      className="no-underline hover:underline hover:text-gray-300"
                    >
                      Studio Room
                    </a>
                  </li>
                  <li>
                    <a
                      href="/rooms/premium-grande-room"
                      className="no-underline hover:underline hover:text-gray-300"
                    >
                      Premium Grande Room
                    </a>
                  </li>
                  <li>
                    <a
                      href="/rooms/suite-room"
                      className="no-underline hover:underline hover:text-gray-300"
                    >
                      Suite Room
                    </a>
                  </li>
                  <li>
                    <a
                      href="/rooms/premium-suite-room"
                      className="no-underline hover:underline hover:text-gray-300"
                    >
                      Premium Suite Room
                    </a>
                  </li>
                </ul>

                <h2 className="text-xl font-bold">Dining</h2>
                <ul className="space-y-1">
                  <li>
                    <a
                      href="/dining"
                      className="no-underline hover:underline hover:text-gray-300"
                    >
                      Dining
                    </a>
                  </li>
                  <li>
                    <a
                      href="/banquets"
                      className="no-underline hover:underline hover:text-gray-300"
                    >
                      Banquets
                    </a>
                  </li>
                </ul>
              </div>

              {/* Right Side Menu Items */}
              <div className="space-y-5">
                <h2 className="text-xl font-bold">About Us</h2>
                <ul className="space-y-1">
                  <li>
                    <a
                      href="/about-us"
                      className="no-underline hover:underline hover:text-gray-300"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact-us"
                      className="no-underline hover:underline hover:text-gray-300"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="/partner-with-us"
                      className="no-underline hover:underline hover:text-gray-300"
                    >
                      Partner with Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="/factsheet"
                      className="no-underline hover:underline hover:text-gray-300"
                    >
                      Factsheet
                    </a>
                  </li>
                  <li>
                    <a
                      href="/investors"
                      className="no-underline hover:underline hover:text-gray-300"
                    >
                      Investors
                    </a>
                  </li>
                  <li>
                    <a
                      href="/news-events"
                      className="no-underline hover:underline hover:text-gray-300"
                    >
                      News & Events
                    </a>
                  </li>
                  <li>
                    <a
                      href="/blog"
                      className="no-underline hover:underline hover:text-gray-300"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="/careers"
                      className="no-underline hover:underline hover:text-gray-300"
                    >
                      Careers
                    </a>
                  </li>
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
