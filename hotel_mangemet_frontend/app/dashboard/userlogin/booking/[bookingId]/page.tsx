"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useBookingsStore from '@/app/store/bookingStore';

// Validation schema
const schema = yup.object().shape({
    category: yup.string().required("Category is required"),
    checkInDate: yup.date().required("Check-in date is required"),
    checkOutDate: yup.date().required("Checkout date is required"),
    noOfAdults: yup.number().min(0, "Number of adults cannot be negative").required("Number of adults is required"),
    noOfChildren: yup.number().min(0, "Number of children cannot be negative").required("Number of children is required"),
});

const UpdateBooking = () => {
    const { bookingId } = useParams();
    const updateBooking = useBookingsStore((state) => state.updateBooking);
    const getBookingById = useBookingsStore((state) => state.fetchBookingById);
    const booking = useBookingsStore((state) => state.booking);
    const [isUpdate, setIsUpdate] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (bookingId) {
            setIsUpdate(true);
            getBookingById(+bookingId);
        } else {
            setIsUpdate(false);
            reset();
        }
    }, [bookingId, getBookingById, reset]);

    useEffect(() => {
        if (isUpdate && booking) {
            // Check if booking and its properties exist
            if (booking) {
                console.log("Booking data fetched:", booking);
                setValue("category", booking.room.room_categories.name);
                setValue('checkInDate', booking.checkInDate);
                setValue('checkOutDate', booking.checkOutDate);
                setValue('noOfAdults', booking.noOfAdults || 0);
                setValue('noOfChildren', booking.noOfChildrens || 0);
            
            }
        }
    }, [booking, isUpdate, setValue]);

    const onSubmitHandler = (data: any) => {
        console.log("Form data submitted:", data);
        const updatedData = {
            ...data,
            checkInDate: new Date(data.checkInDate),

        };

        if (bookingId) {
            updateBooking(+bookingId, updatedData);
        }
    };

    return (
        <div className="p-4 mt-24">
            <h2 className="text-2xl font-semibold mb-6 text-center">
                {isUpdate ? "Update Booking" : "Create Booking"}
            </h2>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
                <div className="mb-4">
                    <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                        Category:
                    </label>
                    <input
                        {...register("category")}
                        type="text"
                        id="category"
                        placeholder="Category"
                        className="px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:border-blue-500"
                    />
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="checkInDate" className="block text-gray-700 text-sm font-bold mb-2">
                        Check-in Date:
                    </label>
                    <input
                        {...register("checkInDate")}
                        type="date"
                        id="checkInDate"
                        className="px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:border-blue-500"
                    />
                    {errors.checkInDate && <p className="text-red-500 text-sm mt-1">{errors.checkInDate.message}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="checkOutDate" className="block text-gray-700 text-sm font-bold mb-2">
                        Checkout Date:
                    </label>
                    <input
                        {...register("checkOutDate")}
                        type="date"
                        id="checkOutDate"
                        className="px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:border-blue-500"
                    />
                    {errors.checkOutDate && <p className="text-red-500 text-sm mt-1">{errors.checkOutDate.message}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="noOfAdults" className="block text-gray-700 text-sm font-bold mb-2">
                        Number of Adults:
                    </label>
                    <input
                        {...register("noOfAdults")}
                        type="number"
                        id="noOfAdults"
                        placeholder="Number of Adults"
                        className="px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:border-blue-500"
                    />
                    {errors.noOfAdults && <p className="text-red-500 text-sm mt-1">{errors.noOfAdults.message}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="noOfChildren" className="block text-gray-700 text-sm font-bold mb-2">
                        Number of Children:
                    </label>
                    <input
                        {...register("noOfChildren")}
                        type="number"
                        id="noOfChildren"
                        placeholder="Number of Children"
                        className="px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:border-blue-500"
                    />
                    {errors.noOfChildren && <p className="text-red-500 text-sm mt-1">{errors.noOfChildren.message}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                    Update Booking
                </button>
            </form>
        </div>
    );
};

export default UpdateBooking;
