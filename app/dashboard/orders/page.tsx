"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RefreshCcw,
  ShoppingBag,
  Filter,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STAGGER = {
  container: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } },
  item: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }
};

export default function ClientOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (search) params.append("search", search);
      params.append("page", page.toString());
      params.append("pageSize", pageSize.toString());

      const res = await fetch(`/api/client/orders?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch acquisitions");
      const data = await res.json();
      setOrders(data.orders || []);
      setTotalPages(data.pagination?.pages || 1);
      setTotalCount(data.pagination?.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [statusFilter, page]);
  useEffect(() => { const t = setTimeout(fetchOrders, 300); return () => clearTimeout(t); }, [search]);

  return (
    <motion.div
      variants={STAGGER.container}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12"
    >
      {/* Header */}
      <motion.div variants={STAGGER.item} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-[0.8] mb-2">
            Acquisition <span className="text-luxe-primary">History</span>
          </h1>
          <p className="text-luxe-on-surface-variant text-sm mt-1 font-medium tracking-wide">
             Complete record of your global transactions and dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2">
           <Button onClick={() => router.push("/products")} className="h-10 bg-luxe-primary text-luxe-on-primary rounded-xl px-6 font-bold text-xs uppercase tracking-widest hover:bg-luxe-primary/90">
              New Acquisition
           </Button>
           <Button onClick={fetchOrders} variant="outline" className="h-10 size-10 bg-white/5 border-white/10 text-white rounded-xl p-0 hover:bg-white/10">
              <RefreshCcw className={loading ? "animate-spin size-3.5" : "size-3.5"} />
           </Button>
        </div>
      </motion.div>

      {/* Main Table Card */}
      <motion.div variants={STAGGER.item}>
         <Card className="glass-panel border-none">
           <CardHeader className="border-b border-luxe-outline-variant/20 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
               {["all", "pending", "paid", "shipped", "delivered", "cancelled"].map(s => (
                 <Button 
                    key={s} 
                    variant={statusFilter === s ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => { setStatusFilter(s); setPage(1); }} 
                    className={cn(
                        "text-[10px] h-8 font-black uppercase tracking-widest rounded-lg px-4 border-white/10", 
                        statusFilter === s ? "bg-luxe-primary text-luxe-on-primary hover:bg-luxe-primary/90" : "text-luxe-on-surface-variant hover:text-white"
                    )}
                 >
                    {s}
                 </Button>
               ))}
             </div>
             <div className="relative w-full sm:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-luxe-on-surface-variant/50 size-4" />
               <input 
                  type="text" 
                  placeholder="ID or Asset Name..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  className="pl-9 pr-4 py-2 w-full bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-luxe-primary/50 transition-colors placeholder:text-white/20" 
               />
             </div>
           </CardHeader>
           <CardContent className="p-0 overflow-x-auto">
             {loading && orders.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <Loader2 className="size-8 text-luxe-primary animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-luxe-on-surface-variant">Decrypting Order Vault...</span>
               </div>
             ) : (
               <>
                 <table className="w-full text-sm text-left">
                   <thead>
                     <tr className="bg-luxe-surface-container/30 border-b border-luxe-outline-variant/20 text-[10px] font-black tracking-[0.2em] text-luxe-on-surface-variant uppercase">
                       <th className="py-4 px-6">ID</th>
                       <th className="py-4 px-6">Portfolio Assets</th>
                       <th className="py-4 px-6">Dispatch Date</th>
                       <th className="py-4 px-6">Total Value</th>
                       <th className="py-4 px-6">Status Indicator</th>
                       <th className="py-4 px-6 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-luxe-outline-variant/10">
                     {orders.map(o => (
                       <tr key={o.id} className="hover:bg-luxe-surface-container/10 transition-all group">
                         <td className="py-4 px-6 font-mono text-[11px] text-luxe-primary font-bold">ORD-{o.id}</td>
                         <td className="py-4 px-6">
                           <div className="flex flex-col">
                             <span className="text-white font-bold text-xs uppercase tracking-tight">{o.order_items[0]?.products?.name || "Premium Asset"}</span>
                             <span className="text-[10px] text-luxe-on-surface-variant font-medium">
                                {o.order_items.length} item{o.order_items.length > 1 ? 's' : ''} in this acquisition
                             </span>
                           </div>
                         </td>
                         <td className="py-4 px-6 text-luxe-on-surface-variant text-xs font-medium">{new Date(o.created_at).toLocaleDateString()}</td>
                         <td className="py-4 px-6 text-white font-black">${Number(o.total).toLocaleString()}</td>
                         <td className="py-4 px-6">
                            <Badge className={cn(
                                "text-[9px] font-black uppercase py-0.5 px-2 rounded-sm border-none shadow-sm",
                                o.status === "delivered" ? "bg-emerald-500/10 text-emerald-400" :
                                o.status === "cancelled" ? "bg-red-500/10 text-red-400" : "bg-luxe-primary/10 text-luxe-primary"
                             )}>
                                {o.status}
                             </Badge>
                         </td>
                         <td className="py-4 px-6 text-right">
                           <Button variant="ghost" size="sm" className="text-luxe-primary hover:bg-luxe-primary/10 h-8 px-4 rounded-lg font-bold text-[10px] uppercase tracking-widest gap-2">
                             Details <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
                           </Button>
                         </td>
                       </tr>
                     ))}
                     {orders.length === 0 && (
                        <tr>
                           <td colSpan={6} className="py-24 text-center">
                              <div className="flex flex-col items-center gap-4">
                                 <ShoppingBag className="size-12 text-white/5" />
                                 <div>
                                    <h4 className="text-white font-bold uppercase tracking-widest">No Acquisitions Found</h4>
                                    <p className="text-xs text-luxe-on-surface-variant mt-1">Your order vault is currently empty.</p>
                                 </div>
                                 <Button onClick={() => router.push("/products")} variant="outline" className="mt-4 border-luxe-primary/30 text-luxe-primary hover:bg-luxe-primary/10 rounded-xl px-8 uppercase text-[10px] font-black tracking-[0.2em]">
                                    Browse Catalogue
                                 </Button>
                              </div>
                           </td>
                        </tr>
                     )}
                   </tbody>
                 </table>
                 
                 {totalPages > 1 && (
                   <div className="flex items-center justify-between px-6 py-6 border-t border-luxe-outline-variant/20">
                     <div className="flex items-center gap-4">
                       <span className="text-[10px] text-luxe-on-surface-variant font-black uppercase tracking-widest">Page {page} / {totalPages}</span>
                       <Badge variant="outline" className="bg-luxe-primary/5 text-luxe-primary border-luxe-primary/20 text-[9px] font-black uppercase tracking-[0.15em] px-3">{totalCount} RECORDS IDENTIFIED</Badge>
                     </div>
                     <div className="flex gap-3">
                       <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="h-10 w-10 p-0 border-white/10 text-white hover:bg-white/10 rounded-xl"><ChevronLeft className="size-4" /></Button>
                       <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="h-10 w-10 p-0 border-white/10 text-white hover:bg-white/10 rounded-xl"><ChevronRight className="size-4" /></Button>
                     </div>
                   </div>
                 )}
               </>
             )}
           </CardContent>
         </Card>
      </motion.div>
    </motion.div>
  );
}
