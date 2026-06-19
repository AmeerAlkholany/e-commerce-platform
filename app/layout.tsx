import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClickSpark } from "@/components/magicui/click-spark";
import { LenisProvider } from "@/components/lenis-provider";
import { ClientLayout } from "@/components/ClientLayout";
import QueryProvider from "@/components/providers/query-provider";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "LUXE GLOBAL | Curated Luxury",
  description:
    "Defining the future of high-performance luxury. Curating elegance for the discerning global citizen.",
};

const navLinks = [
  { label: "NEW IN", href: "/products", isActive: true },
  { label: "COLLECTIONS", href: "/products?category=Fashion" },
  { label: "DESIGNERS", href: "/products" },
  { label: "ABOUT", href: "/about" },
];

const quickLinks = [
  { label: "New Arrivals", href: "/products" },
  { label: "Best Sellers", href: "/products" },
  { label: "Collections", href: "/products" },
  { label: "Gift Guide", href: "/products" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Returns", href: "/returns" },
  { label: "Contact Us", href: "/contact" },
];

export default function RootLayout({
  children,
  ...props
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ClickSpark
          sparkColor1="#AFFF00"
          sparkColor2="#00d4ff"
          sparkSize={10}
          sparkRadius={22}
          sparkCount={8}
          duration={400}
        >
          <LenisProvider>
            <QueryProvider>
              <ClientLayout
                navLinks={navLinks}
                quickLinks={quickLinks}
                legalLinks={legalLinks}
              >
                {children}
                <SpeedInsights />
              </ClientLayout>
            </QueryProvider>
          </LenisProvider>
          <Toaster position="top-right" richColors invert theme="dark" />
        </ClickSpark>
      </body>
    </html>
  );
}

