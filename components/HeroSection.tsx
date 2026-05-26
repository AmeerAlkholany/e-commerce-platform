"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export interface HeroSectionProps {
  subtitle: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  imageSrc: string;
  imageAlt: string;
}

export function HeroSection({
  subtitle,
  title,
  description,
  primaryCta,
  secondaryCta,
  imageSrc,
  imageAlt,
}: HeroSectionProps) {
  // Container variant to stagger children animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  // Upward slide and fade variants
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 15,
      },
    },
  };

  return (
    <section className="relative h-[870px] w-full overflow-hidden bg-luxe-surface-dim group">
      {/* Background Image with elegant slow loading zoom */}
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full"
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="100vw"
          priority={true}
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
        />
      </motion.div>

      {/* Modern Luxury Ambient Gradient Overlay */}
      <div className="absolute inset-0 hero-gradient z-10" />

      {/* Content Container */}
      <div className="relative h-full max-w-[1440px] mx-auto px-4 md:px-[64px] flex flex-col justify-end pb-20 z-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl text-white"
        >
          {/* Tags / Subtitle */}
          <motion.span
            variants={itemVariants}
            className="text-[14px] font-bold leading-[1.4] tracking-[0.25em] text-luxe-primary-fixed-dim mb-6 block uppercase"
          >
            {subtitle}
          </motion.span>

          {/* Heading with spring y-slide */}
          <motion.h1
            variants={itemVariants}
            className="text-[44px] md:text-[68px] font-light leading-[1.05] tracking-tight mb-6"
          >
            {title.split(" ").map((word, idx) => (
              <span key={idx} className={idx === 1 ? "italic font-normal text-luxe-primary-fixed-dim" : "font-light"}>
                {word}{" "}
              </span>
            ))}
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-[18px] leading-[1.7] mb-12 opacity-85 font-light"
          >
            {description}
          </motion.p>

          {/* Spring-activated CTA buttons */}
          <motion.div variants={itemVariants} className="flex gap-6 flex-wrap">
            <Button
              asChild
              className="bg-luxe-primary text-luxe-on-primary px-12 py-6 rounded-lg text-[14px] font-semibold tracking-wider hover:-translate-y-[3px] transition-all duration-300 shadow-xl shadow-luxe-primary/20 h-auto cursor-pointer"
            >
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="glass-panel text-white hover:text-luxe-on-surface px-12 py-6 rounded-lg text-[14px] font-semibold tracking-wider hover:bg-luxe-surface transition-all duration-300 h-auto border-none cursor-pointer"
            >
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
