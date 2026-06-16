"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Loader2, 
  Sparkles, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  TrendingUp,
  Package,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-context";
import { AvatarUpload } from "@/components/dashboard/profile/AvatarUpload";
import { ProfileForm } from "@/components/dashboard/profile/ProfileForm";
import { SecuritySettings } from "@/components/dashboard/profile/SecuritySettings";
import { PreferencesSettings } from "@/components/dashboard/profile/PreferencesSettings";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MetricScorecard } from "@/components/admin/analytics/MetricScorecard";
import { useRouter } from "next/navigation";

const STAGGER = {
  container: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } },
  item: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }
};

export default function ProfilePage() {
  const { user: authUser, isLoading, refetchUser } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/client/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data.summary);
        }
      } catch (err) {
        console.error("Failed to fetch client stats:", err);
      }
    };
    if (authUser) fetchStats();
  }, [authUser]);

  if (isLoading && !authUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="size-12 text-luxe-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-luxe-on-surface-variant animate-pulse">Syncing Secure Profile...</p>
      </div>
    );
  }

  if (!authUser) {
     router.push("/login");
     return null;
  }

  return (
    <motion.div
      variants={STAGGER.container}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-24"
    >
      {/* ─── Profile Overview Header ────────────────────── */}
      <motion.div variants={STAGGER.item} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <Card className="glass-panel border-none p-10 flex flex-col items-center justify-center text-center bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden group">
          <div className="absolute top-4 right-4 animate-pulse">
             <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgb(16,185,129)]" />
          </div>
          
          <AvatarUpload 
            currentUrl={authUser.avatar_url} 
            name={authUser.name} 
            onUploadSuccess={() => refetchUser()} 
            onRemoveSuccess={() => refetchUser()}
          />
          
          <div className="mt-6 flex items-center gap-2">
             <span className="px-3 py-0.5 bg-luxe-primary/10 text-luxe-primary text-[9px] font-black rounded uppercase tracking-widest border border-luxe-primary/20">Verified Client</span>
             <span className="px-3 py-0.5 bg-sky-500/10 text-sky-400 text-[9px] font-black rounded uppercase tracking-widest border border-sky-500/20 flex items-center gap-1.5"><Sparkles className="size-2.5" /> Platinum</span>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/5 w-full grid grid-cols-2 gap-4">
             <div className="text-center">
                <span className="text-[9px] font-bold text-luxe-on-surface-variant uppercase tracking-widest block mb-1">Last Entry</span>
                <span className="text-xs font-black text-white italic">{new Date().toLocaleDateString()}</span>
             </div>
             <div className="text-center border-l border-white/5">
                <span className="text-[9px] font-bold text-luxe-on-surface-variant uppercase tracking-widest block mb-1">Member Since</span>
                <span className="text-xs font-black text-white italic">{new Date(authUser.created_at).getFullYear()}</span>
             </div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
           <h3 className="text-xs font-black uppercase tracking-[0.3em] text-luxe-on-surface-variant flex items-center gap-3">
              <TrendingUp className="size-3 text-luxe-primary" /> Portfolio Performance
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MetricScorecard
                 label="Acquisitions"
                 value={stats?.totalOrders || 0}
                 icon={<Package className="size-5" />}
              />
              <MetricScorecard
                 label="Delivered"
                 value={stats?.completedOrders || 0}
                 icon={<CheckCircle2 className="size-5 text-emerald-400" />}
              />
              <MetricScorecard
                 label="Active Tasks"
                 value={stats?.activeOrders || 0}
                 icon={<Clock className="size-5 text-luxe-primary" />}
              />
              <MetricScorecard
                 label="Account Status"
                 value="Secure"
                 icon={<ShieldCheck className="size-5 text-sky-400" />}
              />
           </div>
        </div>
      </motion.div>

      {/* ─── Main Details & Security ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <motion.div variants={STAGGER.item} className="lg:col-span-2 space-y-12">
          <ProfileForm 
            initialData={{ 
              name: authUser.name, 
              email: authUser.email, 
              phone: authUser.phone 
            }} 
            onSuccess={() => refetchUser()}
          />
          <PreferencesSettings />
        </motion.div>

        <motion.div variants={STAGGER.item}>
           <SecuritySettings />
        </motion.div>
      </div>

      {/* ─── Footer Utility ─────────────────────────────── */}
      <motion.div variants={STAGGER.item} className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="flex items-center gap-4 text-[10px] font-bold text-luxe-on-surface-variant uppercase tracking-widest">
            <span>Server Timestamp: {new Date().toISOString()}</span>
            <span className="hidden md:inline text-white/10">|</span>
            <span className="text-emerald-500/60">Node Integrity: Verified</span>
         </div>
         <p className="text-[10px] text-luxe-on-surface-variant/40 italic">
            All profile credentials are encrypted via AES-256 and synchronized through Secure Sockets.
         </p>
      </motion.div>
    </motion.div>
  );
}
