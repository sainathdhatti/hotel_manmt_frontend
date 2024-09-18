import React from "react";
import Footer from "../footer/page";
import Navbar from "../navbar";

const AboutUs = () => {
  return (
    <div className="mx-auto">
      <Navbar />
      
      {/* Hero Image */}
      <div className="mb-8">
        <img
          src="/images/cnt2.jpg" // Add your hotel's hero image URL
          alt="About Us"
          className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* About Us Content */}
      <div className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">
          Welcome to Our Luxurious Retreat
        </h1>
        <p className="text-md sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Nestled in the vibrant city of Pune, our hotel is a sanctuary for travelers seeking luxury and tranquility. Whether you’re here for business or leisure, we offer unmatched hospitality with a touch of elegance.
        </p>
      </div>

      {/* Image and Story Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-12 px-4">
        <div className="h-48 sm:h-64 md:h-96">
          <img
            src="/images/hotelstory.jpg"
            alt="Our Story"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-800">
            Our Rich Legacy
          </h2>
          <p className="text-md sm:text-lg text-gray-600">
            Established in 2024, our hotel has been a hallmark of sophistication and comfort. Built with an eye for architectural brilliance, our property seamlessly blends modern design with timeless elegance.
          </p>
          <p className="text-md sm:text-lg text-gray-600 mt-4">
            From world-class dining to serene wellness experiences, we strive to offer our guests a haven where every need is met with care and attention.
          </p>
        </div>
      </div>

      {/* Our Services Section */}
      <div className="mb-12">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-800 text-center px-4">
          Our Premium Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 px-4">
          {/* Service 1 */}
          <div className="text-center">
            <img
              src="/images/Aspa.jpeg"
              alt="Spa Service"
              className="w-full h-40 sm:h-48 object-cover rounded-lg shadow-lg mb-4"
            />
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">
              Relaxing Spa Treatments
            </h3>
            <p className="text-gray-600 text-sm sm:text-md">
              Unwind with our rejuvenating spa treatments, designed to relax your mind and body.
            </p>
          </div>

          {/* Service 2 */}
          <div className="text-center">
            <img
              src="/images/Adinning.jpg"
              alt="Gourmet Dining"
              className="w-full h-40 sm:h-48 object-cover rounded-lg shadow-lg mb-4"
            />
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">
              Gourmet Dining
            </h3>
            <p className="text-gray-600 text-sm sm:text-md">
              Savor an exquisite culinary experience with our award-winning chefs at the helm.
            </p>
          </div>

          {/* Service 3 */}
          <div className="text-center">
            <img
              src="/images/banquets.jpg"
              alt="Conference Facilities"
              className="w-full h-40 sm:h-48 object-cover rounded-lg shadow-lg mb-4"
            />
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">
              State-of-the-Art Conference Facilities
            </h3>
            <p className="text-gray-600 text-sm sm:text-md">
              Our fully equipped conference rooms offer the perfect space for your business needs.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-12 px-4">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-800 text-center">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <div>
            <img
              src="/images/ourteam.jpg"
              alt="Our Team"
              className="w-full h-64 sm:h-[70vh] object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-md sm:text-lg text-gray-600">
              Our team is dedicated to delivering the highest level of service. From the front desk to our culinary experts, every member of our team is committed to ensuring your stay is exceptional.
            </p>
            <p className="text-md sm:text-lg text-gray-600 mt-4">
              With years of experience in hospitality, we take pride in creating a warm, welcoming environment for each guest.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mb-12 text-center px-4">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-800">
          Guest Experiences
        </h2>
        <p className="text-md sm:text-lg text-gray-600 mb-8">
          Hear what our guests have to say about their unforgettable stays with us.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <p className="text-gray-800 italic">
              "An amazing hotel! The service was impeccable, and the rooms were stunning. We will definitely be returning!"
            </p>
            <p className="text-gray-800 mt-4">- Sainath D.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <p className="text-gray-800 italic">
              "The perfect getaway. Everything from the spa to the dining experience exceeded our expectations!"
            </p>
            <p className="text-gray-800 mt-4">- Diksha D.</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12 px-4">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-800">
          Plan Your Stay with Us
        </h2>
        <p className="text-md sm:text-lg text-gray-600 mb-8">
          Book now and experience the perfect blend of luxury and comfort at our hotel.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-500 transition duration-300">
          <a href="/rooms">Book Now</a>
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
