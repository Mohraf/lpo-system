import Sidebar from "@/components/Sidenav/Sidenav";
import React from "react";
import SessionWrapper from "@/components/SessionWrapper";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <main className="flex ml-64 md:ml-0">
        {/* Wrap application with SessionProvider */}
        <SessionWrapper>
          <Sidebar />
          {children}
        </SessionWrapper>
      </main>
    </>
  );
};

export default Layout;
