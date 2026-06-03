"use client";

import type React from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Diamond, Shield, Clock, Sparkles } from "lucide-react";

const features = [
  {
    icon: Diamond,
    title: "100%",
    subtitle: "Authentic Materials",
    description: "Sourced with rigorous integrity standards",
    accent: "#ffb695", // Luxe Copper
  },
  {
    icon: Shield,
    title: "Lifetime",
    subtitle: "Quality Guarantee",
    description: "Enduring craftsmanship that lasts",
    accent: "#3525cd", // Luxe Indigo
  },
  {
    icon: Clock,
    title: "24/7",
    subtitle: "Concierge Access",
    description: "Private support for our inner circle",
    accent: "#00D4FF", // High-end tech blue
  },
  {
    icon: Sparkles,
    title: "Bespoke",
    subtitle: "Artisan Packaging",
    description: "Unboxing tailored to perfection",
    accent: "#ffb695",
  },
];

function FeatureCard({ feature, index }: { feature: (typeof features)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <div className="perspective-[1000px] h-full">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative group cursor-pointer h-full"
      >
        {/* Animated border glow */}
        <motion.div
          className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${feature.accent}40, transparent, ${feature.accent}40)`,
            filter: "blur(8px)",
            transform: "translateZ(-10px)",
          }}
        />

        {/* Card */}
        <div className="relative bg-white dark:bg-luxe-inverse-surface rounded-2xl p-6 border border-luxe-outline-variant/20 overflow-hidden h-full shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          {/* Shine effect on hover */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
            initial={false}
            animate={
              isHovered
                ? {
                    background: [
                      "linear-gradient(105deg, transparent 20%, rgba(53, 37, 205, 0.03) 25%, transparent 30%)",
                      "linear-gradient(105deg, transparent 70%, rgba(53, 37, 205, 0.03) 75%, transparent 80%)",
                    ],
                  }
                : {}
            }
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full min-h-[160px]" style={{ transform: "translateZ(20px)" }}>
            {/* Icon with pulse animation */}
            <motion.div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 relative"
              style={{ backgroundColor: `${feature.accent}15` }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{ backgroundColor: feature.accent }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isHovered ? { opacity: [0.15, 0.3, 0.15], scale: [1, 1.15, 1] } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              />
              <feature.icon className="w-5 h-5 relative z-10" style={{ color: feature.accent }} />
            </motion.div>

            {/* Title with count-up feel */}
            <div className="flex-1">
              <motion.div
                className="text-[28px] font-black tracking-tight"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 + index * 0.1 }}
              >
                <span style={{ color: feature.accent }}>{feature.title}</span>
              </motion.div>
              <h3 className="text-sm font-bold text-luxe-on-surface mt-1 tracking-wide uppercase">{feature.subtitle}</h3>
              <p className="text-[13px] text-luxe-on-surface-variant/80 mt-1.5 font-light">{feature.description}</p>
            </div>

            {/* Bottom accent line */}
            <motion.div
              className="h-[2px] rounded-full mt-5"
              style={{ backgroundColor: feature.accent }}
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 + index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function FeaturedBenefits() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="relative py-24 bg-luxe-surface-container-lowest overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-luxe-surface-container-low/50 to-transparent" />

      <div ref={ref} className="max-w-[1440px] mx-auto px-4 md:px-[64px] relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            className="inline-block text-[12px] font-bold tracking-[0.25em] text-luxe-primary uppercase"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.1 }}
          >
            THE LUXE STANDARD
          </motion.span>

          <div className="overflow-hidden mt-3">
            <motion.h2
              className="text-[36px] md:text-[44px] font-light leading-none tracking-tight text-luxe-on-surface"
              initial={{ y: 60 }}
              animate={isInView ? { y: 0 } : { y: 60 }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1], delay: 0.15 }}
            >
              Uncompromising Quality
            </motion.h2>
          </div>

          {/* Animated underline */}
          <motion.div
            className="h-[2px] w-12 bg-luxe-primary mx-auto mt-4 rounded-full"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
