"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    quote: "The curation at LUXE is absolute perfection. Every piece I've bought feels unique and commands attention. Delivery was pristine.",
    name: "Elena Rostova",
    role: "Architectural Designer, Milan",
    rating: 5,
  },
  {
    quote: "Exceptional design and durability. The Horizon Chronograph is not just a watch; it's a structural masterpiece on my wrist.",
    name: "Marcus Vance",
    role: "Creative Director, London",
    rating: 5,
  },
  {
    quote: "A flawless shopping experience from start to finish. The customer support inner circle felt incredibly exclusive and helpful.",
    name: "Sienna Martinez",
    role: "Fine Art Collector, New York",
    rating: 5,
  },
  {
    quote: "Functional elegance in its purest form. Their active tech smart bracelet matches my active lifestyle without sacrificing aesthetics.",
    name: "Kaito Tanaka",
    role: "Tech Entrepreneur, Tokyo",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-luxe-surface-container-lowest relative overflow-hidden mesh-glow">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[64px] relative z-10">
        
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[12px] font-bold tracking-[0.25em] text-luxe-primary uppercase block">
            VERIFIED VOICES
          </span>
          <h2 className="text-[36px] md:text-[44px] font-light tracking-tight text-luxe-on-surface">
            The Discerning View
          </h2>
          <p className="text-[15px] leading-[1.6] text-luxe-on-surface-variant font-light opacity-80">
            Hear from our global collective of designers, artists, and creators who choose LUXE to define their personal aesthetic.
          </p>
        </div>

        {/* Carousel Grid / Horizontal flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", stiffness: 60, damping: 15, delay: idx * 0.1 }}
              className="glass-panel p-8 rounded-2xl flex flex-col justify-between h-[300px] shadow-[0_10px_30px_rgba(0,0,0,0.01)] hover:-translate-y-2 transition-transform duration-300 relative group overflow-hidden glow-border"
            >
              {/* Quote icon background */}
              <Quote className="absolute -top-2 -right-2 size-24 text-luxe-primary/5 select-none pointer-events-none group-hover:scale-110 transition-transform duration-500" />
              
              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex gap-1 text-luxe-tertiary">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                
                {/* Quote Text */}
                <p className="text-[14px] leading-[1.6] text-luxe-on-surface font-light opacity-90 italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="border-t border-luxe-outline-variant/10 pt-4 flex items-center gap-3">
                <div className="size-9 rounded-full bg-luxe-primary-container text-luxe-on-primary flex items-center justify-center font-bold text-xs select-none shadow-inner">
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h4 className="text-[13px] font-bold tracking-wide text-luxe-on-surface">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-luxe-on-surface-variant font-medium opacity-70">
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
