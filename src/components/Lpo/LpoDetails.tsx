"use client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

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

interface LpoDetailsProps {
  lpo: Lpo;
  onClose: () => void;
}

interface SupplyItem {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
}

const LpoDetails: React.FC<LpoDetailsProps> = ({ lpo, onClose }) => {
  const [supplyItems, setSupplyItems] = useState([]);

  useEffect(() => {
    fetch(`/api/supplyItems?lpoId=${lpo.id}`)
      .then((res) => res.json())
      .then(setSupplyItems)
      .catch((err) => console.error("Failed to get supply items", err));
  }, [lpo]);

  if (!supplyItems) return <p>Loading...</p>

  return (
    <div className="fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg p-8 overflow-y-auto z-50 transition-transform transform translate-x-0">
   <button
        className="absolute top-4 right-4 text-gray-600 hover:text-black transition-colors duration-200"
        onClick={onClose}
      >
        <X size={24} />
      </button>
      <h2 className="text-2xl font-bold mb-6 text-blue-600">LPO Details</h2>
      <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
        <p className="text-lg">
          <strong>LPO Number:</strong> <span className="text-gray-800">{lpo.lpoNumber}</span>
        </p>
        <p className="text-lg">
          <strong>PR Number:</strong> <span className="text-gray-800">{lpo.prNumber}</span>
        </p>
        <p className="text-lg">
          <strong>Supplier:</strong> <span className="text-gray-800">{lpo.supplier.name}</span>
        </p>
        <p className="text-lg">
          <strong>Subtotal:</strong> <span className="text-gray-800">{lpo.subTotal.toFixed(2)}</span>
        </p>
        <p className="text-lg">
          <strong>VAT Rate:</strong> <span className="text-gray-800">{lpo.vatRate}%</span>
        </p>
        <p className="text-lg">
          <strong>Total:</strong> <span className="text-gray-800">{lpo.total.toFixed(2)}</span>
        </p>
        <p className="text-lg">
          <strong>Date:</strong> <span className="text-gray-800">{new Date(lpo.createdAt).toLocaleDateString()}</span>
        </p>
      </div>

    <h3 className="text-lg font-bold mt-6">Supply Items</h3>
    <div className="mt-4">
      <table className="w-full border-collapse bg-gray-50 shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 border">Item Name</th>
            <th className="p-3 border">Quantity</th>
            <th className="p-3 border">Unit Price</th>
            <th className="p-3 border">Total</th>
          </tr>
        </thead>
        <tbody>
          {supplyItems.map((item: SupplyItem) => (
            <tr key={item.id} className="border-t hover:bg-gray-100 transition-colors duration-200">
              <td className="p-3 border">{item.name}</td>
              <td className="p-3 border">{item.quantity}</td>
              <td className="p-3 border">{item.unitPrice.toFixed(2)}</td>
              <td className="p-3 border">
                {(item.quantity * item.unitPrice).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default LpoDetails;
