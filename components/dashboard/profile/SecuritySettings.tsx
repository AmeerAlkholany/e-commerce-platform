"use client";

import React, { useState } from "react";
import { ShieldCheck, Eye, EyeOff, Loader2, Lock, Key, Badge } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { ConfirmDialog } from "./ConfirmDialog";

export function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const getStrength = (pass: string) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length > 8) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 25;
    return strength;
  };

  const strength = getStrength(newPassword);

  const performUpdate = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Encryption update failure");
      }

      toast.success("Security keys rotated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Decipher mismatch: Password confirmation failed");
      return;
    }
    setShowConfirm(true);
  };

  return (
    <>
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={performUpdate}
        title="Rotate Security Keys?"
        description="This will update your account encryption. You will be required to use the new credentials for all future entry."
      />
      <Card className="glass-panel border-none shadow-2xl overflow-hidden h-full">
      <CardHeader className="border-b border-luxe-outline-variant/10 p-8 space-y-2">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500">
                 <ShieldCheck className="size-5" />
              </div>
              <div>
                 <CardTitle className="text-lg font-black text-white italic tracking-tight uppercase">Security Sanctum</CardTitle>
                 <CardDescription className="text-[10px] font-bold text-luxe-on-surface-variant tracking-[0.1em] uppercase">Manage your credentials & encryption</CardDescription>
              </div>
           </div>
           <Badge className="bg-emerald-500/10 text-emerald-400 border-none px-3 uppercase text-[9px] font-black">Secure</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black tracking-widest text-luxe-on-surface-variant uppercase">Current Encryption Key</label>
            <div className="relative group">
               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-luxe-on-surface-variant group-focus-within:text-luxe-primary transition-colors" />
               <Input
                type={showPass ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="pl-12 h-14 bg-white/5 border-white/10 rounded-xl focus-visible:ring-2 focus-visible:ring-luxe-primary/50 transition-all font-medium text-white"
                placeholder="Current Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-luxe-on-surface-variant hover:text-white"
              >
                {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black tracking-widest text-luxe-on-surface-variant uppercase flex justify-between">
               Target Password
               <span className={cn(
                  "text-[9px] font-bold uppercase",
                  strength < 50 ? "text-red-400" : strength < 100 ? "text-yellow-400" : "text-emerald-400"
               )}>
                  {strength === 0 ? "" : strength < 50 ? "Vulnerable" : strength < 100 ? "Secure" : "Impenetrable"}
               </span>
            </label>
            <div className="relative group">
               <Key className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-luxe-on-surface-variant group-focus-within:text-luxe-primary transition-colors" />
               <Input
                type={showPass ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-12 h-14 bg-white/5 border-white/10 rounded-xl focus-visible:ring-2 focus-visible:ring-luxe-primary/50 transition-all font-medium text-white"
                placeholder="New Password"
                required
              />
            </div>
            {/* Strength indicator bar */}
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-2">
               <div className={cn(
                  "h-full transition-all duration-500",
                  strength < 50 ? "bg-red-500" : strength < 100 ? "bg-yellow-500" : "bg-emerald-500"
               )} style={{ width: `${strength}%` }} />
            </div>
          </div>

          <div className="space-y-3">
             <label className="text-[10px] font-black tracking-widest text-luxe-on-surface-variant uppercase">Confirm Encryption Target</label>
             <div className="relative group">
               <Key className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-luxe-on-surface-variant group-focus-within:text-luxe-primary transition-colors" />
               <Input
                type={showPass ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-12 h-14 bg-white/5 border-white/10 rounded-xl focus-visible:ring-2 focus-visible:ring-luxe-primary/50 transition-all font-medium text-white"
                placeholder="Confirm Target"
                required
              />
            </div>
          </div>

          <div className="pt-4">
             <Button
               type="submit"
               disabled={loading || !newPassword}
               className="w-full h-14 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-xl font-bold uppercase tracking-[0.2em] transition-all"
             >
               {loading ? (
                 <Loader2 className="size-4 animate-spin mr-3" />
               ) : (
                 <ShieldCheck className="size-4 mr-3 text-sky-400" />
               )}
               {loading ? "Rotating Keys..." : "Rotate Passwords"}
             </Button>
          </div>
        </form>
      </CardContent>
    </Card>
    </>
  );
}
