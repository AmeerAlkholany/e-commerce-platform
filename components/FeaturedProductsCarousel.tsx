"use client";

import type React from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

const featuredProducts = [
  {
    id: 1,
    name: "Aero X1 Chair",
    tagline: "Ergonomic Masterpiece",
    description: "Aerospace-grade aluminum frame wrapped in breathable mesh, offering weightless support and uncompromising style.",
    image: "/product1.png",
    bgColor: "from-luxe-primary/10 via-luxe-primary/5 to-transparent",
    accentColor: "#3525cd", // Luxe Indigo
    price: "$850",
  },
  {
    id: 2,
    name: "Lumina Pendant",
    tagline: "Sculptural Lighting",
    description: "Hand-blown glass meets precision-machined brass in this breathtaking statement piece for modern dining spaces.",
    image: "/product2.png",
    bgColor: "from-[#ffb695]/15 via-[#ffb695]/5 to-transparent",
    accentColor: "#ffb695", // Luxe Copper
    price: "$1,200",
  },
  {
    id: 3,
    name: "Velvet Lounge",
    tagline: "Modern Comfort",
    description: "Deep, sumptuous seating draped in premium Italian velvet, supported by a minimalist blackened steel base.",
    image: "/product3.png",
    bgColor: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    accentColor: "#10b981", // Emerald accent
    price: "$2,400",
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
    rotateY: direction > 0 ? 15 : -15,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.9,
    rotateY: direction > 0 ? -15 : 15,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  }),
};

export function FeaturedProductsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [[page, direction], setPage] = useState([0, 0]);
  const currentProduct = featuredProducts[currentIndex];

  const rotateX = useSpring(0, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    rotateY.set(x * 5);
    rotateX.set(-y * 5);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const paginate = (newDirection: number) => {
    const newIndex = (currentIndex + newDirection + featuredProducts.length) % featuredProducts.length;
    setCurrentIndex(newIndex);
    setPage([page + newDirection, newDirection]);
  };

  const nextProduct = () => paginate(1);
  const prevProduct = () => paginate(-1);

  return (
    <section className="relative py-24 bg-white dark:bg-[#0a0a0a] overflow-hidden">
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${currentProduct.bgColor}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        key={`bg-${currentProduct.id}`}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-[64px]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-16"
        >
          <motion.span
            className="text-[12px] font-bold tracking-[0.25em] text-luxe-on-surface-variant uppercase"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            CURATED SELECTION
          </motion.span>
          <h2 className="text-[36px] md:text-[56px] font-light leading-[1.1] tracking-tight text-luxe-on-surface mt-3 overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ y: 80 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            >
              DISCOVER{" "}
            </motion.span>
            <motion.span
              className="inline-block font-normal italic"
              style={{ color: currentProduct.accentColor }}
              initial={{ y: 80 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1], delay: 0.1 }}
            >
              EXCELLENCE
            </motion.span>
          </h2>
        </motion.div>

        <div className="relative h-[600px] flex items-center justify-center perspective-[1000px]">
          {/* Controls */}
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between z-20 pointer-events-none px-4 md:px-12">
            <motion.button
              onClick={prevProduct}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md border border-luxe-outline-variant/30 flex items-center justify-center text-luxe-on-surface pointer-events-auto hover:bg-white dark:hover:bg-black transition-colors shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <motion.button
              onClick={nextProduct}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md border border-luxe-outline-variant/30 flex items-center justify-center text-luxe-on-surface pointer-events-auto hover:bg-white dark:hover:bg-black transition-colors shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={page}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="absolute inset-0 w-full h-full flex flex-col md:flex-row items-center justify-center gap-12"
              >
                {/* Product Image Side */}
                <div className="w-full md:w-1/2 h-[300px] md:h-[500px] relative">
                  <motion.div
                    className="absolute inset-0 rounded-full blur-[100px] opacity-40 mix-blend-multiply dark:mix-blend-screen"
                    style={{ backgroundColor: currentProduct.accentColor }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="relative w-full h-full flex items-center justify-center"
                    style={{ transform: "translateZ(80px)" }}
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  >
                    <div className="relative w-full h-full max-w-[400px] max-h-[400px]">
                      <Image
                        src={currentProduct.image}
                        alt={currentProduct.name}
                        fill
                        className="object-contain drop-shadow-2xl"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Product Details Side */}
                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-10" style={{ transform: "translateZ(40px)" }}>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span
                      className="text-sm font-bold tracking-widest uppercase mb-3 block"
                      style={{ color: currentProduct.accentColor }}
                    >
                      {currentProduct.tagline}
                    </span>
                    <h3 className="text-4xl md:text-5xl font-light text-luxe-on-surface tracking-tight mb-4">
                      {currentProduct.name}
                    </h3>
                    <p className="text-luxe-on-surface-variant text-lg leading-relaxed mb-8 max-w-md">
                      {currentProduct.description}
                    </p>
                    
                    <div className="flex items-center gap-6">
                      <span className="text-2xl font-normal text-luxe-on-surface">{currentProduct.price}</span>
                      <Link href={`/products/${currentProduct.id}`}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-8 py-4 rounded-full text-white font-medium flex items-center gap-2 group transition-all"
                          style={{ backgroundColor: currentProduct.accentColor }}
                        >
                          View Details
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-3 mt-12">
          {featuredProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const newDirection = index > currentIndex ? 1 : -1;
                setCurrentIndex(index);
                setPage([page + newDirection, newDirection]);
              }}
              className="group py-2"
            >
              <motion.div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-8" : "w-2 bg-luxe-outline-variant/40 group-hover:bg-luxe-outline-variant"
                }`}
                style={{ backgroundColor: index === currentIndex ? currentProduct.accentColor : undefined }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
