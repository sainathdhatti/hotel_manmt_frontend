"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useStaffMemberStore from '@/app/store/staffMembersStore';
import useStaffCategoryStore from '@/app/store/staffCategoryStore';

const schema = yup.object().shape({
    firstName: yup.string().required("First name is required").min(3).max(10),
    lastName: yup.string().required("Last name is required").min(3).max(10),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup.string().required("Phone number is required").matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    password: yup.string().required("Password is required").min(6).max(10),
    gender: yup.string().oneOf(['male', 'female'], 'Invalid gender').required("Gender is required"),
    staffcategory: yup.number().positive().required("Staff category is required"),
});

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    gender: 'male' | 'female';
    staffcategory: number;
}

interface Props {
    params: {
        staffmemberId: string;
    }
}

const StaffMembers = ({ params: { staffmemberId } }: Props) => {
    const router = useRouter();
    const { getStaffMemberById, staffMember, createStaffMember, updateStaffMember } = useStaffMemberStore();
    const { staffCategories, fetchStaffCategories } = useStaffCategoryStore();

    const [loading, setLoading] = useState(true);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        const fetchData = async () => {
            await fetchStaffCategories(); // Fetch staff categories
            if (staffmemberId !== 'new') {
                await getStaffMemberById(parseInt(staffmemberId));
            }
            setLoading(false);
        };

        fetchData();
    }, [staffmemberId, getStaffMemberById, fetchStaffCategories]);

    useEffect(() => {
      if (staffmemberId !== 'new' && staffMember) {
          setValue("firstName", staffMember.firstName);
          setValue("lastName", staffMember.lastName);
          setValue("email", staffMember.email);
          setValue("phone", staffMember.phone);
          //setValue("password", staffMember.password);
          if (staffMember.gender === "male" || staffMember.gender === "female") {
              setValue("gender", staffMember.gender);
          } else {
              console.error("Invalid gender value:", staffMember.gender);
          }
          if (typeof staffMember.staffcategory === 'number') {
              setValue("staffcategory", staffMember.staffcategory);
          } else if (staffMember.staffcategory && staffMember.staffcategory.id) {
              setValue("staffcategory", staffMember.staffcategory.id);
          } else {
              console.error("Invalid or missing staff category:", staffMember.staffcategory);
          }
      }
  }, [staffmemberId, staffMember, setValue]);
  

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        console.log(data);

        const staffMemberData = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            password: data.password,
            gender: data.gender,
            staffcategory: data.staffcategory,
        };

        try {
            if (staffmemberId === 'new') {
                await createStaffMember(staffMemberData);
            } else {
                await updateStaffMember(parseInt(staffmemberId), staffMemberData);
            }
            router.push('/dashboard/adminlogin?section=staff-members');
        } catch (error) {
            console.error("Error saving staff member:", error);
            // Optionally, handle the error
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
            >
                <h1 className="text-2xl font-bold mb-6 text-center">
                    {staffmemberId === 'new' ? "Add Staff Member" : "Update Staff Member"}
                </h1>

                <div className="mb-4">
                    <input
                        {...register("firstName")}
                        placeholder="First Name"
                        className={`w-full p-3 border rounded ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                </div>

                <div className="mb-4">
                    <input
                        {...register("lastName")}
                        placeholder="Last Name"
                        className={`w-full p-3 border rounded ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                </div>

                <div className="mb-4">
                    <input
                        {...register("email")}
                        placeholder="Email"
                        type="email"
                        className={`w-full p-3 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                <div className="mb-4">
                    <input
                        {...register("phone")}
                        placeholder="Phone"
                        className={`w-full p-3 border rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                </div>

                <div className="mb-4">
                    <input
                        {...register("password")}
                        placeholder="Password"
                        type="password"
                        className={`w-full p-3 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>

                <div className="mb-4">
                    <select
                        {...register("gender")}
                        className={`w-full p-3 border rounded ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
                </div>

                <div className="mb-4">
                    <select
                        {...register("staffcategory")}
                        className={`w-full p-3 border rounded ${errors.staffcategory ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="">Select Staff Category</option>
                        {staffCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.category}
                            </option>
                        ))}
                    </select>
                    {errors.staffcategory && <p className="text-red-500 text-sm">{errors.staffcategory.message}</p>}
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

export default StaffMembers;
