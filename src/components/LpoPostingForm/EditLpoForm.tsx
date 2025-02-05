"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

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
  supplyItems: z
    .array(supplyItemSchema)
    .nonempty("At least one supply item is required"),
  supplierId: z.number().min(1, "Supplier selection is required"),
  vatRate: z
    .number()
    .min(0, "VAT rate cannot be negative")
    .max(100, "VAT rate cannot exceed 100%"),
  remarks: z.string().min(1, "Remarks are required"),
});

type LpoFormValues = z.infer<typeof lpoSchema>; // Type inference from your schema

export function EditLpoForm({
  sites,
  suppliers,
  supplyItems,
  lpo
}: {
  sites: any[];
  suppliers: any[];
  supplyItems: any[];
  lpo: any
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<LpoFormValues>({
    resolver: zodResolver(lpoSchema),
    defaultValues: {
      siteId: lpo.site.id,
      lpoNumber: lpo.lpoNumber,
      prNumber: lpo.prNumber,
      paymentTerms: lpo.paymentTerms,
      deliveryTerms: lpo.deliveryTerms,
      supplierId: lpo.supplier.id,
      vatRate: lpo.vatRate,
      remarks: lpo.remarks,
      supplyItems: supplyItems, // Set default values for existing supply items
    },
  });

  const { toast } = useToast()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "supplyItems",
  });

  const onSubmit = async (data: LpoFormValues) => {
    try {
      const response = await fetch(`/api/lpos/${lpo.id}/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          siteId: Number(data.siteId),
          supplierId: Number(data.supplierId),
          vatRate: Number(data.vatRate),
          supplyItems: data.supplyItems.map((item) => ({
            name: item.name,
            quantity: Number(item.quantity),
            unit: item.unit,
            unitPrice: Number(item.unitPrice),
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create LPO");
      }

      // Handle success
      toast({
        title: "Success",
        description: "LPO Posted"
      })
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: error instanceof Error ? error.message : "Unknown error"
      })
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 w-[100%] mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      {/* Form fields implementation */}
      {/* Modal scrollable container */}
      <div className="max-h-[80vh] overflow-y-auto">
        {/* Site Selection */}
        <div>
          <label htmlFor="siteId" className="block font-semibold">
            Site
          </label>
          <select
            id="siteId"
            {...register("siteId", { valueAsNumber: true })} // Add valueAsNumber
            className="w-full border px-4 py-2 mt-1 rounded"
          >
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
          {errors.siteId && (
            <p className="text-red-500 text-sm">{errors.siteId.message}</p>
          )}
        </div>

        {/* Supplier Selection */}
        <div>
          <label htmlFor="supplierId" className="block font-semibold">
            Supplier
          </label>
          <select
            id="supplierId"
            {...register("supplierId", { valueAsNumber: true })} // Add valueAsNumber
            className="w-full border px-4 py-2 mt-1 rounded"
          >
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
          {errors.supplierId && (
            <p className="text-red-500 text-sm">{errors.supplierId.message}</p>
          )}
        </div>

        {/* LPO Number */}
        <div>
          <label htmlFor="lpoNumber" className="block font-semibold">
            LPO Number
          </label>
          <input
            id="lpoNumber"
            type="text"
            {...register("lpoNumber")}
            className="w-full border px-4 py-2 mt-1 rounded"
          />
          {errors.lpoNumber && (
            <p className="text-red-500 text-sm">{errors.lpoNumber.message}</p>
          )}
        </div>

        {/* PR Number */}
        <div>
          <label htmlFor="prNumber" className="block font-semibold">
            PR Number
          </label>
          <input
            id="prNumber"
            type="text"
            {...register("prNumber")}
            className="w-full border px-4 py-2 mt-1 rounded"
          />
          {errors.prNumber && (
            <p className="text-red-500 text-sm">{errors.prNumber.message}</p>
          )}
        </div>

        {/* Payment Terms */}
        <div>
          <label htmlFor="paymentTerms" className="block font-semibold">
            Payment Terms
          </label>
          <input
            id="paymentTerms"
            type="text"
            {...register("paymentTerms")}
            className="w-full border px-4 py-2 mt-1 rounded"
          />
          {errors.paymentTerms && (
            <p className="text-red-500 text-sm">
              {errors.paymentTerms.message}
            </p>
          )}
        </div>

        {/* Delivery Terms */}
        <div>
          <label htmlFor="deliveryTerms" className="block font-semibold">
            Delivery Terms
          </label>
          <input
            id="deliveryTerms"
            type="text"
            {...register("deliveryTerms")}
            className="w-full border px-4 py-2 mt-1 rounded"
          />
          {errors.deliveryTerms && (
            <p className="text-red-500 text-sm">
              {errors.deliveryTerms.message}
            </p>
          )}
        </div>

        {/* VAT Rate */}
        <div>
          <label htmlFor="vatRate" className="block font-semibold">
            VAT Rate
          </label>
          <input
            id="vatRate"
            type="number"
            {...register("vatRate", { valueAsNumber: true })} // Use valueAsNumber to ensure the value is treated as a number
            className="w-full border px-4 py-2 mt-1 rounded"
          />
          {errors.vatRate && (
            <p className="text-red-500 text-sm">{errors.vatRate.message}</p>
          )}
        </div>

        {/* Remarks */}
        <div>
          <label htmlFor="remarks" className="block font-semibold">
            Remarks
          </label>
          <textarea
            id="remarks"
            {...register("remarks")}
            className="w-full border px-4 py-2 mt-1 rounded"
          />
          {errors.remarks && (
            <p className="text-red-500 text-sm">{errors.remarks.message}</p>
          )}
        </div>

        {/* Supply Items */}
        <div>
          <label className="block font-semibold mb-2">Supply Items</label>
          {fields.map((item, index) => (
            <div key={item.id} className="space-y-2">
              <div className="flex flex-col gap-4 border-gray-500 border-2 p-2 rounded-sm">
                <div className="flex justify-between space-x-3">
                  <div className="w-1/2">
                    <label className="text-gray-600 text-sm">Item Name</label>
                    <input
                      {...register(`supplyItems.${index}.name`)}
                      defaultValue={item.name}
                      placeholder="Item Name"
                      className="w-full border px-4 py-2 rounded"
                    />
                  </div>

                  <div className="w-1/2">
                    <label className="text-gray-600 text-sm">Quantity</label>
                    <input
                      {...register(`supplyItems.${index}.quantity`, {
                        valueAsNumber: true,
                      })} // Add valueAsNumber
                      defaultValue={item.quantity}
                      placeholder="Quantity"
                      type="number"
                      className="w-full border px-4 py-2 rounded"
                    />
                  </div>
                </div>
                <div className="flex justify-between space-x-3">
                  <div className="w-1/2">
                    <label className="text-gray-600 text-sm">Unit</label>
                    <input
                      {...register(`supplyItems.${index}.unit`)}
                      defaultValue={item.unit}
                      placeholder="Unit"
                      className="w-full border px-4 py-2 rounded"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="text-gray-600 text-sm">Unit Price</label>
                    <input
                      {...register(`supplyItems.${index}.unitPrice`, {
                        valueAsNumber: true,
                      })} // Add valueAsNumber
                      defaultValue={item.unitPrice}
                      placeholder="Unit Price"
                      type="number"
                      step="0.01"
                      className="w-full border px-4 py-2 rounded"
                    />
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 hover:text-red-700 mt-2"
              >
                Remove Item
              </button>
              {errors.supplyItems?.[index] && (
                <p className="text-red-500 text-sm">
                  {errors.supplyItems[index]?.name?.message}
                </p>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              append({ name: "", quantity: 1, unit: "", unitPrice: 0.01 })
            }
            className="text-blue-500 hover:text-blue-700 mt-4"
          >
            Add Item
          </button>
          {errors.supplyItems && (
            <p className="text-red-500 text-sm">{errors.supplyItems.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}