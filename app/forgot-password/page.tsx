"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-luxe-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-luxe-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-luxe-tertiary/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[460px] z-10">
        <Card className="glass-panel border-none shadow-xl rounded-2xl relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-luxe-primary to-luxe-tertiary" />

          {!submitted ? (
            <>
              <CardHeader className="space-y-2 pt-8">
                <CardTitle className="text-[28px] font-semibold text-luxe-on-surface tracking-tight">
                  Recover Password
                </CardTitle>
                <CardDescription className="text-luxe-on-surface-variant text-[14px]">
                  Enter your email address and we'll transmit private verification credentials.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label htmlFor="recovery-email" className="text-[12px] font-semibold text-luxe-on-surface-variant tracking-[0.05em] uppercase block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxe-outline size-4" />
                      <Input
                        id="recovery-email"
                        type="email"
                        placeholder="name@luxeglobal.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    {loading ? "TRANSMITTING..." : "SEND RECOVERY CODE"}
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
                <h3 className="text-[20px] font-semibold text-luxe-on-surface">Transmission Successful</h3>
                <p className="text-[14px] text-luxe-on-surface-variant leading-relaxed">
                  An encrypted recovery key has been dispatched to <strong className="text-luxe-primary">{email}</strong>. Please check your inbox and follow the steps.
                </p>
              </div>
              <Button
                asChild
                className="w-full bg-luxe-surface-container hover:bg-luxe-surface-container-high text-luxe-on-surface-variant py-5 rounded-lg text-[13px] font-semibold tracking-wider transition-colors cursor-pointer"
              >
                <Link href="/reset-password">
                  Go to Password Reset
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
