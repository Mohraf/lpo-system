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

  return (
    <div className="fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg p-6 overflow-y-auto z-50 transition-transform transform translate-x-0">
      <button
        className="absolute top-4 right-4 text-gray-600 hover:text-black"
        onClick={onClose}
      >
        <X size={24} />
      </button>
      <h2 className="text-xl font-bold mb-4">LPO Details</h2>
      <p>
        <strong>LPO Number:</strong> {lpo.lpoNumber}
      </p>
      <p>
        <strong>PR Number:</strong> {lpo.prNumber}
      </p>
      <p>
        <strong>Supplier:</strong> {lpo.supplier.name}
      </p>
      <p>
        <strong>Subtotal:</strong> {lpo.subTotal.toFixed(2)}
      </p>
      <p>
        <strong>VAT Rate:</strong> {lpo.vatRate}%
      </p>
      <p>
        <strong>Total:</strong> {lpo.total.toFixed(2)}
      </p>
      <p>
        <strong>Date:</strong> {new Date(lpo.createdAt).toLocaleDateString()}
      </p>

      <h3 className="text-lg font-bold mt-4">Supply Items</h3>
      <div className="mt-2">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Item Name</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Unit Price</th>
              <th className="p-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {supplyItems.map((item: SupplyItem) => (
              <tr key={item.id} className="border-t">
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">{item.quantity}</td>
                <td className="p-2 border">{item.unitPrice.toFixed(2)}</td>
                <td className="p-2 border">
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
