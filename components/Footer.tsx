"use client"

import { motion, useInView } from "framer-motion"
import { useState, useRef } from "react"
import Link from "next/link"
import { Globe, Flower2, Hexagon, CreditCard, Wallet, Banknote, ArrowUp } from "lucide-react"

export interface FooterLink {
  label: string
  href: string
}

export interface FooterProps {
  quickLinks?: FooterLink[]
  legalLinks?: FooterLink[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
}

export function Footer({ quickLinks = [], legalLinks = [] }: FooterProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const footerRef = useRef(null)
  const isInView = useInView(footerRef, { once: true, margin: "-100px" })

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setIsSubmitting(true)
      setTimeout(() => {
        setIsSubmitting(false)
        setSubscribed(true)
        setEmail("")
      }, 1500)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer ref={footerRef} className="relative bg-[#0d0d0d] pt-20 pb-8 overflow-hidden border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] relative z-10">
        
        {/* Call to Action Title */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.9] overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: 100 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            >
              READY TO REDEFINE
            </motion.span>
            <motion.span
              className="block text-primary mt-2"
              initial={{ y: 100 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1], delay: 0.1 }}
            >
              YOUR AESTHETIC?
            </motion.span>
          </h2>
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl mx-auto mb-16"
        >
          {subscribed ? (
            <div className="text-center p-4 bg-primary/10 border border-primary/20 rounded-xl text-primary font-mono text-sm">
              Access privileges secured. Welcome to the loop.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 font-mono text-sm focus:outline-none focus:border-primary transition-all duration-300"
                />
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  animate={email.length > 0 ? { boxShadow: "0 0 20px rgba(175,255,0,0.15)" } : { boxShadow: "none" }}
                />
              </div>
              <motion.button
                type="submit"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm tracking-wide whitespace-nowrap relative overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span className="relative z-10">{isSubmitting ? "Joining..." : "Get early access"}</span>
              </motion.button>
            </form>
          )}
          <p className="text-white/40 font-mono text-xs mt-3 text-center">
            Join the inner circle. No spam, only high-performance releases.
          </p>
        </motion.div>

        {/* Footer Links & Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 py-12 border-t border-white/5">
          {/* Column 1: Manifesto */}
          <div className="lg:col-span-4 space-y-6">
            <span className="text-xl font-black text-white tracking-tighter block uppercase select-none">
              LU<span className="text-primary">XE</span>
            </span>
            <p className="text-sm leading-relaxed text-white/50 font-light max-w-sm">
              Defining the future of high-performance luxury. Curating elegance and functional masterpieces for the discerning global citizen.
            </p>
            <div className="flex gap-3">
              <div className="size-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer hover:scale-105 active:scale-95">
                <Globe className="size-4.5" />
              </div>
              <div className="size-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer hover:scale-105 active:scale-95">
                <Flower2 className="size-4.5" />
              </div>
              <div className="size-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer hover:scale-105 active:scale-95">
                <Hexagon className="size-4.5" />
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-3 space-y-5 lg:col-start-6">
            <h4 className="font-bold text-white text-sm tracking-wider uppercase font-mono">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/60 hover:text-primary font-mono text-xs transition-colors inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal Specs */}
          <div className="lg:col-span-3 space-y-5">
            <h4 className="font-bold text-white text-sm tracking-wider uppercase font-mono">Legal Specs</h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/60 hover:text-primary font-mono text-xs transition-colors inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Top Scroll */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-6 relative">
          {/* Scroll back to top circle button */}
          <button
            onClick={scrollToTop}
            className="absolute -top-[22px] left-1/2 -translate-x-1/2 size-11 rounded-full bg-[#121212] border border-white/10 hover:border-primary/50 text-white hover:text-primary flex items-center justify-center shadow-md hover:-translate-y-1 transition-all active:scale-95 cursor-pointer z-10"
            aria-label="Back to top"
          >
            <ArrowUp className="size-4.5" />
          </button>

          <p className="text-white/40 font-mono text-xs">
            © 2026 LUXE GLOBAL. All Rights Reserved. Meticulously engineered.
          </p>

          <div className="flex gap-4 opacity-50">
            <Banknote className="size-4.5 text-white" />
            <CreditCard className="size-4.5 text-white" />
            <Wallet className="size-4.5 text-white" />
          </div>
        </div>
      </div>

      {/* Giant Background Text */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[15rem] md:text-[30rem] font-black text-white/[0.015] pointer-events-none select-none leading-none z-0"
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        LUXE
      </motion.div>
    </footer>
  )
}
