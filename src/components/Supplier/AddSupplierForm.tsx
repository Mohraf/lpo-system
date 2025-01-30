"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const supplierSchema = z.object({
  name: z.string().min(1, "Supplier name is required"),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

const AddSupplierForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: SupplierFormValues) => {
    try {
      const response = await fetch("/api/suppliers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to create Supplier");

      // Handle success
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 w-[100%] mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      {/* Modal scrollable container */}
      <div className="max-h-[80vh] overflow-y-auto">
        {/* Form fields implementation */}

        {/* Name */}
        <div>
          <label htmlFor="name" className="block font-semibold">
            LPO Number
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className="w-full border px-4 py-2 mt-1 rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
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
};

export default AddSupplierForm;
