"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ClientSession from "@/components/ClientSession";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CompanyForm } from "@/components/Company/AddCompanyForm";
import AddSiteForm from "@/components/Site/AddSiteForm";
import AddSupplierForm from "@/components/Supplier/AddSupplierForm";
import Header from "@/components/Header/Header";


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

  // Ensure loading state is handled properly
  if (!isClient) return <div>Loading...</div>; // Show loading state until client is ready

  if (!session) return null; // Ensure user is authenticated

  return (
    <ClientSession>
      <div className="container mx-auto h-screen">
        <Header />

        <div className="flex h-[calc(100vh-58px)]">
          <div className="w-2/3 p-6">
            <h2>Dashboard</h2>
          </div>

          <div className="w-1/3 border-l-2">
            <div className="p-4 shadow-md rounded-lg bg-gray-200 m-2 flex text-center items-center justify-between">
              <h3 className="text-lg font-bold">Register a new company</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-gray-500 text-base text-white px-4 py-2 rounded-full hover:bg-gray-400">
                    New Company
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogTitle>New Company Posting</DialogTitle>
                  <CompanyForm />
                </DialogContent>
              </Dialog>
            </div>

            <div className="p-4 shadow-md rounded-lg bg-gray-200 m-2 flex text-center items-center justify-between">
              <h3 className="text-lg font-bold">Register a new site</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-gray-500 text-base text-white px-4 py-2 rounded-full hover:bg-gray-400">
                    New Site
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogTitle>New Company Site Posting</DialogTitle>
                  <AddSiteForm companies={companies} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="p-4 shadow-md rounded-lg bg-gray-200 m-2 flex text-center items-center justify-between">
              <h3 className="text-lg font-bold">Register a new supplier</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-gray-500 text-base text-white px-4 py-2 rounded-full hover:bg-gray-400">
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
        </div>
      </div>
    </ClientSession>
  );
}
