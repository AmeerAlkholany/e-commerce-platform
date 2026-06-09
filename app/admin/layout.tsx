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
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [counts, setCounts] = useState({ products: 0, orders: 0, categories: 0 });

  useEffect(() => {
    // Fetch counts for badges
    const fetchCounts = async () => {
      try {
        const [prodRes, orderRes, catRes] = await Promise.all([
          fetch("/api/products?countOnly=true"),
          fetch("/api/orders?countOnly=true"),
          fetch("/api/categories?countOnly=true")
        ]);
        
        const [prodData, orderData, catData] = await Promise.all([
          prodRes.json(),
          orderRes.json(),
          catRes.json()
        ]);

        setCounts({
          products: prodData.count || 0,
          orders: orderData.count || 0,
          categories: catData.count || 0
        });
      } catch (error) {
        console.error("Failed to fetch sidebar counts:", error);
      }
    };

    fetchCounts();
  }, [pathname]); // Refresh on navigation

  const menuItems = [
    { name: "Overview", href: "/admin", icon: BarChart3 },
    { name: "Inventory", href: "/admin/products", icon: Package, badge: counts.products },
    { name: "Categories", href: "/admin/categories", icon: Layers, badge: counts.categories },
    { name: "Orders", href: "/admin/orders", icon: ClipboardList, badge: counts.orders },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Reports", href: "/admin/reports", icon: FileText },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-luxe-surface">
        <Sidebar className="border-r border-luxe-outline-variant/30 bg-luxe-surface">
          <SidebarHeader className="p-6 border-b border-luxe-outline-variant/20 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {/* <span className="text-[10px] font-bold tracking-[0.2em] text-luxe-primary uppercase bg-luxe-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="size-1.5 bg-luxe-primary rounded-full animate-ping" />
                Live Data
              </span> */}
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
              <span className="text-[12px] font-semibold text-luxe-on-surface-variant/80 tracking-wider">
                ADMIN CONSOLE
              </span>
              <span className="text-luxe-on-surface-variant/40">/</span>
              <span className="text-[12px] font-bold text-white uppercase tracking-wider">
                {pathname === "/admin" && "Performance Overview"}
                {pathname === "/admin/products" && "Inventory Catalog"}
                {pathname === "/admin/categories" && "Category Management"}
                {pathname === "/admin/orders" && "Orders Management"}
                {pathname === "/admin/users" && "User Management"}
                {pathname === "/admin/reports" && "Analytics Reports"}
                {pathname.startsWith("/admin/users/") && "User Details / " + pathname.split("/")[3]}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* <div className="flex items-center gap-2">
                <span className="size-2 bg-luxe-primary rounded-full animate-ping" />
                <span className="text-[10px] text-luxe-primary font-bold tracking-widest uppercase">Live Connect</span>
              </div> */}
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
