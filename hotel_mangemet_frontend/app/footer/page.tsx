import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8">
      
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Hotel Logo and Image */}
          <div className="flex flex-col items-center">
            <img
              src="/images/logo1.jpg" // Path to your image
              alt="Hotel Kanayarashi Logo"
              className="w-48 h-auto object-contain pt-10" // Adjust the width as needed
            />
          </div>

          {/* Contact Information and Address */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
            <p className="text-gray-300 mb-2">
              135/136, Mumbai-Bangalore Bypass Highway, Wakad,<br />
              Pune, Maharashtra - 411057
            </p>
            <p className="text-gray-300 mb-2">Phone: (123) 020 42121212</p>
            <p className="text-gray-300">Email: <a href="mailto:reservations@HotelEnhance.com" className="text-blue-400 hover:text-blue-300">reservations@HotelEnhance.com</a></p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold mb-2">Quick Links</h2>
            <ul className="space-y-2">
              {["Overview", "About Us", "Rooms", "Amenities", "Contact", "Privacy Policy", "Terms & Conditions"].map((link, index) => (
                <li key={index}>
                  <a
                    href={`/${link.replace(/\s+/g, '-').toLowerCase()}`}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold mb-2">Follow Us</h2>
            <ul className="space-y-2">
              {[
                { href: "https://facebook.com", label: "Facebook" },
                { href: "https://twitter.com", label: "Twitter" },
                { href: "https://instagram.com", label: "Instagram" },
                { href: "https://linkedin.com", label: "LinkedIn" }
              ].map(({ href, label }, index) => (
                <li key={index}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="bg-gray-700 text-white-400 py-4 mt-6 border-t border-white text-right">
          <p className="text-sm px-4 md:px-8">© {new Date().getFullYear()}Hotel Enhance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
