"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users,
  Loader2,
  Package,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Types ─────────────────────────────────────────────
interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  avgOrderValue: number;
  salesData: { name: string; sales: number }[];
  recentActivities: { id: string; type: string; title: string; subtitle: string; time: string }[];
}

export default function AdminOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated or actual fetch for dashboard overview
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real app, this would be a dedicated overview API
        // For now, we'll use reports data or simulate
        const res = await fetch("/api/reports");
        const reports = await res.json();
        
        setStats({
          totalRevenue: reports.totalRevenue,
          totalOrders: reports.totalOrders,
          totalUsers: 1248, // Simulated
          avgOrderValue: reports.totalRevenue / reports.totalOrders,
          salesData: reports.salesByMonth,
          recentActivities: [
            { id: "1", type: "order", title: "New acquisition initialized", subtitle: "Order #5829 by Julian V.", time: "2 mins ago" },
            { id: "2", type: "inventory", title: "Stock depletion alert", subtitle: "Rolex Daytona (Silver) is low", time: "15 mins ago" },
            { id: "3", type: "user", title: "New member onboarded", subtitle: "Sophia R. joined the platform", time: "1 hour ago" },
            { id: "4", type: "order", title: "Transaction complete", subtitle: "Order #5821 successfully delivered", time: "3 hours ago" },
          ]
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-40"><Loader2 className="size-10 text-luxe-primary animate-spin" /></div>;
  if (!stats) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              GLOBAL <span className="text-luxe-primary">SYNOPSIS</span>
            </h1>
            <p className="text-luxe-on-surface-variant text-sm mt-1 flex items-center gap-2">
               <span className="size-1.5 bg-luxe-primary rounded-full animate-pulse" />
               Real-time enterprise performance metrics.
            </p>
         </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Gross Acquisitions" value={`$${stats.totalRevenue.toLocaleString()}`} change="+24.5%" icon={<DollarSign className="size-5" />} />
        <StatCard title="Transaction Volume" value={stats.totalOrders.toLocaleString()} change="+12.2%" icon={<ShoppingBag className="size-5" />} />
        <StatCard title="Active Network" value={stats.totalUsers.toLocaleString()} change="+8.1%" icon={<Users className="size-5" />} />
        <StatCard title="Avg Transaction" value={`$${Math.round(stats.avgOrderValue).toLocaleString()}`} change="+4.3%" icon={<TrendingUp className="size-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <Card className="lg:col-span-2 glass-panel border-none p-6 overflow-hidden">
          <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
             <div>
                <CardTitle className="text-xl font-black text-white tracking-tight uppercase">Fiscal Velocity</CardTitle>
                <CardDescription className="text-luxe-on-surface-variant">Annual revenue visualization.</CardDescription>
             </div>
             <Badge className="bg-luxe-primary/10 text-luxe-primary border-luxe-primary/20 text-[10px] font-bold px-3 py-1 uppercase">Bullish</Badge>
          </CardHeader>
          <div className="h-[350px] w-full mt-6 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.salesData}>
                <defs>
                  <linearGradient id="luxeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" vertical={false} />
                <XAxis dataKey="name" stroke="#555" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#555" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0F0F0F", border: "1px solid #333", color: "#FFF", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }} 
                  itemStyle={{ color: "#D4AF37" }}
                />
                <Area type="monotone" dataKey="sales" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#luxeGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-panel border-none p-6">
          <CardHeader className="px-0 pt-0">
             <CardTitle className="text-xl font-black text-white tracking-tight uppercase">Live Stream</CardTitle>
             <CardDescription className="text-luxe-on-surface-variant">Real-time system event log.</CardDescription>
          </CardHeader>
          <div className="space-y-6 mt-6">
            {stats.recentActivities.map((act) => (
              <div key={act.id} className="flex gap-4 group">
                 <div className="relative">
                    <div className="size-10 rounded-xl bg-luxe-surface-container-high border border-luxe-outline-variant/20 flex items-center justify-center text-luxe-primary group-hover:scale-110 transition-transform">
                       {act.type === "order" && <ShoppingBag className="size-4" />}
                       {act.type === "inventory" && <Package className="size-4" />}
                       {act.type === "user" && <Users className="size-4" />}
                    </div>
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-px h-10 bg-luxe-outline-variant/10 hidden last:hidden" />
                 </div>
                 <div className="flex-1">
                    <div className="flex justify-between items-start">
                       <p className="text-sm font-bold text-white tracking-wide">{act.title}</p>
                       <span className="text-[10px] text-luxe-on-surface-variant font-medium">{act.time}</span>
                    </div>
                    <p className="text-xs text-luxe-on-surface-variant mt-0.5">{act.subtitle}</p>
                 </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 rounded-xl border border-luxe-outline-variant/30 text-xs font-black text-luxe-on-surface-variant hover:text-white hover:bg-luxe-primary/5 transition-all uppercase tracking-[0.2em]">
            Access Archives
          </button>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon }: { title: string; value: string; change: string; icon: React.ReactNode }) {
  return (
    <Card className="glass-panel border-none p-6 group hover:translate-y-[-4px] transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="size-10 rounded-xl bg-luxe-primary/10 flex items-center justify-center text-luxe-primary group-hover:bg-luxe-primary group-hover:text-luxe-on-primary transition-colors">
          {icon}
        </div>
        <Badge className="bg-luxe-primary/5 text-luxe-primary border hover:bg-luxe-primary/10 border-luxe-primary/20 text-[10px] py-1">
           {change}
        </Badge>
      </div>
      <p className="text-[10px] font-bold text-luxe-on-surface-variant uppercase tracking-[0.2em]">{title}</p>
      <p className="text-3xl font-black text-white mt-1 tracking-tighter italic">{value}</p>
    </Card>
  );
}