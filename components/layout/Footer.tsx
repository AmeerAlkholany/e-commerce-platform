import Link from "next/link";
import { Globe, Flower2, Hexagon, CreditCard, Wallet, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  quickLinks?: FooterLink[];
  legalLinks?: FooterLink[];
}

export function Footer({
  quickLinks = [],
  legalLinks = [],
}: FooterProps) {
  return (
    <footer className="bg-luxe-surface-container-highest border-t border-luxe-outline-variant">
      <div className="w-full py-20 px-4 md:px-[64px] grid grid-cols-1 md:grid-cols-4 gap-12 max-w-[1440px] mx-auto">
        {/* Brand */}
        <div className="col-span-1">
          <span className="text-[24px] font-semibold leading-[1.3] font-black text-luxe-on-surface block mb-6">
            LUXE GLOBAL
          </span>
          <p className="text-[16px] leading-[1.6] text-luxe-on-surface-variant mb-6 opacity-80">
            Defining the future of high-performance luxury since 2018. Curating
            elegance for the discerning global citizen.
          </p>
          <div className="flex gap-6">
            <Globe className="text-luxe-primary size-6 hover:scale-110 transition-transform cursor-pointer" />
            <Flower2 className="text-luxe-primary size-6 hover:scale-110 transition-transform cursor-pointer" />
            <Hexagon className="text-luxe-primary size-6 hover:scale-110 transition-transform cursor-pointer" />
          </div>
        </div>

        {/* Quick Links */}
        <div className="col-span-1">
          <h5 className="text-[14px] font-medium leading-[1.4] tracking-[0.05em] text-luxe-on-surface font-bold mb-6 uppercase tracking-wider">
            Quick Links
          </h5>
          <ul className="space-y-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[12px] font-semibold leading-[1.2] text-luxe-on-surface-variant hover:text-luxe-on-surface transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div className="col-span-1">
          <h5 className="text-[14px] font-medium leading-[1.4] tracking-[0.05em] text-luxe-on-surface font-bold mb-6 uppercase tracking-wider">
            Legal
          </h5>
          <ul className="space-y-3">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[12px] font-semibold leading-[1.2] text-luxe-on-surface-variant hover:text-luxe-on-surface transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="col-span-1">
          <h5 className="text-[14px] font-medium leading-[1.4] tracking-[0.05em] text-luxe-on-surface font-bold mb-6 uppercase tracking-wider">
            Join the Inner Circle
          </h5>
          <p className="text-[12px] font-semibold leading-[1.2] text-luxe-on-surface-variant mb-6">
            Subscribe for early access to the Summer 2026 pre-launch.
          </p>
          <div className="flex gap-0">
            <Input
              type="email"
              placeholder="Your email"
              className="bg-luxe-surface border border-luxe-outline-variant rounded-l-lg rounded-r-none px-6 py-3 w-full text-[16px] focus-visible:ring-1 focus-visible:ring-luxe-primary outline-none"
            />
            <Button className="bg-luxe-primary text-luxe-on-primary px-6 py-3 rounded-r-lg rounded-l-none text-[14px] font-medium tracking-[0.05em] hover:bg-luxe-primary/90 transition-colors h-auto">
              JOIN
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full py-6 px-4 md:px-[64px] border-t border-luxe-outline-variant/30 max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[12px] font-semibold leading-[1.2] text-luxe-on-surface-variant opacity-60">
          © 2026 LUXE GLOBAL. All Rights Reserved.
        </p>
        <div className="flex gap-6 opacity-60">
          <Banknote className="size-5" />
          <CreditCard className="size-5" />
          <Wallet className="size-5" />
        </div>
      </div>
    </footer>
  );
}
