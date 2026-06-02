"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Compass } from "lucide-react";

export function BrandStory() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 70, damping: 16 }
    }
  };

  const stats = [
    { value: "150+", label: "Artisan Designers", icon: Sparkles },
    { value: "50K+", label: "Global Customers", icon: Compass },
    { value: "100%", label: "Sourced Integrity", icon: Shield },
  ];

  return (
    <section className="py-24 bg-luxe-surface dark:bg-luxe-inverse-surface/20 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[64px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Story & Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-6 space-y-8"
          >
            <div className="space-y-3">
              <span className="text-[12px] font-bold tracking-[0.25em] text-luxe-primary uppercase block">
                OUR MANIFESTO
              </span>
              <h2 className="text-[36px] md:text-[48px] font-light leading-[1.1] tracking-tight text-luxe-on-surface">
                Crafting the Future of <span className="italic font-normal text-luxe-secondary-fixed-dim">Conscious Luxury</span>
              </h2>
            </div>
            
            <p className="text-[16px] leading-[1.7] text-luxe-on-surface-variant font-light opacity-95">
              Founded in 2018, LUXE GLOBAL was born out of a desire to create a digital sanctuary for individuals who appreciate the finer details of master craftsmanship. We believe luxury is not about excess, but about highly curated selections that tell a story of dedication, authenticity, and enduring aesthetic value.
            </p>
            
            <p className="text-[15px] leading-[1.7] text-luxe-on-surface-variant font-light opacity-80">
              Each piece in our collection is handpicked from independent designers who merge time-tested techniques with progressive, high-performance styling.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-luxe-outline-variant/20">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center gap-1.5 text-luxe-primary">
                      <Icon className="size-4 opacity-75" />
                      <span className="text-xl md:text-2xl font-bold tracking-tight">{stat.value}</span>
                    </div>
                    <p className="text-[11px] font-semibold tracking-[0.05em] text-luxe-on-surface-variant uppercase opacity-70">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column: Lifestyle Visual Image Card */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.98 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 50, damping: 18, delay: 0.2 }}
              className="relative aspect-[4/5] md:aspect-[1.2] lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-luxe-outline-variant/20 group"
            >
              <Image
                src="/brand_story.png"
                alt="Modern concrete studio with minimalist chair and bright sunlight filtering through the window."
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-1500 group-hover:scale-105"
              />
              
              {/* Glassmorphic Brand Accent Box */}
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md text-white flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-luxe-secondary-fixed block mb-1">STUDIO ESSENTIALS</span>
                  <p className="text-sm font-light tracking-wide">Explore our architectural lookbook.</p>
                </div>
                <div className="size-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors cursor-pointer">
                  <ArrowRight className="size-5" />
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
