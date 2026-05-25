"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
  const content = (
    <div className={cn("group cursor-pointer", className)}>
      {/* Image Container — exact 3:4 aspect from Stitch */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-luxe-surface-container-low mb-6">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Optional Badge */}
        {badge && (
          <Badge className="absolute top-6 right-6 bg-luxe-tertiary-container text-luxe-on-tertiary-container border-none px-3 py-1 rounded-full text-[12px] font-semibold leading-[1.2]">
            {badge}
          </Badge>
        )}

        {/* Quick Add — slide-up on hover */}
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onQuickAdd?.();
          }}
          className={cn(
            "absolute bottom-6 left-1/2 -translate-x-1/2",
            "translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
            "bg-white text-luxe-on-surface px-6 py-3 rounded-lg",
            "text-[14px] font-medium tracking-[0.05em]",
            "transition-all duration-300 shadow-xl",
            "flex items-center gap-2 h-auto"
          )}
        >
          <Plus className="size-[18px]" /> QUICK ADD
        </Button>
      </div>

      {/* Product Info */}
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-[14px] font-medium leading-[1.4] tracking-[0.05em] text-luxe-on-surface-variant mb-1">
            {brand}
          </h4>
          <p className="text-[16px] leading-[1.6] font-semibold">
            {name}
          </p>
        </div>
        <p className="text-[14px] font-medium leading-[1.4] tracking-[0.05em] text-luxe-primary">
          {price}
        </p>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
