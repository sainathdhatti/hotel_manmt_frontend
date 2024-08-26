"use client";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import useRoomCategoryStore from "@/app/store/roomCategory";
import useAmenitiesStore from "@/app/store/amenitiesStore";

interface FormData {
  id?: number; // Made optional to handle both create and update cases
  name: string;
  description: string; // Made required
  price: number;
  imageUrl?: string | null | undefined;
  amenities: (number | undefined)[] ;
  noOfChildren: number;
  noOfAdults: number;
}

// Updated Validation Schema
const schema = yup.object().shape({
  name: yup.string().min(3).max(50).required(),
  description: yup.string().max(200).required(),
  price: yup.number().positive().required(),
  imageUrl: yup.string().url().notRequired(),
  noOfAdults: yup.number().positive().integer().required(),
  noOfChildren: yup.number().positive().integer().required(),
  amenities: yup.array().of(yup.number()).required(), // Changed to number[]
});

interface Props {
  params: {
    categoryId: string;
  };
}

const RoomCategoryForm = ({ params: { categoryId } }: Props) => {
  const router = useRouter();
  const getRoomCategory = useRoomCategoryStore((state) => state.getRoomCategory);
  const roomCategory = useRoomCategoryStore((state) => state.roomCategory);
  const addRoomCategory = useRoomCategoryStore((state) => state.addRoomCategory);
  const updateRoomCategory = useRoomCategoryStore((state) => state.updateRoomCategory);
  const { amenities, getAllAmenities } = useAmenitiesStore();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    getValues,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  // Fetch amenities only once
  useEffect(() => {
    if (amenities.length === 0) {
      getAllAmenities();
    }
  }, [amenities, getAllAmenities]);

  useEffect(() => {
    if (categoryId !== "new") {
      getRoomCategory(parseInt(categoryId));
    }
  }, [categoryId, getRoomCategory]);

  useEffect(() => {
    if (categoryId !== "new" && roomCategory) {
      setValue("name", roomCategory.name);
      setValue("description", roomCategory.description || "");
      setValue("price", roomCategory.price ||0);
      setValue("noOfAdults", roomCategory.noOfAdults || 0);
      setValue("noOfChildren", roomCategory.noOfChildren || 0);
      setValue("amenities", roomCategory.amenities?.map((a) => a.id) || []);
      if (roomCategory.imageUrl) {
        setValue("imageUrl", roomCategory.imageUrl);
      }
    }
  }, [roomCategory, categoryId, setValue]);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "hotel_management"); // Replace with your actual preset
    formData.append("cloud_name", "dwvui9v5o"); // Replace with your actual cloud name
  
    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dwvui9v5o/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Cloudinary upload error:", errorData);
        throw new Error(`Cloudinary upload failed: ${errorData.error.message}`);
      }
  
      const result = await response.json();
      console.log("Uploaded image URL:", result.secure_url);
      return result.secure_url;
    } catch (error) {
      console.error("Failed to upload image:", error);
      throw new Error("Failed to upload image");
    }
  };

  const onSubmitHandler: SubmitHandler<FormData> = async (data) => {
    console.log("Form data before submission:", data);
    try {
      let imageUrl = data.imageUrl || ''; // Default to an empty string if no image URL is provided
  
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage); // Upload new image if selected
      }
  
      const roomCategoryData = {
        name: data.name,
        description: data.description || "",
        price: data.price || undefined,
        imageUrl, // Use the resolved image URL
        noOfAdults: data.noOfAdults || undefined,
        noOfChildren: data.noOfChildren || undefined,
        amenities: data.amenities || [],
      };
  
      if (categoryId === "new") {
        await addRoomCategory(roomCategoryData);
      } else {
        await updateRoomCategory({
          id: parseInt(categoryId),
          ...roomCategoryData,
        });
      }
  
      reset();
      router.push("/dashboard/adminlogin?section=room-categories");
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle the error appropriately
    }
  };

  const handleCheckboxChange = (amenityId: number) => {
    const selectedAmenities = getValues("amenities") || [];
    if (selectedAmenities.includes(amenityId)) {
      // Remove from selected
      const newAmenities = selectedAmenities.filter(id => id !== amenityId);
      setValue("amenities", newAmenities, { shouldValidate: true });
    } else {
      // Add to selected
      setValue("amenities", [...selectedAmenities, amenityId], { shouldValidate: true });
    }
  };
  

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          {categoryId === "new" ? "Add Room Category" : "Update Room Category"}
        </h1>

        <div className="mb-4">
          <input
            {...register("name")}
            placeholder="Room Category Name"
            type="text"
            className={`w-full p-3 border rounded ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-4">
          <textarea
            {...register("description")}
            placeholder="Description"
            className={`w-full p-3 border rounded ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>

        <div className="mb-4">
          <input
            {...register("price")}
            placeholder="Price"
            type="number"
            className={`w-full p-3 border rounded ${
              errors.price ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>

        <div className="mb-4">
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleImageChange}
            className={`w-full p-3 border rounded ${
              errors.imageUrl ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.imageUrl && (
            <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            {...register("noOfAdults")}
            placeholder="Number of Adults"
            type="number"
            className={`w-full p-3 border rounded ${
              errors.noOfAdults ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>

        <div className="mb-4">
          <input
            {...register("noOfChildren")}
            placeholder="Number of Children"
            type="number"
            className={`w-full p-3 border rounded ${
              errors.noOfChildren ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            Available Amenities
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {amenities.map((amenity) => (
              <div key={amenity.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`amenity-${amenity.id}`}
                  checked={!!getValues("amenities")?.includes(amenity.id)}
                  onChange={() => handleCheckboxChange(amenity.id)}
                  className="h-5 w-5"
                />
                <label htmlFor={`amenity-${amenity.id}`} className="text-gray-700">
                  {amenity.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {categoryId === "new" ? "Add Room Category" : "Update Room Category"}
        </button>
      </form>
    </div>
  );
};

export default RoomCategoryForm;
