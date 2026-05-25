import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "LUXE GLOBAL | Curated Luxury",
  description:
    "Defining the future of high-performance luxury. Curating elegance for the discerning global citizen.",
};

const navLinks = [
  { label: "NEW IN", href: "/new", isActive: true },
  { label: "COLLECTIONS", href: "/collections" },
  { label: "DESIGNERS", href: "/designers" },
  { label: "ABOUT", href: "/about" },
];

const quickLinks = [
  { label: "New Arrivals", href: "/new" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "Collections", href: "/collections" },
  { label: "Gift Guide", href: "/gifts" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Returns", href: "/returns" },
  { label: "Contact Us", href: "/contact" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <Navbar links={navLinks} cartCount={2} />
        <main className="flex-1">{children}</main>
        <Footer quickLinks={quickLinks} legalLinks={legalLinks} />
      </body>
    </html>
  );
}
