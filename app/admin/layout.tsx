"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Package,
  ClipboardList,
  FileText,
  Layers,
  ChevronLeft,
  Plus,
  Users,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [counts, setCounts] = useState({ products: 0, orders: 0, categories: 0, users: 0, payments: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Instant load from localStorage if available
        const cached = localStorage.getItem("luxe_admin_counts");
        if (cached) {
          const { data, expiry } = JSON.parse(cached);
          if (Date.now() < expiry) {
            setCounts(data);
          }
        }

        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error("Stats fail");
        const { sidebar } = await res.json();
        
        if (sidebar) {
          const freshData = {
            products: sidebar.products || 0,
            orders: sidebar.orders || 0,
            payments: sidebar.payments || 0,
            categories: sidebar.categories || 0,
            users: sidebar.users || 0
          };
          setCounts(freshData);
          // Cache for 5 minutes
          localStorage.setItem("luxe_admin_counts", JSON.stringify({
            data: freshData,
            expiry: Date.now() + 5 * 60 * 1000
          }));
        }
      } catch (error) {
        console.error("Sidebar Optimization Error:", error);
      }
    };

    fetchCounts();
  }, [pathname]);

  const menuItems = [
    { name: "Overview", href: "/admin", icon: BarChart3 },
    { name: "Inventory", href: "/admin/products", icon: Package, badge: counts.products },
    { name: "Categories", href: "/admin/categories", icon: Layers, badge: counts.categories },
    { name: "Orders", href: "/admin/orders", icon: ClipboardList, badge: counts.orders },
    { name: "Payments", href: "/admin/payments", icon: CreditCard, badge: counts.payments },
    { name: "Users", href: "/admin/users", icon: Users, badge: counts.users },
    { name: "Reports", href: "/admin/reports", icon: FileText },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-luxe-surface">
        <Sidebar className="border-r border-luxe-outline-variant/30 bg-luxe-surface">
          <SidebarHeader className="p-6 border-b border-luxe-outline-variant/20 flex flex-col gap-2">
            <div className="flex items-center gap-2">
            </div>
            <div>
              <span className="font-black tracking-tighter text-xl text-white select-none">
                LU<span className="text-luxe-primary">XE</span> GLOBAL
              </span>
              <p className="text-[11px] text-luxe-on-surface-variant uppercase tracking-wider font-semibold">Enterprise Control</p>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-widest text-luxe-on-surface-variant/70 mb-2">Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <Link href={item.href} className="w-full">
                        <SidebarMenuButton
                          isActive={pathname === item.href}
                          className={cn(
                            "w-full text-left font-medium tracking-wide transition-all duration-200 py-2.5 px-3 rounded-lg flex items-center justify-between text-sm select-none",
                            pathname === item.href
                              ? "bg-luxe-primary/10 text-luxe-primary hover:bg-luxe-primary/15"
                              : "text-luxe-on-surface-variant hover:text-white hover:bg-luxe-surface-container-high"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="size-4" />
                            <span>{item.name}</span>
                          </div>
                          {item.badge !== undefined && (
                            <Badge className="bg-luxe-surface-container text-luxe-on-surface-variant text-[10px] px-2 py-0.5 border border-luxe-outline-variant/30">
                              {item.badge}
                            </Badge>
                          )}
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-luxe-outline-variant/20 flex flex-col gap-2">
            <Button
              asChild
              variant="outline"
              className="w-full border-luxe-outline-variant bg-transparent text-luxe-on-surface-variant hover:text-white hover:bg-luxe-surface-container-high py-2.5 rounded-lg text-xs font-bold tracking-wider flex items-center justify-center gap-1.5"
            >
              <Link href="/dashboard">
                <ChevronLeft className="size-3.5" /> Client View
              </Link>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 flex flex-col min-h-screen bg-luxe-surface">
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-luxe-outline-variant/20 bg-luxe-surface px-6 md:px-8">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-luxe-on-surface hover:bg-luxe-surface-container size-9" />
              <div className="h-4 w-px bg-luxe-outline-variant/30" />
              <span className="text-[12px] font-semibold text-luxe-on-surface-variant/80 tracking-[0.15em] hover:text-white transition-colors cursor-default select-none">
                ADMIN CONSOLE
              </span>
              
              {pathname.split("/").filter(Boolean).map((segment, index, array) => {
                const isLast = index === array.length - 1;
                const path = `/${array.slice(0, index + 1).join("/")}`;
                
                // Title Mapping for Pretty Breadcrumbs
                const labels: Record<string, string> = {
                  admin: "Console",
                  products: "Inventory",
                  categories: "Categories",
                  orders: "Orders",
                  payments: "Transactions",
                  users: "Registry",
                  reports: "Analytics",
                };

                const label = labels[segment] || segment.toUpperCase();
                const isId = !isNaN(Number(segment));

                return (
                  <React.Fragment key={path}>
                    <span className="text-luxe-on-surface-variant/30 select-none font-light">/</span>
                    {isLast ? (
                      <span className={cn(
                        "text-[12px] font-black uppercase tracking-widest",
                        isId ? "text-luxe-primary font-mono" : "text-white"
                      )}>
                        {isId ? `#${segment.padStart(4, '0')}` : label.replace("-", " ") }
                      </span>
                    ) : (
                      <Link 
                        href={path} 
                        className="text-[12px] font-bold text-luxe-on-surface-variant/60 hover:text-luxe-primary uppercase tracking-widest transition-all hover:translate-x-0.5"
                      >
                        {label}
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <div className="flex items-center gap-4">

            </div>
          </header>

          <main className="flex-1 p-6 md:p-8 space-y-8 max-w-[1440px] w-full mx-auto relative">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
