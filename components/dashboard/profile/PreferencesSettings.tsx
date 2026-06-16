"use client";

import React, { useState } from "react";
import { Bell, Mail, Sparkles, Truck, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function PreferencesSettings() {
  const [prefs, setPrefs] = useState({
    notifPrelaunch: true,
    notifCatalog: true,
    notifCourier: false,
    marketingEmail: true
  });
  const [saving, setSaving] = useState(false);

  const toggle = (key: keyof typeof prefs) => {
    const newPrefs = { ...prefs, [key]: !prefs[key] };
    setPrefs(newPrefs);
    handleSilentSave(newPrefs);
  };

  const handleSilentSave = async (data: typeof prefs) => {
     // Implementation of silent saving pattern
     console.log("Saving preferences:", data);
     // Simulating save
     setSaving(true);
     setTimeout(() => setSaving(false), 500);
  };

  const PreferenceItem = ({ 
    icon: Icon, 
    title, 
    desc, 
    active, 
    onToggle,
    colorClass
  }: { 
    icon: any, 
    title: string, 
    desc: string, 
    active: boolean, 
    onToggle: () => void,
    colorClass: string 
  }) => (
    <div className="flex items-center justify-between py-6 group transition-all">
      <div className="flex gap-4">
        <div className={cn("size-10 rounded-xl flex items-center justify-center shrink-0", colorClass)}>
          <Icon className="size-5" />
        </div>
        <div className="space-y-0.5 text-left">
          <span className="text-[13px] font-black text-white uppercase tracking-tight block">{title}</span>
          <span className="text-[10px] font-medium text-luxe-on-surface-variant block tracking-wider leading-relaxed">{desc}</span>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={cn(
          "w-12 h-6 rounded-full transition-all relative duration-500 shrink-0",
          active ? "bg-luxe-primary" : "bg-white/10"
        )}
      >
        <div className={cn(
          "absolute top-1 left-1 bg-white size-4 rounded-full shadow-lg transition-transform duration-500",
          active ? "translate-x-6" : "translate-x-0"
        )} />
      </button>
    </div>
  );

  return (
    <Card className="glass-panel border-none shadow-2xl overflow-hidden">
      <CardHeader className="border-b border-luxe-outline-variant/10 p-8 space-y-2">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-luxe-primary/10 flex items-center justify-center text-luxe-primary">
                 <Bell className="size-5" />
              </div>
              <div>
                 <CardTitle className="text-lg font-black text-white italic tracking-tight uppercase">Curated Alerts</CardTitle>
                 <CardDescription className="text-[10px] font-bold text-luxe-on-surface-variant tracking-[0.1em] uppercase">Configure your luxury intelligence feed</CardDescription>
              </div>
           </div>
           {saving && <Loader2 className="size-3 text-luxe-primary animate-spin" />}
        </div>
      </CardHeader>
      <CardContent className="p-0 px-8 divide-y divide-white/5">
        <PreferenceItem
          icon={Sparkles}
          title="Pre-launch Invitations"
          desc="Access global catalogs 24 hours before the standard opening."
          active={prefs.notifPrelaunch}
          onToggle={() => toggle("notifPrelaunch")}
          colorClass="bg-luxe-primary/10 text-luxe-primary"
        />
        <PreferenceItem
          icon={Mail}
          title="Editorial Catalogs"
          desc="Receive premium lookbooks and seasonal physical editions."
          active={prefs.notifCatalog}
          onToggle={() => toggle("notifCatalog")}
          colorClass="bg-luxe-secondary/10 text-luxe-secondary"
        />
        <PreferenceItem
           icon={Truck}
           title="Live Courier Updates"
           desc="Direct SMS contact from dispatch vehicles for arrival synchronization."
           active={prefs.notifCourier}
           onToggle={() => toggle("notifCourier")}
           colorClass="bg-sky-500/10 text-sky-400"
        />
        <PreferenceItem
           icon={Sparkles}
           title="Market Intelligence"
           desc="Receive curated insights on portfolio value and market trends."
           active={prefs.marketingEmail}
           onToggle={() => toggle("marketingEmail")}
           colorClass="bg-purple-500/10 text-purple-400"
        />
      </CardContent>
    </Card>
  );
}
