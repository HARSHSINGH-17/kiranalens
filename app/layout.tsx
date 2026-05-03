import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/components/layout/AppLayout";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import ErrorBoundary from "@/components/ErrorBoundary";

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
    <html lang="en">
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
