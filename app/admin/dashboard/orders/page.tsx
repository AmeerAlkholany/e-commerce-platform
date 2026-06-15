"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  X,
  Check,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  Package,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ─── Types ─────────────────────────────────────────────
interface OrderUser { id: number; name: string; email: string; }
interface OrderItemProduct { id: number; name: string; price: number; image_url: string | null; }
interface OrderItem { id: number; products: OrderItemProduct; quantity: number; price: number; }
interface Payment { id: number; method: string | null; status: string | null; transaction_id: string | null; }
interface Order { id: number; users: OrderUser | null; total: number; status: string; created_at: string; order_items: OrderItem[]; payments: Payment[]; }

interface Toast { id: string; message: string; type: "success" | "error" | "warning"; }
function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = (message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => { setToasts((prev) => prev.filter((t) => t.id !== id)); }, 4000);
  };
  return { toasts, addToast, removeToast: (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)) };
}

function OrderStatusBadge({ status }: { status: string }) {
  const configs: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    pending: { bg: "bg-luxe-tertiary-fixed", text: "text-luxe-on-tertiary", icon: <Clock className="size-3" /> },
    paid: { bg: "bg-luxe-primary/10", text: "text-luxe-primary", icon: <CreditCard className="size-3" /> },
    shipped: { bg: "bg-sky-500/10", text: "text-sky-400", icon: <Truck className="size-3" /> },
    delivered: { bg: "bg-emerald-500/10", text: "text-emerald-400", icon: <CheckCircle2 className="size-3" /> },
    cancelled: { bg: "bg-luxe-error-container", text: "text-luxe-on-error-container", icon: <XCircle className="size-3" /> },
  };
  const config = configs[status] || configs.pending;
  return <Badge className={cn("text-[10px] font-bold uppercase py-0.5 px-2 rounded-md flex items-center gap-1 border-none", config.bg, config.text)}>{config.icon} {status}</Badge>;
}

export default function OrdersPage() {
  const { toasts, addToast, removeToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => { fetchOrders(); }, [statusFilter]);
  useEffect(() => { const t = setTimeout(fetchOrders, 300); return () => clearTimeout(t); }, [search]);

  async function fetchOrders() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (search) params.append("search", search);
      params.append("page", page.toString());
      params.append("pageSize", pageSize.toString());

      const res = await fetch(`/api/orders?${params.toString()}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setOrders(data.orders || []);
      setTotalPages(data.pagination?.pages || 1);
      setTotalCount(data.pagination?.total || 0);
    } catch (e: any) { addToast(e.message, "error"); }
    finally { setLoading(false); }
  }

  async function updateStatus(id: number, status: string) {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      if (!res.ok) throw new Error("Failed");
      const updated = await res.json();
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
      addToast(`Order #${id} updated`, "success");
    } catch (e: any) { addToast(e.message, "error"); }
    finally { setUpdatingId(null); }
  }

  // const paginated = orders; // Now server-side
  // const totalPages = Math.ceil(orders.length / pageSize) || 1;

  return (
    <div className="space-y-8">
      {/* Header */}        
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              Order <span className="text-luxe-primary">Management</span>
            </h1>
            <p className="text-luxe-on-surface-variant text-sm mt-1 font-medium tracking-wide">
              Track and manage client acquisitions.
            </p>
          </div>

      <Card className="glass-panel border-none">
        <CardHeader className="border-b border-luxe-outline-variant/20 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-2">
            {["all", "pending", "paid", "shipped", "delivered", "cancelled"].map(s => (
              <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm" onClick={() => { setStatusFilter(s); setPage(1); }} className={cn("text-[10px] h-8 font-bold uppercase tracking-wider", statusFilter === s ? "bg-luxe-primary text-luxe-on-primary" : "border-luxe-outline-variant")}>{s}</Button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-luxe-outline size-4" />
            <input type="text" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-4 py-2 w-full bg-luxe-surface border border-luxe-outline-variant/40 rounded-lg text-sm text-white" />
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? <div className="flex items-center justify-center py-20"><Loader2 className="size-8 text-luxe-primary animate-spin" /></div> : (
            <>
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-luxe-surface-container/50 border-b border-luxe-outline-variant/20 text-[11px] font-bold tracking-widest text-luxe-on-surface-variant uppercase">
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Customer</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Total</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} className="border-b border-luxe-outline-variant/10 hover:bg-luxe-surface-container/10 transition-all">
                      <td className="py-4 px-6 font-mono text-xs">
                      <Link href={`/admin/dashboard/orders/${o.id}`} className="group">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-luxe-primary font-bold">
                          ORD-{o.id}
                          <ExternalLink className="size-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Link>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-white font-semibold">{o.users?.name || "Guest"}</span>
                          <span className="text-[11px] text-luxe-on-surface-variant">{o.users?.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-luxe-on-surface-variant text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-luxe-primary font-bold">${Number(o.total).toLocaleString()}</td>
                      <td className="py-4 px-6"><OrderStatusBadge status={o.status} /></td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild variant="ghost" size="sm" className="text-luxe-primary hover:bg-luxe-primary/10 h-8 px-3">
                            <Link href={`/admin/dashboard/orders/${o.id}`}>
                              <Eye className="size-4" />
                            </Link>
                          </Button>
                          <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} disabled={updatingId === o.id} className="bg-luxe-surface border border-luxe-outline-variant/30 text-[10px] uppercase font-bold py-1 px-2 rounded outline-none focus:border-luxe-primary">
                            {["pending", "paid", "shipped", "delivered", "cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-luxe-outline-variant/20">
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-luxe-on-surface-variant">Page {page} of {totalPages}</span>
                    <span className="text-[10px] bg-luxe-primary/10 text-luxe-primary px-2 py-0.5 rounded font-bold uppercase tracking-widest">{totalCount} total orders</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="h-8 w-8 p-0 border-luxe-outline-variant"><ChevronLeft className="size-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="h-8 w-8 p-0 border-luxe-outline-variant"><ChevronRight className="size-4" /></Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
