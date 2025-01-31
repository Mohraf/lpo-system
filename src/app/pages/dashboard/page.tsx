"use client";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import ClientSession from "@/components/ClientSession";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CompanyForm } from "@/components/Company/AddCompanyForm";

const LogoutButton = () => (
  <button
    onClick={() => signOut({ callbackUrl: "/login" })}
    className="bg-red-500 text-white px-4 py-2 rounded"
  >
    Logout
  </button>
);

export default function Dashboard() {
  const { data: session } = useSession();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Ensures content is rendered only on client

  return (
    <ClientSession>
      <div className="container mx-auto h-screen">
        <div className="flex justify-between px-4 md:px-4 py-4 border-b-2">
          <h1 className="text-lg font-bold mb-4">
            {session?.user ? `Welcome, ${session.user.name}!` : "Welcome!"}
          </h1>
          <LogoutButton />
        </div>

        <div className="p-4">
          <h1 className="text-2xl font-bold">Companies</h1>
          <Dialog>
            <DialogTrigger asChild>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                New Company
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogTitle>New Company Posting</DialogTitle>
              <CompanyForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ClientSession>
  );
}
