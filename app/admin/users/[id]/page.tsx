"use client";

import React, { useState } from "react";
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
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserDetail, useUserActions } from "@/hooks/use-users";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { use } from "react";

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const userId = parseInt(unwrappedParams.id);
  const { data: user, isLoading } = useUserDetail(userId);
  const { performAction } = useUserActions();
  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p>Loading intelligence data...</p></div>;
  }

  if (!user) return <div>Data not found</div>;

  const tabs = [
    { id: "overview", label: "Overview", icon: UserIcon },
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
            <p className="text-luxe-on-surface-variant text-sm font-medium">Enterprise Entity ID: PRO-{user.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.status === "active" ? (
             <Button onClick={() => performAction.mutate({ id: userId, action: "suspend" })} variant="outline" className="h-10 border-luxe-tertiary/30 text-luxe-tertiary hover:bg-luxe-tertiary/10 rounded-xl px-4 font-bold text-xs uppercase tracking-widest">
              Suspend Account
            </Button>
          ) : (
             <Button onClick={() => performAction.mutate({ id: userId, action: "activate" })} className="h-10 bg-luxe-primary text-luxe-on-primary hover:bg-luxe-primary/90 rounded-xl px-4 font-bold text-xs uppercase tracking-widest">
              Reactivate
            </Button>
          )}
          <Button variant="ghost" className="h-10 text-luxe-error hover:bg-luxe-error/10 rounded-xl px-4 font-bold text-xs uppercase tracking-widest">
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
                              <Button onClick={() => performAction.mutate({ id: userId, action: "verify" })} size="sm" className="ml-auto bg-luxe-primary/10 text-luxe-primary border border-luxe-primary/30 h-8 font-black text-[10px] uppercase">Verify Now</Button>
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
                            <Button onClick={() => performAction.mutate({ id: userId, action: "reset-password" })} className="bg-luxe-primary text-luxe-on-primary font-black text-[10px] uppercase tracking-widest px-6 h-10 rounded-xl">Trigger Reset Sequence</Button>
                            <Button variant="outline" className="border-luxe-outline-variant font-black text-[10px] uppercase tracking-widest px-6 h-10 rounded-xl">Revoke Sessions</Button>
                         </div>
                      </div>
                   </Card>
                </motion.div>
              )}

              {/* Other tabs would follow same pattern */}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
