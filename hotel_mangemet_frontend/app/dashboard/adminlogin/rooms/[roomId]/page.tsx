"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useRoomStore from '@/app/store/roomStore';
import useRoomCategoryStore from '@/app/store/roomCategory'; 

const schema = yup.object().shape({
    roomNumber: yup.number().positive().required(),
    roomCategoryId: yup.number().positive().required(), 
});

interface FormData {
    roomNumber: number;
    roomCategoryId: number; 
}

interface Props {
    params: {
        roomId: string; 
    }
}

const RoomForm = ({ params: { roomId } }: Props) => {
    const router = useRouter();
    const { getRoom, room, addRoom, updateRoom } = useRoomStore();
    const { roomCategories, getAllRoomCategories } = useRoomCategoryStore();

    const [loading, setLoading] = useState(true);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
        resolver: yupResolver(schema),
    }); 

    useEffect(() => {
        const fetchData = async () => {
            await getAllRoomCategories(); // Fetch room categories
            if (roomId !== 'new') {
                await getRoom(parseInt(roomId));
            }
            setLoading(false);
        };

        fetchData();
    }, [roomId, getRoom, getAllRoomCategories]);

    useEffect(() => {
        if (roomId !== 'new' && room) {
            console.log('Room:', room); 
            if (room.roomCategory && room.roomCategory.id) {
                setValue("roomNumber", room.roomNumber);
                setValue("roomCategoryId", room.roomCategory.id); // Set the ID as number
            } else {
                console.error('Room category ID is missing or undefined.');
            }
        }
    }, [roomId, room, setValue]);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const roomData = {
            roomNumber: data.roomNumber,
            roomCategoryId: data.roomCategoryId, // Pass ID as number
        };

        if (roomId === 'new') {
            await addRoom(roomData);
        } else {
            await updateRoom({ id: parseInt(roomId), ...roomData });
        }

        router.push('/dashboard/adminlogin');
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
            >
                <h1 className="text-2xl font-bold mb-6 text-center">
                    {roomId === 'new' ? "Add Room" : "Update Room"}
                </h1>
    
                <div className="mb-4">
                    <input
                        {...register("roomNumber")}
                        placeholder="Room Number"
                        type="number"
                        className={`w-full p-3 border rounded ${
                            errors.roomNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.roomNumber && <p className="text-red-500 text-sm">{errors.roomNumber.message}</p>}
                </div>
    
                <div className="mb-4">
                    <select
                        {...register("roomCategoryId")}
                        className={`w-full p-3 border rounded ${
                            errors.roomCategoryId ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                        <option value="">Select Room Category</option>
                        {roomCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.roomCategoryId && <p className="text-red-500 text-sm">{errors.roomCategoryId.message}</p>}
                </div>
    
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition duration-200"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default RoomForm;
