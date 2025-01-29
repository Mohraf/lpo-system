"use client";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const success = searchParams.get("success");

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center text-blue-500">
            Login
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error === "CredentialsSignin" ? "Invalid credentials" : error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {decodeURIComponent(success)}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              signIn("credentials", {
                email: formData.get("email"),
                password: formData.get("password"),
                callbackUrl: "/dashboard",
              });
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-2 text-black">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border rounded-md text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-black">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border rounded-md text-gray-700"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Sign In
            </button>
          </form>
          
          <div className="flex mt-2 text-black space-x-2">
            <p>Don't have an account?</p> <Link href="/signup" className="text-blue-500">Sign Up</Link>
          </div>
        </div>
      </div>
    </>
  );
}
