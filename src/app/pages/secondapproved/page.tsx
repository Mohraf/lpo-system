"use client";
import { useState, useEffect } from "react";
import LpoDetails from "@/components/Lpo/LpoDetails";
import Header from "@/components/Header/Header";
import { Lpo } from "@/types/models";

const Page = () => {
  const [lpos, setLpos] = useState<Lpo[]>([]);
  const [selectedLpo, setSelectedLpo] = useState<Lpo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/secondapprovedlpos")
        .then((res) => res.json())
        .then(setLpos),
    ])
      .catch((err) => console.error("Failed to fetch data", err))
      .finally(() => setLoading(false));
  }, []);

  const getLpoStatus = (lpo: Lpo) => {
    if (lpo.rejected === "YES") {
      return "Rejected";
    }
    if (lpo.finalApproverId) {
      return "Fully Approved";
    }
    if (lpo.secondApproverId) {
      return "Second Approved";
    }
    if (lpo.firstApproverId) {
      return "First Approved";
    }
    return "Pending";
  };

  return (
    <div className="container mx-auto h-screen">
      <Header />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Second Approved LPOs</h1>
        </div>

        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Select</th>
                <th className="p-3 border">LPO Number</th>
                <th className="p-3 border">PR Number</th>
                <th className="p-3 border">Supplier</th>
                <th className="p-3 border">Subtotal</th>
                <th className="p-3 border">VAT</th>
                <th className="p-3 border">Total</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-500">
                    Loading LPOs...
                  </td>
                </tr>
              ) : lpos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-500">
                    No LPOs available.
                  </td>
                </tr>
              ) : (
                lpos.map((lpo) => (
                  <tr
                    key={lpo.id}
                    className={`border-t cursor-pointer hover:bg-gray-100 ${
                      selectedLpo?.id === lpo.id ? "bg-gray-200" : ""
                    }`}
                    onClick={() => setSelectedLpo(lpo)}
                  >
                    <td className="p-3 border text-center">
                      <input
                        type="radio"
                        name="selectedLpo"
                        checked={selectedLpo?.id === lpo.id}
                        onChange={() => setSelectedLpo(lpo)}
                        className="text-slate-900 appearance-none cursor-pointer peer h-3 w-3 rounded-full border border-slate-500 checked:border-slate-900 transition-all"
                      />
                    </td>
                    <td className="p-3 border">{lpo.lpoNumber}</td>
                    <td className="p-3 border">{lpo.prNumber}</td>
                    <td className="p-3 border">{lpo.supplier.name}</td>
                    <td className="p-3 border">{lpo.subTotal.toFixed(2)}</td>
                    <td className="p-3 border">{lpo.vatRate}%</td>
                    <td className="p-3 border">{lpo.total.toFixed(2)}</td>
                    <td className="p-3 border">
                      {new Date(lpo.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 border">{getLpoStatus(lpo)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {selectedLpo && (
          <LpoDetails lpo={selectedLpo} onClose={() => setSelectedLpo(null)} />
        )}
      </div>
    </div>
  );
};

export default Page;
