import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CEMS — Campus Event Management",
  description: "A centralized event management platform for students and organizers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased selection:bg-indigo-500/30 selection:text-white" suppressHydrationWarning>
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.12),rgba(0,0,0,0))]" />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}