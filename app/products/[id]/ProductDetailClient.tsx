"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Minus, Heart, Truck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MagicCard } from "@/components/magicui/magic-card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProductDetailClientProps {
  product: {
    id: number;
    brand: string;
    name: string;
    price: number;
    category: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    badge?: string;
    gallery: string[];
  };
}

const SIZES = ["S", "M", "L", "XL"];

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [activeImage, setActiveImage] = useState(product.imageSrc);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartState, setCartState] = useState<"idle" | "adding" | "success">("idle");

  const handleAddToCart = () => {
    setCartState("adding");
    setTimeout(() => {
      setCartState("success");
      setTimeout(() => setCartState("idle"), 2500);
    }, 1000);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-[64px] py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Thumbnails */}
          <div className="order-2 md:order-1 md:col-span-2 flex md:flex-col gap-3.5 overflow-x-auto md:overflow-y-auto">
            {product.gallery.map((imgUrl, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(imgUrl)}
                className={cn(
                  "relative aspect-square w-16 md:w-full rounded-lg overflow-hidden border transition-all duration-300 flex-shrink-0 cursor-pointer bg-luxe-surface-container-low",
                  activeImage === imgUrl ? "border-luxe-primary ring-2 ring-luxe-primary/10" : "border-luxe-outline-variant/30 hover:border-luxe-primary/50"
                )}
              >
                <Image src={imgUrl} alt={product.imageAlt} fill className="object-cover" />
              </button>
            ))}
          </div>

          {/* Display Preview */}
          <div className="order-1 md:order-2 md:col-span-10 relative aspect-[3/4] rounded-2xl overflow-hidden bg-luxe-surface-container-low border border-luxe-outline-variant/15 shadow-[0_4px_24px_rgba(0,0,0,0.015)] group">
            <Image
              src={activeImage}
              alt={product.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            {product.badge && (
              <Badge className="absolute top-6 left-6 bg-luxe-primary text-luxe-on-primary border-none px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase">
                {product.badge}
              </Badge>
            )}
          </div>
        </div>

        {/* Right Column: Configurations */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Brand & Name */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold tracking-[0.25em] text-luxe-primary uppercase block">
              {product.brand}
            </span>
            <h1 className="text-[32px] md:text-[42px] font-light leading-tight tracking-tight text-luxe-on-surface">
              {product.name}
            </h1>
            <p className="text-[24px] font-bold tracking-tight text-luxe-primary">
              ${product.price.toLocaleString()}
            </p>
          </div>

          {/* Description */}
          <div className="prose prose-sm dark:prose-invert">
            <p className="text-[15px] leading-[1.7] text-luxe-on-surface-variant font-light opacity-95">
              {product.description}
            </p>
          </div>

          {/* Configurations */}
          <div className="space-y-6 pt-6 border-t border-luxe-outline-variant/15">
            {/* Size Selector */}
            {product.category === "Fashion" && (
              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-xs font-bold tracking-wider text-luxe-on-surface-variant uppercase">
                  <span>Selected Size</span>
                  <span className="text-luxe-primary font-bold">{selectedSize}</span>
                </div>
                <div className="flex gap-3">
                  {SIZES.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={cn(
                        "size-12 rounded-lg font-bold text-sm tracking-wide transition-all border cursor-pointer",
                        selectedSize === sz
                          ? "bg-luxe-primary text-luxe-on-primary border-luxe-primary shadow-md"
                          : "border-luxe-outline-variant/30 hover:border-luxe-primary/60 text-luxe-on-surface"
                      )}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-3.5">
              <span className="text-xs font-bold tracking-wider text-luxe-on-surface-variant uppercase block">Quantity</span>
              <div className="flex items-center gap-1.5 rounded-lg border border-luxe-outline-variant/30 bg-luxe-surface-container/30 w-32 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="size-8 rounded-md hover:bg-luxe-accent/15 flex items-center justify-center text-luxe-on-surface transition-colors cursor-pointer"
                >
                  <Minus className="size-4" />
                </button>
                <span className="flex-1 text-center font-bold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="size-8 rounded-md hover:bg-luxe-accent/15 flex items-center justify-center text-luxe-on-surface transition-colors cursor-pointer"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex gap-4 flex-wrap pt-4">
            <Button
              onClick={handleAddToCart}
              className={cn(
                "flex-1 py-6 rounded-lg text-sm font-bold tracking-wider transition-all duration-300 h-auto cursor-pointer shadow-lg",
                cartState === "success"
                  ? "bg-emerald-600 text-white hover:bg-emerald-600/90 shadow-emerald-600/20"
                  : "bg-luxe-primary text-luxe-on-primary hover:bg-luxe-primary/95 shadow-luxe-primary/20"
              )}
            >
              {cartState === "idle" && "ADD TO BAG"}
              {cartState === "adding" && "SECURING ENTRY..."}
              {cartState === "success" && "ADDED SUCCESSFULLY"}
            </Button>
            
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={cn(
                "size-[54px] rounded-lg border flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer",
                isWishlisted
                  ? "border-luxe-primary bg-luxe-primary/5 text-luxe-primary"
                  : "border-luxe-outline-variant/30 hover:border-luxe-primary/50 text-luxe-on-surface"
              )}
            >
              <Heart className={cn("size-5", isWishlisted && "fill-current")} />
            </button>
          </div>

          {/* Concierge Delivery spotlight cards using MagicCard */}
          <MagicCard
            glowColor="rgba(175, 255, 0, 0.08)"
            borderColor="rgba(175, 255, 0, 0.2)"
            className="p-6 rounded-2xl bg-luxe-surface-container-low border border-luxe-outline-variant/20 space-y-4 shadow-sm"
          >
            <div className="flex gap-4 items-start">
              <Truck className="size-5 text-luxe-primary flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-[13px] font-bold tracking-wide text-luxe-on-surface">Concierge Express Shipping</h5>
                <p className="text-xs font-light text-luxe-on-surface-variant leading-relaxed opacity-95">
                  Complimentary express shipping on orders over $1,000. Securely packed and delivered within 2-3 business days.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start border-t border-luxe-outline-variant/15 pt-4">
              <Sparkles className="size-5 text-luxe-primary flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-[13px] font-bold tracking-wide text-luxe-on-surface">Artisan Packaging</h5>
                <p className="text-xs font-light text-luxe-on-surface-variant leading-relaxed opacity-95">
                  Each selection arrives encased in our signature neon lime and charcoal detailed luxury storage boxes, keeping elements pristine.
                </p>
              </div>
            </div>
          </MagicCard>

        </div>
      </div>
    </div>
  );
}
