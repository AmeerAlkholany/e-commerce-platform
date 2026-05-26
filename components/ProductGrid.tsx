"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard, type ProductCardProps } from "@/components/ProductCard";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface ProductGridProps {
  sectionLabel?: string;
  sectionTitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  products: Omit<ProductCardProps, "onQuickAdd">[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const columnClasses = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
} as const;

export function ProductGrid({
  sectionLabel,
  sectionTitle,
  viewAllHref,
  viewAllLabel = "VIEW ALL PRODUCTS",
  products,
  columns = 4,
  className,
}: ProductGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 18,
      },
    },
  };

  return (
    <div className={cn(className)}>
      {/* Optional Section Header */}
      {(sectionLabel || sectionTitle) && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-end mb-12"
        >
          <div>
            {sectionLabel && (
              <span className="text-[12px] font-bold tracking-[0.2em] text-luxe-primary mb-1.5 block uppercase">
                {sectionLabel}
              </span>
            )}
            {sectionTitle && (
              <h2 className="text-[32px] font-light tracking-tight text-luxe-on-surface">
                {sectionTitle}
              </h2>
            )}
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-[13px] font-bold tracking-wider text-luxe-on-surface-variant hover:text-luxe-primary transition-colors duration-200 flex items-center gap-1 uppercase"
            >
              {viewAllLabel}{" "}
              <ArrowRight className="size-4" />
            </Link>
          )}
        </motion.div>
      )}

      {/* Product Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        className={cn(
          "grid gap-6",
          columnClasses[columns]
        )}
      >
        {products.map((product, index) => (
          <motion.div key={`${product.name}-${index}`} variants={itemVariants}>
            <ProductCard {...product} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
