"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, UserPlus, Shield, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUserActions } from "@/hooks/use-users";
import { motion } from "framer-motion";

export default function NewUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create user");
      }
      router.push("/admin/users");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()} className="h-10 w-10 p-0 border-luxe-outline-variant bg-transparent rounded-xl hover:bg-white/5">
          <ChevronLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Provision <span className="text-luxe-primary">Entity</span></h1>
          <p className="text-luxe-on-surface-variant text-sm font-medium">Create and authorize a new enterprise account.</p>
        </div>
      </div>

      <Card className="glass-panel border-none shadow-2xl rounded-3xl overflow-hidden bg-luxe-surface/40">
        <CardHeader className="p-8 border-b border-white/5">
          <CardTitle className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <UserPlus className="size-4 text-luxe-primary" /> Credentials & Authorization
          </CardTitle>
          <CardDescription className="text-luxe-on-surface-variant">Define identity and system permissions for the new user.</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-luxe-on-surface-variant">Full Name</label>
              <Input 
                required 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                placeholder="Discerning Citizen Name"
                className="h-12 bg-luxe-surface border-luxe-outline-variant/40 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-luxe-on-surface-variant">Email Address</label>
              <Input 
                required 
                type="email" 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
                placeholder="citizen@luxe-global.com"
                className="h-12 bg-luxe-surface border-luxe-outline-variant/40 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-luxe-on-surface-variant">Initial Key (Password)</label>
              <Input 
                required 
                type="password" 
                value={form.password} 
                onChange={(e) => setForm({ ...form, password: e.target.value })} 
                placeholder="Min 8 characters required"
                className="h-12 bg-luxe-surface border-luxe-outline-variant/40 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-luxe-on-surface-variant">Clearance Role</label>
                <select 
                  value={form.role} 
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full h-12 bg-luxe-surface border border-luxe-outline-variant/40 rounded-xl px-4 text-sm text-white focus:ring-1 focus:ring-luxe-primary outline-none"
                >
                  <option value="customer">Customer Access</option>
                  <option value="admin">Administrative Access</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-luxe-on-surface-variant">Account Status</label>
                <select 
                  value={form.status} 
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full h-12 bg-luxe-surface border border-luxe-outline-variant/40 rounded-xl px-4 text-sm text-white focus:ring-1 focus:ring-luxe-primary outline-none"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-luxe-error/10 border border-luxe-error/20 rounded-xl flex items-center gap-3">
                <Shield className="size-4 text-luxe-error" />
                <p className="text-xs font-bold text-luxe-error uppercase tracking-widest">{error}</p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1 h-12 border-white/10 rounded-xl font-bold uppercase tracking-widest">Discard</Button>
              <Button type="submit" disabled={loading} className="flex-1 h-12 bg-luxe-primary text-luxe-on-primary hover:bg-luxe-primary/90 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-luxe-primary/20">
                {loading ? "Decrypting..." : "Provision User"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
