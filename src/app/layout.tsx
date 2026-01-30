import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "Klickshare",
  description: "A platform for photographers and users to share memories",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-smooth-gradient text-gray-900">
        <ToastProvider /> 
        <Navbar />
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
