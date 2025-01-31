"use client";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import ClientSession from "@/components/ClientSession";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CompanyForm } from "@/components/Company/AddCompanyForm";
import AddSiteForm from "@/components/Site/AddSiteForm";
import AddSupplierForm from "@/components/Supplier/AddSupplierForm";

const LogoutButton = () => (
  <button
    onClick={() => signOut({ callbackUrl: "/login" })}
    className="bg-red-500 text-white px-4 py-2 rounded"
  >
    Logout
  </button>
);

export interface Company {
  id: number;
  name: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [companies, setCompanies] = useState<Company[]>([]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    fetch("/api/companies")
      .then((res) => res.json())
      .then(setCompanies)
      .catch((err) => console.error("Failed to fetch Companies", err));
  }, []);

  if (!companies) return <p>Loading companies...</p>;

  if (!isClient) return null; // Ensures content is rendered only on client

  console.log("Session:", session)

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
              <AddSiteForm companies={companies} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="p-4">
          <h1 className="text-2xl font-bold">Sites</h1>
          <Dialog>
            <DialogTrigger asChild>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                New Site
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogTitle>New Company Posting</DialogTitle>
              <AddSiteForm companies={companies} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="p-4">
          <h1 className="text-2xl font-bold">Suppliers</h1>
          <Dialog>
            <DialogTrigger asChild>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                New Supplier
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogTitle>New Supplier Posting</DialogTitle>
              <AddSupplierForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ClientSession>
  );
}
