"use client";

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Users, 
  Loader2, 
  ChevronRight,
  Download,
  Filter,
  UserCheck,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MetricScorecard } from "@/components/admin/analytics/MetricScorecard";
import { ChartBase } from "@/components/admin/analytics/ChartBase";
import { 
  RevenueAreaChart, 
  SectorPieChart, 
  ProductBarChart,
  UserAcquisitionChart,
  AOVTrendChart,
  StockStatusChart
} from "@/components/admin/analytics/IntelligenceCharts";

export default function IntelligenceReports() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/stats");
        setData(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading && !data) return <div className="flex items-center justify-center py-40"><Loader2 className="size-10 text-luxe-primary animate-spin" /></div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Intelligence <span className="text-luxe-primary">Center</span></h1>
            <p className="text-luxe-on-surface-variant font-bold text-[10px] uppercase tracking-widest mt-1">Strategic enterprise data visualization</p>
         </div>
         <div className="flex gap-2">
            <Button variant="outline" className="h-10 bg-white/5 border-white/10 text-white rounded-xl px-4 hover:bg-white/10 uppercase text-[10px] font-black tracking-widest">
               <Filter className="size-3.5 mr-2" /> Segments
            </Button>
            <Button variant="outline" className="h-10 bg-luxe-primary/10 border-luxe-primary/20 text-luxe-primary rounded-xl px-4 hover:bg-luxe-primary/20 uppercase text-[10px] font-black tracking-widest">
               <Download className="size-3.5 mr-2" /> Export Intelligence
            </Button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricScorecard label="Total Acquisitions" value={data?.summary.orders} trend={14.8} icon={<ShoppingBag className="size-4" />} />
        <MetricScorecard label="Gross Value" value={data?.summary.revenue.toLocaleString()} prefix="$" trend={21.2} icon={<DollarSign className="size-4" />} />
        <MetricScorecard label="Platform Network" value={data?.summary.users} trend={5.4} icon={<Users className="size-4" />} />
        <MetricScorecard label="Market Edge" value="98.1%" trend={1.2} icon={<TrendingUp className="size-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartBase title="Fiscal Velocity (AOV)" description="Daily average order value trajectory" isLoading={loading}>
          <AOVTrendChart data={data?.charts.revenueTrend || []} />
        </ChartBase>

        <ChartBase title="Acquisition Intelligence" description="Daily new user enrollment trends" isLoading={loading}>
          <UserAcquisitionChart data={data?.charts.userTrend || []} />
        </ChartBase>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ChartBase title="Inventory Health" description="Stock level distribution across catalog" isLoading={loading}>
          <StockStatusChart data={data?.charts.stockStatus || []} />
        </ChartBase>
        
        <div className="lg:col-span-2">
           <ChartBase title="Categorical Dominance" description="Revenue distribution by portfolio sector" isLoading={loading}>
             <SectorPieChart data={data?.charts.categoryBreakdown || []} />
           </ChartBase>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Top Performing Assets */}
         <Card className="glass-panel border-none p-0 overflow-hidden">
            <CardHeader className="p-8 pb-4">
               <CardTitle className="text-xl font-black text-white tracking-tight uppercase italic">Apex Performers</CardTitle>
               <CardDescription className="text-luxe-on-surface-variant text-[10px] font-bold uppercase tracking-widest">High-yield inventory pieces</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-white/5">
                  {data?.charts.productPerformance.slice(0, 5).map((p: any) => (
                     <div key={p.id} className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                           <div className="size-12 rounded-xl bg-luxe-surface-container flex items-center justify-center text-luxe-primary font-black italic text-lg opacity-40 group-hover:opacity-100 transition-opacity">
                              0{p.id}
                           </div>
                           <div>
                              <p className="text-sm font-black text-white hover:text-luxe-primary transition-colors">{p.name}</p>
                              <div className="flex items-center gap-4 mt-1">
                                 <span className="text-[10px] text-luxe-on-surface-variant font-bold uppercase tracking-widest">{p.sold} units relocated</span>
                                 <Badge variant="outline" className="border-luxe-primary/20 text-luxe-primary text-[9px] uppercase font-bold py-0">High Liquid</Badge>
                              </div>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-black text-white italic tracking-tighter">${p.revenue.toLocaleString()}</p>
                           <p className="text-[9px] text-luxe-on-surface-variant font-bold uppercase tracking-widest">Gross Yield</p>
                        </div>
                     </div>
                  ))}
               </div>
               <div className="p-4 bg-white/5 border-t border-white/5 text-center">
                  <button className="text-[10px] font-black text-luxe-primary uppercase tracking-widest hover:underline flex items-center justify-center mx-auto">
                     Full Performance Spreadsheet <ChevronRight className="size-3 ml-1" />
                  </button>
               </div>
            </CardContent>
         </Card>

         {/* Vanguard Clients */}
         <Card className="glass-panel border-none p-0 overflow-hidden">
            <CardHeader className="p-8 pb-4">
               <CardTitle className="text-xl font-black text-white tracking-tight uppercase italic">Vanguard Clients</CardTitle>
               <CardDescription className="text-luxe-on-surface-variant text-[10px] font-bold uppercase tracking-widest">High-net-worth individual matrix</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-white/5">
                  {/* Mocking top customers for now as we don't have them in the new stats API yet */}
                  {[
                    { id: 1, name: "Julian V.", email: "julian@luxury.com", orders: 12, spent: 48200 },
                    { id: 2, name: "Sophia R.", email: "sophia@network.net", orders: 8, spent: 32500 },
                    { id: 3, name: "Marcus D.", email: "marcus@vanguard.io", orders: 6, spent: 21900 },
                    { id: 4, name: "Elena Q.", email: "elena@private.co", orders: 5, spent: 18400 },
                    { id: 5, name: "Aiden T.", email: "aiden@legacy.com", orders: 4, spent: 14200 },
                  ].map((c, i) => (
                     <div key={c.id} className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                           <div className="size-12 rounded-full border-2 border-luxe-primary/20 bg-luxe-primary/5 flex items-center justify-center text-luxe-primary font-black group-hover:bg-luxe-primary group-hover:text-black transition-all">
                              {c.name.charAt(0)}
                           </div>
                           <div>
                              <p className="text-sm font-black text-white uppercase italic tracking-tight">{c.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                 <UserCheck className="size-3 text-luxe-primary" />
                                 <span className="text-[10px] text-luxe-on-surface-variant font-bold uppercase tracking-widest">{c.orders} acquisitions</span>
                              </div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="flex items-center justify-end gap-1 mb-1">
                              {[1, 2, 3].map(s => <Star key={s} className="size-2 text-luxe-primary fill-luxe-primary" />)}
                           </div>
                           <p className="text-sm font-black text-white italic tracking-tighter">${c.spent.toLocaleString()}</p>
                           <p className="text-[9px] text-luxe-on-surface-variant font-bold uppercase tracking-widest">Portfolio Value</p>
                        </div>
                     </div>
                  ))}
               </div>
               <div className="p-4 bg-white/5 border-t border-white/5 text-center">
                  <button className="text-[10px] font-black text-luxe-primary uppercase tracking-widest hover:underline flex items-center justify-center mx-auto">
                     Master CRM Synchronizer <ChevronRight className="size-3 ml-1" />
                  </button>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
