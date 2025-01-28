"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const lpoSchema = z.object({
  siteId: z.number(),
  lpoNumber: z.string(),
  prNumber: z.string(),
  paymentTerms: z.string(),
  deliveryTerms: z.string(),
  supplyItems: z.array(z.object({
    name: z.string(),
    quantity: z.number(),
    unit: z.string(),
    unitPrice: z.number(),
  })),
  supplierId: z.number(),
});

export function LpoForm({ sites, suppliers }: { sites: any[], suppliers: any[] }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(lpoSchema),
  });

  const onSubmit = async (data: any) => {
    // Calculate amounts
    const subTotal = data.supplyItems.reduce((acc: number, item: any) => 
      acc + (item.quantity * item.unitPrice), 0);
    const total = subTotal * (1 + (data.vatRate || 0));

    const response = await fetch("/api/lpos", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        subTotal,
        total,
        date: new Date(),
      }),
    });
    // Handle response
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Form fields here */}
    </form>
  );
}