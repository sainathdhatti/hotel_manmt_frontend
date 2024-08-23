import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons"; 

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0">
          <h1 className="text-2xl font-bold mb-2">Hotel Kanayarashi</h1>
          <p className="text-gray-400 mb-4">
          135/136, Mumbai-Bangalore Bypass Highway, Wakad,
           Pune, Maharashtra
          - 411057
          </p>
          <p className="text-gray-400 mb-4">Phone: (123)020 42121212</p>
          <p className="text-gray-400">Email:reservations@Kanayarashi.com</p>
        </div>

        {/* Quick Links */}
        <div className="mb-6 md:mb-0">
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <a href="/" className="text-gray-400 hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="text-gray-400 hover:text-white">
                About Us
              </a>
            </li>
            <li>
              <a href="/rooms" className="text-gray-400 hover:text-white">
                Rooms & Suites
              </a>
            </li>
            <li>
              <a href="/amenities" className="text-gray-400 hover:text-white">
                Amenities
              </a>
            </li>
            <li>
              <a href="/contact" className="text-gray-400 hover:text-white">
                Contact Us
              </a>
            </li>
            <li>
              <a href="/privacy" className="text-gray-400 hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms" className="text-gray-400 hover:text-white">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div>
          <h2 className="text-lg font-semibold mb-4 m-5 ">Follow Us</h2>
          <div className="flex space-x-4 m-5">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FontAwesomeIcon icon={faFacebookF} size="lg" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FontAwesomeIcon icon={faTwitter} size="lg" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FontAwesomeIcon icon={faInstagram} size="lg" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FontAwesomeIcon icon={faXTwitter} size="lg" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FontAwesomeIcon icon={faLinkedinIn} size="lg" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="bg-gray-900 text-gray-500 py-4 mt-6 text-center">
        <p>&copy; {new Date().getFullYear()} Hotel Kanayarashi. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
