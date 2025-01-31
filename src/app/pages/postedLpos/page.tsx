"use client";

import { useState, useEffect } from "react";
import { LpoForm } from "@/components/LpoPostingForm/LpoForm";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Lpo {
  id: number;
  lpoNumber: string;
  prNumber: string;
  supplier: { name: string };
  subTotal: number;
  vatRate: number;
  total: number;
  createdAt: string;
}

interface Site {
  id: number;
  name: string;
}

interface Supplier {
  id: number;
  name: string; 
}

export default function PostedLposPage() {
  const [lpos, setLpos] = useState<Lpo[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    fetch("/api/lpos")
      .then((res) => res.json())
      .then(setLpos)
      .catch((err) => console.error("Failed to fetch LPOs", err));
  }, []);

  if (!lpos) return <p>Loading...</p>;

  useEffect(()=>{
    fetch("/api/sites")
      .then((res) => res.json())
      .then(setSites)
      .catch((err) => console.error("Failed to fetch Sites", err));
  },[])

  useEffect(()=>{
    fetch("/api/suppliers")
      .then((res) => res.json())
      .then(setSuppliers)
      .catch((err) => console.error("Failed to fetch Suppliers", err));
  },[])
  

  return (
    <div className="container mx-auto p-6 h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Posted LPOs</h1>
        <Dialog>
          <DialogTrigger asChild>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              New LPO
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogTitle>New LPO Posting</DialogTitle>
            <LpoForm sites={sites} suppliers={suppliers} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">LPO Number</th>
              <th className="p-3 border">PR Number</th>
              <th className="p-3 border">Supplier</th>
              <th className="p-3 border">Subtotal</th>
              <th className="p-3 border">VAT</th>
              <th className="p-3 border">Total</th>
              <th className="p-3 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {lpos.map((lpo) => (
              <tr key={lpo.id} className="border-t">
                <td className="p-3 border">{lpo.lpoNumber}</td>
                <td className="p-3 border">{lpo.prNumber}</td>
                <td className="p-3 border">{lpo.supplier.name}</td>
                <td className="p-3 border">{lpo.subTotal.toFixed(2)}</td>
                <td className="p-3 border">{lpo.vatRate}%</td>
                <td className="p-3 border">{lpo.total.toFixed(2)}</td>
                <td className="p-3 border">{new Date(lpo.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
