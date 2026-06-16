"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, ShieldCheck, CreditCard, Bell, Sparkles, UserCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/auth-context";

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+1 (555) 890-4820");
  const [country, setCountry] = useState("United States");
  const [tier] = useState("Platinum Member");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      const names = user.name.split(" ");
      setFirstName(names[0] || "");
      setLastName(names.slice(1).join(" ") || "");
      setEmail(user.email);
    }
  }, [user]);

  const [notifCatalog, setNotifCatalog] = useState(true);
  const [notifPrelaunch, setNotifPrelaunch] = useState(true);
  const [notifActivity, setNotifActivity] = useState(false);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-luxe-surface flex items-center justify-center">
        <Loader2 className="size-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-luxe-surface py-12 px-4 md:px-[64px] max-w-[1440px] mx-auto space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-luxe-outline-variant/30 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-bold tracking-[0.25em] text-luxe-primary uppercase bg-luxe-primary/10 px-3 py-1 rounded-full">
              Verified Client
            </span>
            <span className="text-[12px] font-bold tracking-[0.25em] text-luxe-tertiary uppercase bg-luxe-tertiary/10 px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="size-3" /> VIP
            </span>
          </div>
          <h1 className="text-[36px] font-light tracking-tight text-luxe-on-surface">
            Client Portfolio
          </h1>
        </div>
        <Button
          asChild
          className="bg-luxe-inverse-surface text-luxe-inverse-on-surface hover:opacity-90 py-5 px-6 rounded-lg text-[13px] font-semibold tracking-wider transition-opacity cursor-pointer"
        >
          <Link href="/dashboard">
            Open Dashboard
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Member Card & Payment details */}
        <div className="lg:col-span-1 space-y-8">
          {/* Platinum Membership Card */}
          <div className="relative h-60 w-full rounded-2xl bg-gradient-to-br from-[#1b1b24] via-[#2c2b3c] to-[#121217] text-white p-8 flex flex-col justify-between shadow-2xl overflow-hidden border border-white/5 group transition-transform duration-500 hover:scale-[1.02] cursor-pointer">
            {/* Metallic shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
            
            <div className="flex justify-between items-start z-10">
              <div className="space-y-1">
                <span className="text-[11px] font-bold tracking-[0.2em] text-luxe-outline-variant/60 uppercase block">
                  Luxe Global Tier
                </span>
                <span className="text-[20px] font-semibold tracking-wide bg-gradient-to-r from-luxe-outline-variant to-white bg-clip-text text-transparent">
                  {tier}
                </span>
              </div>
              <span className="text-[22px] font-black tracking-widest text-luxe-outline-variant/30">L G</span>
            </div>

            <div className="z-10 space-y-4">
              <div className="text-[14px] text-luxe-outline-variant/80 tracking-[0.25em] font-mono">
                XXXX  XXXX  XXXX  8904
              </div>
              <div className="flex justify-between items-end border-t border-white/10 pt-4">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-luxe-outline-variant/40 tracking-widest uppercase block">Portfolio Holder</span>
                  <span className="text-[13px] font-semibold tracking-wider uppercase text-white/90">
                    {firstName} {lastName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-luxe-outline-variant/40 tracking-widest uppercase block">Member Since</span>
                  <span className="text-[13px] font-mono text-white/90">05/18</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secure Settings Summary */}
          <Card className="glass-panel border-none shadow-md rounded-xl">
            <CardHeader>
              <CardTitle className="text-[16px] font-semibold text-luxe-on-surface">
                Portfolio Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2.5 border-b border-luxe-outline-variant/20">
                <div className="space-y-0.5">
                  <span className="text-[13px] font-medium text-luxe-on-surface">Two-Factor Auth</span>
                  <span className="text-[11px] text-luxe-on-surface-variant block">Secured via Mobile Authenticator</span>
                </div>
                <span className="px-2.5 py-0.5 bg-luxe-primary/10 text-luxe-primary text-[10px] font-bold rounded uppercase">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-luxe-outline-variant/20">
                <div className="space-y-0.5">
                  <span className="text-[13px] font-medium text-luxe-on-surface">Data Encryption</span>
                  <span className="text-[11px] text-luxe-on-surface-variant block">AES-256 Bit secure standard</span>
                </div>
                <span className="px-2.5 py-0.5 bg-luxe-primary/10 text-luxe-primary text-[10px] font-bold rounded uppercase">
                  Enabled
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <div className="space-y-0.5">
                  <span className="text-[13px] font-medium text-luxe-on-surface">Biometrics Entry</span>
                  <span className="text-[11px] text-luxe-on-surface-variant block">Face ID / Touch ID sync ready</span>
                </div>
                <span className="px-2.5 py-0.5 bg-luxe-outline-variant/30 text-luxe-outline text-[10px] font-bold rounded uppercase">
                  Optional
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center / Right Columns: Account Details Form */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="glass-panel border-none shadow-md rounded-xl">
            <CardHeader className="border-b border-luxe-outline-variant/20 pb-6">
              <CardTitle className="text-[20px] font-semibold text-luxe-on-surface">
                Personal Credentials
              </CardTitle>
              <CardDescription className="text-luxe-on-surface-variant text-[13px]">
                Maintain your verified client profile to ensure swift custom dispatching.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {success && (
                <div className="mb-6 p-4 rounded-lg bg-luxe-primary/10 text-luxe-primary text-[13px] border border-luxe-primary/20 flex items-center gap-2.5">
                  <UserCheck className="size-4 shrink-0" />
                  <span>Your luxury client credentials have been updated successfully.</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label htmlFor="first-name" className="text-[11px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase block">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxe-outline size-4" />
                      <Input
                        id="first-name"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="pl-11 bg-luxe-surface-container border-luxe-outline-variant/40 rounded-lg text-[15px] focus-visible:ring-2 focus-visible:ring-luxe-primary/80"
                        required
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label htmlFor="last-name" className="text-[11px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase block">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxe-outline size-4" />
                      <Input
                        id="last-name"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="pl-11 bg-luxe-surface-container border-luxe-outline-variant/40 rounded-lg text-[15px] focus-visible:ring-2 focus-visible:ring-luxe-primary/80"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="profile-email" className="text-[11px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase block">
                      Email Address (Verified)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxe-outline size-4" />
                      <Input
                        id="profile-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-11 bg-luxe-surface-container border-luxe-outline-variant/40 rounded-lg text-[15px] opacity-75 focus-visible:ring-2 focus-visible:ring-luxe-primary/80 cursor-not-allowed"
                        disabled
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label htmlFor="profile-phone" className="text-[11px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase block">
                      Secure Phone Contact
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxe-outline size-4" />
                      <Input
                        id="profile-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-11 bg-luxe-surface-container border-luxe-outline-variant/40 rounded-lg text-[15px] focus-visible:ring-2 focus-visible:ring-luxe-primary/80"
                        required
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="profile-location" className="text-[11px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase block">
                      Primary Country
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxe-outline size-4" />
                      <Input
                        id="profile-location"
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="pl-11 bg-luxe-surface-container border-luxe-outline-variant/40 rounded-lg text-[15px] focus-visible:ring-2 focus-visible:ring-luxe-primary/80"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-luxe-outline-variant/20 pt-6">
                  <h4 className="text-[14px] font-semibold text-luxe-on-surface mb-4 flex items-center gap-2">
                    <Bell className="size-4 text-luxe-primary" /> Curated Preferences
                  </h4>
                  <div className="space-y-4">
                    {/* Toggle 1 */}
                    <div className="flex items-center justify-between py-2">
                      <div className="space-y-0.5">
                        <span className="text-[13px] font-medium text-luxe-on-surface block">Pre-launch Invitation</span>
                        <span className="text-[11px] text-luxe-on-surface-variant block">Be alerted 24 hours prior to global catalog openings.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotifPrelaunch(!notifPrelaunch)}
                        className={`w-11 h-6 rounded-full transition-colors relative duration-300 focus:outline-none ${notifPrelaunch ? "bg-luxe-primary" : "bg-luxe-outline-variant"}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-300 ${notifPrelaunch ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>

                    {/* Toggle 2 */}
                    <div className="flex items-center justify-between py-2 border-t border-luxe-outline-variant/10">
                      <div className="space-y-0.5">
                        <span className="text-[13px] font-medium text-luxe-on-surface block">Seasonal Catalogs</span>
                        <span className="text-[11px] text-luxe-on-surface-variant block">Receive premium physical and digital editorial lookbooks.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotifCatalog(!notifCatalog)}
                        className={`w-11 h-6 rounded-full transition-colors relative duration-300 focus:outline-none ${notifCatalog ? "bg-luxe-primary" : "bg-luxe-outline-variant"}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-300 ${notifCatalog ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>

                    {/* Toggle 3 */}
                    <div className="flex items-center justify-between py-2 border-t border-luxe-outline-variant/10">
                      <div className="space-y-0.5">
                        <span className="text-[13px] font-medium text-luxe-on-surface block">Live Courier Alert</span>
                        <span className="text-[11px] text-luxe-on-surface-variant block">Receive SMS text notifications directly from dispatch vehicle.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotifActivity(!notifActivity)}
                        className={`w-11 h-6 rounded-full transition-colors relative duration-300 focus:outline-none ${notifActivity ? "bg-luxe-primary" : "bg-luxe-outline-variant"}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-300 ${notifActivity ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-luxe-primary text-luxe-on-primary py-5 px-8 rounded-lg text-[13px] font-semibold tracking-wider hover:bg-luxe-primary/95 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {saving ? "SAVING CHANGES..." : "SAVE CLIENT SETTINGS"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
