"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  Plus,
  Search,
  BarChart3,
  Loader2,
  Trash2,
  Pencil,
  X,
  Check,
  AlertTriangle,
  Package,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  Layers,
  ArrowUpDown,
  MoreVertical,
  CheckSquare,
  Square,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────
interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  categories?: { id: number; name: string } | null; // parent
  _count: {
    products: number;
  };
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning";
}

// ─── Toast Hook ────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  return { toasts, addToast, removeToast };
}

// ─── Toast Container ────────────────────────────────────
function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-[60] space-y-2 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className={cn(
              "pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium min-w-[280px]",
              toast.type === "success" ? "bg-luxe-primary/10 border-luxe-primary/30 text-luxe-primary" : "",
              toast.type === "error" ? "bg-luxe-error-container border-luxe-error/30 text-luxe-error" : "",
              toast.type === "warning" ? "bg-luxe-tertiary-fixed border-luxe-tertiary/30 text-luxe-tertiary" : ""
            )}
          >
            {toast.type === "success" && <Check className="size-4" />}
            {(toast.type === "error" || toast.type === "warning") && <AlertTriangle className="size-4" />}
            <span>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="ml-auto hover:opacity-70">
              <X className="size-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────
export default function CategoriesPage() {
  const { toasts, addToast, removeToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<keyof Category | "parent">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", parent_id: "" });
  const [adding, setAdding] = useState(false);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{name: string, parent_id: string}>({ name: "", parent_id: "" });
  
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);
  const [deleteOptions, setDeleteOptions] = useState({ deleteProducts: false, deleteSubCategories: false });
  const [deleting, setDeleting] = useState(false);
  
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showBulkDelete, setShowBulkDelete] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setLoading(true);
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  const filteredCategories = useMemo(() => {
    let result = categories.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    result.sort((a, b) => {
      let aVal: any = sortKey === "parent" ? a.categories?.name || "" : a[sortKey as keyof Category];
      let bVal: any = sortKey === "parent" ? b.categories?.name || "" : b[sortKey as keyof Category];
      if (typeof aVal === "string") return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return sortDir === "asc" ? (aVal > bVal ? 1 : -1) : aVal > bVal ? -1 : 1;
    });
    
    return result;
  }, [categories, searchQuery, sortKey, sortDir]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    try {
      setAdding(true);
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      if (!response.ok) throw new Error("Failed to add category");
      await fetchCategories();
      setShowAddModal(false);
      setAddForm({ name: "", parent_id: "" });
      addToast("Category added successfully!", "success");
    } catch (err: any) {
      addToast(err.message, "error");
    } finally {
      setAdding(false);
    }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    try {
      const response = await fetch(`/api/categories/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!response.ok) throw new Error("Failed to update category");
      await fetchCategories();
      setEditingId(null);
      addToast("Category updated!", "success");
    } catch (err: any) {
      addToast(err.message, "error");
    }
  }

  async function handleDelete() {
    if (!deleteConfirm) return;
    try {
      setDeleting(true);
      const params = new URLSearchParams();
      if (deleteOptions.deleteProducts) params.append("deleteProducts", "true");
      if (deleteOptions.deleteSubCategories) params.append("deleteSubCategories", "true");
      
      const response = await fetch(`/api/categories/${deleteConfirm.id}?${params.toString()}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete category");
      await fetchCategories();
      setDeleteConfirm(null);
      setDeleteOptions({ deleteProducts: false, deleteSubCategories: false });
      addToast("Category deleted!", "success");
    } catch (err: any) {
      addToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  }

  async function handleBulkDelete() {
    try {
      setDeleting(true);
      const response = await fetch(`/api/categories/bulk-delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ids: selectedIds, 
          deleteProducts: deleteOptions.deleteProducts,
          deleteSubCategories: deleteOptions.deleteSubCategories 
        }),
      });
      if (!response.ok) throw new Error("Failed to delete categories");
      await fetchCategories();
      setSelectedIds([]);
      setShowBulkDelete(false);
      setDeleteOptions({ deleteProducts: false, deleteSubCategories: false });
      addToast("Categories deleted successfully!", "success");
    } catch (err: any) {
      addToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  }

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedIds(prev => prev.length === filteredCategories.length ? [] : filteredCategories.map(c => c.id));
  };

  const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const cascadeItem = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-luxe-surface">
        {/* Left Sidebar - Mirrored from admin/page.tsx */}
        <Sidebar className="border-r border-luxe-outline-variant/30 bg-luxe-surface">
          <SidebarHeader className="p-6 border-b border-luxe-outline-variant/20 flex flex-col gap-2">
            <div>
              <span className="font-black tracking-tighter text-xl text-white select-none">
                LU<span className="text-luxe-primary">XE</span> GLOBAL
              </span>
              <p className="text-[11px] text-luxe-on-surface-variant uppercase tracking-wider font-semibold">Enterprise Control</p>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-widest text-luxe-on-surface-variant/70 mb-2">Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem><Link href="/admin"><SidebarMenuButton className="text-luxe-on-surface-variant hover:text-white"><BarChart3 className="size-4" /><span>Overview</span></SidebarMenuButton></Link></SidebarMenuItem>
                  <SidebarMenuItem><Link href="/admin"><SidebarMenuButton className="text-luxe-on-surface-variant hover:text-white"><Package className="size-4" /><span>Inventory</span></SidebarMenuButton></Link></SidebarMenuItem>
                  <SidebarMenuItem><SidebarMenuButton isActive className="bg-luxe-primary/10 text-luxe-primary"><Layers className="size-4" /><span>Categories</span></SidebarMenuButton></SidebarMenuItem>
                  <SidebarMenuItem><Link href="/admin"><SidebarMenuButton className="text-luxe-on-surface-variant hover:text-white"><ClipboardList className="size-4" /><span>Orders</span></SidebarMenuButton></Link></SidebarMenuItem>
                  <SidebarMenuItem><Link href="/admin"><SidebarMenuButton className="text-luxe-on-surface-variant hover:text-white"><FileText className="size-4" /><span>Reports</span></SidebarMenuButton></Link></SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-luxe-outline-variant/20">
            <Button onClick={() => setShowAddModal(true)} className="w-full bg-luxe-primary text-luxe-on-primary hover:bg-luxe-primary/95 text-xs font-bold tracking-wider flex items-center justify-center gap-1.5"><Plus className="size-3.5" /> Add Category</Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 flex flex-col min-h-screen bg-luxe-surface">
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-luxe-outline-variant/20 bg-luxe-surface px-6 md:px-8">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-luxe-on-surface hover:bg-luxe-surface-container size-9" />
              <div className="h-4 w-px bg-luxe-outline-variant/30" />
              <span className="text-[12px] font-semibold text-luxe-on-surface-variant/80 tracking-wider uppercase">Categories Management</span>
            </div>
          </header>

          <main className="flex-1 p-6 md:p-8 space-y-8 max-w-[1440px] w-full mx-auto">
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="flex flex-col gap-8">
              {/* Header Card */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tight">Category <span className="text-luxe-primary">Hierarchy</span></h1>
                  <p className="text-luxe-on-surface-variant text-sm mt-1">Organize your inventory with precision and style.</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-luxe-outline size-4" />
                    <input type="text" placeholder="Search categories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 pr-4 py-2 bg-luxe-surface border border-luxe-outline-variant/40 rounded-lg text-sm text-white focus:ring-1 focus:ring-luxe-primary outline-none w-64" />
                  </div>
                  <Button onClick={() => setShowAddModal(true)} className="bg-luxe-primary text-luxe-on-primary"><Plus className="size-4 mr-2" /> New Category</Button>
                </div>
              </div>

              {/* Bulk Actions Bar */}
              <AnimatePresence>
                {selectedIds.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-luxe-primary/10 border border-luxe-primary/30 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-luxe-primary font-bold text-sm tracking-wide">{selectedIds.length} categories selected</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedIds([])} className="border-luxe-primary/30 text-luxe-primary">Cancel</Button>
                      <Button size="sm" onClick={() => setShowBulkDelete(true)} className="bg-luxe-error text-white"><Trash2 className="size-4 mr-2" /> Bulk Delete</Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Table Card */}
              <Card className="glass-panel border-none shadow-sm rounded-xl overflow-hidden">
                <CardContent className="p-0">
                  {loading ? (
                    <div className="flex items-center justify-center py-20"><Loader2 className="size-8 text-luxe-primary animate-spin" /></div>
                  ) : (
                    <table className="w-full text-sm text-left border-collapse">
                      <thead>
                        <tr className="bg-luxe-surface-container/50 border-b border-luxe-outline-variant/20 text-[11px] font-bold tracking-widest text-luxe-on-surface-variant uppercase">
                          <th className="py-4 px-6 w-10"><button onClick={toggleSelectAll}>{selectedIds.length === filteredCategories.length ? <CheckSquare className="size-4 text-luxe-primary" /> : <Square className="size-4" />}</button></th>
                          <th className="py-4 px-6 cursor-pointer hover:text-luxe-primary" onClick={() => { setSortKey("name"); setSortDir(prev => prev === "asc" ? "desc" : "asc"); }}><div className="flex items-center gap-1">Category Name <ArrowUpDown className="size-3" /></div></th>
                          <th className="py-4 px-6 cursor-pointer hover:text-luxe-primary" onClick={() => { setSortKey("parent"); setSortDir(prev => prev === "asc" ? "desc" : "asc"); }}><div className="flex items-center gap-1">Parent <ArrowUpDown className="size-3" /></div></th>
                          <th className="py-4 px-6 text-center">Products</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <motion.tbody variants={staggerContainer} initial="hidden" animate="visible">
                        {filteredCategories.map(cat => (
                          <motion.tr key={cat.id} variants={cascadeItem} className={cn("border-b border-luxe-outline-variant/10 hover:bg-luxe-primary/5 transition-colors", selectedIds.includes(cat.id) && "bg-luxe-primary/5")}>
                            <td className="py-4 px-6"><button onClick={() => toggleSelect(cat.id)}>{selectedIds.includes(cat.id) ? <CheckSquare className="size-4 text-luxe-primary" /> : <Square className="size-4" />}</button></td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                {cat.parent_id && <div className="h-4 w-px bg-luxe-primary/40 ml-2 mr-1" />}
                                <span className={cn("font-semibold text-white", cat.parent_id ? "opacity-90" : "text-lg")}>{cat.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              {cat.categories ? <Badge variant="outline" className="text-[10px] font-bold border-luxe-primary/30 text-luxe-primary uppercase">{cat.categories.name}</Badge> : <span className="text-luxe-on-surface-variant/40">—</span>}
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className="font-mono text-sm text-luxe-primary">{cat._count.products} items</span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => { setEditingId(cat.id); setEditForm({ name: cat.name, parent_id: cat.parent_id?.toString() || "" }); }} className="text-luxe-primary hover:bg-luxe-primary/10"><Pencil className="size-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm({ id: cat.id, name: cat.name })} className="text-luxe-error hover:bg-luxe-error/10"><Trash2 className="size-4" /></Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </motion.tbody>
                    </table>
                  )}
                  {!loading && filteredCategories.length === 0 && <div className="text-center py-20 text-luxe-on-surface-variant">No categories found.</div>}
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>

      {/* ─── MODALS ─────────────────────────────────────────── */}
      <AnimatePresence>
        {/* Add Modal */}
        {showAddModal && (
          <Modal title="Add New Category" onClose={() => setShowAddModal(false)}>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-luxe-on-surface-variant uppercase">Category Name</label>
                <input required value={addForm.name} onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))} type="text" className="w-full bg-luxe-surface-container border border-luxe-outline-variant/30 rounded-lg px-4 py-2.5 text-white outline-none focus:border-luxe-primary" placeholder="e.g. Luxury Timepieces" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-luxe-on-surface-variant uppercase">Parent Category (Optional)</label>
                <select value={addForm.parent_id} onChange={e => setAddForm(p => ({ ...p, parent_id: e.target.value }))} className="w-full bg-luxe-surface-container border border-luxe-outline-variant/30 rounded-lg px-4 py-2.5 text-white outline-none focus:border-luxe-primary">
                  <option value="">None (Top Level)</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">Cancel</Button>
                <Button type="submit" disabled={adding} className="flex-1 bg-luxe-primary text-luxe-on-primary">{adding ? <Loader2 className="animate-spin size-4" /> : "Create Category"}</Button>
              </div>
            </form>
          </Modal>
        )}

        {/* Edit Modal */}
        {editingId && (
          <Modal title="Edit Category" onClose={() => setEditingId(null)}>
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-luxe-on-surface-variant uppercase">Category Name</label>
                <input required value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} type="text" className="w-full bg-luxe-surface-container border border-luxe-outline-variant/30 rounded-lg px-4 py-2.5 text-white outline-none focus:border-luxe-primary" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-luxe-on-surface-variant uppercase">Parent Category</label>
                <select value={editForm.parent_id} onChange={e => setEditForm(p => ({ ...p, parent_id: e.target.value }))} className="w-full bg-luxe-surface-container border border-luxe-outline-variant/30 rounded-lg px-4 py-2.5 text-white outline-none focus:border-luxe-primary">
                  <option value="">None (Top Level)</option>
                  {categories.filter(c => c.id !== editingId).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditingId(null)} className="flex-1">Cancel</Button>
                <Button type="submit" className="flex-1 bg-luxe-primary text-luxe-on-primary">Save Changes</Button>
              </div>
            </form>
          </Modal>
        )}

        {/* Delete Confirmation */}
        {(deleteConfirm || showBulkDelete) && (
          <Modal title="Confirm Strategic Deletion" onClose={() => { setDeleteConfirm(null); setShowBulkDelete(false); }}>
            <div className="space-y-6">
              <div className="flex items-start gap-4 bg-luxe-error-container/20 border border-luxe-error/30 p-4 rounded-xl">
                <div className="size-10 rounded-full bg-luxe-error/20 flex items-center justify-center shrink-0"><AlertCircle className="text-luxe-error size-6" /></div>
                <div>
                  <p className="text-white font-bold tracking-tight">Serious Modification Required</p>
                  <p className="text-luxe-on-error-container text-xs mt-0.5">
                    Deleting {showBulkDelete ? `${selectedIds.length} categories` : `"${deleteConfirm?.name}"`} will affect multiple inventory nodes. Choose your cascade options carefully.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center p-3 rounded-lg bg-luxe-surface-container/30 border border-luxe-outline-variant/10 hover:border-luxe-primary/30 transition-colors cursor-pointer group" onClick={() => setDeleteOptions(p => ({ ...p, deleteProducts: !p.deleteProducts }))}>
                   <div className={cn("size-5 border rounded flex items-center justify-center transition-all", deleteOptions.deleteProducts ? "bg-luxe-primary border-luxe-primary text-luxe-on-primary" : "border-luxe-outline-variant group-hover:border-luxe-primary")}>
                     {deleteOptions.deleteProducts && <Check className="size-3.5" />}
                   </div>
                   <div className="ml-3">
                     <p className="text-sm font-bold text-white tracking-wide">Purge Associated Products</p>
                     <p className="text-[11px] text-luxe-on-surface-variant">Permanently delete all products in {showBulkDelete ? "these categories" : "this category"}.</p>
                   </div>
                </div>

                <div className="flex items-center p-3 rounded-lg bg-luxe-surface-container/30 border border-luxe-outline-variant/10 hover:border-luxe-primary/30 transition-colors cursor-pointer group" onClick={() => setDeleteOptions(p => ({ ...p, deleteSubCategories: !p.deleteSubCategories }))}>
                   <div className={cn("size-5 border rounded flex items-center justify-center transition-all", deleteOptions.deleteSubCategories ? "bg-luxe-primary border-luxe-primary text-luxe-on-primary" : "border-luxe-outline-variant group-hover:border-luxe-primary")}>
                     {deleteOptions.deleteSubCategories && <Check className="size-3.5" />}
                   </div>
                   <div className="ml-3">
                     <p className="text-sm font-bold text-white tracking-wide">Dissolve Sub-Categories</p>
                     <p className="text-[11px] text-luxe-on-surface-variant">Recursively delete children. If unchecked, children move to top-level.</p>
                   </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-luxe-outline-variant/20">
                <Button variant="outline" onClick={() => { setDeleteConfirm(null); setShowBulkDelete(false); }} className="flex-1">Abort</Button>
                <Button onClick={showBulkDelete ? handleBulkDelete : handleDelete} disabled={deleting} className="flex-1 bg-luxe-error text-white hover:bg-luxe-error/90">
                  {deleting ? <Loader2 className="animate-spin size-4" /> : "Confirm Deletion"}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </SidebarProvider>
  );
}

// ─── Modal Wrapper ───────────────────────────────────────
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-luxe-surface border border-luxe-outline-variant/30 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-luxe-outline-variant/20 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
          <button onClick={onClose} className="text-luxe-on-surface-variant hover:text-white transition-colors"><X className="size-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  );
}
