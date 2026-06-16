"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Plus,
  RefreshCcw,
  Loader2,
  Calendar,
  CreditCard,
  Bell,
  LifeBuoy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MetricScorecard } from "@/components/admin/analytics/MetricScorecard";
import { ChartBase } from "@/components/admin/analytics/ChartBase";
import { RevenueAreaChart } from "@/components/admin/analytics/IntelligenceCharts";
import { cn } from "@/lib/utils";

const STAGGER = {
  container: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } },
  item: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }
};

export default function ClientDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes] = await Promise.all([
        fetch("/api/client/stats"),
        fetch("/api/client/orders?pageSize=5")
      ]);
      
      if (!statsRes.ok || !ordersRes.ok) throw new Error("Synchronization Error");
      
      const statsData = await statsRes.json();
      const ordersData = await ordersRes.json();
      
      setData(statsData);
      setOrders(ordersData.orders || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="size-12 text-luxe-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-luxe-on-surface-variant animate-pulse">Syncing Client Portal...</p>
      </div>
    );
  }

  const summary = data?.summary || { totalOrders: 0, activeOrders: 0, completedOrders: 0, totalSpent: 0 };
  const user = data?.user || { name: "Guest", email: "" };

  return (
    <motion.div
      variants={STAGGER.container}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12"
    >
      {/* ─── Header Section ─────────────────────────────── */}
      <motion.div variants={STAGGER.item} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-[0.8] mb-2">
            Welcome back, <span className="text-luxe-primary">{user.name.split(" ")[0]}</span>
          </h1>
          <div className="flex items-center gap-3 mt-3">
             <span className="text-luxe-on-surface-variant font-medium text-xs tracking-wide">
                Synced: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
             </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <Button variant="outline" className="h-10 bg-white/5 border-white/10 text-white rounded-xl px-4 hover:bg-white/10 uppercase text-[10px] font-bold tracking-widest">
              My Portfolio
           </Button>
           <Button onClick={fetchData} variant="outline" className="h-10 size-10 bg-white/5 border-white/10 text-white rounded-xl p-0 hover:bg-white/10">
              <RefreshCcw className={loading ? "animate-spin size-3.5" : "size-3.5"} />
           </Button>
        </div>
      </motion.div>

      {/* ─── Statistics Cards ───────────────────────────── */}
      <motion.div variants={STAGGER.item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricScorecard
          label="Total Orders"
          value={summary.totalOrders.toLocaleString()}
          icon={<ShoppingBag className="size-5" />}
          isLoading={loading}
        />
        <MetricScorecard
          label="Active Orders"
          value={summary.activeOrders.toLocaleString()}
          icon={<Clock className="size-5" />}
          trend={summary.activeOrders > 0 ? 100 : 0} // Placeholder trend
          isLoading={loading}
        />
        <MetricScorecard
          label="Completed"
          value={summary.completedOrders.toLocaleString()}
          icon={<CheckCircle2 className="size-5" />}
          isLoading={loading}
        />
        <MetricScorecard
          label="Total Invested"
          value={summary.totalSpent.toLocaleString()}
          prefix="$"
          icon={<TrendingUp className="size-5" />}
          isLoading={loading}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ─── Spend Analytics ──────────────────────────── */}
        <motion.div variants={STAGGER.item} className="lg:col-span-2">
          <ChartBase
            title="Spending Evolution"
            description="Acquisition trajectory over the last 30 days"
            isLoading={loading}
          >
            <RevenueAreaChart data={data?.charts?.spendingTrend || []} />
          </ChartBase>
        </motion.div>

        {/* ─── Quick Actions ────────────────────────────── */}
        <motion.div variants={STAGGER.item} className="space-y-6">
           <h3 className="text-xs font-black uppercase tracking-widest text-luxe-on-surface-variant flex items-center gap-2">
              <ArrowRight className="size-3 text-luxe-primary" /> Quick Actions
           </h3>
           <div className="grid grid-cols-1 gap-4">
              <Button onClick={() => router.push("/products")} className="w-full h-16 bg-luxe-primary text-luxe-on-primary hover:bg-luxe-primary/90 justify-between px-6 rounded-2xl group transition-all">
                 <div className="flex items-center gap-4">
                    <div className="size-10 bg-black/10 rounded-xl flex items-center justify-center">
                       <Plus className="size-5" />
                    </div>
                    <span className="font-bold text-sm tracking-tight">Create New Order</span>
                 </div>
                 <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button onClick={() => router.push("/dashboard/orders")} variant="outline" className="w-full h-16 bg-white/5 border-white/10 text-white hover:bg-white/10 justify-between px-6 rounded-2xl group transition-all">
                 <div className="flex items-center gap-4">
                    <div className="size-10 bg-white/10 rounded-xl flex items-center justify-center text-luxe-primary">
                       <ShoppingBag className="size-5" />
                    </div>
                    <span className="font-bold text-sm tracking-tight text-luxe-on-surface">View All Orders</span>
                 </div>
                 <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button onClick={() => router.push("/profile")} variant="outline" className="w-full h-16 bg-white/5 border-white/10 text-white hover:bg-white/10 justify-between px-6 rounded-2xl group transition-all">
                 <div className="flex items-center gap-4">
                    <div className="size-10 bg-white/10 rounded-xl flex items-center justify-center">
                       <CreditCard className="size-5" />
                    </div>
                    <span className="font-bold text-sm tracking-tight text-luxe-on-surface">Payment Methods</span>
                 </div>
                 <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button variant="outline" className="w-full h-16 bg-white/5 border-white/10 text-white hover:bg-white/10 justify-between px-6 rounded-2xl group transition-all">
                 <div className="flex items-center gap-4">
                    <div className="size-10 bg-white/10 rounded-xl flex items-center justify-center text-sky-400">
                       <MessageSquare className="size-5" />
                    </div>
                    <span className="font-bold text-sm tracking-tight text-luxe-on-surface">Concierge Service</span>
                 </div>
                 <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </Button>
           </div>
        </motion.div>
      </div>

      {/* ─── Recent Dispatches (Table) ─────────────────── */}
      <motion.div variants={STAGGER.item}>
        <Card className="glass-panel border-none overflow-hidden">
          <CardHeader className="border-b border-luxe-outline-variant/20 p-6 flex flex-row justify-between items-center">
            <div>
               <CardTitle className="text-[12px] font-black uppercase tracking-widest text-white">Recent Dispatches</CardTitle>
               <p className="text-[10px] text-luxe-on-surface-variant font-medium mt-1">Latest status updates for your acquisitions.</p>
            </div>
            <Button variant="ghost" onClick={() => router.push("/dashboard/orders")} className="text-[10px] font-bold text-luxe-primary uppercase tracking-widest hover:bg-luxe-primary/10">
               Full History
            </Button>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-luxe-surface-container/50 border-b border-luxe-outline-variant/20 text-[10px] font-black tracking-[0.2em] text-luxe-on-surface-variant uppercase">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Assets</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Total</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxe-outline-variant/10">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-luxe-on-surface-variant font-medium italic text-xs">
                       No recent acquisitions identified.
                    </td>
                  </tr>
                ) : (
                  orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-luxe-surface-container/10 transition-colors group">
                      <td className="py-4 px-6 font-mono text-[11px] text-luxe-primary font-bold">ORD-{order.id}</td>
                      <td className="py-4 px-6">
                         <div className="flex flex-col gap-1">
                            <span className="text-white font-semibold text-xs truncate max-w-[200px]">
                               {order.order_items[0]?.products?.name || "Multiple Items"}
                            </span>
                            {order.order_items.length > 1 && (
                               <span className="text-[9px] text-luxe-on-surface-variant font-medium uppercase tracking-tighter">
                                  + {order.order_items.length - 1} additional items
                               </span>
                            )}
                         </div>
                      </td>
                      <td className="py-4 px-6 text-luxe-on-surface-variant text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-white font-bold">${Number(order.total).toLocaleString()}</td>
                      <td className="py-4 px-6">
                         <Badge className={cn(
                            "text-[9px] font-black uppercase py-0.5 px-2 rounded-sm border-none shadow-sm",
                            order.status === "delivered" ? "bg-emerald-500/10 text-emerald-400" :
                            order.status === "cancelled" ? "bg-red-500/10 text-red-400" : "bg-luxe-primary/10 text-luxe-primary"
                         )}>
                            {order.status}
                         </Badge>
                      </td>
                      <td className="py-4 px-6 text-right">
                         <Button variant="ghost" size="sm" className="text-luxe-primary hover:bg-luxe-primary/10 h-7 w-7 p-0 rounded-lg group-hover:scale-110 transition-transform">
                            <ExternalLink className="size-3.5" />
                         </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Notifications & Support Widget ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <motion.div variants={STAGGER.item}>
            <Card className="glass-panel border-none p-6 bg-gradient-to-br from-luxe-primary/5 to-transparent border-t border-luxe-primary/10">
               <div className="flex items-center gap-4 mb-6">
                  <div className="size-12 rounded-2xl bg-luxe-primary/10 flex items-center justify-center text-luxe-primary">
                     <Bell className="size-6" />
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-white uppercase tracking-widest">Portal Announcements</h4>
                     <p className="text-[10px] text-luxe-on-surface-variant font-medium">Global intelligence and security updates.</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex gap-4">
                     <div className="size-2 bg-luxe-primary rounded-full mt-1 shrink-0" />
                     <div className="space-y-1">
                        <span className="text-[11px] font-bold text-white tracking-tight">Security Audit Complete</span>
                        <p className="text-[10px] text-luxe-on-surface-variant font-medium leading-relaxed">Your account environment has been verified and secured for high-value transactions.</p>
                     </div>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex gap-4 opacity-70">
                     <div className="size-2 bg-luxe-on-surface-variant rounded-full mt-1 shrink-0" />
                     <div className="space-y-1">
                        <span className="text-[11px] font-bold text-white tracking-tight">New Collection Drop</span>
                        <p className="text-[10px] text-luxe-on-surface-variant font-medium leading-relaxed">The Summer Zenith catalogue is now available for VIP pre-order.</p>
                     </div>
                  </div>
               </div>
               <Button variant="link" className="text-[10px] font-bold text-luxe-primary uppercase tracking-[0.2em] mt-4 p-0 h-auto">Mark all as acknowledged</Button>
            </Card>
         </motion.div>

         <motion.div variants={STAGGER.item}>
            <Card className="glass-panel border-none p-6 bg-gradient-to-br from-sky-400/5 to-transparent border-t border-sky-400/10 h-full">
               <div className="flex items-center gap-4 mb-6">
                  <div className="size-12 rounded-2xl bg-sky-400/10 flex items-center justify-center text-sky-400">
                     <LifeBuoy className="size-6" />
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-white uppercase tracking-widest">Global Support</h4>
                     <p className="text-[10px] text-luxe-on-surface-variant font-medium">Concierge service for refined clients.</p>
                  </div>
               </div>
               <div className="flex flex-col items-center justify-center text-center py-4 space-y-4">
                  <p className="text-xs text-luxe-on-surface-variant font-medium italic">"At Luxe Global, elegance is not just a standard, <br/>but a lifelong commitment to our patrons."</p>
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl px-10 font-bold text-xs">
                     Connect with Concierge
                  </Button>
               </div>
            </Card>
         </motion.div>
      </div>
    </motion.div>
  );
}
