/**
 * @file layout.tsx
 * @description Global layout wrapper for the CardioTrack app including metadata and font setup.
 * @module RootLayout
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Page metadata for SEO and browser rendering
 * @type {Metadata}
 */

export const metadata: Metadata = {
  title: " Heart Rate Monitoring",
  description: "Professional heart rate monitoring system with real-time EKG visualization",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
    ],
  },
};

/**
 * Root layout component that wraps all pages with global styles, fonts, and layout structure.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content to render inside layout
 * @returns {JSX.Element}
 */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <main className="min-h-screen bg-gradient-to-br from-cyan-50 to-indigo-50">
          {children}
        </main>
      </body>
    </html>
  );
}
