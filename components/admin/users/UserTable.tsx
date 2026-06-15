"use client";

import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  ShieldCheck, 
  UserX, 
  CheckCircle2, 
  XCircle,
  Mail,
  ChevronDown,
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { User, useUserActions } from "@/hooks/use-users";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const columnHelper = createColumnHelper<User>();

export function UserTable({ users, isLoading }: { users: User[]; isLoading: boolean }) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const { performAction, bulkAction } = useUserActions();

  const columns = [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          className="size-4 rounded border-luxe-outline-variant/50 bg-luxe-surface accent-luxe-primary"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="size-4 rounded border-luxe-outline-variant/50 bg-luxe-surface accent-luxe-primary"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    }),
    columnHelper.accessor("name", {
      header: "User",
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-luxe-primary/10 flex items-center justify-center text-luxe-primary font-bold text-xs overflow-hidden">
            {info.row.original.avatar_url ? (
              <img src={info.row.original.avatar_url} alt="" className="size-full object-cover" />
            ) : (
              info.getValue().charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white tracking-tight">{info.getValue()}</span>
            <span className="text-[11px] text-luxe-on-surface-variant font-medium lowercase italic">{info.row.original.email}</span>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("role", {
      header: "Role",
      cell: (info) => (
        <Badge variant="outline" className={cn(
          "text-[10px] uppercase font-bold tracking-widest px-2 py-0.5",
          info.getValue() === "admin" ? "border-luxe-primary/30 text-luxe-primary bg-luxe-primary/5" : "border-luxe-outline-variant/30 text-luxe-on-surface-variant"
        )}>
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <Badge className={cn(
          "text-[10px] uppercase font-bold px-2 py-0.5 rounded-md",
          info.getValue() === "active" ? "bg-luxe-primary/10 text-luxe-primary" : 
          info.getValue() === "suspended" ? "bg-luxe-tertiary-fixed text-luxe-on-tertiary-container" : 
          "bg-luxe-error-container text-luxe-on-error-container"
        )}>
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor("verification_status", {
      header: "Verified",
      cell: (info) => (
        <div className="flex items-center justify-center">
          {info.getValue() === "verified" ? (
            <CheckCircle2 className="size-4 text-luxe-primary" />
          ) : (
            <XCircle className="size-4 text-luxe-on-surface-variant/30" />
          )}
        </div>
      ),
    }),
    columnHelper.accessor("created_at", {
      header: ({ column }) => (
        <button className="flex items-center gap-1 hover:text-white transition-colors" onClick={() => column.toggleSorting()}>
          Registration <ArrowUpDown className="size-3" />
        </button>
      ),
      cell: (info) => (
        <span className="text-[12px] font-medium text-luxe-on-surface-variant">
          {new Date(info.getValue()).toLocaleDateString()}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <div className="flex items-center justify-end gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="size-8 p-0 text-luxe-on-surface-variant hover:text-white"
            onClick={() => router.push(`/admin/dashboard/users/${info.row.original.id}`)}
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="size-8 p-0 text-luxe-on-surface-variant hover:text-white"
            onClick={() => performAction.mutate({ id: info.row.original.id, action: "send-email", data: { subject: "Admin message" } })}
          >
            <Mail className="size-3.5" />
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: users,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const selectedCount = Object.keys(rowSelection).length;

  const handleBulkAction = (action: string) => {
    const userIds = table.getSelectedRowModel().rows.map(r => r.original.id);
    bulkAction.mutate({ userIds, action });
    setRowSelection({});
  };

  return (
    <div className="relative">
      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-6 px-6 py-4 bg-luxe-surface-container-highest border border-luxe-primary/30 rounded-2xl shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center gap-3 border-r border-white/10 pr-6 mr-2">
              <span className="size-6 bg-luxe-primary text-luxe-on-primary rounded-full flex items-center justify-center text-xs font-black">{selectedCount}</span>
              <span className="text-sm font-bold text-white uppercase tracking-widest">Selected</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => handleBulkAction("activate")} className="bg-luxe-primary/10 text-luxe-primary hover:bg-luxe-primary hover:text-luxe-on-primary border border-luxe-primary/20 h-9 font-bold text-xs uppercase tracking-wider">Activate</Button>
              <Button size="sm" onClick={() => handleBulkAction("suspend")} className="bg-white/5 text-white hover:bg-luxe-tertiary-fixed hover:text-luxe-on-tertiary-container border border-white/10 h-9 font-bold text-xs uppercase tracking-wider">Suspend</Button>
              <Button size="sm" onClick={() => handleBulkAction("verify")} className="bg-white/5 text-white hover:bg-luxe-primary/20 border border-white/10 h-9 font-bold text-xs uppercase tracking-wider text-luxe-primary">Verify</Button>
              <Button size="sm" onClick={() => handleBulkAction("delete")} className="bg-luxe-error/10 text-luxe-error hover:bg-luxe-error hover:text-white border border-luxe-error/20 h-9 font-bold text-xs uppercase tracking-wider">Delete</Button>
            </div>
            
            <Button variant="ghost" size="sm" onClick={() => setRowSelection({})} className="ml-4 text-[10px] font-bold text-luxe-on-surface-variant uppercase tracking-widest hover:text-white">Clear</Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="bg-luxe-surface-container/50 border-b border-luxe-outline-variant/20">
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="py-5 px-6 text-[10px] font-black tracking-[0.2em] text-luxe-on-surface-variant uppercase">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {table.getRowModel().rows.map(row => (
                <motion.tr 
                  key={row.id} 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "border-b border-luxe-outline-variant/10 hover:bg-luxe-surface-container/20 transition-all duration-200",
                    row.getIsSelected() && "bg-luxe-primary/5"
                  )}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="py-4 px-6">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      {users.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="size-16 rounded-full bg-luxe-surface-container-high flex items-center justify-center text-luxe-on-surface-variant/20">
            <UserX className="size-8" />
          </div>
          <div>
            <h4 className="text-white font-bold tracking-tight">No Entities Found</h4>
            <p className="text-xs text-luxe-on-surface-variant mt-1">Adjust your filters or synchronization parameters.</p>
          </div>
        </div>
      )}
    </div>
  );
}
