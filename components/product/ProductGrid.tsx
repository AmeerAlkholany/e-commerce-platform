import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard, type ProductCardProps } from "./ProductCard";
import { cn } from "@/lib/utils";

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
  return (
    <div className={cn(className)}>
      {/* Optional Section Header */}
      {(sectionLabel || sectionTitle) && (
        <div className="flex justify-between items-end mb-12">
          <div>
            {sectionLabel && (
              <span className="text-[14px] font-medium leading-[1.4] tracking-widest text-luxe-primary mb-1 block">
                {sectionLabel}
              </span>
            )}
            {sectionTitle && (
              <h2 className="text-[32px] font-semibold leading-[1.2] tracking-[-0.02em]">
                {sectionTitle}
              </h2>
            )}
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-[14px] font-medium leading-[1.4] tracking-[0.05em] text-luxe-on-surface-variant hover:text-luxe-primary transition-colors duration-200 flex items-center gap-1"
            >
              {viewAllLabel}{" "}
              <ArrowRight className="size-[18px]" />
            </Link>
          )}
        </div>
      )}

      {/* Product Grid */}
      <div
        className={cn(
          "grid gap-6",
          columnClasses[columns]
        )}
      >
        {products.map((product, index) => (
          <ProductCard key={`${product.name}-${index}`} {...product} />
        ))}
      </div>
    </div>
  );
}
