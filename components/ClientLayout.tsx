"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

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
    <>
      {!isAdmin && <Navbar links={navLinks} cartCount={2} />}
      <main className="flex-1">{children}</main>
      {!isAdmin && <Footer quickLinks={quickLinks} legalLinks={legalLinks} />}
    </>
  );
}
