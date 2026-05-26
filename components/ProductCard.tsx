"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface ProductCardProps {
  brand: string;
  name: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
  href?: string;
  badge?: string;
  onQuickAdd?: () => void;
  className?: string;
}

export function ProductCard({
  brand,
  name,
  price,
  imageSrc,
  imageAlt,
  href,
  badge,
  onQuickAdd,
  className,
}: ProductCardProps) {
  const cardVariants = {
    initial: { y: 0, scale: 1 },
    hover: {
      y: -6,
      scale: 1.01,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const buttonVariants = {
    initial: { y: 20, opacity: 0, x: "-50%" },
    hover: {
      y: 0,
      opacity: 1,
      x: "-50%",
      transition: {
        type: "spring",
        stiffness: 250,
        damping: 18
      }
    }
  };

  const content = (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      className={cn("group cursor-pointer select-none", className)}
    >
      {/* Image Container — exact 3:4 aspect */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-luxe-surface-container-low mb-6 shadow-sm border border-luxe-outline-variant/10">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Optional Badge */}
        {badge && (
          <Badge className="absolute top-6 right-6 bg-luxe-tertiary-container text-luxe-on-tertiary-container border-none px-3 py-1 rounded-full text-[12px] font-semibold leading-[1.2]">
            {badge}
          </Badge>
        )}

        {/* Quick Add Button with springy slide up */}
        <motion.div
          variants={buttonVariants}
          className="absolute bottom-6 left-1/2"
        >
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickAdd?.();
            }}
            className={cn(
              "bg-white text-luxe-on-surface px-6 py-3 rounded-lg",
              "text-[13px] font-semibold tracking-wider",
              "shadow-xl hover:bg-luxe-surface active:scale-95 transition-all duration-200",
              "flex items-center gap-1.5 h-auto border-none cursor-pointer"
            )}
          >
            <Plus className="size-4" /> QUICK ADD
          </Button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="flex justify-between items-start px-1">
        <div className="space-y-1">
          <h4 className="text-[12px] font-bold leading-[1.4] tracking-[0.05em] text-luxe-on-surface-variant uppercase opacity-80">
            {brand}
          </h4>
          <p className="text-[16px] leading-[1.4] font-light text-luxe-on-surface group-hover:text-luxe-primary transition-colors duration-300">
            {name}
          </p>
        </div>
        <p className="text-[14px] font-bold leading-[1.4] tracking-[0.05em] text-luxe-primary">
          {price}
        </p>
      </div>
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
