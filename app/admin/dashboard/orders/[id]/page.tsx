"use client";

import React, { use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ChevronLeft, 
  ShoppingBag, 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Truck,
  ArrowLeft,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// --- Components ---
function OrderStatusBadge({ status }: { status: string }) {
  const configs: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    pending: { bg: "bg-amber-500/10", text: "text-amber-500", icon: <Clock className="size-3" /> },
    paid: { bg: "bg-luxe-primary/10", text: "text-luxe-primary", icon: <CreditCard className="size-3" /> },
    shipped: { bg: "bg-sky-500/10", text: "text-sky-400", icon: <Truck className="size-3" /> },
    delivered: { bg: "bg-emerald-500/10", text: "text-emerald-400", icon: <CheckCircle2 className="size-3" /> },
    cancelled: { bg: "bg-rose-500/10", text: "text-rose-500", icon: <XCircle className="size-3" /> },
  };
  const config = configs[status] || configs.pending;
  return (
    <Badge className={cn("text-[10px] font-black uppercase py-1 px-3 rounded-lg flex items-center gap-1.5 border-none", config.bg, config.text)}>
      {config.icon} {status}
    </Badge>
  );
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const orderId = parseInt(unwrappedParams.id);

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) throw new Error("Order not found");
      return res.json();
    }
  });

  const statusMutation = useMutation({
    mutationFn: async (status: string) => {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["order", orderId], updated);
      toast.success(`Protocol: Order status set to ${updated.status.toUpperCase()}`);
    }
  });

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="size-12 text-luxe-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-luxe-on-surface-variant animate-pulse">Loading ORD-{orderId}  Data...</p>
    </div>
  );

  if (error || !order) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="size-20 rounded-3xl bg-rose-500/10 flex items-center justify-center text-rose-500 animate-pulse">
        <AlertTriangle className="size-10" />
      </div>
      <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Record Non-Existent</h2>
      <Button onClick={() => router.push("/admin/orders")} variant="outline" className="h-10 border-white/5 rounded-xl px-6 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
        <ArrowLeft className="size-4" /> Return to Catalog
      </Button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <Button variant="outline" onClick={() => router.back()} className="h-12 w-12 p-0 border-luxe-outline-variant/30 bg-luxe-surface rounded-2xl group overflow-hidden">
            <ChevronLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase underline decoration-luxe-primary/30 decoration-4 underline-offset-8">
                ORD-{order.id}
              </h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-luxe-on-surface-variant text-[11px] font-bold uppercase tracking-widest mt-3">
              Initialized: {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-luxe-surface-container/20 p-2 rounded-2xl border border-white/5">
          {["pending", "paid", "shipped", "delivered"].map((s) => (
            <Button
              key={s}
              size="sm"
              onClick={() => statusMutation.mutate(s)}
              disabled={statusMutation.isPending || order.status === s}
              className={cn(
                "h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                order.status === s 
                  ? "bg-luxe-primary text-luxe-on-primary shadow-lg shadow-luxe-primary/20" 
                  : "bg-transparent text-luxe-on-surface-variant hover:text-white hover:bg-white/5"
              )}
            >
              {s}
            </Button>
          ))}
          <div className="w-px h-6 bg-white/10 mx-1" />
          <Button
              size="sm"
              variant="ghost"
              onClick={() => statusMutation.mutate("cancelled")}
              disabled={statusMutation.isPending || order.status === "cancelled"}
              className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-400 hover:bg-rose-500/10"
            >
              Cancel
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Registry of Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-panel border-none p-8 bg-luxe-surface/30 rounded-[40px] overflow-hidden group">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Inventory Manifest</h4>
                <p className="text-[10px] text-luxe-on-surface-variant mt-1">Verified items scheduled for fulfillment.</p>
              </div>
              <ShoppingBag className="size-6 text-luxe-primary/40 group-hover:text-luxe-primary transition-colors" />
            </div>

            <div className="space-y-4">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/[0.08] transition-all">
                  <div className="flex items-center gap-6">
                    <div className="size-16 rounded-2xl bg-luxe-surface border border-white/5 overflow-hidden">
                      {item.products?.image_url ? (
                        <img src={item.products.image_url} alt="" className="size-full object-cover" />
                      ) : (
                        <div className="size-full flex items-center justify-center text-luxe-on-surface-variant"><Package className="size-6" /></div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-tight italic">{item.products?.name}</p>
                      <p className="text-[10px] font-semibold text-luxe-on-surface-variant mt-1.5 uppercase tracking-widest">
                        Unit Value: ${parseFloat(item.price).toLocaleString()} <span className="mx-2 opacity-30">|</span> Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-black text-luxe-primary">${(parseFloat(item.price) * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-10 border-t border-white/5 flex flex-col items-end gap-2">
              <p className="text-[10px] font-black text-luxe-on-surface-variant uppercase tracking-[0.3em] opacity-60">Consolidated Transaction Value</p>
              <p className="text-5xl font-black text-white italic tracking-tighter leading-none">${parseFloat(order.total).toLocaleString()}</p>
            </div>
          </Card>
        </div>

        {/* Sidebar: Intelligence Context */}
        <div className="space-y-8">
          {/* Acquirer Info */}
          <Card className="glass-panel border-none p-8 bg-luxe-surface/30 rounded-[40px] space-y-8">
            <div>
              <p className="text-[10px] font-black text-luxe-primary uppercase tracking-[0.3em] mb-6">Acquirer Registry</p>
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-gradient-to-br from-luxe-primary/20 to-transparent flex items-center justify-center border border-luxe-primary/20 shadow-2xl">
                  <User className="size-6 text-luxe-primary" />
                </div>
                <div>
                  <h5 className="text-lg font-black text-white uppercase italic tracking-tight">{order.users?.name || "GUEST_ENTITY"}</h5>
                  <p className="text-[10px] font-bold text-luxe-on-surface-variant uppercase tracking-widest mt-1">ID: USR-{order.users?.id}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-2">
              <div className="space-y-2">
                <p className="text-[9px] font-black text-luxe-on-surface-variant uppercase tracking-[0.2em] opacity-40">Communication Line</p>
                <p className="text-xs font-bold text-white tracking-wide">{order.users?.email}</p>
              </div>
              <div className="flex items-center gap-2 group cursor-pointer" onClick={() => router.push(`/admin/users/${order.users?.id}`)}>
                <span className="text-[10px] font-black text-luxe-primary uppercase tracking-widest">Go to Profile</span>
                <ChevronLeft className="size-3 text-luxe-primary group-hover:translate-x-1 transition-transform rotate-180" />
              </div>
            </div>
          </Card>

          {/* Payment Status */}
          <Card className="glass-panel border-none p-8 bg-luxe-surface/30 rounded-[40px] space-y-6">
            <p className="text-[10px] font-black text-luxe-primary uppercase tracking-[0.3em]">Financial Telemetry</p>
            <div className="space-y-4">
              {order.payments?.length > 0 ? order.payments.map((p: any) => (
                <div key={p.id} className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-[9px] font-black uppercase text-luxe-primary border-luxe-primary/20 bg-luxe-primary/5">{p.status}</Badge>
                    <span className="text-[10px] font-mono text-white opacity-40">#PAY-{p.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="size-3.5 text-luxe-on-surface-variant" />
                      <span className="text-[11px] font-bold text-white uppercase">{p.method}</span>
                    </div>
                  </div>
                  {p.transaction_id && (
                    <div className="pt-2 border-t border-white/5">
                      <p className="text-[9px] font-black text-luxe-on-surface-variant uppercase tracking-widest opacity-40 mb-1">Gateway Ref</p>
                      <p className="text-[11px] font-mono text-white truncate">{p.transaction_id}</p>
                    </div>
                  )}
                </div>
              )) : (
                <div className="p-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                   <Clock className="size-8 text-luxe-on-surface-variant/20 mx-auto mb-3" />
                   <p className="text-[10px] font-black text-luxe-on-surface-variant uppercase tracking-widest">Awaiting Transaction...</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
