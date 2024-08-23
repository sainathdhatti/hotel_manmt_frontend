import React from 'react';
import Footer from '../footer/page';

const Location = () => {
  return (
    <div className="pt-24">
      {/* Image from the image folder */}
      <img 
        src="/images/location.jpg"  // Make sure to update the path to your image
        alt="Location Image"
        className="w-full h-[120vh]"     // Adjust styling as needed
      />
      
      {/* Centered Google Maps iframe */}
      <div className="flex justify-center my-4">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.7158747437315!2d73.78859257417004!3d18.541737368529425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bee17fb5a755%3A0x597fd7408690f92a!2sValueadd%20Softtech%20%26%20Systems%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1724404437946!5m2!1sen!2sin"
          width="800"
          height="450"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* Footer component */}
      <Footer />
    </div>
  );
}

export default Location;
