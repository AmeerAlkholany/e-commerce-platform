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
  LayoutDashboard,
  ShoppingBag,
  User,
  LifeBuoy,
  ChevronLeft,
  Settings,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useAuth } from "@/components/providers/auth-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [counts, setCounts] = useState({ orders: 0 });

  const getInitials = (name?: string) => {
    if (!name) return "??";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch("/api/client/orders?pageSize=1");
        if (res.ok) {
          const data = await res.json();
          setCounts({ orders: data.pagination?.total || 0 });
        }
      } catch (error) {
        console.error("Dashboard Layout Error:", error);
      }
    };

    fetchCounts();
  }, [pathname]);

  const menuItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Orders", href: "/dashboard/orders", icon: ShoppingBag, badge: counts.orders },
    { name: "Profile Settings", href: "/dashboard/profile", icon: User },
    { name: "Contact Support", href: "/dashboard/support", icon: LifeBuoy },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-luxe-surface">
        <Sidebar className="border-r border-luxe-outline-variant/30 bg-luxe-surface">
          <SidebarHeader className="p-6 border-b border-luxe-outline-variant/20">
            <div>
              <span className="font-black tracking-tighter text-xl text-white select-none">
                LU<span className="text-luxe-primary">XE</span> GLOBAL
              </span>
              <p className="text-[10px] text-luxe-on-surface-variant uppercase tracking-wider font-semibold">Client Portal</p>
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
                          {item.badge !== undefined && item.badge > 0 && (
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
              <Link href="/">
                <ChevronLeft className="size-3.5" /> Back to Store
              </Link>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 flex flex-col min-h-screen bg-luxe-surface">
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-luxe-outline-variant/20 bg-luxe-surface px-6 md:px-8">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-luxe-on-surface hover:bg-luxe-surface-container size-9" />
              <div className="h-4 w-px bg-luxe-outline-variant/30" />
              <span className="text-[12px] font-semibold text-luxe-on-surface-variant/80 tracking-[0.15em] hover:text-white transition-colors cursor-default select-none uppercase">
                {pathname === "/dashboard" ? "Client Overview" : pathname.split("/").pop()?.replace("-", " ")}
              </span>
            </div>

            <div className="flex items-center gap-4">
               <Button variant="ghost" size="icon" className="text-luxe-on-surface-variant hover:text-white size-9 rounded-full">
                  <Bell className="size-5" />
               </Button>
               
               <Link href="/dashboard/profile">
                 <div className="h-9 w-9 rounded-full bg-luxe-primary/20 border border-luxe-primary/30 flex items-center justify-center text-[10px] font-bold text-luxe-primary uppercase cursor-pointer hover:bg-luxe-primary/30 transition-all overflow-hidden relative group">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt={user.name} className="size-full object-cover group-hover:scale-110 transition-transform" />
                    ) : (
                      getInitials(user?.name)
                    )}
                 </div>
               </Link>
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
