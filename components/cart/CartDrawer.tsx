"use client";

import { useCart } from "@/components/providers/cart-context";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function CartDrawer() {
  const {
    items,
    cartCount,
    cartTotal,
    isCartOpen,
    isLoading,
    isUpdating,
    closeCart,
    updateQuantity,
    removeItem,
  } = useCart();

  const shippingThreshold = 1000;
  const freeShipping = cartTotal >= shippingThreshold;
  const shippingCost = freeShipping ? 0 : 25;
  const orderTotal = cartTotal + shippingCost;
  const progressToFreeShipping = Math.min(
    (cartTotal / shippingThreshold) * 100,
    100
  );

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[440px] bg-[#121212] border-l border-white/10 shadow-2xl z-[60] flex flex-col"
          >
            {/* ─── Header ─── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-bold tracking-[0.2em] text-white uppercase">
                  Your Bag
                </h2>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
                aria-label="Close cart"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* ─── Free Shipping Progress ─── */}
            {cartCount > 0 && (
              <div className="px-6 py-3 border-b border-white/5">
                <div className="flex justify-between text-[11px] font-medium mb-2">
                  <span className="text-white/50">
                    {freeShipping ? (
                      <span className="text-primary font-bold">
                        ✓ Free express shipping unlocked!
                      </span>
                    ) : (
                      <>
                        Add{" "}
                        <span className="text-primary font-bold">
                          ${(shippingThreshold - cartTotal).toLocaleString()}
                        </span>{" "}
                        more for free shipping
                      </>
                    )}
                  </span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToFreeShipping}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full"
                  />
                </div>
              </div>
            )}

            {/* ─── Body ─── */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              {isLoading ? (
                /* Skeleton Loading */
                <div className="p-6 space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex gap-4 animate-pulse"
                    >
                      <div className="w-20 h-24 rounded-lg bg-white/5" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-3 w-2/3 bg-white/5 rounded" />
                        <div className="h-3 w-1/3 bg-white/5 rounded" />
                        <div className="h-3 w-1/4 bg-white/5 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : items.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center h-full px-6 py-16 text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6"
                  >
                    <ShoppingBag className="size-8 text-white/20" />
                  </motion.div>
                  <h3 className="text-lg font-light text-white mb-2">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed max-w-[260px] mb-8">
                    Explore our curated collections and discover masterfully
                    crafted pieces.
                  </p>
                  <Button
                    onClick={closeCart}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-lg text-xs font-bold tracking-wider h-auto"
                    asChild
                  >
                    <Link href="/products">
                      EXPLORE CATALOGUE
                      <ArrowRight className="size-3.5 ml-2" />
                    </Link>
                  </Button>
                </div>
              ) : (
                /* Cart Items */
                <div className="p-6 space-y-1">
                  <AnimatePresence initial={false}>
                    {items.map((item) => {
                      const price =
                        typeof item.products.price === "string"
                          ? parseFloat(item.products.price)
                          : item.products.price;

                      return (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{
                            opacity: 0,
                            x: 60,
                            height: 0,
                            marginBottom: 0,
                            paddingTop: 0,
                            paddingBottom: 0,
                            transition: { duration: 0.3 },
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 28,
                          }}
                          className="flex gap-4 py-4 border-b border-white/5 last:border-none"
                        >
                          {/* Product Image */}
                          <Link
                            href={`/products/${item.product_id}`}
                            onClick={closeCart}
                            className="relative w-20 h-24 rounded-lg overflow-hidden bg-[#1a1a1a] border border-white/5 flex-shrink-0 group"
                          >
                            <Image
                              src={
                                item.products.image_url || "/placeholder.jpg"
                              }
                              alt={item.products.name}
                              fill
                              sizes="80px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </Link>

                          {/* Item Details */}
                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div>
                              <Link
                                href={`/products/${item.product_id}`}
                                onClick={closeCart}
                                className="text-sm font-medium text-white hover:text-primary transition-colors line-clamp-1 block"
                              >
                                {item.products.name}
                              </Link>
                              <p className="text-xs text-primary font-bold mt-0.5">
                                ${price.toLocaleString()}
                              </p>
                            </div>

                            {/* Quantity & Remove */}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/5">
                                <button
                                  onClick={() =>
                                    item.quantity > 1
                                      ? updateQuantity(
                                          item.id,
                                          item.quantity - 1
                                        )
                                      : removeItem(item.id)
                                  }
                                  disabled={isUpdating}
                                  className="size-7 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-l-lg transition-colors disabled:opacity-40"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="size-3" />
                                </button>
                                <span className="w-8 text-center text-xs font-bold text-white select-none">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.id,
                                      item.quantity + 1
                                    )
                                  }
                                  disabled={isUpdating}
                                  className="size-7 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-r-lg transition-colors disabled:opacity-40"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="size-3" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeItem(item.id)}
                                disabled={isUpdating}
                                className="text-white/30 hover:text-red-400 transition-colors p-1 disabled:opacity-40"
                                aria-label="Remove item"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Line Total */}
                          <div className="text-right flex-shrink-0">
                            <span className="text-sm font-bold text-white">
                              ${(price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* ─── Footer ─── */}
            {items.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="border-t border-white/10 px-6 py-5 space-y-4 bg-[#0e0e0e]"
              >
                {/* Totals breakdown */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs text-white/50">
                    <span>Subtotal</span>
                    <span className="font-medium text-white/70">
                      ${cartTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-white/50">
                    <span>Shipping</span>
                    <span
                      className={cn(
                        "font-medium",
                        freeShipping
                          ? "text-primary font-bold"
                          : "text-white/70"
                      )}
                    >
                      {freeShipping ? "FREE" : `$${shippingCost}`}
                    </span>
                  </div>
                  <div className="border-t border-white/10 pt-2.5 flex justify-between">
                    <span className="text-sm font-bold tracking-wider text-white uppercase">
                      Total
                    </span>
                    <span className="text-lg font-bold text-primary">
                      ${orderTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={() => {
                    toast.info("Checkout coming soon", {
                      description:
                        "We're building an amazing checkout experience for you.",
                    });
                  }}
                  className="w-full py-6 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold tracking-[0.15em] h-auto shadow-lg shadow-primary/20 active:scale-[0.98] transition-all duration-200"
                >
                  PROCEED TO CHECKOUT
                </Button>

                {/* Continue Shopping */}
                <button
                  onClick={closeCart}
                  className="w-full text-center text-xs text-white/40 hover:text-primary font-medium tracking-wider uppercase transition-colors py-1"
                >
                  Continue Shopping
                </button>
              </motion.div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
