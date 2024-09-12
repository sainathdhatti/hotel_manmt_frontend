import React from "react";
import Navbar from "../navbar";
import Footer from "../footer/page";

const images = [
  { src: "/images/room2.jpg", alt: "Room with modern decor" },
  { src: "/images/rooms3.jpg", alt: "Elegant hotel room" },
  { src: "/images/ORoom.png", alt: "Luxurious suite" },
  { src: "/images/dinner.jpg", alt: "Gourmet dinner setup" },
  { src: "/images/Adinning.jpg", alt: "Cozy dining area" },
  { src: "/images/banquets.jpg", alt: "Banquet hall setup" },
  { src: "/images/swmimmgpolamities.jpg", alt: "Swimming pool amenities" },
  { src: "/images/Aspa.jpeg", alt: "Spa relaxation area" },
  { src: "/images/Agym.jpg", alt: "Fully equipped gym" },
];

const Gallery = () => {
  return (
    <div className="mx-auto">
      <Navbar />
      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 m-12">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image.src}
              alt={image.alt} // Added alt text
              className="w-full h-64 object-cover rounded-lg transform transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
            {/* Optional Overlay Text
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <span className="text-white text-lg">{`Image ${index + 1}`}</span>
            </div> */}
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Gallery;
