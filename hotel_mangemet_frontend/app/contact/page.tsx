"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import Footer from "../footer/page";
import useContactStore from "@/app/store/contactStore";
import Navbar from "../navbar";
import { toast } from "react-toastify";

// Define the Yup schema for validation
const schema = yup.object().shape({
  firstName: yup.string().min(2).max(50).required("First Name is required"),
  lastName: yup.string().min(2).max(50).required("Last Name is required"),
  Email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: yup.string().min(10).max(15).required("Phone is required"),
  Subject: yup.string().min(3).max(100).required("Subject is required"),
  Message: yup.string().min(10).required("Description is required"),
});

const Contact = () => {
  const router = useRouter();
  const { addContact } = useContactStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmitHandler = async (data: any) => {
    try {
      await addContact(data);
      reset();
      toast.success("Thank you for contacting us. We will get back to you soon.");
      router.push("/contact");
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>
      
      {/* Hero Image Section */}
      <div className="relative w-full h-[40vh] md:h-[60vh] overflow-hidden">
        <img
          src="/images/contttt.jpg"
          alt="Contact Us"
          className="absolute inset-0 object-cover w-full h-full "
        />
      </div>

      {/* Contact Form Section */}
      <div className="flex-grow max-w-4xl mx-auto p-6 md:p-8 bg-white rounded-lg shadow-xl mt-[-60px] relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-gray-800">
          We'd Love to Hear From You
        </h2>
        <p className="text-red-500 mb-4 text-center">
          * All fields are mandatory
        </p>
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* First Name */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="firstName"
            >
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("firstName")}
              type="text"
              id="firstName"
              placeholder="John"
              className={`shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${
                errors.firstName
                  ? "border-red-500 ring-red-500"
                  : "border-gray-300"
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="lastName"
            >
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("lastName")}
              type="text"
              id="lastName"
              placeholder="Doe"
              className={`shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${
                errors.lastName
                  ? "border-red-500 ring-red-500"
                  : "border-gray-300"
              }`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              {...register("Email")}
              type="email"
              id="email"
              placeholder="example@domain.com"
              className={`shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${
                errors.Email ? "border-red-500 ring-red-500" : "border-gray-300"
              }`}
            />
            {errors.Email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.Email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="phone"
            >
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              {...register("phone")}
              type="tel"
              id="phone"
              placeholder="+910808000000"
              className={`shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${
                errors.phone ? "border-red-500 ring-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Subject */}
          <div className="mb-4 md:col-span-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="subject"
            >
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              {...register("Subject")}
              type="text"
              id="subject"
              placeholder="Subject of your message"
              className={`shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${
                errors.Subject
                  ? "border-red-500 ring-red-500"
                  : "border-gray-300"
              }`}
            />
            {errors.Subject && (
              <p className="text-red-500 text-sm mt-1">
                {errors.Subject.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="mb-4 md:col-span-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("Message")}
              id="description"
              placeholder="Type your message here..."
              className={`shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${
                errors.Message
                  ? "border-red-500 ring-red-500"
                  : "border-gray-300"
              }`}
              rows={4}
            />
            {errors.Message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.Message.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="w-full max-w-md bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>

      {/* Map and Location Section */}
      <div className="relative w-full mt-12 px-4 md:px-0">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center">
          Find Us
        </h2>
        <div className="flex flex-col md:flex-row">
          {/* Location Info */}
          <div className="md:w-1/3 p-6 rounded-lg shadow-md mb-4 md:mb-0 md:mr-4">
            <h3 className="text-2xl md:text-4xl font-semibold mb-4 text-center md:text-left">
              Our Location
            </h3>
          </div>

          {/* Map */}
          <div className="md:w-2/3 h-60 md:h-80 rounded-lg overflow-hidden border shadow-md mb-10">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12690.755757143983!2d-0.1297921101715347!3d51.50853019543915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761b3170a26a2f%3A0x0!2zNDPCsDE5JzA4LjEiTiA0MMKwMTEnNTUuMiJX!5e0!3m2!1sen!2sus!4v1615280731320!5m2!1sen!2sus"
              allowFullScreen
              loading="lazy"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Contact;
