"use client";

import React, { useState } from "react";
import { User, Phone, Mail, UserCheck, Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

interface ProfileFormProps {
  initialData: {
    name: string;
    email: string;
    phone: string | null;
  };
  onSuccess: (updatedData: any) => void;
}

import { ConfirmDialog } from "./ConfirmDialog";

export function ProfileForm({ initialData, onSuccess }: ProfileFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const performSave = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
        }),
      });

      if (!res.ok) throw new Error("Synchronization failure");

      const data = await res.json();
      onSuccess(data);
      toast.success("Credentials synchronized with secure registry");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  return (
    <>
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={performSave}
        title="Apply Identity Changes?"
        description="This will update your verified legal name and contact information across the global registry."
      />
      <Card className="glass-panel border-none shadow-2xl overflow-hidden">
      <CardHeader className="border-b border-luxe-outline-variant/10 p-8 space-y-2">
        <div className="flex items-center gap-3">
           <div className="size-10 rounded-xl bg-luxe-primary/10 flex items-center justify-center text-luxe-primary">
              <UserCheck className="size-5" />
           </div>
           <div>
              <CardTitle className="text-lg font-black text-white italic tracking-tight uppercase">Identity Hub</CardTitle>
              <CardDescription className="text-[10px] font-bold text-luxe-on-surface-variant tracking-[0.1em] uppercase">Maintain your verified account metadata</CardDescription>
           </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black tracking-widest text-luxe-on-surface-variant uppercase">Full Legal Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-luxe-on-surface-variant group-focus-within:text-luxe-primary transition-colors" />
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-12 h-14 bg-white/5 border-white/10 rounded-xl focus-visible:ring-2 focus-visible:ring-luxe-primary/50 transition-all font-medium text-white"
                  placeholder="Verified Full Name"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black tracking-widest text-luxe-on-surface-variant uppercase">Secure Email (Primary)</label>
              <div className="relative opacity-60 cursor-not-allowed group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-luxe-on-surface-variant" />
                <Input
                  value={formData.email}
                  disabled
                  className="pl-12 h-14 bg-white/5 border-white/5 rounded-xl cursor-not-allowed font-medium"
                />
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black tracking-widest text-luxe-on-surface-variant uppercase">Telephonic Contact</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-luxe-on-surface-variant group-focus-within:text-luxe-primary transition-colors" />
                <Input
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-12 h-14 bg-white/5 border-white/10 rounded-xl focus-visible:ring-2 focus-visible:ring-luxe-primary/50 transition-all font-medium text-white"
                  placeholder="+1 (XXX) XXX-XXXX"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <Button
              type="submit"
              disabled={saving}
              className="h-14 bg-luxe-primary text-luxe-on-primary hover:bg-luxe-primary/90 px-10 rounded-xl font-bold uppercase tracking-[0.2em] transition-all active:scale-95 group"
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin mr-3" />
              ) : (
                <Save className="size-4 mr-3 group-hover:rotate-12 transition-transform" />
              )}
              {saving ? "Synchronizing..." : "Update Vault"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
    </>
  );
}
