"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  X,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRightLeft,
  ExternalLink,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// --- Types ---
interface User { id: number; name: string; email: string; }
interface Order { id: number; users: User | null; total: number; }
interface Payment {
  id: number;
  order_id: number;
  method: string | null;
  status: string | null;
  transaction_id: string | null;
  orders: Order;
}

interface Toast { id: string; message: string; type: "success" | "error"; }

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    pending: { bg: "bg-amber-500/10", text: "text-amber-500", icon: <Clock className="size-3" /> },
    paid: { bg: "bg-emerald-500/10", text: "text-emerald-500", icon: <CheckCircle2 className="size-3" /> },
    failed: { bg: "bg-rose-500/10", text: "text-rose-500", icon: <XCircle className="size-3" /> },
  };
  const config = configs[status] || configs.pending;
  return (
    <Badge className={cn("text-[10px] font-bold uppercase py-0.5 px-2 rounded-md flex items-center gap-1 border-none", config.bg, config.text)}>
      {config.icon} {status}
    </Badge>
  );
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  useEffect(() => { fetchPayments(); }, [statusFilter]);
  useEffect(() => { const t = setTimeout(fetchPayments, 300); return () => clearTimeout(t); }, [search]);

  async function fetchPayments() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (search) params.append("search", search);
      params.append("page", page.toString());
      params.append("pageSize", pageSize.toString());

      const res = await fetch(`/api/payments?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPayments(data.payments || []);
      setTotalPages(data.pagination?.pages || 1);
      setTotalCount(data.pagination?.total || 0);
    } catch (e: any) {
      addToast(e.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function updateField(id: number, field: string, value: string) {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/payments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value })
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      setPayments(prev => prev.map(p => p.id === id ? updated : p));
      addToast(`Payment #${id} updated`, "success");
    } catch (e: any) {
      addToast(e.message, "error");
    } finally {
      setUpdatingId(null);
    }
  }

  const stats = {
    total: totalCount,
    settled: payments.filter(p => p.status === "paid").length,
    pending: payments.filter(p => p.status === "pending").length,
    revenue: payments.filter(p => p.status === "paid").reduce((acc, p) => acc + Number(p.orders.total), 0)
  };

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
      

        {/* Header */}        
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              Transaction <span className="text-luxe-primary">Ledger</span>
            </h1>
            <p className="text-luxe-on-surface-variant text-sm mt-1 font-medium tracking-wide">
              Audit and regulate financial flows.
            </p>
          </div>


          <div className="flex gap-4 w-full lg:w-auto">
            {[
              { label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500" },
              { label: "Settled", value: stats.settled, icon: CheckCircle2, color: "text-luxe-primary" },
              { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-500" }
            ].map((s, i) => (
              <div key={i} className="glass-panel px-4 py-3 rounded-xl flex-1 lg:flex-none lg:min-w-32 border border-luxe-outline-variant/10">
                <p className="text-[9px] uppercase font-bold tracking-widest text-luxe-on-surface-variant opacity-70 mb-1">{s.label}</p>
                <div className="flex items-center gap-2">
                  <s.icon className={cn("size-3.5", s.color)} />
                  <span className="text-white font-black text-lg leading-none">{s.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card className="glass-panel border-none overflow-hidden">
          <CardHeader className="border-b border-luxe-outline-variant/20 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-2">
              {["all", "pending", "paid", "failed"].map(s => (
                <Button
                  key={s}
                  variant={statusFilter === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={cn("text-[10px] h-8 font-bold uppercase tracking-wider rounded-lg px-4 border-luxe-outline-variant/50",
                    statusFilter === s ? "bg-luxe-primary text-luxe-on-primary" : "text-luxe-on-surface-variant hover:text-white")
                  }
                >
                  {s}
                </Button>
              ))}
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-luxe-outline size-4" />
              <input
                type="text"
                placeholder="Search IDs or Customers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 w-full bg-luxe-surface/50 border border-luxe-outline-variant/40 rounded-xl text-sm text-white placeholder:text-luxe-outline/50 transition-all focus:border-luxe-primary/50 outline-none"
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-3">
                <Loader2 className="size-10 text-luxe-primary animate-spin" />
                <p className="text-xs font-bold tracking-widest text-luxe-on-surface-variant uppercase animate-pulse">Syncing Ledger...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-luxe-surface-container/30 border-b border-luxe-outline-variant/20 text-[10px] font-black tracking-[0.15em] text-luxe-on-surface-variant uppercase">
                      <th className="py-5 px-6">Transaction</th>
                      <th className="py-5 px-6">Customer</th>
                      <th className="py-5 px-6">Order</th>
                      <th className="py-5 px-6">Method</th>
                      <th className="py-5 px-6">Status</th>
                      <th className="py-5 px-6 text-right">Reference ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {payments.map(p => (
                        <motion.tr
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          key={p.id}
                          className="border-b border-luxe-outline-variant/10 hover:bg-luxe-primary/5 transition-all group"
                        >
                          <td className="py-5 px-6">
                            <div className="flex items-center gap-3">
                              <div className="size-8 rounded-lg bg-luxe-surface-container flex items-center justify-center border border-luxe-outline-variant/20 group-hover:border-luxe-primary/30">
                                <ArrowRightLeft className="size-4 text-luxe-on-surface-variant group-hover:text-luxe-primary" />
                              </div>
                              <span className="font-mono text-[11px] font-bold text-white">#PAY-{p.id.toString().padStart(4, '0')}</span>
                            </div>
                          </td>
                          <td className="py-5 px-6">
                            <div className="flex flex-col">
                              <span className="text-white font-bold text-sm tracking-tight">{p.orders.users?.name || "Guest"}</span>
                              <span className="text-[10px] text-luxe-on-surface-variant font-medium">{p.orders.users?.email}</span>
                            </div>
                          </td>
                          <td className="py-5 px-6">
                            <Link href={`/admin/dashboard/orders/${p.orders.id}`}>
                              <div className="flex items-center gap-1.5 font-mono text-[11px] text-luxe-primary font-bold">
                                ORD-{p.orders.id}
                                <ExternalLink className="size-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </Link>
                          </td>
                          <td className="py-5 px-6">
                            <select
                              value={p.method || ""}
                              onChange={e => updateField(p.id, "method", e.target.value)}
                              disabled={updatingId === p.id}
                              className="bg-transparent border-none text-[10px] font-black uppercase text-luxe-on-surface-variant hover:text-white cursor-pointer outline-none focus:text-luxe-primary transition-colors"
                            >
                              <option value="card" className="bg-luxe-surface">CARD</option>
                              <option value="paypal" className="bg-luxe-surface">PAYPAL</option>
                              <option value="cash" className="bg-luxe-surface">CASH</option>
                            </select>
                          </td>
                          <td className="py-5 px-6">
                            <select
                              value={p.status || "pending"}
                              onChange={e => updateField(p.id, "status", e.target.value)}
                              disabled={updatingId === p.id}
                              className="hidden" // Native select hidden, clicking badge would be better but keeping it simple first
                              id={`status-${p.id}`}
                            />
                            <div className="flex items-center gap-2">
                              <StatusBadge status={p.status || "pending"} />
                              <select
                                value={p.status || "pending"}
                                onChange={e => updateField(p.id, "status", e.target.value)}
                                disabled={updatingId === p.id}
                                className="bg-transparent border-none text-[8px] font-bold uppercase text-luxe-outline hover:text-white cursor-pointer outline-none w-4"
                              >
                                <option value="pending" className="bg-luxe-surface">PENDING</option>
                                <option value="paid" className="bg-luxe-surface">PAID</option>
                                <option value="failed" className="bg-luxe-surface">FAILED</option>
                              </select>
                            </div>
                          </td>
                          <td className="py-5 px-6 text-right">
                            <input
                              type="text"
                              defaultValue={p.transaction_id || ""}
                              onBlur={e => e.target.value !== p.transaction_id && updateField(p.id, "transaction_id", e.target.value)}
                              placeholder="Set Ref ID..."
                              className="bg-transparent border-b border-transparent hover:border-luxe-outline-variant/30 focus:border-luxe-primary/50 text-right font-mono text-[10px] text-luxe-on-surface-variant focus:text-white outline-none w-32 transition-all"
                            />
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-8 py-5 border-t border-luxe-outline-variant/10 bg-luxe-surface-container/20">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-luxe-on-surface-variant uppercase tracking-widest">
                      <span>Audit Page {page} <span className="opacity-30">/</span> {totalPages}</span>
                      <span className="px-2 py-0.5 rounded bg-luxe-primary/10 text-luxe-primary">{totalCount} Records</span>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="h-8 w-8 p-0 rounded-lg border-luxe-outline-variant/40 hover:bg-luxe-primary/10 hover:text-luxe-primary transition-all"><ChevronLeft className="size-4" /></Button>
                      <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="h-8 w-8 p-0 rounded-lg border-luxe-outline-variant/40 hover:bg-luxe-primary/10 hover:text-luxe-primary transition-all"><ChevronRight className="size-4" /></Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Toast Notifications */}
        <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-2">
          <AnimatePresence>
            {toasts.map(t => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={cn("px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 min-w-64 backdrop-blur-md",
                  t.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400")}
              >
                {t.type === "success" ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
                <span className="text-xs font-bold tracking-wide">{t.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      );
}
