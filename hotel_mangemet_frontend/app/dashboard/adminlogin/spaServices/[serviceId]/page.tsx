"use client";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter, useParams } from "next/navigation";
import useSpaServiceStore from "@/app/store/spaServiceStore";

const schema = yup.object().shape({
  name: yup.string().min(3).max(50).required("Service name is required"),
  description: yup.string().max(200).required("Service description is required"),
  price: yup.number().positive().required('Price is required'),
  service_image: yup.string().url().notRequired()
});

interface FormData {
  name: string;
  price: number;
  description: string;
  service_image?: string | null;
}

interface SpaService {
  id?: number; // Optional for new services
  name: string;
  description: string;
  price: number;
  service_image: string;
}

const CreateSpaService: React.FC = () => {
  const router = useRouter();
  const { serviceId } = useParams();
  const getSpaServiceById = useSpaServiceStore((state) => state.getSpaServiceById);
  const spaService = useSpaServiceStore((state) => state.spaService);
  const addSpaService = useSpaServiceStore((state) => state.addSpaService);
  const updateSpaService = useSpaServiceStore((state) => state.updateSpaService);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const serviceIdStr = Array.isArray(serviceId) ? serviceId[0] : serviceId;

  useEffect(() => {
    if (serviceIdStr !== "new") {
      getSpaServiceById(parseInt(serviceIdStr));
    }
  }, [serviceIdStr, getSpaServiceById]);

  useEffect(() => {
    if (serviceIdStr !== "new" && spaService) {
      setValue("name", spaService.name);
      setValue("description", spaService.description || "");
      setValue("price", spaService.price || 0);
      if (spaService.service_image) {
        setValue("service_image", spaService.service_image);
      }
    }
  }, [spaService, serviceIdStr, setValue]);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "hotel_management");
    formData.append("cloud_name", "dwvui9v5o");
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
        console.error(`Cloudinary upload failed: ${errorData.error.message}`);
        throw new Error("Cloudinary upload failed");
      }
      const result = await response.json();
      console.log("Upload image URL:", result.secure_url);
      return result.secure_url;
    } catch (error) {
      console.error("Failed to upload image:", error);
      return ''; // Return an empty string if the upload fails
    }
  };

  const onSubmitHandler: SubmitHandler<FormData> = async (data) => {
    console.log("Form data before submission:", data);
    try {
      let imageUrl = '';
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }
      const spaServiceData: SpaService = {
        name: data.name,
        description: data.description,
        price: data.price || 0,
        service_image: imageUrl || '',
      };
      if (serviceIdStr === "new") {
        await addSpaService(spaServiceData);
      } else {
        await updateSpaService({
          ...spaServiceData,
          id: parseInt(serviceIdStr),
        });
      }
      reset();
      router.push("/dashboard/adminlogin?section=spaServices");
    } catch (error) {
      console.error("Error submitting form:", error);
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
          {serviceIdStr === "new" ? "Add Spa Service" : "Update Spa Service"}
        </h1>

        <div className="mb-4">
          <input
            {...register("name")}
            placeholder="Spa Service Name"
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
            step="0.01"
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
              errors.service_image ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.service_image && (
            <p className="text-red-500 text-sm">{errors.service_image.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {serviceIdStr === "new" ? "Add Spa Service" : "Update Spa Service"}
        </button>
      </form>
    </div>
  );
}

export default CreateSpaService;
