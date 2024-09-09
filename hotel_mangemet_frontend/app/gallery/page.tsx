import React from "react";
import Navbar from "../navbar";
import Footer from "../footer/page";

const images = [
  "/images/room2.jpg",
  "/images/rooms3.jpg",
  "/images/ORoom.png", 
  "/images/dinner.jpg",
  "/images/Adinning.jpg",
  "/images/banquets.jpg",
  "/images/swmimmgpolamities.jpg",
  "/images/Aspa.jpeg",
  "/images/Agym.jpg",
];

const Gallery = () => {
  return (
    <div className=" mx-auto ">
      {/* Featured Image */}
      <Navbar className="absolute top-0 left-0 w-full z-50" />
      <div className="mb-8">
        <img
          src="/images/Orecepetint.png"
          alt="Featured"
          className="w-full h-96 object-cover opacity-80 rounded-lg"
        />
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              // alt={`Gallery image ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg transform transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
            {/* Optional Overlay Text */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              {/* <span className="text-white text-lg">Image {index + 1}</span> */}
            </div>
          </div>
        ))}
      </div>
      <Footer/>
    </div>
  );
};

export default Gallery;
