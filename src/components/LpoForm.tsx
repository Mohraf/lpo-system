"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define the schema
const supplyItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unit: z.string().min(1, "Unit is required"),
  unitPrice: z.number().min(0.01, "Unit price must be at least 0.01"),
});

const lpoSchema = z.object({
  siteId: z.number().min(1, "Site selection is required"),
  lpoNumber: z.string().min(1, "LPO number is required"),
  prNumber: z.string().min(1, "PR number is required"),
  paymentTerms: z.string().min(1, "Payment terms are required"),
  deliveryTerms: z.string().min(1, "Delivery terms are required"),
  supplyItems: z.array(supplyItemSchema).nonempty("At least one supply item is required"),
  supplierId: z.number().min(1, "Supplier selection is required"),
  vatRate: z.number().min(0, "VAT rate cannot be negative").max(100, "VAT rate cannot exceed 100%"),
});

export function LpoForm({ sites, suppliers }: { sites: any[], suppliers: any[] }) {
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(lpoSchema),
    defaultValues: {
      supplyItems: [{
        name: "",
        quantity: 0,
        unit: "",
        unitPrice: 0,
      }]
    }
  });

  const onSubmit = async (data: any) => {
    try {
      const subTotal = data.supplyItems.reduce(
        (acc: number, item: any) => acc + (item.quantity * item.unitPrice),
        0
      );
      const total = subTotal * (1 + (data.vatRate / 100));

      const response = await fetch("/api/lpos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          subTotal,
          total,
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to create LPO");
      
      // Handle success
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Form fields implementation */}
    </form>
  );
}