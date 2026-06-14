"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { useAuth } from "@/components/providers/auth-context";
import { signupSchema } from "@/lib/validations/users";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signup, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  // Password strength calculation
  const [strength, setStrength] = useState<{ score: number; text: string; color: string }>({ score: 0, text: "Too Weak", color: "bg-luxe-outline-variant/30 text-luxe-outline" });

  useEffect(() => {
    if (!password) {
      setStrength({ score: 0, text: "Not Entered", color: "bg-luxe-outline-variant/30 text-luxe-outline" });
      return;
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) {
      setStrength({ score, text: "Weak Protection", color: "bg-luxe-error text-luxe-on-error" });
    } else if (score === 2 || score === 3) {
      setStrength({ score, text: "Good Strength", color: "bg-luxe-tertiary-fixed-dim text-luxe-tertiary" });
    } else {
      setStrength({ score, text: "Impenetrable", color: "bg-luxe-primary text-luxe-on-primary" });
    }
  }, [password]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreeTerms) {
      setError("Please accept the Membership Terms of Service.");
      return;
    }

    // 1. Client-side validation with Zod
    const validation = signupSchema.safeParse({ name, email, password });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      await signup({ name, email, password });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreWidth = () => {
    switch (strength.score) {
      case 1: return "w-1/4";
      case 2: return "w-1/2";
      case 3: return "w-3/4";
      case 4: return "w-full";
      default: return "w-0";
    }
  };

  return (
    <main className="min-h-screen bg-luxe-surface flex flex-col md:flex-row relative overflow-hidden">
      {/* Visual Ambient Left Column */}
      <div className="hidden md:flex md:w-1/2 relative bg-luxe-inverse-surface text-luxe-inverse-on-surface flex-col justify-between p-16 overflow-hidden">
        {/* Soft floating background glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] rounded-full bg-luxe-tertiary/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[70%] h-[70%] rounded-full bg-luxe-primary/15 blur-[100px] pointer-events-none" />

        {/* Top Branding */}
        <Link href="/" className="z-10 text-luxe-inverse-on-surface font-semibold tracking-[0.2em] text-[18px] uppercase">
          Luxe Global
        </Link>

        {/* Typography */}
        <div className="z-10 my-auto max-w-lg space-y-6">
          <span className="text-[12px] font-bold tracking-[0.25em] text-luxe-tertiary-fixed-dim uppercase block">
            A Lifetime of Privileges
          </span>
          <h1 className="text-[48px] md:text-[56px] leading-[1.1] font-light tracking-tight text-white">
            Access <br />
            <span className="italic font-normal text-luxe-tertiary-fixed-dim">unrivaled</span> <br />
            craftsmanship.
          </h1>
          <p className="text-[16px] text-luxe-inverse-on-surface/70 leading-[1.6]">
            By requesting a Luxe Global membership account, you gain complete access to limited collections, private designer runway collections, real-time white-glove courier tracking, and priority customer service.
          </p>
        </div>

        {/* Footer Note */}
        <div className="z-10 flex items-center justify-between border-t border-white/10 pt-6 text-[12px] text-luxe-inverse-on-surface/50 tracking-wider">
          <span>MEMBERSHIP INVITATION</span>
          <span>EST. 2018</span>
        </div>
      </div>

      {/* Form Right Column */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-16 relative">
        <div className="absolute md:hidden top-1/4 right-1/4 w-64 h-64 rounded-full bg-luxe-tertiary/10 blur-[80px] pointer-events-none" />

        <div className="w-full max-w-[460px] z-10">
          <Card className="glass-panel border-none shadow-xl rounded-2xl relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-luxe-tertiary via-luxe-primary to-luxe-tertiary" />

            <CardHeader className="space-y-2 pt-8">
              <CardTitle className="text-[28px] font-semibold text-luxe-on-surface tracking-tight">
                Request Account
              </CardTitle>
              <CardDescription className="text-luxe-on-surface-variant text-[14px]">
                Enter details to apply for an active client portal slot.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="mb-6 p-4 rounded-lg bg-luxe-error-container text-luxe-on-error-container text-[13px] border border-luxe-error/20 flex items-center gap-2.5">
                  <ShieldCheck className="size-4 shrink-0 text-luxe-error" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label htmlFor="signup-name" className="text-[12px] font-semibold text-luxe-on-surface-variant tracking-[0.05em] uppercase block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxe-outline size-4" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Alexander Vance"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-11 bg-luxe-surface-container border-luxe-outline-variant/40 rounded-lg text-[15px] focus-visible:ring-2 focus-visible:ring-luxe-primary/80 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label htmlFor="signup-email" className="text-[12px] font-semibold text-luxe-on-surface-variant tracking-[0.05em] uppercase block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxe-outline size-4" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="alexander@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 bg-luxe-surface-container border-luxe-outline-variant/40 rounded-lg text-[15px] focus-visible:ring-2 focus-visible:ring-luxe-primary/80 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label htmlFor="signup-password" className="text-[12px] font-semibold text-luxe-on-surface-variant tracking-[0.05em] uppercase block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxe-outline size-4" />
                    <Input
                      id="signup-password"
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

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="pt-2 space-y-1.5 transition-all">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-luxe-on-surface-variant/80 font-medium">Security Tier:</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${strength.color}`}>
                          {strength.text}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-luxe-surface-container-high rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 bg-luxe-primary ${getScoreWidth()}`}
                        />
                      </div>
                      <div className="flex gap-2 text-[10px] text-luxe-on-surface-variant/70 leading-normal">
                        <span className={password.length >= 8 ? "text-luxe-primary font-bold" : ""}>✓ 8+ chars</span>
                        <span className={/[A-Z]/.test(password) ? "text-luxe-primary font-bold" : ""}>✓ Uppercase</span>
                        <span className={/[0-9]/.test(password) ? "text-luxe-primary font-bold" : ""}>✓ Digit</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Agree to terms */}
                <div className="flex items-start space-x-2 pt-2">
                  <input
                    id="agree-terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="size-4 mt-0.5 rounded border-luxe-outline-variant text-luxe-primary focus:ring-luxe-primary accent-luxe-primary cursor-pointer"
                  />
                  <label htmlFor="agree-terms" className="text-[13px] text-luxe-on-surface-variant leading-[1.4] cursor-pointer select-none">
                    I accept the <span className="text-luxe-primary font-bold hover:underline">Membership Agreement</span> and authorize email updates regarding pre-launches.
                  </label>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-luxe-primary text-luxe-on-primary py-6 rounded-lg text-[14px] font-semibold tracking-wider hover:bg-luxe-primary/95 transition-all duration-300 mt-3 hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-luxe-primary/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? "PROCESSING..." : "REQUEST CLIENT ENTRY"}
                  {!loading && <ArrowRight className="size-4" />}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="bg-luxe-surface-container-low border-t border-luxe-outline-variant/20 py-4 px-6 flex justify-center text-[13px] text-luxe-on-surface-variant">
              <span>Already a member?</span>
              <Link href="/login" className="text-luxe-primary font-bold hover:underline ml-1">
                Enter Here
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
