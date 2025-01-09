"use client";

import { Header } from "./header";

interface PageProps {
  children?: React.ReactNode;
}

const Page = ({ children }: PageProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fff5ee]">
      <Header />

      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Page;
