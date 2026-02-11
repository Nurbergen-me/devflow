import React from "react";
import Navbar from "@/components/navigation/navbar/page";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
};
export default RootLayout;
