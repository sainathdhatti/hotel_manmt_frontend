"use client";
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import useStaffCategoryStore from "@/app/store/staffCategoryStore"; // Adjust the import path as needed

interface FormData {
  id?: number;
  category: string;
}

const schema = yup.object().shape({
  category: yup.string().min(3).max(50).required(),
});

interface Props {
  params: {
    staffcategoryId: string;
  };
}

const StaffCategory = ({ params: { staffcategoryId } }: Props) => {
  const router = useRouter();
  const fetchStaffCategories = useStaffCategoryStore((state) => state.fetchStaffCategories);
  const staffCategories = useStaffCategoryStore((state) => state.staffCategories);
  const fetchStaffCategoryById = useStaffCategoryStore((state) => state.fetchStaffCategoryById);
  const addStaffCategory = useStaffCategoryStore((state) => state.addStaffCategory);
  const updateStaffCategory = useStaffCategoryStore((state) => state.updateStaffCategory);

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
    fetchStaffCategories();
  }, [staffcategoryId, fetchStaffCategoryById, fetchStaffCategories]);

  useEffect(() => {
    if (staffcategoryId !== "new" && staffCategories.length > 0) {
      const category = staffCategories.find((cat) => cat.id === parseInt(staffcategoryId));
      if (category) {
        setValue("category", category.category);
      }
    }
  }, [staffCategories, staffcategoryId, setValue]);

  const onSubmitHandler: SubmitHandler<FormData> = async (data) => {
    try {
      if (staffcategoryId === "new") {
        await addStaffCategory(data);
      } else {
        await updateStaffCategory(parseInt(staffcategoryId), data);
      }

      reset();
      router.push("/dashboard/adminlogin?section=staff-categories");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          {staffcategoryId === "new" ? "Add Staff Category" : "Update Staff Category"}
        </h1>

        <div className="mb-4">
          <input
            {...register("category")}
            placeholder="Staff Category Name"
            type="text"
            className={`w-full p-3 border rounded ${
              errors.category ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {staffcategoryId === "new" ? "Add Staff Category" : "Update Staff Category"}
        </button>
      </form>
    </div>
  );
};

export default StaffCategory;
