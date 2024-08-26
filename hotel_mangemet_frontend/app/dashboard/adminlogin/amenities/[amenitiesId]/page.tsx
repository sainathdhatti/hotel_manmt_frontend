"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import useAmenitiesStore from "@/app/store/amenitiesStore";

const schema = yup.object().shape({
  name: yup.string().min(3).max(50).required(),
});

interface Props {
  params: {
    amenitiesId: string;
  };
}

const AmenityForm = ({ params: { amenitiesId } }: Props) => {
  const router = useRouter();
  const getAmenity = useAmenitiesStore((state) => state.getAmenity);
  const amenity = useAmenitiesStore((state) => state.amenity);
  const addAmenity = useAmenitiesStore((state) => state.addAmenity);
  const updateAmenity = useAmenitiesStore((state) => state.updateAmenity);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (amenitiesId !== "add") {
      getAmenity(parseInt(amenitiesId));
    }
  }, [amenitiesId]);

  useEffect(() => {
    if (amenity) {
      setValue("name", amenity.name);
    }
  }, [amenity]);

  const onSubmitHandler = (data: { name: string }) => {
    if (amenitiesId === "add") {
      addAmenity(data);
    } else {
      updateAmenity({ id: parseInt(amenitiesId), ...data });
    }
    reset();
    router.push("/dashboard/adminlogin?activeSection=amenities");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          {amenitiesId === "add" ? "Add Amenity" : "Update Amenity"}
        </h1>
        
        <div className="mb-4">
          <input
            {...register("name")}
            placeholder="Amenity Name"
            type="text"
            className={`w-full p-3 border rounded ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
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
};

export default AmenityForm;
