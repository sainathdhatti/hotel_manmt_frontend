"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/app/store/loginStore"; // Import your Zustand store

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  const router = useRouter();
  const { isAuthenticated, userName, logout } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    userName: state.userName,
    logout: state.logout,
  }));

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to handle dropdown toggle
  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Function to handle logout
  const handleLogout = () => {
    logout();
    router.push("/"); // Redirect to home page after logout
  };

  // Function to handle login option selection
  const handleSelectOption = (role: string) => {
    router.push(`/login/${role}`);
  };

  return (
    <div>
      {/* Main Navigation Bar */}
      <nav className={`navbar ${className}`}>
        <div className="container mx-auto flex items-center justify-between p-4 relative">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <img
              src="/images/logo1 (1).jpg"
              alt="Hotel Logo"
              className="w-15 h-12 object-cover"
            />
            <div className="text-center text-2xl font-bold text-black md:text-3xl">
              Hotel Enhance
            </div>
          </div>

          <div className="flex items-center space-x-4 ml-auto">
            {/* Mobile Menu Button */}
            <button
              onClick={handleDropdownToggle}
              className="md:hidden text-black text-xl hover:text-red-900 font-bold"
            >
              Menu
            </button>

            {/* Book Now Button */}
            <button
              onClick={() => router.push("/rooms")}
              className="bg-red-700 p-2 text-white text-lg hover:bg-red-800 font-bold rounded-md"
            >
              Book Now
            </button>

            {/* Right Side (Login/Signup) */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* User Dropdown Menu */}
                  <div className="relative">
                    <button
                      onClick={handleDropdownToggle}
                      className="text-black text-lg hover:text-red-900 font-bold"
                    >
                      {userName}
                    </button>
                    {isDropdownOpen && (
                      <ul className="absolute bg-red-100 shadow-lg border border-gray-200 mt-2 w-40 rounded-lg">
                        <li
                          onClick={() => router.push("/dashboard/userlogin")}
                          className="p-2 cursor-pointer hover:bg-gray-100"
                        >
                          Profile
                        </li>
                        <li
                          onClick={handleLogout}
                          className="p-2 cursor-pointer hover:bg-gray-100"
                        >
                          Logout
                        </li>
                      </ul>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={handleDropdownToggle}
                    className="text-black text-lg hover:text-red-900 font-bold"
                  >
                    Login
                  </button>
                  {isDropdownOpen && (
                    <ul className="absolute bg-red-100 shadow-lg border border-gray-200 mt-48 w-20 rounded-lg">
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
                  <a
                    href="/userRegister"
                    className="text-black text-lg hover:text-red-900 font-bold"
                  >
                    Signup
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden ${isDropdownOpen ? "block" : "hidden"} bg-white border-t border-gray-200`}>
          <ul className="flex flex-col space-y-4 p-4">
            {[
              "OVERVIEW",
              "ABOUT US",
              "ROOMS",
              "Food",
              "SPASERVICE",
              "GALLERY",
              "AMENITIES",
              "CONTACT"  
            ].map((item) => (
              <li key={item}>
                <a
                  href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                  className="block text-black text-xl hover:text-red-900"
                >
                  {item}
                </a>
              </li>
            ))}
            {!isAuthenticated ? (
              <>
                <li>
                  <button
                    onClick={handleDropdownToggle}
                    className="text-black text-lg hover:text-red-900 font-bold"
                  >
                    Login
                  </button>
                </li>
                {isDropdownOpen && (
                  <ul className="flex flex-col space-y-2 p-2">
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
                <li>
                  <a
                    href="/userRegister"
                    className="text-black text-lg hover:text-red-900 font-bold"
                  >
                    Signup
                  </a>
                </li>
              </>
            ) : null}
          </ul>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:block bg-white-800">
          <ul className="flex justify-center space-x-8 p-4 text-black text-lg font-bold">
            {[
              "OVERVIEW",
              "ABOUT US",
              "ROOMS",
              "Food",
              "SPASERVICE",
              "GALLERY",
              "AMENITIES",
              "CONTACT",
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
      </nav>
    </div>
  );
};

export default Navbar;
