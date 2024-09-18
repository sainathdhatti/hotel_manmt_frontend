"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/app/store/loginStore";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Marks component as client-side
  }, []);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen); // Toggle mobile menu
  };

  const handleLogout = () => {
    logout();
    router.push("/"); // Redirect to home page after logout
  };

  // Get the first letter of the user's name
  const userInitial = userName ? userName.charAt(0).toUpperCase() : '';

  return (
    <div>
      {isClient && (
        <nav>
          <div className="container mx-auto flex items-center justify-between p-4 relative">
            {/* Logo and Hotel Name */}
            <div className="flex items-center space-x-4">
              <img
                src="/images/logo1 (1).jpg"
                alt="Hotel Logo"
                className="w-15 h-12 object-cover"
              />
              <div className="text-2xl font-bold text-black md:text-3xl">
                Hotel Enhance
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <ul className="flex justify-center space-x-3 p-4 text-black text-sm font-bold">
                {[
                  "OVERVIEW",
                  "ABOUT US",
                  "ROOMS",
                  "FOOD",
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

            {/* Mobile Menu Toggle Button */}
            <div className="md:hidden">
              <button
                onClick={handleMobileMenuToggle}
                className="text-black focus:outline-none"
              >
                {/* Hamburger Icon */}
                <svg
                  className="h-8 w-8"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative flex items-center space-x-2">
                  <button
                    onClick={handleDropdownToggle}
                    className="flex items-center justify-center w-10 h-10 bg-gray-800 text-white rounded-full text-lg font-bold"
                    title={userName ?? ''} // Tooltip to show full username on hover
                  >
                    {userInitial}
                  </button>
                  <span className="text-black font-bold">{userName}</span>
                  {isDropdownOpen && (
                    <ul className="absolute bg-red-100 shadow-lg border border-gray-200 mt-32 w-20 rounded-lg z-20">
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
              ) : (
                <button
                  onClick={() => router.push("/login/userlogin")}
                  className="text-black text-lg hover:text-red-900 font-bold"
                >
                  Login
                </button>
              )}
              <button
                onClick={() => router.push("/rooms")}
                className="bg-red-700 p-2 text-white text-lg hover:bg-red-800 font-bold rounded-md"
              >
                Book Now
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"} bg-white border-t border-gray-200`}
          >
            <ul className="flex flex-col space-y-4 p-4">
              {[
                "OVERVIEW",
                "ABOUT US",
                "ROOMS",
                "FOOD",
                "SPASERVICE",
                "GALLERY",
                "AMENITIES",
                "CONTACT",
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
              {!isAuthenticated && (
                <li>
                  <button
                    onClick={() => router.push("/login/userlogin")}
                    className="text-black text-lg hover:text-red-900 font-bold"
                  >
                    Login
                  </button>
                </li>
              )}
            </ul>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Navbar;
