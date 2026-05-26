"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
  Sparkles
} from "lucide-react";

interface OrderItem {
  name: string;
  price: string;
  qty: number;
}

interface Order {
  id: string;
  date: string;
  total: string;
  status: "Placed" | "Processing" | "Shipped" | "Delivered";
  statusStep: number; // 1 to 4
  items: OrderItem[];
}

const recentOrdersData: Order[] = [
  {
    id: "#LG-2026-9812",
    date: "May 24, 2026",
    total: "$1,850",
    status: "Shipped",
    statusStep: 3,
    items: [
      { name: "The Horizon Chronograph (Steel/Blue)", price: "$1,250", qty: 1 },
      { name: "Excursion Leather Holdall (Noir)", price: "$600", qty: 1 }
    ]
  },
  {
    id: "#LG-2026-9045",
    date: "April 18, 2026",
    total: "$980",
    status: "Delivered",
    statusStep: 4,
    items: [
      { name: "Luxe Cashmere Knitwear (Camel)", price: "$480", qty: 1 },
      { name: "Equinox Scented Candle Set", price: "$500", qty: 1 }
    ]
  }
];

const curationsData = [
  {
    id: 1,
    name: "Classic Silk Scarf",
    price: "$320",
    imageSrc: "https://lh3.googleusercontent.com/aida-publi/AB6AXuD__Cn26y7P769GD0Ok2wEWmZecxJgXCxgE-Sc6CAMFiizkR25aJv_D7ZYfzJPoz6PIeYYiJANJH698gDmfDBW5wihiIosgmqy4YCx-kTw5yD1Vt2v1I7MyrWVO5_QcOw-MhC7f98sQl9kfib6kGZWMiCPVD058RManzqgMrucRRNYGTtmoHwIIOmNwKGx5IoqPZMUdI06BccpKHgqRu037TVVkAy1nws21I2-DAKhW-tRLwrqmDH-hLCgmYNRmkh5fXo6B986Bw-oN",
    category: "ACCESSORIES"
  },
  {
    id: 2,
    name: "Platinum Fountain Pen",
    price: "$850",
    imageSrc: "https://lh3.googleusercontent.com/aida-publi/AB6AXuD__Cn26y7P769GD0Ok2wEWmZecxJgXCxgE-Sc6CAMFiizkR25aJv_D7ZYfzJPoz6PIeYYiJANJH698gDmfDBW5wihiIosgmqy4YCx-kTw5yD1Vt2v1I7MyrWVO5_QcOw-MhC7f98sQl9kfib6kGZWMiCPVD058RManzqgMrucRRNYGTtmoHwIIOmNwKGx5IoqPZMUdI06BccpKHgqRu037TVVkAy1nws21I2-DAKhW-tRLwrqmDH-hLCgmYNRmkh5fXo6B986Bw-oN",
    category: "STUDIO"
  },
  {
    id: 3,
    name: "Architectural Onyx Cufflinks",
    price: "$450",
    imageSrc: "https://lh3.googleusercontent.com/aida-publi/AB6AXuD__Cn26y7P769GD0Ok2wEWmZecxJgXCxgE-Sc6CAMFiizkR25aJv_D7ZYfzJPoz6PIeYYiJANJH698gDmfDBW5wihiIosgmqy4YCx-kTw5yD1Vt2v1I7MyrWVO5_QcOw-MhC7f98sQl9kfib6kGZWMiCPVD058RManzqgMrucRRNYGTtmoHwIIOmNwKGx5IoqPZMUdI06BccpKHgqRu037TVVkAy1nws21I2-DAKhW-tRLwrqmDH-hLCgmYNRmkh5fXo6B986Bw-oN",
    category: "JEWELRY"
  }
];

