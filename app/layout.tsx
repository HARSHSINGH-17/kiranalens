import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/layout/AppLayout";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KiranaLens - AI-Powered Kirana Store Underwriting",
  description: "AI-powered cash flow underwriting platform for Indian NBFCs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable}`}>
      <body>
        <ErrorBoundary>
          <QueryProvider>
            <ToastProvider />
            <AppLayout>
              {children}
            </AppLayout>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
