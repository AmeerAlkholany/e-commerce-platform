"use client";

import React from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function UserFilters({
  filters,
  setFilters,
  onReset
}: {
  filters: any;
  setFilters: (f: any) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row items-end md:items-center gap-4 bg-luxe-surface-container/30 p-4 rounded-2xl border border-luxe-outline-variant/10">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxe-outline size-4" />
        <Input
          placeholder="Search by name, email or ID..."
          value={filters.search || ""}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          className="pl-10 h-11 bg-luxe-surface border-luxe-outline-variant/40 rounded-xl"
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <select
          value={filters.role || ""}
          onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
          className="h-11 bg-luxe-surface border border-luxe-outline-variant/40 rounded-xl px-4 text-sm text-white focus:ring-1 focus:ring-luxe-primary outline-none min-w-[120px]"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </select>

        <select
          value={filters.status || ""}
          onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
          className="h-11 bg-luxe-surface border border-luxe-outline-variant/40 rounded-xl px-4 text-sm text-white focus:ring-1 focus:ring-luxe-primary outline-none min-w-[130px]"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </select>

        <Button 
          variant="outline" 
          onClick={onReset}
          className="h-11 px-4 border-luxe-outline-variant hover:bg-luxe-surface-container rounded-xl"
        >
          <X className="size-4 mr-2" /> Reset
        </Button>
      </div>
    </div>
  );
}
