"use client"

import Image from "next/image"
import Link from "next/link"
import { Plus, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef, useState } from "react"

export interface ProductCardProps {
  brand: string
  name: string
  price: string
  imageSrc: string
  imageAlt: string
  href?: string
  badge?: string
  onQuickAdd?: () => void
  className?: string
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
  const ref = useRef<HTMLDivElement>(null)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // 3D spatial tilt values
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)

  const mouseXSpring = useSpring(tiltX, { stiffness: 350, damping: 25 })
  const mouseYSpring = useSpring(tiltY, { stiffness: 350, damping: 25 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    tiltX.set(mouseX / width - 0.5)
    tiltY.set(mouseY / height - 0.5)
  }

  const handleMouseLeave = () => {
    tiltX.set(0)
    tiltY.set(0)
    setIsHovered(false)
  }

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const buttonVariants = {
    initial: { y: 15, opacity: 0, x: "-50%" },
    hover: {
      y: 0,
      opacity: 1,
      x: "-50%",
      transition: {
        type: "spring",
        stiffness: 250,
        damping: 18,
      },
    },
  }

  const content = (
    <div className="perspective-[1000px] w-full flex">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn(
          "group relative flex-1 flex flex-col overflow-hidden rounded-2xl bg-[#1a1a1a] border border-white/10 p-4 shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(175,255,0,0.15)] select-none cursor-pointer w-full",
          className
        )}
      >
        {/* Animated border glow */}
        <motion.div
          className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
          style={{
            background: "linear-gradient(135deg, rgba(175,255,0,0.25), transparent, rgba(175,255,0,0.25))",
            filter: "blur(6px)",
          }}
        />

        {/* Card Content Wrapper to overlay on glow */}
        <div className="relative z-10 flex-1 flex flex-col">
          {/* Image Container — exact 3:4 aspect */}
          <div
            style={{ transform: "translateZ(15px)" }}
            className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#121212] mb-4 border border-white/5"
          >
            {/* Shimmer skeleton */}
            {!isLoaded && <div className="absolute inset-0 shimmer-effect bg-[#222222] z-0" />}

            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onLoad={() => setIsLoaded(true)}
              className={cn(
                "object-cover transition-all duration-[1.2s] ease-[0.25,1,0.5,1] group-hover:scale-[1.04]",
                isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )}
            />

            {/* Wishlist Heart Overlay */}
            <button
              onClick={toggleWishlist}
              className="absolute top-4 right-4 z-20 size-8.5 rounded-full bg-[#121212]/75 backdrop-blur-md hover:bg-primary hover:text-primary-foreground text-white flex items-center justify-center transition-all duration-300 active:scale-90 border border-white/10 shadow-sm"
              aria-label="Add to wishlist"
            >
              <Heart
                className={cn(
                  "size-[16px] transition-colors duration-300",
                  isWishlisted ? "fill-primary text-primary scale-110" : "text-white/75"
                )}
              />
            </button>

            {/* Optional Badge */}
            {badge && (
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground border-none px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-[0.05em] uppercase font-mono">
                {badge}
              </Badge>
            )}

            {/* Quick Add Button */}
            <motion.div
              variants={buttonVariants}
              animate={isHovered ? "hover" : "initial"}
              className="absolute bottom-4 left-1/2 z-20"
            >
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onQuickAdd?.()
                }}
                className={cn(
                  "bg-primary text-primary-foreground px-5 py-2.5 rounded-lg",
                  "text-[11px] font-bold tracking-wider hover:bg-white hover:text-black shadow-xl active:scale-95 transition-all duration-300",
                  "flex items-center gap-1.5 h-auto border-none cursor-pointer text-nowrap"
                )}
              >
                <Plus className="size-3.5" /> QUICK ADD
              </Button>
            </motion.div>
          </div>

          {/* Product Info with depth */}
          <div style={{ transform: "translateZ(20px)" }} className="flex justify-between items-start px-1 gap-2 mt-1">
            <div className="space-y-1">
              <h4 className="text-[10px] font-bold tracking-wider text-white/50 uppercase font-mono">{brand}</h4>
              <p className="text-[14px] leading-tight font-medium text-white group-hover:text-primary transition-colors duration-300 line-clamp-1">
                {name}
              </p>
            </div>
            <p className="text-[13px] font-bold tracking-tight text-primary text-nowrap mt-0.5">{price}</p>
          </div>
        </div>
      </motion.div>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
