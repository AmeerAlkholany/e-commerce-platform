"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Loader2,
  Trash2,
  Pencil,
  X,
  Check,
  AlertTriangle,
  Package,
  ChevronLeft,
  ChevronRight,
  Download,
  ArrowUpDown,
  FileText,
  DollarSign,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

// ─── Types ─────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category_id: number | null;
  image_url: string | null;
  categories?: { id: number; name: string } | null;
}

interface Category {
  id: number;
  name: string;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning";
}

// ─── Toast Hook ────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = (message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => { setToasts((prev) => prev.filter((t) => t.id !== id)); }, 4000);
  };
  const removeToast = (id: string) => { setToasts((prev) => prev.filter((t) => t.id !== id)); };
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
            <button onClick={() => removeToast(toast.id)} className="ml-auto hover:opacity-70"><X className="size-3.5" /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Stock Badge ──────────────────────────────────────
function StockBadge({ stock }: { stock: number }) {
  const status = stock === 0 ? "Out of Stock" : stock <= 5 ? "Low Stock" : "In Stock";
  const classes = status === "In Stock" ? "bg-luxe-primary/10 text-luxe-primary" : status === "Low Stock" ? "bg-luxe-tertiary-fixed text-luxe-on-tertiary-container" : "bg-luxe-error-container text-luxe-on-error-container";
  return <Badge className={cn("text-[10px] font-bold uppercase py-0.5 px-2 rounded-md", classes)}>{status}</Badge>;
}

