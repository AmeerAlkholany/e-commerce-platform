"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search, Heart, User, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface NavbarProps {
  links?: NavLink[];
  cartCount?: number;
}

export function Navbar({ links = [], cartCount = 0 }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchFocus = () => {
    searchRef.current?.classList.add("scale-105");
  };
  const handleSearchBlur = () => {
    searchRef.current?.classList.remove("scale-105");
  };

  return (
    <nav
      className={cn(
        "bg-luxe-surface/80 backdrop-blur-xl sticky top-0 border-b border-luxe-outline-variant/30 shadow-sm z-50 transition-all duration-300",
        isScrolled ? "h-16" : "h-20"
      )}
    >
      <div className="flex justify-between items-center w-full px-4 md:px-[64px] h-full max-w-[1440px] mx-auto">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-luxe-primary font-bold text-[48px] leading-[1.1] tracking-tighter">
            LUXE
          </Link>
          <div className="hidden md:flex gap-6 ml-12">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[14px] font-medium leading-[1.4] tracking-[0.05em] transition-opacity duration-300",
                  link.isActive
                    ? "text-luxe-primary font-bold border-b-2 border-luxe-primary"
                    : "text-luxe-on-surface-variant hover:text-luxe-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Search + Icons */}
        <div className="flex items-center gap-6">
          <div
            ref={searchRef}
            className="relative hidden lg:block transition-transform duration-300"
          >
            <Input
              type="text"
              placeholder="Search curated luxury..."
              className="bg-luxe-surface-container border-none rounded-full px-6 py-1 w-64 text-[16px] focus-visible:ring-2 focus-visible:ring-luxe-primary transition-all duration-300"
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-luxe-on-surface-variant size-5" />
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="hover:opacity-80 transition-opacity duration-300 active:scale-95"
              aria-label="Favorites"
            >
              <Heart className="text-luxe-primary size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:opacity-80 transition-opacity duration-300 active:scale-95"
              aria-label="Account"
            >
              <User className="text-luxe-primary size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:opacity-80 transition-opacity duration-300 active:scale-95"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="text-luxe-primary size-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-luxe-primary text-luxe-on-primary text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