export default function DashboardPage() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>("#LG-2026-9812");

  const toggleOrder = (id: string) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const steps = [
    { label: "Ordered", icon: Package },
    { label: "Processing", icon: Clock },
    { label: "Dispatched", icon: Truck },
    { label: "Delivered", icon: CheckCircle2 }
  ];

  // Grid cascade setup
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cascadeItem = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <main className="min-h-screen bg-luxe-surface py-12 px-4 md:px-[64px] max-w-[1440px] mx-auto space-y-12">
      {/* Header Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-luxe-outline-variant/30 pb-8"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold tracking-[0.2em] text-luxe-primary uppercase">
              Exclusive Enclave
            </span>
            <span className="text-[10px] bg-luxe-primary/10 text-luxe-primary rounded px-2 py-0.5 font-bold uppercase tracking-wider">
              Client Portal
            </span>
          </div>
          <h1 className="text-[36px] font-light tracking-tight text-luxe-on-surface">
            Welcome back, <span className="font-normal">Alexander</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <Button
            asChild
            variant="outline"
            className="border-luxe-outline-variant bg-transparent text-luxe-on-surface hover:bg-luxe-surface-container py-5 px-6 rounded-lg text-[13px] font-semibold tracking-wider transition-colors cursor-pointer"
          >
            <Link href="/profile">
              Portfolio Settings
            </Link>
          </Button>
          <Button
            asChild
            className="bg-luxe-primary text-luxe-on-primary hover:bg-luxe-primary/95 py-5 px-6 rounded-lg text-[13px] font-semibold tracking-wider transition-all cursor-pointer"
          >
            <Link href="/admin">
              Admin View (Demo)
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Grid: Main metrics & Account card */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-4 gap-8"
      >
        {/* Metric Card 1 */}
        <motion.div variants={cascadeItem}>
          <Card className="glass-panel border-none shadow-sm rounded-xl p-6 flex flex-col justify-between h-40 transition-all duration-300 hover:scale-[1.01] hover:shadow-md">
            <div className="flex justify-between items-start">
              <span className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">
                Membership Class
              </span>
              <Award className="text-luxe-primary size-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-[24px] font-semibold text-luxe-on-surface tracking-tight">
                Platinum Elite
              </h3>
              <p className="text-[11px] text-luxe-primary font-medium tracking-wide">
                Top 1% Global Client Status
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Metric Card 2 */}
        <motion.div variants={cascadeItem}>
          <Card className="glass-panel border-none shadow-sm rounded-xl p-6 flex flex-col justify-between h-40 transition-all duration-300 hover:scale-[1.01] hover:shadow-md">
            <div className="flex justify-between items-start">
              <span className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">
                Accumulated Value
              </span>
              <TrendingUp className="text-luxe-primary size-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-[28px] font-bold text-luxe-on-surface tracking-tight">
                $14,200
              </h3>
              <p className="text-[11px] text-luxe-on-surface-variant/80">
                Across 8 custom acquisitions
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Metric Card 3 */}
        <motion.div variants={cascadeItem}>
          <Card className="glass-panel border-none shadow-sm rounded-xl p-6 flex flex-col justify-between h-40 transition-all duration-300 hover:scale-[1.01] hover:shadow-md">
            <div className="flex justify-between items-start">
              <span className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">
                VIP Points Balance
              </span>
              <Sparkles className="text-luxe-tertiary size-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-[28px] font-bold text-luxe-on-surface tracking-tight">
                4,800 <span className="text-[14px] font-medium text-luxe-on-surface-variant">pts</span>
              </h3>
              <p className="text-[11px] text-luxe-tertiary font-medium">
                Redeemable for private events
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Dynamic Credit Card Visualizer */}
        <motion.div variants={cascadeItem}>
          <div className="relative h-40 rounded-xl bg-gradient-to-br from-[#1b1b24] to-[#2c2b3c] text-white p-6 flex flex-col justify-between shadow-lg overflow-hidden border border-white/5 group transition-transform duration-500 hover:scale-[1.02] cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
            <div className="flex justify-between items-start z-10">
              <span className="text-[11px] font-bold tracking-[0.2em] text-luxe-outline-variant/60 uppercase">
                MEMBER CARD
              </span>
              <span className="text-[14px] font-semibold text-luxe-outline-variant">PLATINUM</span>
            </div>
            <div className="z-10 flex justify-between items-end">
              <div>
                <span className="text-[11px] font-mono tracking-widest block text-luxe-outline-variant/90">ALEXANDER VANCE</span>
                <span className="text-[9px] text-luxe-outline-variant/50 tracking-wider">ID: 8904-ELITE</span>
              </div>
              <Award className="size-6 text-luxe-outline-variant/40" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main content: Order Tracker & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Collapsible Order History List (Left/Center 2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-[20px] font-semibold text-luxe-on-surface tracking-tight">
            Recent Custom Dispatches
          </h2>

          <div className="space-y-4">
            {recentOrdersData.map((order) => {
              const isExpanded = expandedOrder === order.id;
              return (
                <Card
                  key={order.id}
                  className="glass-panel border-none shadow-md rounded-xl overflow-hidden transition-all duration-300"
                >
                  {/* Header summary line */}
                  <div
                    onClick={() => toggleOrder(order.id)}
                    className="p-6 flex flex-wrap justify-between items-center gap-4 cursor-pointer hover:bg-luxe-surface-container/30 transition-colors select-none"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-10 bg-luxe-primary/10 rounded-full flex items-center justify-center text-luxe-primary">
                        <Package className="size-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-luxe-on-surface text-[15px]">{order.id}</span>
                          <span className="text-[12px] text-luxe-on-surface-variant/80">({order.date})</span>
                        </div>
                        <span className="text-[13px] text-luxe-on-surface-variant font-medium block">
                          Total Investment: {order.total}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        variant={order.status === "Delivered" ? "secondary" : "default"}
                        className={`text-[11px] px-2.5 py-0.5 font-bold uppercase rounded-md ${
                          order.status === "Delivered"
                            ? "bg-luxe-secondary text-luxe-on-secondary"
                            : "bg-luxe-primary text-luxe-on-primary animate-pulse"
                        }`}
                      >
                        {order.status}
                      </Badge>
                      {isExpanded ? <ChevronUp className="size-4 text-luxe-outline" /> : <ChevronDown className="size-4 text-luxe-outline" />}
                    </div>
                  </div>

                  {/* Expandable detailed tracker using Framer Motion */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2 border-t border-luxe-outline-variant/10 space-y-6">
                          {/* Step-by-step visual tracker bar */}
                          <div className="pt-4">
                            <div className="relative flex justify-between items-center w-full">
                              {/* Progress Line */}
                              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-luxe-outline-variant/40 -translate-y-1/2 z-0" />
                              <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: `${((order.statusStep - 1) / (steps.length - 1)) * 100}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="absolute top-1/2 left-0 h-[2px] bg-luxe-primary -translate-y-1/2 z-0"
                              />

                              {/* Tracker Steps */}
                              {steps.map((step, idx) => {
                                const stepNum = idx + 1;
                                const isCompleted = stepNum <= order.statusStep;
                                const isActive = stepNum === order.statusStep;
                                const StepIcon = step.icon;

                                return (
                                  <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                                    <motion.div
                                      initial={{ scale: 0.8 }}
                                      animate={{ scale: isActive ? 1.1 : 1 }}
                                      className={`size-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                                        isCompleted
                                          ? "bg-luxe-primary border-luxe-primary text-luxe-on-primary"
                                          : "bg-luxe-surface border-luxe-outline-variant text-luxe-outline"
                                      } ${isActive ? "ring-4 ring-luxe-primary/20" : ""}`}
                                    >
                                      <StepIcon className="size-4" />
                                    </motion.div>
                                    <span
                                      className={`text-[11px] font-bold uppercase tracking-wider hidden sm:block ${
                                        isCompleted ? "text-luxe-on-surface" : "text-luxe-outline-variant"
                                      }`}
                                    >
                                      {step.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Items lists */}
                          <div className="pt-4 space-y-3">
                            <h4 className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">
                              Acquisition Breakdown
                            </h4>
                            <div className="bg-luxe-surface-container/40 rounded-lg p-4 space-y-3">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center text-[13px] font-medium">
                                  <span className="text-luxe-on-surface">{item.name} <span className="text-luxe-on-surface-variant font-normal">x{item.qty}</span></span>
                                  <span className="text-luxe-on-surface font-semibold">{item.price}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Luxury Curations (Right 1 Col) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-[20px] font-semibold text-luxe-on-surface tracking-tight">
              Luxe Curations
            </h2>
            <Link
              href="/collections"
              className="text-[12px] font-bold text-luxe-primary hover:underline flex items-center gap-1"
            >
              Explore <Compass className="size-3.5" />
            </Link>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6"
          >
            {curationsData.map((item) => (
              <motion.div key={item.id} variants={cascadeItem}>
                <Card className="glass-panel border-none shadow-sm rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-md">
                  <div className="relative h-44 w-full bg-luxe-surface-container overflow-hidden">
                    <Image
                      src={item.imageSrc}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    <Badge className="absolute top-3 left-3 bg-white/80 backdrop-blur-md text-luxe-on-surface text-[10px] font-bold uppercase py-0.5 px-2.5 border-none rounded">
                      {item.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4 space-y-1">
                    <h3 className="text-[14px] font-semibold text-luxe-on-surface leading-tight transition-colors group-hover:text-luxe-primary">
                      {item.name}
                    </h3>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[15px] font-bold text-luxe-primary">{item.price}</span>
                      <button className="text-[12px] font-bold text-luxe-on-surface group-hover:text-luxe-primary flex items-center gap-0.5 hover:underline cursor-pointer">
                        ACQUIRE <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
