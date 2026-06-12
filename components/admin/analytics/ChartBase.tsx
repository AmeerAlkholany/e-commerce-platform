"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChartBaseProps {
  title: string;
  description?: string;
  isLoading?: boolean;
  error?: string | null;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export function ChartBase({ 
  title, 
  description, 
  isLoading, 
  error, 
  children, 
  className,
  headerAction 
}: ChartBaseProps) {
  return (
    <Card className={cn("glass-panel border-none overflow-hidden group", className)}>
      <CardHeader className="pb-2 space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-black text-white uppercase tracking-widest italic flex items-center gap-2">
            <span className="size-1.5 bg-luxe-primary rounded-full" />
            {title}
          </CardTitle>
          {headerAction}
        </div>
        {description && <CardDescription className="text-[10px] text-luxe-on-surface-variant font-bold uppercase tracking-wider">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="h-[300px] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5 animate-pulse">
            <Loader2 className="size-6 text-luxe-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <AlertCircle className="size-8 text-luxe-error opacity-50" />
            <p className="text-xs text-luxe-on-surface-variant font-medium">{error}</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full w-full"
          >
            {children}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