export default function ProductsPage() {
  const { toasts, addToast, removeToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [sortKey, setSortKey] = useState<keyof Product | "category">("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", description: "", price: "", stock: "", category_id: "", image_url: "" });
  const [addingProduct, setAddingProduct] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch { console.error("Failed to fetch categories"); }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => searchProducts(), 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  async function searchProducts() {
    try {
      setLoading(true);
      setCurrentPage(1);
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();
      setProducts(data);
    } catch (err: any) { addToast("Search failed", "error"); }
    finally { setLoading(false); }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      setUploadProgress(0);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 11)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error } = await supabase.storage.from('products-images').upload(filePath, file, { cacheControl: '3600', upsert: false });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('products-images').getPublicUrl(filePath);
      setAddForm(prev => ({ ...prev, image_url: publicUrl }));
      setImagePreview(publicUrl);
      addToast("Image uploaded successfully", "success");
    } catch (err: any) { addToast(`Upload failed: ${err.message}`, "error"); }
    finally { setIsUploading(false); setUploadProgress(100); }
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    if (isUploading) { addToast("Please wait for image upload to complete", "warning"); return; }
    try {
      setAddingProduct(true);
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addForm.name.trim(),
          description: addForm.description || null,
          price: Number(addForm.price),
          stock: Number(addForm.stock) || 0,
          category_id: addForm.category_id ? Number(addForm.category_id) : null,
          image_url: addForm.image_url || null,
        }),
      });
      if (!response.ok) throw new Error("Failed");
      const newProduct = await response.json();
      setProducts(prev => [newProduct, ...prev]);
      setAddForm({ name: "", description: "", price: "", stock: "", category_id: "", image_url: "" });
      setImagePreview("");
      setShowAddModal(false);
      addToast("Product added!", "success");
    } catch (err: any) { addToast(err.message, "error"); }
    finally { setAddingProduct(false); }
  }

  async function deleteProduct(id: number) {
    try {
      setDeletingId(id);
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed");
      setProducts(prev => prev.filter(p => p.id !== id));
      setShowDeleteConfirm(null);
      addToast("Product deleted", "success");
    } catch (err: any) { addToast(err.message, "error"); }
    finally { setDeletingId(null); }
  }

  async function saveEdit(id: number) {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          price: Number(editForm.price),
          stock: Number(editForm.stock),
          description: editForm.description,
          category_id: editForm.category_id ? Number(editForm.category_id) : null,
        }),
      });
      if (!response.ok) throw new Error("Failed");
      const updated = await response.json();
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
      setEditingId(null);
      addToast("Product updated!", "success");
    } catch (err: any) { addToast(err.message, "error"); }
  }

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    sorted.sort((a, b) => {
      let aVal: any = sortKey === "category" ? a.categories?.name || "" : a[sortKey as keyof Product];
      let bVal: any = sortKey === "category" ? b.categories?.name || "" : b[sortKey as keyof Product];
      if (aVal === null) aVal = "";
      if (bVal === null) bVal = "";
      if (typeof aVal === "string") return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return sortDir === "asc" ? (aVal > bVal ? 1 : -1) : aVal > bVal ? -1 : 1;
    });
    return sorted;
  }, [products, sortKey, sortDir]);

  const totalPages = Math.ceil(sortedProducts.length / pageSize) || 1;
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function exportToCSV() {
    const headers = ["ID", "Name", "Category", "Price", "Stock", "Status"];
    const rows = sortedProducts.map(p => [p.id, `"${p.name.replace(/"/g, '""')}"`, p.categories?.name || "Uncategorized", p.price, p.stock, p.stock === 0 ? "Out of Stock" : p.stock <= 5 ? "Low Stock" : "In Stock"]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `products-${new Date().toISOString().split("T")[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
    addToast("CSV exported!", "success");
  }

  const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const cascadeItem = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="space-y-8">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Inventory <span className="text-luxe-primary">Catalog</span></h1>
          <p className="text-luxe-on-surface-variant text-sm mt-1">Manage your luxury product collection.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddModal(true)} className="bg-luxe-primary text-luxe-on-primary">
            <Plus className="size-4 mr-2" /> Add Luxury Item
          </Button>
        </div>
      </div>

      <Card className="glass-panel border-none shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="border-b border-luxe-outline-variant/20 pb-6 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-[20px] font-semibold text-luxe-on-surface">Product Inventory Database</CardTitle>
            <CardDescription className="text-[13px] text-luxe-on-surface-variant">Add, Edit, or Delete</CardDescription>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxe-outline size-4" />
              <input type="text" placeholder="Search catalog..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full sm:w-64 bg-luxe-surface border border-luxe-outline-variant/40 rounded-lg text-sm text-white focus:ring-1 focus:ring-luxe-primary outline-none" />
            </div>
            <Button variant="outline" onClick={exportToCSV} className="border-luxe-outline-variant bg-transparent text-luxe-on-surface hover:bg-luxe-surface-container font-semibold">
              <Download className="size-3.5 mr-2" /> Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? <div className="flex items-center justify-center py-20"><Loader2 className="size-8 text-luxe-primary animate-spin" /></div> : (
            <>
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-luxe-surface-container/50 border-b border-luxe-outline-variant/20 text-[11px] font-bold tracking-widest text-luxe-on-surface-variant uppercase">
                    <th className="py-4 px-6 cursor-pointer hover:text-luxe-primary transition-colors" onClick={() => { setSortKey("id"); setSortDir(prev => prev === "asc" ? "desc" : "asc"); }}>ID</th>
                    <th className="py-4 px-6 cursor-pointer hover:text-luxe-primary transition-colors" onClick={() => { setSortKey("name"); setSortDir(prev => prev === "asc" ? "desc" : "asc"); }}>Name</th>
                    <th className="py-4 px-6 cursor-pointer hover:text-luxe-primary transition-colors" onClick={() => { setSortKey("category"); setSortDir(prev => prev === "asc" ? "desc" : "asc"); }}>Category</th>
                    <th className="py-4 px-6 cursor-pointer hover:text-luxe-primary transition-colors" onClick={() => { setSortKey("price"); setSortDir(prev => prev === "asc" ? "desc" : "asc"); }}>Price</th>
                    <th className="py-4 px-6 cursor-pointer hover:text-luxe-primary transition-colors" onClick={() => { setSortKey("stock"); setSortDir(prev => prev === "asc" ? "desc" : "asc"); }}>Stock</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <motion.tbody variants={staggerContainer} initial="hidden" animate="visible">
                  <AnimatePresence>
                    {paginatedProducts.map((p) => (
                      <motion.tr key={p.id} variants={cascadeItem} className="border-b border-luxe-outline-variant/10 hover:bg-luxe-surface-container/10 transition-colors">
                        <td className="py-4 px-6 font-mono text-xs text-luxe-on-surface-variant">PROD-{p.id}</td>
                        <td className="py-4 px-6">
                          {editingId === p.id ? <input value={editForm.name || ""} onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))} className="w-full bg-luxe-surface border border-luxe-primary/30 rounded px-2 py-1 text-sm text-white outline-none" /> : <span className="font-semibold text-white">{p.name}</span>}
                        </td>
                        <td className="py-4 px-6">
                          {editingId === p.id ? (
                            <select value={editForm.category_id || ""} onChange={(e) => setEditForm(prev => ({ ...prev, category_id: e.target.value ? Number(e.target.value) : null }))} className="w-full bg-luxe-surface border border-luxe-primary/30 rounded px-2 py-1 text-sm text-white outline-none">
                              <option value="">No Category</option>
                              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                          ) : <Badge variant="outline" className="text-[10px] uppercase border-luxe-outline-variant/30 text-luxe-on-surface-variant font-bold">{p.categories?.name || "Uncategorized"}</Badge>}
                        </td>
                        <td className="py-4 px-6 text-luxe-primary font-bold">
                          {editingId === p.id ? <input type="number" step="0.01" value={editForm.price || ""} onChange={(e) => setEditForm(prev => ({ ...prev, price: Number(e.target.value) }))} className="w-24 bg-luxe-surface border border-luxe-primary/30 rounded px-2 py-1 text-sm text-white outline-none" /> : `$${Number(p.price).toLocaleString()}`}
                        </td>
                        <td className="py-4 px-6 text-luxe-on-surface-variant">
                          {editingId === p.id ? <input type="number" value={editForm.stock || ""} onChange={(e) => setEditForm(prev => ({ ...prev, stock: Number(e.target.value) }))} className="w-20 bg-luxe-surface border border-luxe-primary/30 rounded px-2 py-1 text-sm text-white outline-none" /> : `${p.stock} units`}
                        </td>
                        <td className="py-4 px-6"><StockBadge stock={p.stock} /></td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {editingId === p.id ? (
                              <>
                                <Button size="sm" onClick={() => saveEdit(p.id)} className="bg-luxe-primary text-luxe-on-primary h-8 px-3"><Check className="size-3.5" /></Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="h-8 px-3"><X className="size-3.5" /></Button>
                              </>
                            ) : (
                              <>
                                <Button variant="ghost" size="sm" onClick={() => { setEditingId(p.id); setEditForm({ ...p }); }} className="text-luxe-primary hover:bg-luxe-primary/10 h-8 px-3"><Pencil className="size-3.5" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(p.id)} className="text-luxe-error hover:bg-luxe-error/10 h-8 px-3"><Trash2 className="size-3.5" /></Button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </motion.tbody>
              </table>
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-luxe-outline-variant/20">
                  <span className="text-xs text-luxe-on-surface-variant">Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedProducts.length)} of {sortedProducts.length}</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 w-8 p-0 border-luxe-outline-variant"><ChevronLeft className="size-4" /></Button>
                    <span className="text-xs font-medium text-white min-w-[3rem] text-center">{currentPage} / {totalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 w-8 p-0 border-luxe-outline-variant"><ChevronRight className="size-4" /></Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && <AddModal
          onClose={() => setShowAddModal(false)}
          onSubmit={addProduct}
          form={addForm}
          setForm={setAddForm}
          categories={categories}
          imagePreview={imagePreview}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          addingProduct={addingProduct}
          handleImageUpload={handleImageUpload}
          fileInputRef={fileInputRef}
        />}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && <DeleteModal
          onClose={() => setShowDeleteConfirm(null)}
          onDelete={() => deleteProduct(showDeleteConfirm)}
          deleting={deletingId === showDeleteConfirm}
          name={products.find(p => p.id === showDeleteConfirm)?.name || ""}
        />}
      </AnimatePresence>
    </div>
  );
}

function AddModal({ onClose, onSubmit, form, setForm, categories, imagePreview, isUploading, uploadProgress, addingProduct, handleImageUpload, fileInputRef }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-luxe-surface border border-luxe-outline-variant/30 rounded-2xl shadow-3xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-luxe-outline-variant/20 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white tracking-tight">Add New Product</h3>
          <button onClick={onClose} className="text-luxe-on-surface-variant hover:text-white transition-colors"><X className="size-5" /></button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-luxe-on-surface-variant uppercase">Product Name</label>
            <Input required value={form.name} onChange={e => setForm((p: any) => ({ ...p, name: e.target.value }))} placeholder="e.g. Phantom Chronograph" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-luxe-on-surface-variant uppercase">Description</label>
            <textarea value={form.description} onChange={e => setForm((p: any) => ({ ...p, description: e.target.value }))} placeholder="Product details..." rows={2} className="w-full bg-luxe-surface-container border border-luxe-outline-variant/30 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-luxe-primary resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest text-luxe-on-surface-variant uppercase">Price ($)</label>
              <Input required type="number" step="0.01" value={form.price} onChange={e => setForm((p: any) => ({ ...p, price: e.target.value }))} placeholder="0.00" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest text-luxe-on-surface-variant uppercase">Initial Stock</label>
              <Input type="number" value={form.stock} onChange={e => setForm((p: any) => ({ ...p, stock: e.target.value }))} placeholder="0" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-luxe-on-surface-variant uppercase">Category</label>
            <select value={form.category_id} onChange={e => setForm((p: any) => ({ ...p, category_id: e.target.value }))} className="w-full bg-luxe-surface-container border border-luxe-outline-variant/30 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-luxe-primary">
              <option value="">Select Category...</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>



          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-luxe-on-surface-variant uppercase">Product Media</label>
            <div onClick={() => fileInputRef.current?.click()} className="relative h-32 border border-dashed border-luxe-outline-variant/40 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-luxe-primary/5 hover:border-luxe-primary transition-all overflow-hidden group">
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              {imagePreview ? (
                <img src={imagePreview} className="absolute inset-0 w-full h-full object-contain p-2" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Plus className="size-5 text-luxe-primary" />
                  <span className="text-[10px] font-bold text-luxe-on-surface-variant uppercase tracking-widest text-center px-4">Upload Image</span>
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 space-y-2">
                  <Loader2 className="size-6 text-luxe-primary animate-spin" />
                  <div className="w-full max-w-[120px]">
                    <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                      <motion.div className="bg-luxe-primary h-full" initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={addingProduct} className="flex-1 bg-luxe-primary text-luxe-on-primary">
              {addingProduct ? <Loader2 className="animate-spin size-4" /> : "Add Product"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function DeleteModal({ onClose, onDelete, deleting, name }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-luxe-surface border border-luxe-outline-variant/30 rounded-2xl p-6 shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-4 mb-4">
          <div className="size-12 rounded-full bg-luxe-error/10 flex items-center justify-center shrink-0"><AlertTriangle className="text-luxe-error size-6" /></div>
          <h3 className="text-xl font-bold text-white tracking-tight">Confirm Purge</h3>
        </div>
        <p className="text-sm text-luxe-on-surface-variant mb-6">Are you certain you wish to eliminate <strong className="text-white">{name}</strong> from the database? This action is irreversible.</p>
        <div className="flex gap-3 justify-end pt-4 border-t border-luxe-outline-variant/20">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onDelete} disabled={deleting} className="bg-luxe-error text-white hover:bg-luxe-error/90">{deleting ? <Loader2 className="animate-spin size-4" /> : "Confirm Deletion"}</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
