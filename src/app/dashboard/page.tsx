import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import LpoForm from "@/components/LpoForm";

export default async function Dashboard() {
  const session = await auth();
  const [sites, suppliers] = await Promise.all([
    prisma.site.findMany(),
    prisma.supplier.findMany(),
  ]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New LPO</h1>
      <LpoForm sites={sites} suppliers={suppliers} />
    </div>
  );
}