"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  DollarSign,
  Users,
  Percent,
  Plus,
  ArrowUpRight,
  Search,
  Filter,
  BarChart3
} from "lucide-react";

interface AdminMetric {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ComponentType<any>;
}

const adminMetricsData: AdminMetric[] = [
  {
    title: "Store Revenue",
    value: "$142,500",
    change: "+12.4% vs last month",
    trend: "up",
    icon: DollarSign
  },
  {
    title: "Total Dispatches",
    value: "1,240",
    change: "+8.2% vs last month",
    trend: "up",
    icon: ShoppingBag
  },
  {
    title: "Acquisition Conv.",
    value: "3.42%",
    change: "+0.3% vs last month",
    trend: "up",
    icon: Percent
  },
  {
    title: "Active VIP Members",
    value: "2,840",
    change: "-1.2% vs last week",
    trend: "down",
    icon: Users
  }
];

interface AdminProduct {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

const mockProducts: AdminProduct[] = [
  { id: "PROD-901", name: "The Horizon Chronograph", category: "TIMEPIECES", price: "$1,250", stock: 18, status: "In Stock" },
  { id: "PROD-803", name: "Classic Silk Scarf", category: "ACCESSORIES", price: "$320", stock: 54, status: "In Stock" },
  { id: "PROD-742", name: "Excursion Leather Holdall", category: "LEATHER", price: "$600", stock: 4, status: "Low Stock" },
  { id: "PROD-699", name: "Platinum Fountain Pen", category: "STUDIO", price: "$850", stock: 12, status: "In Stock" },
  { id: "PROD-510", name: "Architectural Onyx Cufflinks", category: "JEWELRY", price: "$450", stock: 0, status: "Out of Stock" }
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "products">("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = mockProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stagger variants
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
      {/* Admin Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-luxe-outline-variant/30 pb-8"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold tracking-[0.2em] text-luxe-tertiary uppercase bg-luxe-tertiary/10 px-3 py-1 rounded-full">
              Enterprise Dashboard
            </span>
            <span className="size-2 bg-luxe-primary rounded-full animate-ping" />
            <span className="text-[10px] text-luxe-primary font-bold tracking-wider">LIVE DATA</span>
          </div>
          <h1 className="text-[36px] font-light tracking-tight text-luxe-on-surface">
            Luxe Global <span className="font-normal">Control Panel</span>
          </h1>
        </div>

        <div className="flex gap-3">
          <Button
            asChild
            variant="outline"
            className="border-luxe-outline-variant bg-transparent text-luxe-on-surface hover:bg-luxe-surface-container py-5 px-6 rounded-lg text-[13px] font-semibold tracking-wider transition-colors cursor-pointer"
          >
            <Link href="/dashboard">
              Go to Client View
            </Link>
          </Button>
          <Button className="bg-luxe-primary text-luxe-on-primary hover:bg-luxe-primary/95 py-5 px-6 rounded-lg text-[13px] font-semibold tracking-wider transition-all cursor-pointer flex items-center gap-1.5">
            <Plus className="size-4" /> Add Luxury Item
          </Button>
        </div>
      </motion.div>

      {/* Admin Subheader Navigation tabs */}
      <div className="flex gap-4 border-b border-luxe-outline-variant/20 pb-1">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-4 text-[14px] font-bold tracking-[0.05em] uppercase border-b-2 transition-all cursor-pointer ${
            activeTab === "overview"
              ? "border-luxe-primary text-luxe-primary font-bold"
              : "border-transparent text-luxe-on-surface-variant hover:text-luxe-on-surface"
          }`}
        >
          Performance Overview
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-4 text-[14px] font-bold tracking-[0.05em] uppercase border-b-2 transition-all cursor-pointer ${
            activeTab === "products"
              ? "border-luxe-primary text-luxe-primary font-bold"
              : "border-transparent text-luxe-on-surface-variant hover:text-luxe-on-surface"
          }`}
        >
          Inventory Catalog ({mockProducts.length})
        </button>
      </div>

      {activeTab === "overview" ? (
        <div className="space-y-12">
          {/* Grid: 4 Metric Cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {adminMetricsData.map((metric, idx) => {
              const MetricIcon = metric.icon;
              return (
                <motion.div key={idx} variants={cascadeItem}>
                  <Card
                    className="glass-panel border-none shadow-sm rounded-xl p-6 flex flex-col justify-between h-44 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:scale-[1.01]"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">
                        {metric.title}
                      </span>
                      <div className="size-8 rounded-lg bg-luxe-surface-container flex items-center justify-center text-luxe-primary">
                        <MetricIcon className="size-4" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[32px] font-bold text-luxe-on-surface tracking-tight">
                        {metric.value}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        {metric.trend === "up" ? (
                          <span className="text-[11px] bg-luxe-primary/10 text-luxe-primary px-2 py-0.5 rounded font-bold flex items-center gap-0.5">
                            <TrendingUp className="size-3" /> Growth
                          </span>
                        ) : (
                          <span className="text-[11px] bg-luxe-error-container text-luxe-on-error-container px-2 py-0.5 rounded font-bold flex items-center gap-0.5 animate-pulse">
                            <TrendingDown className="size-3" /> Shift
                          </span>
                        )}
                        <span className="text-[11px] text-luxe-on-surface-variant/80">
                          {metric.change}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Grid: Charts & Targets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Visual Custom SVG Line Chart (2 Cols) */}
            <Card className="lg:col-span-2 glass-panel border-none shadow-sm rounded-xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-[18px] font-semibold text-luxe-on-surface">Acquisitions Analytics</CardTitle>
                  <CardDescription className="text-[13px] text-luxe-on-surface-variant">Live store conversions graph (Year 2026)</CardDescription>
                </div>
                <Badge className="bg-luxe-primary/10 text-luxe-primary border-none text-[11px] font-bold rounded flex items-center gap-1">
                  <BarChart3 className="size-3" /> Line Chart
                </Badge>
              </div>

              {/* High-fidelity Custom SVG Graph */}
              <div className="relative h-64 w-full bg-luxe-surface-container/30 rounded-lg p-2 overflow-hidden flex items-end">
                <svg className="absolute inset-0 w-full h-full p-6 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(199, 196, 216, 0.2)" strokeWidth="0.5" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(199, 196, 216, 0.2)" strokeWidth="0.5" />
                  <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(199, 196, 216, 0.2)" strokeWidth="0.5" />

                  {/* Gradient Area under chart line */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3525cd" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#3525cd" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M 0 80 Q 20 40, 40 55 T 80 20 T 100 35 L 100 90 L 0 90 Z"
                    fill="url(#chartGradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                  />

                  {/* Graph Line Self-drawing via Framer Motion */}
                  <motion.path
                    d="M 0 80 Q 20 40, 40 55 T 80 20 T 100 35"
                    fill="none"
                    stroke="#3525cd"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.6, ease: "easeInOut" }}
                  />

                  {/* Interactive Nodes */}
                  <circle cx="20" cy="53" r="3.5" fill="#3525cd" className="hover:scale-150 transition-transform cursor-pointer" />
                  <circle cx="48" cy="49" r="3.5" fill="#3525cd" className="hover:scale-150 transition-transform cursor-pointer" />
                  <circle cx="80" cy="20" r="3.5" fill="#3525cd" className="hover:scale-150 transition-transform cursor-pointer" />
                </svg>

                {/* X-axis indicators */}
                <div className="absolute bottom-2 left-6 right-6 flex justify-between text-[11px] text-luxe-on-surface-variant/70 font-semibold uppercase">
                  <span>Jan</span>
                  <span>Mar</span>
                  <span>May</span>
                  <span>Jul</span>
                  <span>Sep</span>
                  <span>Nov</span>
                </div>
              </div>
            </Card>

            {/* Circular Gauge Target progress (1 Col) */}
            <Card className="lg:col-span-1 glass-panel border-none shadow-sm rounded-xl p-6 flex flex-col justify-between">
              <div className="space-y-1">
                <CardTitle className="text-[18px] font-semibold text-luxe-on-surface">Target Quotient</CardTitle>
                <CardDescription className="text-[13px] text-luxe-on-surface-variant">Store performance metric progress</CardDescription>
              </div>

              {/* Circular gauge */}
              <div className="relative size-36 mx-auto flex items-center justify-center my-6">
                <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(199, 196, 216, 0.3)" strokeWidth="3" />
                  {/* Self-drawing indicator progress */}
                  <motion.circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    stroke="#3525cd"
                    strokeWidth="3.2"
                    strokeDasharray="100"
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 18 }} // 100 - 82% = 18 Dashoffset
                    transition={{ duration: 1.4, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center space-y-0.5">
                  <span className="text-[28px] font-black text-luxe-on-surface leading-none tracking-tighter">82%</span>
                  <span className="text-[10px] text-luxe-primary font-bold tracking-[0.05em] uppercase block">Aimed Quotient</span>
                </div>
              </div>

              <div className="text-center text-[12px] text-luxe-on-surface-variant font-medium">
                High conversion of <strong className="text-luxe-on-surface">8.4%</strong> triggers next level reward.
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Inventory Catalog Tab Details with spring rows */
        <Card className="glass-panel border-none shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="border-b border-luxe-outline-variant/20 pb-6 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-[20px] font-semibold text-luxe-on-surface">Product Inventory Database</CardTitle>
              <CardDescription className="text-[13px] text-luxe-on-surface-variant">Monitor private store luxury item units and classifications.</CardDescription>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxe-outline size-4" />
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-64 bg-luxe-surface border border-luxe-outline-variant/40 rounded-lg text-[14px] focus-visible:ring-1 focus-visible:ring-luxe-primary outline-none"
                />
              </div>
              <Button variant="outline" className="border-luxe-outline-variant bg-transparent text-luxe-on-surface hover:bg-luxe-surface-container font-semibold rounded-lg text-[13px] flex items-center gap-1.5">
                <Filter className="size-3.5" /> Filter
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-[14px] text-left border-collapse">
              <thead>
                <tr className="bg-luxe-surface-container/50 border-b border-luxe-outline-variant/20 text-[11px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">
                  <th className="py-4 px-6">Product Code</th>
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Classification</th>
                  <th className="py-4 px-6">Target Price</th>
                  <th className="py-4 px-6">Stock Units</th>
                  <th className="py-4 px-6">State Status</th>
                  <th className="py-4 px-6 text-right">Operation Actions</th>
                </tr>
              </thead>
              <motion.tbody
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {filteredProducts.map((p) => (
                  <motion.tr
                    key={p.id}
                    variants={cascadeItem}
                    className="border-b border-luxe-outline-variant/10 hover:bg-luxe-surface-container/10 transition-colors"
                  >
                    <td className="py-4 px-6 font-mono text-[12px] text-luxe-on-surface">{p.id}</td>
                    <td className="py-4 px-6 font-semibold text-luxe-on-surface">{p.name}</td>
                    <td className="py-4 px-6">
                      <span className="text-[11px] font-bold text-luxe-on-surface-variant tracking-[0.05em] uppercase">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-luxe-primary font-semibold">{p.price}</td>
                    <td className="py-4 px-6 text-luxe-on-surface-variant">{p.stock} units</td>
                    <td className="py-4 px-6">
                      <Badge
                        className={`text-[10px] font-bold uppercase py-0.5 px-2 rounded-md ${
                          p.status === "In Stock"
                            ? "bg-luxe-primary/10 text-luxe-primary"
                            : p.status === "Low Stock"
                            ? "bg-luxe-tertiary-fixed text-luxe-tertiary"
                            : "bg-luxe-error-container text-luxe-on-error-container"
                        }`}
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button variant="ghost" size="sm" className="text-luxe-primary font-bold hover:underline py-1 px-3 cursor-pointer">
                        Edit <ArrowUpRight className="size-3 ml-0.5 inline-block" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
