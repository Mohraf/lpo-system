import React from "react";
import { signOut, useSession } from "next-auth/react";

const LogoutButton = () => (
  <button
    onClick={() => signOut({ callbackUrl: "/login" })}
    className="bg-red-500 text-white px-4 py-2 rounded"
  >
    Logout
  </button>
);

const Header = () => {
  const { data: session } = useSession();
  return (
    <div className="flex justify-between items-center px-4 md:px-6 py-2 border-b-2">
      <div className="flex items-center h-full">
        <h1 className="text-lg font-bold">
          {session?.user ? `Welcome, ${session.user.name}!` : "Welcome!"}
        </h1>
      </div>
      <LogoutButton />
    </div>
  );
};

export default Header;
