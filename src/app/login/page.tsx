"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function LoginPage() {
  const searchParams = useSearchParams();

  const [params, setParams] = useState<{
    error?: string;
    success?: string;
    callbackUrl?: string;
  }>({});

  useEffect(() => {
    const error = searchParams.get("error") || undefined;
    const success = searchParams.get("success") || undefined;
    const callbackUrl = searchParams.get("callbackUrl") || "/pages/dashboard";

    setParams({ error, success, callbackUrl });
  }, []);

  return (
    <div className="min-h-screen p-4 flex flex-col md:space-x-4 md:flex-row items-center justify-center bg-gray-100">
      <div className="flex-auto flex items-center justify-center">
        <Image src="/purchaseChain.png" width={500} height={300} alt="logo" />
      </div>
      <div className="flex-auto flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center text-blue-500">
            Login
          </h1>

          {params.error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {params.error === "CredentialsSignin"
                ? "Invalid credentials"
                : params.error}
            </div>
          )}

          {params.success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {decodeURIComponent(params.success)}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              signIn("credentials", {
                email: formData.get("email"),
                password: formData.get("password"),
                callbackUrl: params.callbackUrl, // Use dynamic callback URL
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
        </div>
      </div>
    </div>
  );
}
