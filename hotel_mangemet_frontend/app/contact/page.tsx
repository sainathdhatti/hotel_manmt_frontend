"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import Footer from "../footer/page";
import useContactStore from "@/app/store/contactStore";

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
    console.log("Submitting data:", data); // Check what data is being sent
    try {
      await addContact(data);
      reset();
      router.push("/contact"); // Redirect or handle success
    } catch (error) {
      console.error("Submission error:", error); // Log any errors
    }
  };

  return (
    <div className="flex flex-col pt-28">
      {/* Image Section */}
      <div className="w-full">
        <img
          src="/images/contact1.jpg"
          alt="Contact Us"
          className="w-full h-[120vh] object-cover"
        />
      </div>

      {/* Contact Form Section */}
      <div className="flex-grow max-w-4xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
        <p className="text-red-500 mb-4">* All fields are mandatory</p>
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
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
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
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
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
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.Email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.Email && (
              <p className="text-red-500 text-sm">{errors.Email.message}</p>
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
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
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
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.Subject ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.Subject && (
              <p className="text-red-500 text-sm">{errors.Subject.message}</p>
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
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.Message ? "border-red-500" : "border-gray-300"
              }`}
              rows={4}
            />
            {errors.Message && (
              <p className="text-red-500 text-sm">{errors.Message.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="w-full max-w-[400px] bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Contact;
