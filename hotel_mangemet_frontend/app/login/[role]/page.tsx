'use client';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useAuthStore from '@/app/store/loginStore';
import { useRouter } from 'next/navigation';

// Define the validation schema
const schema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

interface FormValues {
  email: string;
  password: string;
}

interface LoginProps {
  params: {
    role: string;
  };
}

const Login = ({ params: { role } }: LoginProps) => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const router = useRouter();
  const { login, isAuthenticated, error } = useAuthStore();

  const onSubmit = async (data: FormValues) => {
    try {
      await login(data, role);
        router.push(`/dashboard/${role}`);
     // router.push(`/rooms`)
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Login failed');
    }
  };

  return (
    <div className="relative h-screen">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/login.jpeg" // Ensure this path is correct
          alt="Login"
          className="object-cover w-full h-full"
        />
      </div>
      
      {/* Login Form */}
      <div className="relative flex items-center justify-center w-full h-full bg-gray-100 bg-opacity-20">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg mt-9">
          <h1 className="text-3xl font-bold mb-6 text-center">{role}</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    type="email"
                    id="email"
                    {...field}
                    className="border border-gray-300 rounded-md p-2 w-full"
                  />
                )}
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <input
                    type="password"
                    id="password"
                    {...field}
                    className="border border-gray-300 rounded-md p-2 w-full"
                  />
                )}
              />
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
            >
              Login
            </button>
            
            {error && <div className="text-red-500 mt-2">{error}</div>}
            {isAuthenticated && <div className="text-green-500 mt-2">Logged in successfully!</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
