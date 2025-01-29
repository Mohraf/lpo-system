"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignupPage() {
  const [serverError, setServerError] = useState("");
  const router = useRouter();
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data: any) => {
    setServerError("");
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed");
      }

      router.push("/login?success=Registration+successful");
    } catch (error: any) {
      setServerError(error.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Sign Up</h1>
        
        {serverError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {serverError}
          </div>
        )}

        {/* Form fields remain the same */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-black mb-2">First Name</label>
          <input
            {...register("firstName")}
            className="w-full px-3 py-2 border rounded-md text-gray-700"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{(errors.firstName as { message: string }).message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-black mb-2">Last Name</label>
          <input
            {...register("lastName")}
            className="w-full px-3 py-2 border rounded-md text-gray-700"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{(errors.lastName as { message: string }).message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-black mb-2">Email</label>
          <input
            {...register("email")}
            type="email"
            className="w-full px-3 py-2 border rounded-md text-gray-700"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{(errors.email as { message: string }).message}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-black mb-2">Password</label>
          <input
            {...register("password")}
            type="password"
            className="w-full px-3 py-2 border rounded-md text-gray-700"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{(errors.password as { message: string }).message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSubmitting ? "Registering..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}