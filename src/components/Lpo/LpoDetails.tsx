"use client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { EditLpoForm } from "../LpoPostingForm/EditLpoForm";
import { Lpo, Site, Supplier, SupplyItem } from "@/types/models";


interface LpoDetailsProps {
  lpo: Lpo;
  onClose: () => void;
}


const LpoDetails: React.FC<LpoDetailsProps> = ({ lpo, onClose }) => {
  const { data: session } = useSession();
  const [supplyItems, setSupplyItems] = useState<SupplyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const { toast } = useToast();
  const [sites, setSites] = useState<Site[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const userHasApprovalRights =
    session?.user?.role === "APPROVER" || session?.user?.role === "ADMIN";

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/supplyItems?lpoId=${lpo.id}`)
      .then((res) => res.json())
      .then((data) => {
        setSupplyItems(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to get supply items", err);
        setIsLoading(false);
      });
  }, [lpo]);

  useEffect(() => {
    setLoading(true)
    setIsEditing(true)
    Promise.all([
      fetch("/api/sites")
        .then((res) => res.json())
        .then(setSites),
      fetch("/api/suppliers")
        .then((res) => res.json())
        .then(setSuppliers),
    ])
      .catch((err) => console.error("Failed to fetch data", err))
      .finally(() => {setLoading(false); setIsEditing(false)});
  }, [isEditing, loading]);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const response = await fetch(`/api/lpos/${lpo.id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast({ description: "Approval failed", variant: "destructive" });
      } else {
        toast({ description: "LPO approved successfully!" });
        onClose(); // Optionally close after approval
      }
    } catch (error) {
      console.error(error);
      toast({ description: "Error approving LPO", variant: "destructive" });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      const response = await fetch(`/api/lpos/${lpo.id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast({ description: "Reject failed", variant: "destructive" });
      } else {
        toast({ description: "LPO rejected successfully!" });
        onClose(); // Optionally close after approval
      }
    } catch (error) {
      console.error(error);
      toast({ description: "Error Rejecting LPO", variant: "destructive" });
    } finally {
      setIsRejecting(false);
    }
  };

  // Determine approval stage text dynamically
  const getApprovalButtonText = () => {
    if (session?.user?.role === "ADMIN") {
      return "Approve LPO";
    } else if (!lpo.firstApproverId) {
      return "Initial Approval";
    } else if (!lpo.secondApproverId) {
      return "Second Approval";
    } else if (!lpo.finalApproverId) {
      return "Finalize Approval";
    }
    return ""; // In case LPO is fully approved
  };

  const approvalButtonText = getApprovalButtonText();

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
          <strong>LPO Number:</strong>{" "}
          <span className="text-gray-800">{lpo.lpoNumber}</span>
        </p>
        <p className="text-lg">
          <strong>PR Number:</strong>{" "}
          <span className="text-gray-800">{lpo.prNumber}</span>
        </p>
        <p className="text-lg">
          <strong>Supplier:</strong>{" "}
          <span className="text-gray-800">{lpo.supplier.name}</span>
        </p>
        <p className="text-lg">
          <strong>Subtotal:</strong>{" "}
          <span className="text-gray-800">{lpo.subTotal.toFixed(2)}</span>
        </p>
        <p className="text-lg">
          <strong>VAT Rate:</strong>{" "}
          <span className="text-gray-800">{lpo.vatRate}%</span>
        </p>
        <p className="text-lg">
          <strong>Total:</strong>{" "}
          <span className="text-gray-800">{lpo.total.toFixed(2)}</span>
        </p>
        <p className="text-lg">
          <strong>Date:</strong>{" "}
          <span className="text-gray-800">
            {new Date(lpo.createdAt).toLocaleDateString()}
          </span>
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
            {isLoading
              ? // Skeleton loaders
                [...Array(3)].map((_, index) => (
                  <tr key={index} className="border-t animate-pulse">
                    <td className="p-3 border bg-gray-300 h-6 w-24"></td>
                    <td className="p-3 border bg-gray-300 h-6 w-16"></td>
                    <td className="p-3 border bg-gray-300 h-6 w-20"></td>
                    <td className="p-3 border bg-gray-300 h-6 w-20"></td>
                  </tr>
                ))
              : supplyItems.map((item: SupplyItem) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-gray-100 transition-colors duration-200"
                  >
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

      {!userHasApprovalRights &&
        lpo.rejected === "NO" &&
        (lpo.firstApproverId == null ||
          lpo.secondApproverId == null ||
          lpo.finalApproverId == null) && (
          <Dialog>
            <DialogTrigger asChild>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Edit LPO
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogTitle>Edit LPO Posting</DialogTitle>
              <EditLpoForm
                sites={sites}
                suppliers={suppliers}
                supplyItems={supplyItems}
                lpo={lpo} // Pass the LPO with supply items
              />
            </DialogContent>
          </Dialog>
        )}

      {/* Approval Button */}
      {userHasApprovalRights &&
        lpo.rejected === "NO" &&
        (lpo.firstApproverId == null ||
          lpo.secondApproverId == null ||
          lpo.finalApproverId == null) && (
          <div className="flex justify-between space-x-4">
            <button
              onClick={handleReject}
              disabled={isApproving}
              className="mt-4 w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors duration-200 disabled:opacity-50"
            >
              {isRejecting ? "Rejecting..." : "Reject LPO"}
            </button>
            <button
              onClick={handleApprove}
              disabled={isApproving}
              className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
            >
              {isApproving ? "Approving..." : approvalButtonText}
            </button>
          </div>
        )}
    </div>
  );
};

export default LpoDetails;