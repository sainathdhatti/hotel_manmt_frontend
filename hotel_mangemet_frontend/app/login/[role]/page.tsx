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
  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const router = useRouter();
  const { login, isAuthenticated, error } = useAuthStore();

  const onSubmit = async (data: FormValues) => {
    try {
      await login(data, role);
      reset(); // Clear the form fields

      if (role === 'userlogin') {
        // If role is userlogin, redirect to the home page
        router.push('/');
      } else {
        console.log(role);
        // Redirect to the dashboard or any other page for different roles
        router.push(`/dashboard/${role}`);
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Login failed');
    }
  };

  return (
    <div className="relative h-screen bg-gray-100">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/login.jpeg" // Ensure this path is correct
          alt="Login"
          className="object-cover w-full h-full"
        />
      </div>
      
      {/* Login Form */}
      <div className="relative flex items-center justify-center w-full h-full">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg mt-9 mb-9">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Login</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    type="email"
                    id="email"
                    {...field}
                    className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <input
                    type="password"
                    id="password"
                    {...field}
                    className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md w-full shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </button>
            
            {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
            {isAuthenticated && <div className="text-green-500 mt-2 text-center">Logged in successfully!</div>}

            <div className="mt-4 text-center">
              <a href="/forgetpassword" className="text-blue-500 hover:underline">Forgot Password?</a>
            </div>

            <div className="mt-4 text-center">
              <p className="text-gray-600">Don't have an account? <a href="/userRegister" className="text-blue-500 hover:underline">Sign Up</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
