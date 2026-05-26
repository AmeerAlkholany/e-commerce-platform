"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, ArrowLeft, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !password || !confirmPassword) {
      setError("Please fill in all verification credentials.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }
    if (password.length < 8) {
      setError("Security requirement: Password must be at least 8 characters.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-luxe-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-luxe-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-luxe-tertiary/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[460px] z-10">
        <Card className="glass-panel border-none shadow-xl rounded-2xl relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-luxe-tertiary to-luxe-primary" />

          {!submitted ? (
            <>
              <CardHeader className="space-y-2 pt-8">
                <CardTitle className="text-[28px] font-semibold text-luxe-on-surface tracking-tight">
                  Reset Password
                </CardTitle>
                <CardDescription className="text-luxe-on-surface-variant text-[14px]">
                  Provide the recovery code and define your new login credentials.
                </CardDescription>
              </CardHeader>

              <CardContent>
                {error && (
                  <div className="mb-6 p-4 rounded-lg bg-luxe-error-container text-luxe-on-error-container text-[13px] border border-luxe-error/20 flex items-center gap-2.5">
                    <ShieldAlert className="size-4 shrink-0 text-luxe-error" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Recovery Code */}
                  <div className="space-y-1.5">
                    <label htmlFor="recovery-code" className="text-[12px] font-semibold text-luxe-on-surface-variant tracking-[0.05em] uppercase block">
                      Recovery Code
                    </label>
                    <Input
                      id="recovery-code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="bg-luxe-surface-container border-luxe-outline-variant/40 rounded-lg text-[15px] focus-visible:ring-2 focus-visible:ring-luxe-primary/80 tracking-wider text-center"
                      required
                    />
                  </div>

                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label htmlFor="new-password" className="text-[12px] font-semibold text-luxe-on-surface-variant tracking-[0.05em] uppercase block">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxe-outline size-4" />
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-11 bg-luxe-surface-container border-luxe-outline-variant/40 rounded-lg text-[15px] focus-visible:ring-2 focus-visible:ring-luxe-primary/80 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label htmlFor="confirm-password" className="text-[12px] font-semibold text-luxe-on-surface-variant tracking-[0.05em] uppercase block">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxe-outline size-4" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-11 bg-luxe-surface-container border-luxe-outline-variant/40 rounded-lg text-[15px] focus-visible:ring-2 focus-visible:ring-luxe-primary/80 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-luxe-primary text-luxe-on-primary py-6 rounded-lg text-[14px] font-semibold tracking-wider hover:bg-luxe-primary/95 transition-all duration-300 mt-2 hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-luxe-primary/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? "CONFIGURING..." : "UPDATE CREDENTIALS"}
                    {!loading && <ArrowRight className="size-4" />}
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <CardContent className="pt-10 pb-8 text-center space-y-6">
              <div className="mx-auto size-16 bg-luxe-primary/10 rounded-full flex items-center justify-center text-luxe-primary animate-bounce">
                <CheckCircle2 className="size-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-[20px] font-semibold text-luxe-on-surface">Credentials Updated</h3>
                <p className="text-[14px] text-luxe-on-surface-variant leading-relaxed">
                  Your luxury client portal has been securely configured with your new credentials.
                </p>
              </div>
              <Button
                asChild
                className="w-full bg-luxe-primary text-luxe-on-primary py-5 rounded-lg text-[13px] font-semibold tracking-wider hover:bg-luxe-primary/95 transition-all duration-300 cursor-pointer"
              >
                <Link href="/login">
                  Enter Portfolio Now
                </Link>
              </Button>
            </CardContent>
          )}

          <CardFooter className="bg-luxe-surface-container-low border-t border-luxe-outline-variant/20 py-4 px-6 flex justify-between text-[13px] text-luxe-on-surface-variant">
            <Link href="/login" className="flex items-center gap-1.5 hover:text-luxe-primary transition-colors font-medium">
              <ArrowLeft className="size-3.5" /> Back to Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
