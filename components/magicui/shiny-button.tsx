"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShinyButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  className?: string;
}

export function ShinyButton({
  children,
  className,
  ...props
}: ShinyButtonProps) {
  return (
    <motion.button
      {...props}
      initial={{ "--x": "100%", scale: 1 }}
      animate={{ "--x": "-100%" }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        "--x": {
          repeat: Infinity,
          repeatType: "loop",
          duration: 2.2,
          ease: "linear",
        },
        scale: {
          type: "spring",
          stiffness: 400,
          damping: 25,
        },
      }}
      className={cn(
        "relative rounded-lg px-8 py-3.5 text-sm font-semibold tracking-wide uppercase transition-all duration-300 text-white",
        "bg-linear-to-r from-luxe-primary via-indigo-700 to-luxe-primary bg-[length:200%_auto] bg-left",
        "border border-white/10 hover:border-white/20 shadow-lg shadow-luxe-primary/20",
        className
      )}
      style={
        {
          backgroundImage:
            "radial-gradient(circle at var(--x) 50%, rgba(255, 255, 255, 0.25) 0%, transparent 60%), linear-gradient(135deg, var(--color-luxe-primary) 0%, #4f46e5 100%)",
        } as React.CSSProperties
      }
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
