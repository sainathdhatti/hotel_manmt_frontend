"use client";
import { useState, useEffect } from 'react';
import useBookingsStore from '@/app/store/bookingStore'
import useAuthStore from '@/app/store/loginStore';
import useRoomCategoryStore from '@/app/store/roomCategory';
import { useParams } from 'next/navigation';
import DatePicker from "react-datepicker";
import * as yup from "yup";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from 'next/navigation';
import Navbar from '@/app/navbar';

// Schema for validation
const schema = yup.object().shape({
  checkInDate: yup.date().required('Check-in date is required'),
  checkOutDate: yup.date().required('Check-out date is required'),
  noOfAdults: yup.number().required('Number of adults is required'),
  noOfChildren: yup.number().required('Number of children is required')
});

// Utility function to format dates
const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const BookingForm = () => {
  const { categoryId } = useParams();
  const addBooking = useBookingsStore((state) => state.addBooking);
  const roomCategory = useRoomCategoryStore((state) => state.roomCategory);
  const fetchRoomCategory = useRoomCategoryStore((state) => state.getRoomCategory);
  const { isAuthenticated, userId } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    userId: state.userId
  }));

  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    if (categoryId) {
      fetchRoomCategory(+categoryId);
    }
  }, [categoryId, fetchRoomCategory]);

  useEffect(() => {
    if (roomCategory && checkInDate && checkOutDate && roomCategory.price) {
      const numberOfDays = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      setTotalPrice(numberOfDays * roomCategory.price);
    }
  }, [checkInDate, checkOutDate, roomCategory]);

  const router = useRouter();
  const handleSubmit = () => {
    schema
      .validate({
        checkInDate: checkInDate || new Date(),
        checkOutDate: checkOutDate || new Date(),
        noOfAdults: adults,
        noOfChildren: children
      })
      .then(() => {
        if (isAuthenticated && userId && roomCategory && checkInDate && checkOutDate) {
          // Add booking
          addBooking({
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            noOfAdults: adults,
            noOfChildrens: children,
            userId: userId,
            categoryId: roomCategory.id
          });
          console.log(addBooking);
          router.push(`/dashboard/userlogin`);
        } else {
          alert('Please complete all required fields and ensure you are logged in.');
        }
      })
      .catch((err) => {
        alert(err.errors.join(', '));
      });
  };

  return (
    <>
    <Navbar/>
    <div className="p-6 flex">
           
      <div className="w-1/3 mt-10">
        {roomCategory ? (
          <>
            <img
              src={roomCategory.imageUrl || ""}
              alt={roomCategory.name}
              className="w-full h-auto object-cover"
            />
            <h1 className="ml-24 text-2xl mt-3">{roomCategory.name}</h1>
          </>
        ) : (
          <p>No image available</p>
        )}
      </div>
      <div className="w-2/3 ml-6">
        <div className="flex mb-4 mt-10 ml-10">
          <div className="flex-1 mr-2">
            <label className="block text-lg mb-2">Check-In Date</label>
            <DatePicker
              selected={checkInDate}
              onChange={(date: Date | null) => setCheckInDate(date)}
              dateFormat="yyyy-MM-dd"
              minDate={new Date()} // Prevent selection of past dates
              placeholderText="Select check-in date"
              className="w-full border border-gray-300 rounded-md pl-5"
            />
          </div>

          <div className="flex-1 ml-2">
            <label className="block text-lg mb-2">Check-Out Date</label>
            <DatePicker
              selected={checkOutDate}
              onChange={(date: Date | null) => {
                if (date && checkInDate && date <= checkInDate) {
                  alert('Check-out date must be after the check-in date.');
                } else {
                  setCheckOutDate(date);
                }
              }}
              dateFormat="yyyy-MM-dd"
              minDate={checkInDate || new Date()} // Ensure minDate is not before check-in date
              placeholderText="Select check-out date"
              className="w-full border border-gray-300 rounded-md pl-5"
            />
          </div>
        </div>

        <div className="flex mt-7 ml-10">
          <div className="flex-1 mr-2">
            <label className="block text-lg mb-2">Number of Adults</label>
            <select
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="w-60 border border-gray-300 rounded-md p-2"
            >
              <option value="" disabled>Select the number of adults</option>
              {roomCategory && roomCategory.noOfAdults ? (
                Array.from({ length: roomCategory.noOfAdults }, (_, i) => i + 1).map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))
              ) : (
                <option value="" disabled>No options available</option>
              )}
            </select>
          </div>

          <div className="flex-1 ml-0">
            <label className="block text-lg mb-2">Number of Children</label>
            <select
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              className="w-60 border border-gray-300 rounded-md p-2"
            >
              <option value="" disabled>Select the number of children</option>
              {roomCategory && roomCategory.noOfChildren ? (
                Array.from({ length: roomCategory.noOfChildren }, (_, i) => i + 1).map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))
              ) : (
                <option value="" disabled>No options available</option>
              )}
            </select>
          </div>
        </div>

        {roomCategory && (
          <div className="mt-4 ml-10">
            <h2 className="text-lg font-bold mb-2">Booking Summary</h2>
            <p>Number of Days: {checkInDate && checkOutDate ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)) : 0}</p>
            <p>Total Price: &#x20B9;{totalPrice.toFixed(2)}</p>
          </div>
        )}

        <div className="mt-6 ml-10">
          <button
            onClick={handleSubmit}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default BookingForm;
