"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Successfully logged in as: ${email}`);
    }, 1200);
  };

  const fillCredentials = (type: "customer" | "admin") => {
    setError("");
    if (type === "customer") {
      setEmail("vip@luxeglobal.com");
      setPassword("luxury12345");
    } else {
      setEmail("admin@luxeglobal.com");
      setPassword("adminSecure99");
    }
  };

  return (
    <main className="min-h-screen bg-luxe-surface flex flex-col md:flex-row relative overflow-hidden">
      {/* Visual Ambient Left Column (Art-directed editorial) */}
      <div className="hidden md:flex md:w-1/2 relative bg-luxe-inverse-surface text-luxe-inverse-on-surface flex-col justify-between p-16 overflow-hidden">
        {/* Soft floating background glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] rounded-full bg-luxe-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[70%] h-[70%] rounded-full bg-luxe-tertiary/15 blur-[100px] pointer-events-none" />

        {/* Top Branding */}
        <Link href="/" className="z-10 text-luxe-inverse-on-surface font-semibold tracking-[0.2em] text-[18px] uppercase">
          Luxe Global
        </Link>

        {/* Dynamic Typography Centerpiece */}
        <div className="z-10 my-auto max-w-lg space-y-6">
          <span className="text-[12px] font-bold tracking-[0.25em] text-luxe-primary-fixed-dim uppercase block">
            Exclusivity Redefined
          </span>
          <h1 className="text-[48px] md:text-[56px] leading-[1.1] font-light tracking-tight text-white">
            Curating <br />
            <span className="italic font-normal text-luxe-primary-fixed-dim">exceptional</span> <br />
            experiences.
          </h1>
          <p className="text-[16px] text-luxe-inverse-on-surface/70 leading-[1.6]">
            Welcome back to your curated digital enclave. Enter your credentials to access personalized luxury selections, tailored private previews, and bespoke orders.
          </p>
        </div>

        {/* Editorial Footer Note */}
        <div className="z-10 flex items-center justify-between border-t border-white/10 pt-6 text-[12px] text-luxe-inverse-on-surface/50 tracking-wider">
          <span>MEMBERSHIP PRIVILEGES</span>
          <span>EST. 2018</span>
        </div>
      </div>

      {/* Interactive Form Right Column */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-16 relative">
        {/* Soft background glow for mobile */}
        <div className="absolute md:hidden top-1/4 left-1/4 w-64 h-64 rounded-full bg-luxe-primary/10 blur-[80px] pointer-events-none" />

        <div className="w-full max-w-[460px] z-10">
          <Card className="glass-panel border-none shadow-xl rounded-2xl relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
            {/* Top decorative stripe */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-luxe-primary via-luxe-tertiary to-luxe-primary" />

            <CardHeader className="space-y-2 pt-8">
              <CardTitle className="text-[28px] font-semibold text-luxe-on-surface tracking-tight">
                Sign In
              </CardTitle>
              <CardDescription className="text-luxe-on-surface-variant text-[14px]">
                Access your private portfolio and curated luxury account.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="mb-6 p-4 rounded-lg bg-luxe-error-container text-luxe-on-error-container text-[13px] border border-luxe-error/20 flex items-center gap-2.5 animate-pulse">
                  <ShieldCheck className="size-4 shrink-0 text-luxe-error" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email Input */}
                <div className="space-y-2">
                  <label htmlFor="login-email" className="text-[12px] font-semibold text-luxe-on-surface-variant tracking-[0.05em] uppercase block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxe-outline size-4" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="name@luxeglobal.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 bg-luxe-surface-container border-luxe-outline-variant/40 rounded-lg text-[15px] focus-visible:ring-2 focus-visible:ring-luxe-primary/80 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="login-password" className="text-[12px] font-semibold text-luxe-on-surface-variant tracking-[0.05em] uppercase block">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-[12px] font-semibold text-luxe-primary hover:opacity-80 transition-opacity"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxe-outline size-4" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 pr-11 bg-luxe-surface-container border-luxe-outline-variant/40 rounded-lg text-[15px] focus-visible:ring-2 focus-visible:ring-luxe-primary/80 transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-luxe-outline hover:text-luxe-on-surface transition-colors cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="size-4 rounded border-luxe-outline-variant text-luxe-primary focus:ring-luxe-primary accent-luxe-primary"
                  />
                  <label htmlFor="remember-me" className="text-[13px] text-luxe-on-surface-variant cursor-pointer select-none">
                    Keep me signed in for 30 days
                  </label>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-luxe-primary text-luxe-on-primary py-6 rounded-lg text-[14px] font-semibold tracking-wider hover:bg-luxe-primary/95 transition-all duration-300 mt-2 hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-luxe-primary/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? "AUTHENTICATING..." : "ENTER PORTFOLIO"}
                  {!loading && <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-1" />}
                </Button>
              </form>

              {/* Quick Fill Dev Options */}
              <div className="mt-8 border-t border-luxe-outline-variant/20 pt-6">
                <span className="text-[11px] font-bold tracking-[0.1em] text-luxe-on-surface-variant/60 uppercase block mb-3">
                  Quick Access (Demo)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => fillCredentials("customer")}
                    className="flex-1 text-[11px] font-semibold bg-luxe-surface-container hover:bg-luxe-surface-container-high text-luxe-on-surface-variant py-2.5 px-3 rounded-md transition-colors border border-luxe-outline-variant/30 cursor-pointer"
                  >
                    VIP Customer
                  </button>
                  <button
                    onClick={() => fillCredentials("admin")}
                    className="flex-1 text-[11px] font-semibold bg-luxe-surface-container hover:bg-luxe-surface-container-high text-luxe-on-surface-variant py-2.5 px-3 rounded-md transition-colors border border-luxe-outline-variant/30 cursor-pointer"
                  >
                    Site Administrator
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-luxe-surface-container-low border-t border-luxe-outline-variant/20 py-4 px-6 flex justify-center text-[13px] text-luxe-on-surface-variant">
              <span>New to Luxe? </span>
              <Link href="/signup" className="text-luxe-primary font-bold hover:underline ml-1">
                Request Invitation
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
