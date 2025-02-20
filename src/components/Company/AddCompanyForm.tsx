"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export function CompanyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
    },
  });

  const { toast } = useToast()

  const onSubmit = async (data: CompanyFormValues) => {
    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) toast({
        title: "Error",
        variant: "destructive",
        description: "Error occured! Failed to create company"
      });

      // console.log("company created");
      toast({
        title: "Success",
        description: "Company created"
      })
      window.location.reload();
    } catch (error) {
      // console.error("Submission error:", error);
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
        {/* LPO Number */}
        <div>
          <label htmlFor="name" className="block font-semibold">
            Company Name
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
}
