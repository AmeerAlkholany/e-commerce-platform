"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users,
  Loader2,
  FileText,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ─── Types ─────────────────────────────────────────────
interface ReportData {
  salesByMonth: { name: string; sales: number }[];
  topProducts: { id: number; name: string; quantity: number; revenue: number }[];
  topCustomers: { id: number; name: string; email: string; ordersCount: number; totalSpent: number }[];
  categoryData: { name: string; value: number }[];
  totalOrders: number;
  totalRevenue: number;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchReports(); }, []);

  async function fetchReports() {
    try {
      setLoading(true);
      const res = await fetch("/api/reports");
      if (!res.ok) throw new Error("Failed");
      setReports(await res.json());
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  const COLORS = ["#D4AF37", "#2C2C2C", "#C0C0C0", "#F5F5F5", "#8E7618"];

  if (loading) return <div className="flex items-center justify-center py-40"><Loader2 className="size-10 text-luxe-primary animate-spin" /></div>;
  if (!reports) return <div className="text-center py-40 text-luxe-on-surface-variant">No data available.</div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Intelligence <span className="text-luxe-primary">Reports</span></h1>
            <p className="text-luxe-on-surface-variant text-sm mt-1">Cross-dimensional business analytics.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Acquisitions" value={reports.totalOrders.toLocaleString()} icon={<ShoppingBag className="size-4" />} />
        <StatCard title="Gross Portfolio Value" value={`$${reports.totalRevenue.toLocaleString()}`} icon={<DollarSign className="size-4" />} />
        <StatCard title="Top Client Loyalty" value={reports.topCustomers[0]?.name || "N/A"} icon={<Users className="size-4" />} />
        <StatCard title="Market Efficiency" value="94.2%" icon={<TrendingUp className="size-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-panel border-none p-6">
          <CardHeader className="px-0 pt-0">
             <CardTitle className="text-lg font-bold text-white uppercase tracking-wider">Revenue Trajectory</CardTitle>
             <CardDescription className="text-luxe-on-surface-variant">Monthly fiscal performance summary.</CardDescription>
          </CardHeader>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reports.salesByMonth}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" vertical={false} />
                <XAxis dataKey="name" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #333", color: "#FFF", borderRadius: "8px" }} />
                <Area type="monotone" dataKey="sales" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass-panel border-none p-6">
          <CardHeader className="px-0 pt-0">
             <CardTitle className="text-lg font-bold text-white uppercase tracking-wider">Categorical Dominance</CardTitle>
             <CardDescription className="text-luxe-on-surface-variant">Inventory distribution across sectors.</CardDescription>
          </CardHeader>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={reports.categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {reports.categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="glass-panel border-none p-6">
            <CardHeader className="px-0 pt-0">
               <CardTitle className="text-lg font-bold text-white uppercase tracking-wider">Apex Performers</CardTitle>
               <CardDescription className="text-luxe-on-surface-variant">Top inventory pieces by revenue generated.</CardDescription>
            </CardHeader>
            <div className="mt-4 space-y-4">
               {reports.topProducts.map((p, i) => (
                  <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-luxe-surface-container/20 border border-luxe-outline-variant/10">
                     <div className="flex items-center gap-4">
                        <span className="text-luxe-primary font-black text-xl opacity-20">0{i+1}</span>
                        <div>
                           <p className="text-white font-bold">{p.name}</p>
                           <p className="text-xs text-luxe-on-surface-variant">{p.quantity} units sold</p>
                        </div>
                     </div>
                     <p className="text-luxe-primary font-bold">${p.revenue.toLocaleString()}</p>
                  </div>
               ))}
            </div>
         </Card>

         <Card className="glass-panel border-none p-6">
            <CardHeader className="px-0 pt-0">
               <CardTitle className="text-lg font-bold text-white uppercase tracking-wider">Vanguard Clients</CardTitle>
               <CardDescription className="text-luxe-on-surface-variant">High-net-worth individuals by total investment.</CardDescription>
            </CardHeader>
            <div className="mt-4 space-y-4">
               {reports.topCustomers.map((c, i) => (
                  <div key={c.id} className="flex items-center justify-between p-4 rounded-xl bg-luxe-surface-container/20 border border-luxe-outline-variant/10">
                     <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-luxe-primary/10 flex items-center justify-center text-luxe-primary font-bold">{c.name.charAt(0)}</div>
                        <div>
                           <p className="text-white font-bold">{c.name}</p>
                           <p className="text-xs text-luxe-on-surface-variant">{c.ordersCount} acquisitions</p>
                        </div>
                     </div>
                     <p className="text-luxe-primary font-bold">${c.totalSpent.toLocaleString()}</p>
                  </div>
               ))}
            </div>
         </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="glass-panel border-none p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="size-8 rounded-lg bg-luxe-primary/10 flex items-center justify-center text-luxe-primary">{icon}</div>
        <p className="text-[10px] font-bold text-luxe-on-surface-variant uppercase tracking-widest">{title}</p>
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      <div className="mt-2 flex items-center gap-1.5">
        <TrendingUp className="size-3 text-luxe-primary" />
        <span className="text-[11px] text-luxe-primary font-bold">+12.5% vs last month</span>
      </div>
    </Card>
  );
}
