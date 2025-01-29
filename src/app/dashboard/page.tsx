"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ClientSession from "@/components/ClientSession";

const LogoutButton = () => (
  <button
    onClick={() => signOut({ callbackUrl: "/login" })}
    className="bg-red-500 text-white px-4 py-2 rounded"
  >
    Logout
  </button>
);

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <ClientSession>
      <div className="container mx-auto">
        <div className="flex justify-between px-4 md:px-16 py-4 border-b-2">
          <h1 className="text-lg font-bold mb-4">
            {session?.user ? `Welcome, ${session.user.name}!` : "Welcome!"}
          </h1>
          <LogoutButton />
        </div>

        <div className="grid grid-cols-[25%,50%,25%]">
          <div className="bg-white text-black py-10 border-r-2 flex justify-end px-4">
            <ul className="text-right">
              <li>POSTED LPOS</li>
              <li>FIRST APPROVED LPOS</li>
              <li>SECOND APPROVED LPOS</li>
              <li>FINAL APPROVED LPOS</li>
            </ul>
          </div>
          <div className="bg-white text-black py-10 px-4">Hello</div>
          <div className="bg-white text-black py-10 border-l-2 flex justify-start px-4">Hello</div>
        </div>
      </div>
    </ClientSession>
  );
}
