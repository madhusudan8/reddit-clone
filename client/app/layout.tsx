import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Providers } from "./providers";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reddit Clone — The Front Page of the Internet",
  description:
    "A modern Reddit-style social media platform. Discover communities, share content, and connect with people around the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[var(--background)]">
        <ClerkProvider>
          <Providers>
            <Navbar />
            <div className="mx-auto flex max-w-[1440px]">
              <LeftSidebar />
              <main className="min-w-0 flex-1 pb-20 lg:pb-0">{children}</main>
              <RightSidebar />
            </div>
            <MobileBottomNav />
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
