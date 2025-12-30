import type { Metadata } from "next";
import "./globals.css";

import NavContainer from "@/components/Home/Navbar/NavContainer";
import LoadingOverlay from '@/components/Common/LoadingOverlay';
import SafeDomPatches from '@/components/Common/SafeDomPatches';


// Using system font 'Century Gothic' instead of Geist.

export const metadata: Metadata = {
  title: "Mirai",
  description: "Welcome to pavani world",
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Playfair Display (headings) still loaded from Google */}
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
        {/* Preferred favicons in public/ to satisfy browsers requesting /favicon.ico */}
        <link rel="icon" href="/favicon.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
      </head>
      <body className="antialiased">
        {/* Server-rendered black overlay to show immediately during initial load */}
        <div id="initial-loading-overlay" className="fixed inset-0 bg-black z-9999 transition-opacity duration-500" />
        <NavContainer />
        {/* Safe DOM patches that run early on the client to prevent insertBefore runtime errors */}
        <SafeDomPatches />
        {children}
        <LoadingOverlay />
      </body>
    </html>
  );
}
