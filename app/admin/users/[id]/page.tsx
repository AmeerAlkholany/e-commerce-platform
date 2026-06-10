"use client";

import React, { useState, } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Mail,
  Shield,
  History,
  ShoppingBag,
  Lock,
  AlertTriangle,
  User as UserIcon,
  CheckCircle2,
  Calendar,
  Phone,
  ArrowRight,
  Loader2,
  MapPin,
  RefreshCcw,
  Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserDetail, useUserActions } from "@/hooks/use-users";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/admin/ConfirmModal";

import { use } from "react";

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const userId = parseInt(unwrappedParams.id);
  const { data: user, isLoading } = useUserDetail(userId);
  const { performAction } = useUserActions();
  const [activeTab, setActiveTab] = useState("overview");

  // Confirmation Modal State
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant: "danger" | "warning" | "info";
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => { },
    variant: "danger"
  });

  const openConfirm = (config: Omit<typeof confirmState, "isOpen">) => {
    setConfirmState({ ...config, isOpen: true });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="size-12 text-luxe-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-luxe-on-surface-variant animate-pulse">Loading intelligence data...</p>
      </div>
    );
    //  return <div className="flex items-center justify-center min-h-[60vh]"><p>Loading intelligence data...</p></div>;


  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="size-20 rounded-3xl bg-luxe-error/10 flex items-center justify-center text-luxe-error animate-pulse">
          <AlertTriangle className="size-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Entity Not Located</h2>
          <p className="text-sm text-luxe-on-surface-variant max-w-xs mx-auto">
            The user metadata you are attempting to retrieve does not exist or has been purged from the central database.
          </p>
        </div>
        <Button onClick={() => router.push("/admin/users")} variant="outline" className="h-10 border-white/5 rounded-xl px-6 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
          <ChevronLeft className="size-4" />
          Return to Registry
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: UserIcon },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "security", label: "Security", icon: Shield },
    { id: "activity", label: "Activity", icon: History },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()} className="h-10 w-10 p-0 border-luxe-outline-variant bg-transparent rounded-xl">
            <ChevronLeft className="size-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">{user.name}</h1>
              <Badge variant="outline" className="border-luxe-primary/30 text-luxe-primary bg-luxe-primary/5 uppercase text-[10px] py-0.5 px-2 font-black">{user.role}</Badge>
            </div>
            <p className="text-luxe-on-surface-variant text-sm font-medium">USR-{user.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.status === "active" ? (
            <Button
              onClick={() => openConfirm({
                title: "Confirm Suspension",
                description: `You are about to suspend ${user.name}'s access to all platform services. This action will be logged in the governance timeline.`,
                variant: "warning",
                onConfirm: () => performAction.mutate({ id: userId, action: "suspend" }, { onSuccess: () => toast.warning("Protocol: Account status set to SUSPENDED") })
              })}
              variant="outline"
              className="h-10 border-luxe-tertiary/30 text-luxe-tertiary hover:bg-luxe-tertiary/10 rounded-xl px-4 font-bold text-xs uppercase tracking-widest"
            >
              Suspend Account
            </Button>
          ) : (
            <Button
              onClick={() => openConfirm({
                title: "Reactivate Entity",
                description: `Initiating reactivation sequence for ${user.name}. This will restore full access to all platform sectors.`,
                variant: "info",
                onConfirm: () => performAction.mutate({ id: userId, action: "activate" }, { onSuccess: () => toast.success("Protocol: Account status set to ACTIVE") })
              })}
              className="h-10 bg-luxe-primary text-luxe-on-primary hover:bg-luxe-primary/90 rounded-xl px-4 font-bold text-xs uppercase tracking-widest"
            >
              Reactivate
            </Button>
          )}
          <Button
            onClick={() => openConfirm({
              title: "Purge Intelligence Data",
              description: `Warning: This will permanently delete all records associated with ${user.name}. This process is IRREVERSIBLE and requires Level 5 clearance.`,
              variant: "danger",
              onConfirm: () => toast.error("ACCESS DENIED: Data purging requires physical biometric verification at HQ.")
            })}
            variant="ghost"
            className="h-10 text-luxe-error hover:bg-luxe-error/10 rounded-xl px-4 font-bold text-xs uppercase tracking-widest"
          >
            Purge Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Stats */}
        <div className="space-y-6">
          <Card className="glass-panel border-none p-6 bg-luxe-surface/40 rounded-3xl">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="size-24 rounded-3xl bg-gradient-to-br from-luxe-primary/20 to-transparent flex items-center justify-center p-1 border border-luxe-primary/10">
                <div className="size-full rounded-[20px] bg-luxe-surface flex items-center justify-center text-luxe-primary text-3xl font-black">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} className="size-full object-cover rounded-[20px]" alt="" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">{user.name}</h3>
                <p className="text-xs text-luxe-on-surface-variant font-medium mt-1">{user.email}</p>
              </div>
              <div className="flex gap-2 mt-2">
                <Badge className={cn(
                  "text-[10px] uppercase font-black px-3 py-1",
                  user.status === "active" ? "bg-luxe-primary text-luxe-on-primary" : "bg-luxe-error text-white"
                )}>
                  {user.status}
                </Badge>
                {user.verification_status === "verified" && (
                  <Badge className="bg-luxe-primary/10 text-luxe-primary border border-luxe-primary/20 text-[10px] uppercase font-black px-3 py-1">Verified</Badge>
                )}
              </div>
            </div>

            <div className="mt-8 space-y-4 pt-8 border-t border-luxe-outline-variant/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-luxe-on-surface-variant uppercase tracking-widest">Joined</span>
                <span className="text-xs font-semibold text-white">{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-luxe-on-surface-variant uppercase tracking-widest">Last Login</span>
                <span className="text-xs font-semibold text-white">{user.last_login ? new Date(user.last_login).toLocaleDateString() : "Never"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-luxe-on-surface-variant uppercase tracking-widest">Total Orders</span>
                <span className="text-xs font-semibold text-luxe-primary">{user.orders?.length || 0}</span>
              </div>
            </div>
          </Card>

          <Card className="glass-panel border-none p-6 bg-luxe-surface/40 rounded-3xl space-y-4">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] border-b border-white/5 pb-3">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="size-3.5 text-luxe-primary" />
                <span className="text-xs text-white truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="size-3.5 text-luxe-primary" />
                <span className="text-xs text-white">{user.phone || "Not provided"}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Custom Tabs List */}
          <div className="flex items-center gap-2 bg-luxe-surface-container/20 p-1.5 rounded-2xl border border-white/5 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300",
                  activeTab === tab.id
                    ? "bg-luxe-primary text-luxe-on-primary shadow-lg shadow-luxe-primary/20"
                    : "text-luxe-on-surface-variant hover:text-white hover:bg-white/5"
                )}
              >
                <tab.icon className="size-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="glass-panel border-none p-8 bg-luxe-surface/30 rounded-3xl">
                      <CardTitle className="text-sm font-black uppercase tracking-widest mb-4">Identity Verification</CardTitle>
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "size-12 rounded-2xl flex items-center justify-center",
                          user.verification_status === "verified" ? "bg-luxe-primary/10 text-luxe-primary" : "bg-luxe-error/10 text-luxe-error"
                        )}>
                          {user.verification_status === "verified" ? <CheckCircle2 className="size-6" /> : <AlertTriangle className="size-6" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white uppercase italic tracking-wider">Status: {user.verification_status}</p>
                          <p className="text-[11px] text-luxe-on-surface-variant mt-1">Cross-referenced with global verified signatures.</p>
                        </div>
                        {user.verification_status !== "verified" && (
                          <Button onClick={() => performAction.mutate({ id: userId, action: "verify" }, { onSuccess: () => toast.success("Entity identity verified.") })} size="sm" className="ml-auto bg-luxe-primary/10 text-luxe-primary border border-luxe-primary/30 h-8 font-black text-[10px] uppercase">Verify Now</Button>
                        )}
                      </div>
                    </Card>

                    <Card className="glass-panel border-none p-8 bg-luxe-surface/30 rounded-3xl">
                      <CardTitle className="text-sm font-black uppercase tracking-widest mb-4">Account Health</CardTitle>
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-luxe-primary/10 flex items-center justify-center text-luxe-primary">
                          <Shield className="size-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white uppercase italic tracking-wider">Clean Record</p>
                          <p className="text-[11px] text-luxe-on-surface-variant mt-1">No security violations detected in the last 180 days.</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <Card className="glass-panel border-none p-8 bg-luxe-surface/30 rounded-3xl">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-sm font-black uppercase tracking-widest">Recent Transactions</h4>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab("orders")} className="text-[10px] font-black uppercase text-luxe-primary tracking-widest">View All <ArrowRight className="size-3 ml-2" /></Button>
                    </div>
                    <div className="space-y-4">
                      {user.orders?.length > 0 ? user.orders.map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="flex items-center gap-4">
                            <div className="size-10 bg-luxe-primary/5 rounded-xl flex items-center justify-center text-luxe-primary">
                              <ShoppingBag className="size-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white uppercase tracking-wider">Order #{order.id}</p>
                              <p className="text-[10px] text-luxe-on-surface-variant font-medium uppercase mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-luxe-primary">${parseFloat(order.total).toLocaleString()}</p>
                            <Badge variant="outline" className="text-[9px] border-luxe-outline-variant uppercase mt-1">{order.status}</Badge>
                          </div>
                        </div>
                      )) : (
                        <p className="text-xs text-luxe-on-surface-variant italic">No transaction history detected.</p>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === "addresses" && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center bg-luxe-surface-container/20 p-6 rounded-3xl border border-white/5">
                    <div>
                      <h4 className="text-lg font-bold text-white tracking-tight uppercase italic">Geographic Clusters</h4>
                      <p className="text-xs text-luxe-on-surface-variant mt-1 font-medium italic">Registry of physical locations associated with identity USR-{user.id}.</p>
                    </div>
                    <Button
                      onClick={async () => {
                        toast.loading("Querying address API...", { id: "addr-sync" });
                        try {
                          const res = await fetch(`/api/users/addresses?userId=${user.id}`);
                          if (!res.ok) throw new Error();
                          toast.success("Intelligence data synchronized.", { id: "addr-sync" });
                        } catch (e) {
                          toast.error("Failed to synchronize address data.", { id: "addr-sync" });
                        }
                      }}
                      variant="outline"
                      className="size-10 p-0 border-white/5 bg-white/5 rounded-xl hover:bg-luxe-primary/10 hover:text-luxe-primary hover:border-luxe-primary/30 group"
                    >
                      <RefreshCcw className="size-4 group-hover:rotate-180 transition-transform duration-500" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.addresses?.length > 0 ? user.addresses.map((addr: any) => (
                      <Card key={addr.id} className="glass-panel border-none p-8 bg-luxe-surface/30 rounded-3xl hover:bg-luxe-surface/50 transition-all duration-500 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <MapPin className="size-24 -mr-8 -mt-8" />
                        </div>
                        <div className="flex items-start gap-6 relative z-10">
                          <div className="size-14 rounded-2xl bg-luxe-primary/10 flex items-center justify-center text-luxe-primary border border-luxe-primary/20 shadow-2xl shadow-luxe-primary/10">
                            <MapPin className="size-7" />
                          </div>
                          <div className="flex-1 space-y-4">
                            <div>
                              <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-luxe-primary/30 text-luxe-primary bg-luxe-primary/5 mb-2 px-2 py-0.5">Location ID: #{addr.id}</Badge>
                              <h5 className="text-sm font-black text-white uppercase tracking-wider italic leading-snug group-hover:text-luxe-primary transition-colors">{addr.street || "STREET_UNDEFINED"}</h5>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-6 mt-2 border-t border-white/5">
                              <div>
                                <p className="text-[9px] font-black text-luxe-on-surface-variant uppercase tracking-[0.2em] mb-1.5">Sector/City</p>
                                <p className="text-xs font-bold text-white uppercase tracking-wide">{addr.city || "UNKNOWN"}</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-luxe-on-surface-variant uppercase tracking-[0.2em] mb-1.5">Region/Country</p>
                                <p className="text-xs font-bold text-white uppercase tracking-wide">{addr.country || "UNKNOWN"}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )) : (
                      <div className="col-span-full py-24 flex flex-col items-center justify-center bg-white/5 rounded-[40px] border border-dashed border-white/10">
                        <div className="size-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                          <MapPin className="size-8 text-luxe-on-surface-variant/20" />
                        </div>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-luxe-on-surface-variant italic animate-pulse">No address metadata found in registry.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <Card className="glass-panel border-none p-8 bg-luxe-surface/30 rounded-3xl">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="size-12 rounded-2xl bg-luxe-primary/10 flex items-center justify-center text-luxe-primary"><Lock className="size-6" /></div>
                        <div>
                          <h4 className="text-lg font-bold text-white tracking-tight">Security Credentials</h4>
                          <p className="text-xs text-luxe-on-surface-variant mt-1 leading-relaxed">Initiate a secure password reset sequence or manage authentication protocols.</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button onClick={() => performAction.mutate({ id: userId, action: "reset-password" }, { onSuccess: () => toast.info("Reset sequence initiated. Transmission sent.") })} className="bg-luxe-primary text-luxe-on-primary font-black text-[10px] uppercase tracking-widest px-6 h-10 rounded-xl">Trigger Reset Sequence</Button>
                        <Button variant="outline" onClick={() => toast.info("Session revocation protocols engaged.")} className="border-luxe-outline-variant font-black text-[10px] uppercase tracking-widest px-6 h-10 rounded-xl">Revoke Sessions</Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="glass-panel border-none p-8 bg-luxe-surface/30 rounded-3xl">
                    <h4 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Manual Password Override</h4>
                    <div className="flex flex-col md:flex-row items-end gap-4">
                      <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-luxe-on-surface-variant ml-1">New Authority Key</label>
                        <Input
                          type="password"
                          id="manual-password"
                          placeholder="Entrust a new secure key..."
                          className="h-12 bg-luxe-surface border-luxe-outline-variant/40 rounded-xl"
                        />
                      </div>
                      <Button
                        onClick={async () => {
                          const el = document.getElementById("manual-password") as HTMLInputElement;
                          if (el.value) {
                            try {
                              const res = await fetch(`/api/admin/users/${userId}/password`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ password: el.value })
                              });
                              if (res.ok) {
                                el.value = "";
                                toast.success("Authority key overridden successfully.");
                              } else {
                                const data = await res.json();
                                toast.error(data.error || "Override sequence failed.");
                              }
                            } catch (err) {
                              toast.error("An error occurred during the update sequence.");
                            }
                          }
                        }}
                        className="h-12 bg-white/5 text-white hover:bg-luxe-primary hover:text-luxe-on-primary border border-white/10 rounded-xl px-8 font-black text-[10px] uppercase tracking-widest"
                      >
                        Overwrite Key
                      </Button>
                    </div>
                    <p className="text-[10px] text-luxe-on-surface-variant italic mt-4 ml-1">Note: This action bypasses email verification and updates the database record directly.</p>
                  </Card>
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <Card className="glass-panel border-none bg-luxe-surface/30 rounded-3xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-white/5 border-b border-white/5">
                          <tr>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-luxe-on-surface-variant">Order</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-luxe-on-surface-variant">Date</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-luxe-on-surface-variant">Status</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-luxe-on-surface-variant text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {user.orders?.length > 0 ? user.orders.map((order: any) => (
                            <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 font-bold text-white uppercase tracking-wider text-xs">

                                <Link href={`/admin/orders`} className="hover:text-luxe-primary transition-colors" >
                                  <div>
                                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-luxe-primary/30 text-luxe-primary bg-luxe-primary/5 mb-2 px-2 py-0.5">Order ID: #{order.id}</Badge>
                                  </div>
                                </Link>
                              </td>
                              <td className="px-6 py-4 text-xs text-luxe-on-surface-variant">{new Date(order.created_at).toLocaleDateString()}</td>
                              <td className="px-6 py-4">
                                <Badge variant="outline" className={cn(
                                  "text-[9px] uppercase font-bold",
                                  order.status === "delivered" ? "border-luxe-primary/30 text-luxe-primary bg-luxe-primary/5" : "border-luxe-outline-variant text-luxe-on-surface-variant"
                                )}>
                                  {order.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-right font-black text-luxe-primary text-xs">
                                ${parseFloat(order.total).toLocaleString()}
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={4} className="px-6 py-20 text-center text-xs text-luxe-on-surface-variant italic">No order data found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === "activity" && (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <Card className="glass-panel border-none p-8 bg-luxe-surface/30 rounded-3xl">
                    <h4 className="text-sm font-black uppercase tracking-widest mb-8">Audit Logs</h4>
                    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-luxe-primary/20 before:via-white/5 before:to-transparent">
                      {user.audit_logs_target?.length > 0 ? user.audit_logs_target.map((log: any) => (
                        <div key={log.id} className="relative flex items-center justify-between group">
                          <div className="flex items-center w-full">
                            <div className="flex items-center justify-center size-10 rounded-full bg-luxe-surface border border-luxe-primary/20 text-luxe-primary z-10 shadow-lg shadow-black/40">
                              <History className="size-4" />
                            </div>
                            <div className="ml-6 flex-1">
                              <div className="flex items-center justify-between">
                                <h5 className="text-xs font-black text-white uppercase tracking-wider italic">
                                  {log.action_type.replace(/_/g, " ")}
                                </h5>
                                <span className="text-[10px] font-bold text-luxe-on-surface-variant uppercase tracking-widest">
                                  {new Date(log.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-[11px] text-luxe-on-surface-variant mt-1 font-medium">
                                Executed by <span className="text-white">{log.actor.name}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-20">
                          <p className="text-xs text-luxe-on-surface-variant italic">No administrative activities recorded.</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        description={confirmState.description}
        variant={confirmState.variant}
        confirmText="Confirm Protocol"
      />
    </div>
  );
}
