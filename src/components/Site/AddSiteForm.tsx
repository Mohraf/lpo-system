"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Company } from "@/types/models";

const siteSchema = z.object({
  name: z.string().min(1, "Site name is required"),
  companyId: z.number().min(1, "Company Selection is required"),
});

type SiteFormValues = z.infer<typeof siteSchema>;

const AddSiteForm = ({ companies }: { companies: Company[] }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SiteFormValues>({
    resolver: zodResolver(siteSchema),
    defaultValues: {
      name: "",
      companyId: 1,
    },
  });

  const onSubmit = async (data: SiteFormValues) => {
    try {
      const response = await fetch("/api/sites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create Site");

      console.log("Site created");
    } catch (error) {
      console.error("Submission error:", error);
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
        {/* Company Selection */}
        <div>
          <label htmlFor="companyId" className="block font-semibold">
            Company
          </label>
          <select
            id="companyId"
            {...register("companyId", { valueAsNumber: true })} // Add valueAsNumber
            className="w-full border px-4 py-2 mt-1 rounded"
          >
            {companies.length > 0 ? (
              companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))
            ) : (
              <option value="">No companies available</option>
            )}
          </select>
          {errors.companyId && (
            <p className="text-red-500 text-sm">{errors.companyId.message}</p>
          )}
        </div>

        {/* Site Name */}
        <div>
          <label htmlFor="name" className="block font-semibold">
            Site Name
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

export default AddSiteForm;
