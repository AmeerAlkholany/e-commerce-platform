"use client";

import { motion } from "framer-motion";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { Meteors } from "@/components/magicui/meteors";
import { Input } from "@/components/ui/input";
import { Mail, Sparkles } from "lucide-react";
import { useState } from "react";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="py-28 relative overflow-hidden bg-luxe-on-surface text-white">
      {/* Dynamic Animated CSS Gradient Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#1b1b24] via-[#2d226a] to-[#7e3000]/30 opacity-90 z-0" />
      
      {/* Magic UI Meteors Background Effect */}
      <Meteors number={30} className="opacity-45" />

      {/* Decorative blurred glow orbs */}
      <div className="absolute -top-12 -left-20 w-80 h-80 bg-luxe-primary/30 rounded-full blur-[100px] pointer-events-none floating" />
      <div className="absolute -bottom-24 -right-16 w-96 h-96 bg-luxe-tertiary/20 rounded-full blur-[120px] pointer-events-none floating-delayed" />

      <div className="max-w-[1440px] mx-auto px-4 md:px-[64px] relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-10">
          
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md"
          >
            <Sparkles className="size-3.5 text-luxe-tertiary-fixed-dim" />
            <span className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-luxe-secondary-fixed uppercase">
              LUXE PRIVÉ MEMBERSHIP
            </span>
          </motion.div>

          {/* Heading */}
          <div className="space-y-4">
            <h2 className="text-[36px] sm:text-[44px] md:text-[54px] font-light leading-[1.1] tracking-tight">
              Join the <span className="italic font-normal text-luxe-tertiary-fixed">Inner Circle</span>
            </h2>
            <p className="text-[15px] md:text-[17px] leading-[1.6] text-white/70 max-w-lg mx-auto font-light">
              Subscribe to unlock priority reservations for our highly anticipated Summer 2026 Collection pre-launch event.
            </p>
          </div>

          {/* Interactive Form */}
          <div className="max-w-md mx-auto">
            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center space-y-2"
              >
                <h4 className="text-lg font-semibold text-luxe-secondary-fixed">Subscription Confirmed</h4>
                <p className="text-xs text-white/60">An exclusive invitation has been sent to your inbox.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 focus-visible:border-white/40 text-white rounded-lg pl-12 pr-4 py-6 text-[15px] focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-white/40 h-auto"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-white/40" />
                </div>
                
                {/* Magic UI Shiny Button submit */}
                <ShinyButton type="submit" className="px-10 py-5 text-xs tracking-widest cursor-pointer">
                  REQUEST ACCESS
                </ShinyButton>
              </form>
            )}
          </div>

          {/* Subtext info */}
          <p className="text-[11px] text-white/40 font-medium tracking-wide">
            By joining, you agree to our Terms of Service and Privacy Policy. You can opt out at any time.
          </p>

        </div>
      </div>
    </section>
  );
}
