"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const LUXE_PALETTE = ["#D4AF37", "#444444", "#C0C0C0", "#2C2C2C", "#F5F5F5"];

const CustomTooltip = ({ active, payload, label, prefix = "", suffix = "" }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0F0F0F] border border-white/10 rounded-xl p-4 shadow-2xl backdrop-blur-md">
        <p className="text-[10px] font-black text-luxe-on-surface-variant uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-black text-white italic tracking-tight">
          {prefix}{payload[0].value.toLocaleString()}{suffix}
        </p>
      </div>
    );
  }
  return null;
};

const ChartWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full h-full min-h-[250px]">
    <ResponsiveContainer width="100%" height="100%" minHeight={250}>
      {children as any}
    </ResponsiveContainer>
  </div>
);

export const RevenueAreaChart = ({ data }: { data: any[] }) => (
  <ChartWrapper>
    <AreaChart data={data} margin={{ left: -20, top: 10, right: 10 }}>
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
      <XAxis 
        dataKey="date" 
        stroke="#444" 
        fontSize={10} 
        tickLine={false} 
        axisLine={false} 
        tickFormatter={(v) => v.split("-").slice(2).join("/")} 
      />
      <YAxis 
        stroke="#444" 
        fontSize={10} 
        tickLine={false} 
        axisLine={false} 
        tickFormatter={(v) => `$${v >= 1000 ? v/1000 + "k" : v}`} 
      />
      <Tooltip content={<CustomTooltip prefix="$" />} />
      <Area 
        type="monotone" 
        dataKey="revenue" 
        stroke="#D4AF37" 
        strokeWidth={3} 
        fillOpacity={1} 
        fill="url(#chartGradient)" 
        animationBegin={500}
        animationDuration={1500}
      />
    </AreaChart>
  </ChartWrapper>
);

export const SectorPieChart = ({ data }: { data: any[] }) => (
  <ChartWrapper>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="45%"
        innerRadius={65}
        outerRadius={85}
        paddingAngle={8}
        dataKey="value"
        stroke="none"
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={LUXE_PALETTE[index % LUXE_PALETTE.length]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip prefix="$" />} />
      <Legend 
        verticalAlign="bottom" 
        height={36} 
        iconType="circle"
        formatter={(value) => <span className="text-[10px] font-bold uppercase text-luxe-on-surface-variant tracking-[0.1em]">{value}</span>}
      />
    </PieChart>
  </ChartWrapper>
);

export const ProductBarChart = ({ data }: { data: any[] }) => (
  <ChartWrapper>
    <BarChart data={data} layout="vertical" margin={{ left: 40, right: 20 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
      <XAxis type="number" hide />
      <YAxis 
        dataKey="name" 
        type="category" 
        stroke="#888" 
        fontSize={9} 
        width={80} 
        tickLine={false} 
        axisLine={false} 
        tickFormatter={(v) => v.length > 12 ? v.substring(0, 12) + "..." : v}
      />
      <Tooltip content={<CustomTooltip prefix="$" />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
      <Bar 
        dataKey="revenue" 
        fill="#D4AF37" 
        radius={[0, 4, 4, 0]} 
        barSize={20}
        animationDuration={2000}
      />
    </BarChart>
  </ChartWrapper>
);

export const UserAcquisitionChart = ({ data }: { data: any[] }) => (
  <ChartWrapper>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="userAcquisitionGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#C0C0C0" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#C0C0C0" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
      <XAxis 
        dataKey="date" 
        stroke="#444" 
        fontSize={10} 
        tickLine={false} 
        axisLine={false} 
        tickFormatter={(v) => v.split("-").slice(2).join("/")} 
      />
      <YAxis stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
      <Tooltip content={<CustomTooltip suffix=" New Users" />} />
      <Area 
        type="monotone" 
        dataKey="users" 
        stroke="#FFFFFF" 
        strokeWidth={2} 
        fillOpacity={1} 
        fill="url(#userAcquisitionGradient)" 
      />
    </AreaChart>
  </ChartWrapper>
);

export const AOVTrendChart = ({ data }: { data: any[] }) => (
  <ChartWrapper>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="aovTrendGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2} />
          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
      <XAxis 
        dataKey="date" 
        stroke="#444" 
        fontSize={10} 
        tickLine={false} 
        axisLine={false} 
        tickFormatter={(v) => v.split("-").slice(2).join("/")} 
      />
      <YAxis 
        stroke="#444" 
        fontSize={10} 
        tickLine={false} 
        axisLine={false} 
        tickFormatter={(v) => `$${v}`} 
      />
      <Tooltip content={<CustomTooltip prefix="$" />} />
      <Area 
        type="stepAfter" 
        dataKey="aov" 
        stroke="#D4AF37" 
        strokeWidth={2} 
        fillOpacity={1} 
        fill="url(#aovTrendGradient)" 
      />
    </AreaChart>
  </ChartWrapper>
);

export const StockStatusChart = ({ data }: { data: any[] }) => (
  <ChartWrapper>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="45%"
        innerRadius={60}
        outerRadius={80}
        paddingAngle={5}
        dataKey="value"
        stroke="none"
      >
        {data.map((entry, index) => (
          <Cell 
            key={`cell-${index}`} 
            fill={entry.name === "Out of Stock" ? "#EF4444" : entry.name === "Low Stock" ? "#F59E0B" : "#10B981"} 
          />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend 
        verticalAlign="bottom" 
        height={36} 
        formatter={(value) => <span className="text-[9px] font-bold uppercase text-luxe-on-surface-variant">{value}</span>}
      />
    </PieChart>
  </ChartWrapper>
);

export const OrderVolumeChart = ({ data }: { data: any[] }) => (
  <ChartWrapper>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
      <XAxis 
        dataKey="date" 
        stroke="#444" 
        fontSize={10} 
        tickLine={false} 
        axisLine={false} 
        tickFormatter={(v) => v.split("-").slice(2).join("/")} 
      />
      <YAxis stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
      <Tooltip content={<CustomTooltip suffix=" Orders" />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
      <Bar 
        dataKey="orders" 
        fill="#FFFFFF" 
        radius={[4, 4, 0, 0]} 
        barSize={15} 
        animationDuration={1500}
      />
    </BarChart>
  </ChartWrapper>
);
