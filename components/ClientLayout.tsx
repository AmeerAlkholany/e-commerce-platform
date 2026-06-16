"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/providers/cart-context";
import { CartDrawer } from "@/components/cart/CartDrawer";

import { AuthProvider } from "@/components/providers/auth-context";

interface ClientLayoutProps {
  children: React.ReactNode;
  navLinks: Array<{ label: string; href: string; isActive?: boolean }>;
  quickLinks: Array<{ label: string; href: string }>;
  legalLinks: Array<{ label: string; href: string }>;
}

export function ClientLayout({
  children,
  navLinks,
  quickLinks,
  legalLinks,
}: ClientLayoutProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <AuthProvider>
      <CartProvider>
        {!isAdmin && <Navbar links={navLinks} />}
        <main className="flex-1">{children}</main>
        {!isAdmin && <Footer quickLinks={quickLinks} legalLinks={legalLinks} />}
        <CartDrawer />
      </CartProvider>
    </AuthProvider>
  );
}
