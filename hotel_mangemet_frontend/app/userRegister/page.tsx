"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import useUserStore from "../store/userRegisterStore";

// Validation schema using Yup
const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
  aadharCardNumber: yup.string().required("Aadhar card number is required"),
});

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  aadharCardNumber: string;
}

const Register = () => {
  const { registerUser } = useUserStore((state) => ({
    registerUser: state.registerUser,
  }));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [registrationStatus, setRegistrationStatus] = useState<string | null>(
    null
  );

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data);
      reset();
      console.log("User registered successfully:", data);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error registering user.";
      setRegistrationStatus(`Error registering user: ${errorMessage}`);
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="relative h-screen bg-gray-100">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/login.jpeg" // Ensure the path is correct
          alt="Register Background"
          className="object-cover w-full h-full "
        />
      </div>

      {/* Register Form */}
      <div className="relative flex items-center justify-center w-full h-full">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg mt-6 mb-9">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Register
          </h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md bg-white shadow-md px-4 py-4 space-y-2">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="sr-only">
                  First Name
                </label>
                <input
                  id="firstName"
                  {...register("firstName")}
                  type="text"
                  autoComplete="given-name"
                  placeholder="First Name"
                  className={`input-field border-2 border-gray-300 focus:border-blue-800 rounded-md px-4 py-2 w-full ${
                    errors.firstName ? "border-red-500" : ""
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="sr-only">
                  Last Name
                </label>
                <input
                  id="lastName"
                  {...register("lastName")}
                  type="text"
                  autoComplete="family-name"
                  placeholder="Last Name"
                  className={`input-field border-2 border-gray-300 focus:border-indigo-500 rounded-md px-4 py-2 w-full ${
                    errors.lastName ? "border-red-500" : ""
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  placeholder="Email address"
                  className={`input-field border-2 border-gray-300 focus:border-indigo-500 rounded-md px-4 py-2 w-full ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="sr-only">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  {...register("phoneNumber")}
                  type="text"
                  autoComplete="tel"
                  placeholder="Phone Number"
                  className={`input-field border-2 border-gray-300 focus:border-indigo-500 rounded-md px-4 py-2 w-full ${
                    errors.phoneNumber ? "border-red-500" : ""
                  }`}
                />
                {errors.phoneNumber && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  {...register("password")}
                  type="password"
                  autoComplete="new-password"
                  placeholder="Password"
                  className={`input-field border-2 border-gray-300 focus:border-indigo-500 rounded-md px-4 py-2 w-full ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Aadhar Card Number */}
              <div>
                <label htmlFor="aadharCardNumber" className="sr-only">
                  Aadhar Card Number
                </label>
                <input
                  id="aadharCardNumber"
                  {...register("aadharCardNumber")}
                  type="text"
                  placeholder="Aadhar Card Number"
                  className={`input-field border-2 border-gray-300 focus:border-indigo-500 rounded-md px-4 py-2 w-full ${
                    errors.aadharCardNumber ? "border-red-500" : ""
                  }`}
                />
                {errors.aadharCardNumber && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.aadharCardNumber.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Register
                </button>
              </div>

              {/* Status Message */}
              {registrationStatus && (
                <p
                  className={`mt-2 text-sm ${
                    registrationStatus.includes("successfully")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {registrationStatus}
                </p>
              )}
            </div>
          </form>

          {/* Link to Login */}
          <p className="mt-4 text-center text-sm">
            Already have an account?
            <Link
              href="/login/userlogin"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
