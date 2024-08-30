"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  className?: string; // Add this line
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelectOption = (value: string) => {
    setSelectedOption(value);
    setIsDropdownOpen(false);
    router.push(`/login/${value}`);
  };

  return (
    <div>
      {/* Main Navigation Bar */}
      <nav className={`navbar ${className}`}>
        <div className="container mx-auto flex items-center justify-between p-4 relative">
          {/* Logo */}
          <div className="text-center text-2xl font-bold text-black">
            Hotel Enhance
          </div>

          {/* Right Side (Login/Signup) */}
          <div className="flex items-center space-x-4 ml-auto">
            <div className="text-center text-xl font-bold text-black hover:text-red-900">
              <button
                onClick={() => router.push("/rooms")}
                className=" bg-red-700 p-1  text-black text-xl hover:text-red-900 font-bold"
              >
                Booknow
              </button>
            </div>
            {/* Dropdown Menu */}
            <div className="relative">
              <button
                onClick={handleDropdownToggle}
                className=" text-black text-xl hover:text-red-900 font-bold"
              >
                Login
              </button>
              {isDropdownOpen && (
                <ul className="absolute  bg-red-100 shadow-lg border border-gray-200 mt-2 w-20 rounded-lg">
                  <li
                    onClick={() => handleSelectOption("adminlogin")}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                  >
                    Admin
                  </li>
                  <li
                    onClick={() => handleSelectOption("spalogin")}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                  >
                    SPA
                  </li>
                  <li
                    onClick={() => handleSelectOption("foodlogin")}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                  >
                    Food
                  </li>
                  <li
                    onClick={() => handleSelectOption("userlogin")}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                  >
                    User
                  </li>
                </ul>
              )}
            </div>
            {/* Signup Link */}
            <a
              href="/userRegister"
              className="text-black text-xl hover:text-red-900 font-bold"
            >
              Signup
            </a>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="bg-white-800">
          <div className="hidden md:flex justify-center text-black text-l font-bold">
            <ul className="flex space-x-8 p-4">
              {[
                "OVERVIEW",
                "ROOMS",
                "Food",
                "SPA",
                "Bookings",
                "GALLERY",
                "AMENITIES",
                "CONTACT",
                "ABOUT US",
              ].map((item) => (
                <li key={item}>
                  <a
                    href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                    className="no-underline hover:underline hover:text-red-900"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
