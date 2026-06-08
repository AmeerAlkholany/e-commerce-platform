"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users,
  Loader2,
  Package,
  ArrowRight,
  MousePointerClick,
  RefreshCcw,
  Calendar,
  LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MetricScorecard } from "@/components/admin/analytics/MetricScorecard";
import { ChartBase } from "@/components/admin/analytics/ChartBase";
import {
  RevenueAreaChart,
  SectorPieChart,
  ProductBarChart,
  OrderVolumeChart,
  StockStatusChart
} from "@/components/admin/analytics/IntelligenceCharts";

// ─── Constants ──────────────────────────────────────────
const STAGGER = {
  container: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } },
  item: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }
};

export default function GlobalSynopsis() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIntelligence = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to decrypt enterprise data");
      setData(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIntelligence(); }, []);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="size-12 text-luxe-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-luxe-on-surface-variant animate-pulse">Decrypting Intelligence...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={STAGGER.container}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12"
    >
      {/* ─── Header Section ─────────────────────────────── */}
      <motion.div variants={STAGGER.item} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-[0.8]">
            GLOBAL <span className="text-luxe-primary text-opacity-80">SYNOPSIS</span><sup>™</sup>
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-luxe-primary/5 border border-luxe-primary/20 rounded-full">
              <span className="size-1.5 bg-luxe-primary rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-luxe-primary uppercase tracking-widest">Enterprise Instance Live</span>
            </div>
            <span className="text-luxe-on-surface-variant font-medium text-xs tracking-wide">Real-time performance metrics synchronized.</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 bg-white/5 border-white/10 text-white rounded-xl px-4 hover:bg-white/10">
            <Calendar className="size-3.5 mr-2 text-luxe-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Last 30 Days</span>
          </Button>
          <Button onClick={fetchIntelligence} variant="outline" className="h-10 size-10 bg-white/5 border-white/10 text-white rounded-xl p-0 hover:bg-white/10">
            <RefreshCcw className={loading ? "animate-spin size-3.5" : "size-3.5"} />
          </Button>
        </div>
      </motion.div>

      {/* ─── Top KPIs ────────────────────────────────────── */}
      <motion.div variants={STAGGER.item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricScorecard
          label="Total Revenue"
          value={data?.summary.revenue.toLocaleString()}
          prefix="$"
          trend={12.4}
          icon={<DollarSign className="size-5" />}
          isLoading={loading}
        />
        <MetricScorecard
          label="Transactions"
          value={data?.summary.orders.toLocaleString()}
          trend={8.2}
          icon={<ShoppingBag className="size-5" />}
          isLoading={loading}
        />
        <MetricScorecard
          label="Avg Transaction"
          value={data?.summary.aov.toLocaleString()}
          prefix="$"
          trend={-2.1}
          icon={<TrendingUp className="size-5" />}
          isLoading={loading}
        />
        <MetricScorecard
          label="Net Conversion"
          value={data?.summary.conversionRate}
          suffix="%"
          trend={4.3}
          icon={<MousePointerClick className="size-5" />}
          isLoading={loading}
        />
      </motion.div>

      {/* ─── Primary Charts ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={STAGGER.item} className="lg:col-span-2">
          <ChartBase
            title="Fiscal Velocity"
            description="Acquisition momentum & gross revenue trajectory"
            isLoading={loading}
            headerAction={<Badge variant="outline" className="bg-luxe-primary/5 text-luxe-primary border-luxe-primary/20 text-[10px] uppercase font-bold tracking-widest px-3">Live Feed</Badge>}
          >
            <RevenueAreaChart data={data?.charts.revenueTrend || []} />
          </ChartBase>
        </motion.div>

        <motion.div variants={STAGGER.item}>
          <ChartBase
            title="Operational Volume"
            description="Daily fulfillment activity & order density"
            isLoading={loading}
          >
            <OrderVolumeChart data={data?.charts.revenueTrend || []} />
          </ChartBase>
        </motion.div>
      </div>

      {/* ─── Distribution & Health ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={STAGGER.item}>
          <ChartBase
            title="Portfolio Mix"
            description="Revenue distribution by category sector"
            isLoading={loading}
          >
            <SectorPieChart data={data?.charts.categoryBreakdown || []} />
          </ChartBase>
        </motion.div>

        <motion.div variants={STAGGER.item}>
          <ChartBase
            title="Inventory Health"
            description="Global stock availability & depletion status"
            isLoading={loading}
          >
            <StockStatusChart data={data?.charts.stockStatus || []} />
          </ChartBase>
        </motion.div>
      </div>

      {/* ─── Secondary Analytics ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={STAGGER.item}>
          <Card className="glass-panel border-none p-8 flex flex-col items-center justify-center text-center gap-4 bg-gradient-to-br from-luxe-primary/5 to-transparent border-t border-luxe-primary/10">
            <div className="size-16 rounded-3xl bg-luxe-primary/10 flex items-center justify-center text-luxe-primary">
              <LayoutGrid className="size-8" />
            </div>
            <div>
              <h4 className="text-xl font-black text-white tracking-tight uppercase italic italic">Inventory <span className="text-luxe-primary">Control</span></h4>
              <p className="text-xs text-luxe-on-surface-variant font-medium mt-2 leading-relaxed">Manage your premium portfolio sectors and optimize catalog liquidity.</p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/products")}
              className="mt-4 border-luxe-primary/30 text-luxe-primary hover:bg-luxe-primary/10 rounded-xl px-8 uppercase text-[10px] font-black tracking-[0.2em]"
            >
              Open Catalog <ArrowRight className="size-3 ml-2" />
            </Button>
          </Card>
        </motion.div>

        <motion.div variants={STAGGER.item} className="lg:col-span-2">
          <ChartBase
            title="Apex Performers"
            description="Top performing inventory assets by gross revenue"
            isLoading={loading}
          >
            <ProductBarChart data={data?.charts.productPerformance || []} />
          </ChartBase>
        </motion.div>
      </div>
    </motion.div>
  );
}
