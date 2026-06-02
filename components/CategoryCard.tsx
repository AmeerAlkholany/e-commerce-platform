"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";

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
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Magic UI Spotlight coordinates
  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);

  // Gen Z 3D spatial tilt values
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const mouseXSpring = useSpring(tiltX, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(tiltY, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Spotlight positioning
    spotX.set(e.clientX - rect.left);
    spotY.set(e.clientY - rect.top);

    // 3D tilt positioning
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    tiltX.set(mouseX / width - 0.5);
    tiltY.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
    setIsHovered(false);
  };

  return (
    <div className="perspective-[1000px] w-full h-full min-h-[300px] md:min-h-0 flex">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn(
          "group relative flex-1 flex flex-col justify-end overflow-hidden rounded-2xl bg-luxe-surface-container-high shadow-[0_4px_24px_rgba(0,0,0,0.02)] select-none border border-luxe-outline-variant/10 cursor-pointer w-full p-0 transition-shadow duration-300 hover:shadow-xl",
          className
        )}
      >
        {/* Background Image with spatial parallax depth */}
        <motion.div 
          className="absolute inset-0 w-full h-full z-0"
          style={{ transform: "translateZ(-20px) scale(1.05)" }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-[1.2s] ease-[0.25,1,0.5,1] group-hover:scale-[1.03]"
            priority={headingSize === "lg"}
          />
        </motion.div>

        {/* Dynamic Spotlight Glow Layer */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                250px circle at ${spotX}px ${spotY}px,
                rgba(255, 255, 255, 0.12),
                transparent 80%
              )
            `,
          }}
        />

        {/* Dynamic Border Spotlight Glow Layer */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                250px circle at ${spotX}px ${spotY}px,
                rgba(255, 255, 255, 0.3),
                transparent 80%
              )
            `,
            maskImage: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
            WebkitMaskImage: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            padding: "1px",
          }}
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-500 group-hover:opacity-90 z-0" />
        <div className="absolute inset-0 bg-luxe-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

        {/* Info card overlay - Glassmorphism floating with 3D Z-index depth */}
        <div 
          style={{ transform: "translateZ(30px)" }}
          className="relative z-20 m-6 p-5 rounded-xl border border-white/10 bg-white/10 backdrop-blur-md transition-all duration-500 group-hover:bg-white/15 group-hover:border-white/20 flex justify-between items-center"
        >
          <div className="space-y-1">
            <h3
              className={cn(
                "text-white leading-[1.2] font-light",
                headingSize === "lg"
                  ? "text-[22px] md:text-[28px] tracking-tight"
                  : "text-[18px] md:text-[22px] tracking-wide"
              )}
            >
              {title}
            </h3>
            <span className="text-white/70 text-[10px] font-bold tracking-[0.1em] uppercase block">
              {linkLabel}
            </span>
          </div>
          
          {/* Animated Arrow Icon */}
          <div className="size-10 rounded-full bg-white text-luxe-on-surface flex items-center justify-center transition-transform duration-500 group-hover:rotate-45 shadow-md shrink-0">
            <ArrowUpRight className="size-4.5" />
          </div>
        </div>

        {/* Direct Link wrapper */}
        <Link href={href} className="absolute inset-0 z-30" aria-label={`Browse ${title}`} />
      </motion.div>
    </div>
  );
}
