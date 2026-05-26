"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface CategoryCardProps {
  title: string;
  linkLabel: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  /** Use to control heading size: "lg" for main categories, "md" for secondary */
  headingSize?: "lg" | "md";
  className?: string;
}

export function CategoryCard({
  title,
  linkLabel,
  href,
  imageSrc,
  imageAlt,
  headingSize = "md",
  className,
}: CategoryCardProps) {
  const containerVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.015,
      transition: {
        type: "spring",
        stiffness: 280,
        damping: 22
      }
    }
  };

  const textVariants = {
    initial: { y: 0 },
    hover: {
      y: -2,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      whileHover="hover"
      className={cn(
        "relative group overflow-hidden rounded-xl bg-luxe-surface-container-high shadow-sm select-none border border-luxe-outline-variant/10 cursor-pointer",
        className
      )}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-1000 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors duration-500" />
      
      <motion.div
        variants={textVariants}
        className="absolute bottom-6 left-6 p-6 z-10 space-y-2"
      >
        <h3
          className={cn(
            "text-white leading-[1.2]",
            headingSize === "lg"
              ? "text-[32px] font-light tracking-tight"
              : "text-[24px] font-light tracking-wide"
          )}
        >
          {title}
        </h3>
        <Link
          href={href}
          className="text-white text-[13px] font-bold tracking-[0.08em] uppercase underline underline-offset-4 block hover:opacity-85 transition-opacity"
        >
          {linkLabel}
        </Link>
      </motion.div>
    </motion.div>
  );
}
