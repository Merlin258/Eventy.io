import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CEMS",
  description: "CEMS platform",
};

// Locking the app to dark mode regardless of system/browser preference,
// matching the Linear-style deep dark aesthetic (bg-zinc-950 base).
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased selection:bg-indigo-500/30 selection:text-white">
        {/* Faint ambient gradient glow, kept subtle so it doesn't fight the flat dark surface */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.12),rgba(0,0,0,0))]"
        />
        
        <ToastProvider>
          <Navbar />
          <main className="mx-auto max-w-6xl px-6">{children}</main>
        </ToastProvider>
        
      </body>
    </html>
  );
}