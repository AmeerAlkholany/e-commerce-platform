"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricScorecardProps {
  label: string;
  value: string | number;
  trend?: number;
  suffix?: string;
  prefix?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export function MetricScorecard({ label, value, trend, suffix, prefix, icon, isLoading }: MetricScorecardProps) {
  const isPositive = trend && trend > 0;

  return (
    <Card className="glass-panel border-none p-6 relative overflow-hidden group hover:translate-y-[-4px] transition-all duration-300">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="size-10 rounded-xl bg-luxe-primary/10 flex items-center justify-center text-luxe-primary group-hover:bg-luxe-primary group-hover:text-black transition-colors duration-500">
          {icon}
        </div>
        {trend !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border",
            isPositive 
              ? "bg-luxe-primary/10 border-luxe-primary/20 text-luxe-primary" 
              : "bg-luxe-error/10 border-luxe-error/20 text-luxe-error"
          )}>
            {isPositive ? <TrendingUp className="size-2.5" /> : <TrendingDown className="size-2.5" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-[10px] font-black text-luxe-on-surface-variant uppercase tracking-[0.25em]">{label}</p>
        <div className="flex items-baseline gap-1 mt-1">
          {prefix && <span className="text-sm font-bold text-luxe-primary">{prefix}</span>}
          {isLoading ? (
            <div className="h-9 w-24 bg-white/5 animate-pulse rounded" />
          ) : (
            <h3 className="text-3xl font-black text-white tracking-tighter italic">{value}</h3>
          )}
          {suffix && <span className="text-sm font-bold text-luxe-on-surface-variant italic">{suffix}</span>}
        </div>
      </div>

      {/* Decorative pulse */}
      <div className="absolute top-0 right-0 size-32 bg-luxe-primary/5 blur-[40px] rounded-full -mr-16 -mt-16 group-hover:bg-luxe-primary/10 transition-colors" />
    </Card>
  );
}
