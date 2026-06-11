"use client";

import React, { useState } from "react";
import { Plus, Download, RefreshCcw, ChevronLeft, ChevronRight, LayoutDashboard, LayoutList } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserStats } from "@/components/admin/users/UserStats";
import { UserFilters } from "@/components/admin/users/UserFilters";
import { UserTable } from "@/components/admin/users/UserTable";
import { useUsers } from "@/hooks/use-users";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function UsersManagementPage() {
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    search: "",
    role: "",
    status: "",
    sortKey: "created_at",
    sortDir: "desc",
  });
  const [showStats, setShowStats] = useState(false);

  const { data, isLoading, refetch } = useUsers(filters);

  const handleReset = () => {
    setFilters({
      page: 1,
      pageSize: 10,
      search: "",
      role: "",
      status: "",
      sortKey: "created_at",
      sortDir: "desc",
    });
  };

  const handleExport = () => {
    // CSV Export logic
    if (!data?.users) return;
    const headers = ["ID", "Name", "Email", "Role", "Status", "Joined"];
    const rows = data.users.map((u: any) => [
      u.id, 
      `"${u.name}"`, 
      u.email, 
      u.role, 
      u.status, 
      new Date(u.created_at).toLocaleDateString()
    ]);
    const csv = [headers.join(","), ...rows.map((r: any) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-20"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            User <span className="text-luxe-primary">Intelligence</span>
          </h1>
          <p className="text-luxe-on-surface-variant text-sm mt-1 font-medium tracking-wide">
            Detailed governance over global enterprise accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setShowStats(!showStats)} 
            variant="outline" 
            className={cn(
              "h-11 border-luxe-outline-variant bg-white/5 rounded-xl px-4 font-bold text-xs uppercase tracking-widest transition-all",
              showStats ? "text-luxe-primary border-luxe-primary/30 bg-luxe-primary/5" : "text-luxe-on-surface-variant hover:text-white"
            )}
            title={showStats ? "Hide Dashboard Overview" : "Show Dashboard Overview"}
          >
            {showStats ? <LayoutList className="size-4 mr-2" /> : <LayoutDashboard className="size-4 mr-2" />}
            {showStats ? "Compact View" : "Analytics"}
          </Button>
          <Button onClick={handleExport} variant="outline" className="h-11 border-luxe-outline-variant bg-white/5 text-white hover:bg-white/10 rounded-xl px-6 font-bold text-xs uppercase tracking-widest">
            <Download className="size-4 mr-2 text-luxe-primary" /> Export Data
          </Button>
          <Link href="/admin/users/new">
            <Button className="h-11 bg-luxe-primary text-luxe-on-primary hover:bg-luxe-primary/90 rounded-xl px-6 font-bold text-xs uppercase tracking-widest">
              <Plus className="size-4 mr-2" /> Invite User
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 32 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <UserStats />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <Card className="glass-panel border-none shadow-2xl rounded-3xl overflow-hidden bg-luxe-surface/40">
        <CardHeader className="p-8 border-b border-luxe-outline-variant/10">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div>
              <CardTitle className="text-2xl font-black text-white tracking-tight uppercase italic">Registry</CardTitle>
              <CardDescription className="text-luxe-on-surface-variant text-xs font-semibold uppercase tracking-widest mt-1">Real-time database synchronization</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => refetch()} variant="outline" className="h-10 size-10 items-center justify-center border-luxe-outline-variant bg-transparent">
                <RefreshCcw className={isLoading ? "animate-spin size-4" : "size-4"} />
              </Button>
            </div>
          </div>
          
          <div className="mt-8">
            <UserFilters filters={filters} setFilters={setFilters} onReset={handleReset} />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <UserTable users={data?.users || []} isLoading={isLoading} />
          
          {/* Pagination */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-8 py-6 border-t border-luxe-outline-variant/10 bg-luxe-surface-container/20">
              <span className="text-[11px] font-bold text-luxe-on-surface-variant uppercase tracking-[0.1em]">
                Page {data.pagination.page} of {data.pagination.totalPages} <span className="opacity-40">•</span> {data.pagination.total} ENTITIES
              </span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={data.pagination.page === 1}
                  onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                  className="h-10 w-10 p-0 border-luxe-outline-variant bg-transparent rounded-xl hover:bg-luxe-primary/10"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <div className="flex items-center gap-1 mx-2">
                  {[...Array(data.pagination.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setFilters({ ...filters, page: i + 1 })}
                      className={cn(
                        "size-2 rounded-full transition-all duration-300",
                        data.pagination.page === i + 1 ? "bg-luxe-primary w-6" : "bg-white/20 hover:bg-white/40"
                      )}
                    />
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={data.pagination.page === data.pagination.totalPages}
                  onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                  className="h-10 w-10 p-0 border-luxe-outline-variant bg-transparent rounded-xl hover:bg-luxe-primary/10"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
