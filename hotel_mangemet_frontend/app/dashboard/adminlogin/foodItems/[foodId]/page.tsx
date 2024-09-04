"use client";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import useFoodItemsStore from "@/app/store/foodItemsStore";

// Validation schema
const schema = yup.object().shape({
  food_name: yup.string().min(3).max(50).required(),
  food_description: yup.string().max(200).required(),
  food_price: yup.number().positive().required(),
  food_image:  yup.string().url().notRequired()
});

// Form data interface
interface FormData {
  food_name: string;
  food_price: number;
  food_description: string;
  food_image?: string |null|undefined; 
}

interface Props {
  params: {
    foodId: string;
  };
}

const FoodItemsForm = ({ params: { foodId } }: Props) => {
  const router = useRouter();
  const getFoodItem = useFoodItemsStore((state) => state.getFoodItem);
  const foodItem = useFoodItemsStore((state) => state.foodItem);
  const addFoodItem = useFoodItemsStore((state) => state.addFoodItem);
  const updateFoodItem = useFoodItemsStore((state) => state.updateFoodItem);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  console.log(foodId)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (foodId !== "new") {
      getFoodItem(parseInt(foodId));
    }
  }, [foodId, getFoodItem]);

  useEffect(() => {
    if (foodId !== "new" && foodItem) {
      setValue("food_name", foodItem.food_name);
      setValue("food_description", foodItem.food_description || "");
      setValue("food_price", foodItem.food_price || 0);
      if (foodItem.food_image) {
        setValue("food_image", foodItem.food_image);
      }
    }
  }, [foodItem, foodId, setValue]);

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
      let imageUrl = ''; 
  
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage); // Upload new image if selected
      }
  
      const foodItemData = {
        food_name: data.food_name,
        food_description: data.food_description || "",
        food_price: data.food_price || 0,
        food_image: imageUrl || '', 
      };
  
      if (foodId === "new") {
        // Adding a new food item
        await addFoodItem(foodItemData);
      } else {
        // Updating an existing food item requires food_id
        await updateFoodItem({
          // food_id: parseInt(foodId), // Include food_id here
          // ...foodItemData,
          id: parseInt(foodId), // Ensure this matches the expected property name and type
          name: foodItemData.food_name,
          description: foodItemData.food_description,
          price: foodItemData.food_price,
          image: foodItemData.food_image,
        });
      }
  
      reset();
      router.push("/dashboard/adminlogin?section=fooditems");
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle the error appropriately
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
          {foodId === "new" ? "Add Food Item" : "Update Food Item"}
        </h1>

        <div className="mb-4">
          <input
            {...register("food_name")}
            placeholder="Food Item Name"
            type="text"
            className={`w-full p-3 border rounded ${
              errors.food_name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.food_name && (
            <p className="text-red-500 text-sm">{errors.food_name.message}</p>
          )}
        </div>

        <div className="mb-4">
          <textarea
            {...register("food_description")}
            placeholder="Description"
            className={`w-full p-3 border rounded ${
              errors.food_description ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>

        <div className="mb-4">
          <input
            {...register("food_price")}
            placeholder="Price"
            type="number"
            step="0.01"
            className={`w-full p-3 border rounded ${
              errors.food_price ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>

        <div className="mb-4">
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleImageChange}
            className={`w-full p-3 border rounded ${
              errors.food_image ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.food_image && (
            <p className="text-red-500 text-sm">{errors.food_image.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {foodId === "new" ? "Add Food Item" : "Update Food Item"}
        </button>
      </form>
    </div>
  );
};

export default FoodItemsForm;
