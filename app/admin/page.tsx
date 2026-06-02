"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  DollarSign,
  Users,
  Percent,
  Plus,
  Search,
  Filter,
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
  Download,
  ArrowUpDown,
  ImageIcon,
} from "lucide-react";

// ─── Recharts (npm install recharts) ───────────────────
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
} from "recharts";

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

// ─── Focus Trap Hook ───────────────────────────────────
function useFocusTrap(isActive: boolean, onEscape?: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;
    const element = ref.current;
    if (!element) return;

    const focusable = element.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onEscape?.();
        return;
      }
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    element.addEventListener("keydown", handleKeyDown);
    return () => element.removeEventListener("keydown", handleKeyDown);
  }, [isActive, onEscape]);

  return ref;
}

// ─── Helper Components ─────────────────────────────────
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
            className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium min-w-[280px]
              ${toast.type === "success" ? "bg-luxe-primary/10 border-luxe-primary/30 text-luxe-primary" : ""}
              ${toast.type === "error" ? "bg-luxe-error-container border-luxe-error/30 text-luxe-error" : ""}
              ${toast.type === "warning" ? "bg-luxe-tertiary-fixed border-luxe-tertiary/30 text-luxe-tertiary" : ""}
            `}
          >
            {toast.type === "success" && <Check className="size-4" />}
            {toast.type === "error" && <AlertTriangle className="size-4" />}
            {toast.type === "warning" && <AlertTriangle className="size-4" />}
            <span>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="ml-auto hover:opacity-70" aria-label="Dismiss notification">
              <X className="size-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function StockBadge({ stock }: { stock: number }) {
  const status = stock === 0 ? "Out of Stock" : stock <= 5 ? "Low Stock" : "In Stock";
  const classes =
    status === "In Stock"
      ? "bg-luxe-primary/10 text-luxe-primary"
      : status === "Low Stock"
      ? "bg-luxe-tertiary-fixed text-luxe-tertiary"
      : "bg-luxe-error-container text-luxe-on-error-container";
  return (
    <Badge className={`text-[10px] font-bold uppercase py-0.5 px-2 rounded-md ${classes}`}>
      {status}
    </Badge>
  );
}

// ─── Main Component ────────────────────────────────────
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "products">("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Sorting
  const [sortKey, setSortKey] = useState<keyof Product | "category">("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Edit State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  // Delete State
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  // Add State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    image_url: "",
  });
  const [addingProduct, setAddingProduct] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  // Abort controller ref
  const abortRef = useRef<AbortController | null>(null);

  // Focus traps
  const addModalRef = useFocusTrap(showAddModal, () => setShowAddModal(false));
  const deleteModalRef = useFocusTrap(!!showDeleteConfirm, () => setShowDeleteConfirm(null));

  // ─── Metrics with useMemo ────────────────────────────
  const { totalRevenue, totalProducts, lowStockCount, outOfStockCount } = useMemo(() => {
    const revenue = products.reduce((sum, p) => sum + Number(p.price) * p.stock, 0);
    const low = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
    const out = products.filter((p) => p.stock === 0).length;
    return { totalRevenue: revenue, totalProducts: products.length, lowStockCount: low, outOfStockCount: out };
  }, [products]);

  // ─── Chart Data (Mock sales data - replace with real API) ──
  const salesData = useMemo(() => {
    return [
      { name: "Jan", sales: 4000 },
      { name: "Feb", sales: 3000 },
      { name: "Mar", sales: 5000 },
      { name: "Apr", sales: 2780 },
      { name: "May", sales: 1890 },
      { name: "Jun", sales: 6390 },
    ];
  }, []);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      const cat = p.categories?.name || "Uncategorized";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [products]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // ─── Fetch Data ──────────────────────────────────────
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      const response = await fetch("/api/products", { signal: abortRef.current.signal });
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message || "Unknown error");
        addToast(err.message || "Failed to load products", "error");
      }
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
    } catch {
      console.error("Failed to fetch categories");
    }
  }

  // ─── Search with Debounce + Abort ────────────────────
  useEffect(() => {
    const timeoutId = setTimeout(() => searchProducts(), 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  async function searchProducts() {
    try {
      setLoading(true);
      setCurrentPage(1);
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      const response = await fetch(`/api/products?${params.toString()}`, {
        signal: abortRef.current.signal,
      });
      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError("Search failed");
        addToast("Search failed", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  // ─── Validation ──────────────────────────────────────
  function validateProduct(form: typeof addForm | Partial<Product>, isEdit = false) {
    const errors: string[] = [];
    const name = isEdit ? (form as Partial<Product>).name : (form as typeof addForm).name;
    const price = isEdit ? (form as Partial<Product>).price : (form as typeof addForm).price;
    const stock = isEdit ? (form as Partial<Product>).stock : (form as typeof addForm).stock;

    if (!name || String(name).trim().length < 2) errors.push("Name must be at least 2 characters");
    if (price === undefined || price === "" || Number(price) <= 0) errors.push("Price must be greater than 0");
    if (stock !== undefined && stock !== "" && Number(stock) < 0) errors.push("Stock cannot be negative");

    return errors;
  }

  // ─── POST: Add Product ───────────────────────────────
  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    const errors = validateProduct(addForm);
    if (errors.length > 0) {
      addToast(errors[0], "warning");
      return;
    }

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

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to create");
      }

      const newProduct = await response.json();
      setProducts((prev) => [newProduct, ...prev]);
      setAddForm({ name: "", description: "", price: "", stock: "", category_id: "", image_url: "" });
      setImagePreview("");
      setShowAddModal(false);
      setError(null);
      addToast("Product added successfully!", "success");
    } catch (err: any) {
      setError(err.message || "Failed to add product");
      addToast(err.message || "Failed to add product", "error");
    } finally {
      setAddingProduct(false);
    }
  }

  // ─── DELETE ──────────────────────────────────────────
  async function deleteProduct(id: number) {
    try {
      setDeletingId(id);
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to delete");
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setShowDeleteConfirm(null);
      addToast("Product deleted successfully", "success");
    } catch (err: any) {
      setError(err.message || "Failed to delete");
      addToast(err.message || "Failed to delete", "error");
    } finally {
      setDeletingId(null);
    }
  }

  // ─── START Edit ──────────────────────────────────────
  function startEdit(product: Product) {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      category_id: product.category_id,
    });
  }

  // ─── SAVE Edit (PUT) ─────────────────────────────────
  async function saveEdit(id: number) {
    const errors = validateProduct(editForm, true);
    if (errors.length > 0) {
      addToast(errors[0], "warning");
      return;
    }

    try {
      setLoading(true);
      const updateData: Partial<Pick<Product, "name" | "price" | "stock" | "description" | "category_id">> = {};
      if (editForm.name !== undefined) updateData.name = editForm.name;
      if (editForm.price !== undefined) updateData.price = Number(editForm.price);
      if (editForm.stock !== undefined) updateData.stock = Number(editForm.stock);
      if (editForm.description !== undefined) updateData.description = editForm.description;
      if (editForm.category_id !== undefined) updateData.category_id = editForm.category_id ? Number(editForm.category_id) : null;

      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to update");
      }

      const updated = await response.json();
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
      setEditingId(null);
      setEditForm({});
      addToast("Product updated successfully", "success");
    } catch (err: any) {
      setError(err.message || "Failed to update");
      addToast(err.message || "Failed to update", "error");
    } finally {
      setLoading(false);
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({});
  }

  // ─── Sorting ─────────────────────────────────────────
  function handleSort(key: keyof Product | "category") {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setCurrentPage(1);
  }

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    sorted.sort((a, b) => {
      let aVal: any = a[sortKey as keyof Product];
      let bVal: any = b[sortKey as keyof Product];

      if (sortKey === "category") {
        aVal = a.categories?.name || "";
        bVal = b.categories?.name || "";
      }

      if (aVal === null) aVal = "";
      if (bVal === null) bVal = "";

      if (typeof aVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? (aVal > bVal ? 1 : -1) : aVal > bVal ? -1 : 1;
    });
    return sorted;
  }, [products, sortKey, sortDir]);

  // ─── Pagination ──────────────────────────────────────
  const totalPages = Math.ceil(sortedProducts.length / pageSize) || 1;
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // ─── Export CSV ──────────────────────────────────────
  function exportToCSV() {
    const headers = ["ID", "Name", "Category", "Price", "Stock", "Status"];
    const rows = sortedProducts.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.categories?.name || "Uncategorized",
      p.price,
      p.stock,
      p.stock === 0 ? "Out of Stock" : p.stock <= 5 ? "Low Stock" : "In Stock",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast("CSV exported successfully", "success");
  }

  // ─── Animation Variants ──────────────────────────────
  const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const cascadeItem = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } } };

  const adminMetricsData = [
    { title: "Store Revenue", value: `$${totalRevenue.toLocaleString()}`, change: "+12.4% vs last month", trend: "up" as const, icon: DollarSign },
    { title: "Total Products", value: totalProducts.toString(), change: "+8.2% vs last month", trend: "up" as const, icon: ShoppingBag },
    { title: "Low Stock Items", value: lowStockCount.toString(), change: lowStockCount > 0 ? "Needs attention" : "All good", trend: lowStockCount > 0 ? ("down" as const) : ("up" as const), icon: Percent },
    { title: "Out of Stock", value: outOfStockCount.toString(), change: outOfStockCount > 0 ? "Restock needed" : "Fully stocked", trend: outOfStockCount > 0 ? ("down" as const) : ("up" as const), icon: Users },
  ];

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-luxe-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-10 text-luxe-primary animate-spin" />
          <span className="text-luxe-on-surface-variant text-sm">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-luxe-surface py-12 px-4 md:px-[64px] max-w-[1440px] mx-auto space-y-12">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-luxe-outline-variant/30 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold tracking-[0.2em] text-luxe-tertiary uppercase bg-luxe-tertiary/10 px-3 py-1 rounded-full">Enterprise Dashboard</span>
            <span className="size-2 bg-luxe-primary rounded-full animate-ping" />
            <span className="text-[10px] text-luxe-primary font-bold tracking-wider">LIVE DATA</span>
          </div>
          <h1 className="text-[36px] font-light tracking-tight text-luxe-on-surface">Luxe Global <span className="font-normal">Control Panel</span></h1>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="border-luxe-outline-variant bg-transparent text-luxe-on-surface hover:bg-luxe-surface-container py-5 px-6 rounded-lg text-[13px] font-semibold tracking-wider cursor-pointer">
            <Link href="/dashboard">Go to Client View</Link>
          </Button>
          <Button onClick={() => setShowAddModal(true)} className="bg-luxe-primary text-luxe-on-primary hover:bg-luxe-primary/95 py-5 px-6 rounded-lg text-[13px] font-semibold tracking-wider cursor-pointer flex items-center gap-1.5">
            <Plus className="size-4" /> Add Luxury Item
          </Button>
        </div>
      </motion.div>

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-luxe-error-container border border-luxe-error/20 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="size-5 text-luxe-error" />
            <span className="text-luxe-on-error-container text-sm">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto hover:bg-luxe-error/10 rounded p-1" aria-label="Dismiss error">
              <X className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-luxe-outline-variant/20 pb-1">
        <button onClick={() => setActiveTab("overview")} className={`pb-4 text-[14px] font-bold tracking-[0.05em] uppercase border-b-2 transition-all cursor-pointer ${activeTab === "overview" ? "border-luxe-primary text-luxe-primary" : "border-transparent text-luxe-on-surface-variant"}`}>Performance Overview</button>
        <button onClick={() => setActiveTab("products")} className={`pb-4 text-[14px] font-bold tracking-[0.05em] uppercase border-b-2 transition-all cursor-pointer ${activeTab === "products" ? "border-luxe-primary text-luxe-primary" : "border-transparent text-luxe-on-surface-variant"}`}>Inventory Catalog ({products.length})</button>
      </div>

      {activeTab === "overview" ? (
        <div className="space-y-12">
          {/* Metrics */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {adminMetricsData.map((metric, idx) => {
              const MetricIcon = metric.icon;
              return (
                <motion.div key={idx} variants={cascadeItem}>
                  <Card className="glass-panel border-none shadow-sm rounded-xl p-6 flex flex-col justify-between h-44 hover:-translate-y-0.5 hover:shadow-md hover:scale-[1.01] transition-all">
                    <div className="flex justify-between items-start">
                      <span className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">{metric.title}</span>
                      <div className="size-8 rounded-lg bg-luxe-surface-container flex items-center justify-center text-luxe-primary">
                        <MetricIcon className="size-4" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-[32px] font-bold text-luxe-on-surface tracking-tight">{metric.value}</h3>
                      <div className="flex items-center gap-1.5">
                        {metric.trend === "up" ? (
                          <span className="text-[11px] bg-luxe-primary/10 text-luxe-primary px-2 py-0.5 rounded font-bold flex items-center gap-0.5">
                            <TrendingUp className="size-3" /> Growth
                          </span>
                        ) : (
                          <span className="text-[11px] bg-luxe-error-container text-luxe-on-error-container px-2 py-0.5 rounded font-bold flex items-center gap-0.5 animate-pulse">
                            <TrendingDown className="size-3" /> Shift
                          </span>
                        )}
                        <span className="text-[11px] text-luxe-on-surface-variant/80">{metric.change}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="glass-panel border-none shadow-sm rounded-xl p-6">
              <CardHeader className="px-0 pt-0 pb-4">
                <CardTitle className="text-[18px] font-semibold text-luxe-on-surface flex items-center gap-2">
                  <BarChart3 className="size-5 text-luxe-primary" /> Sales Trend
                </CardTitle>
              </CardHeader>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="sales" stroke="#8884d8" fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="glass-panel border-none shadow-sm rounded-xl p-6">
              <CardHeader className="px-0 pt-0 pb-4">
                <CardTitle className="text-[18px] font-semibold text-luxe-on-surface flex items-center gap-2">
                  <Package className="size-5 text-luxe-primary" /> Category Distribution
                </CardTitle>
              </CardHeader>
              <div className="h-[300px] w-full flex items-center justify-center">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                        {categoryData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <span className="text-luxe-on-surface-variant text-sm">No category data available</span>
                )}
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="glass-panel border-none shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="border-b border-luxe-outline-variant/20 pb-6 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-[20px] font-semibold text-luxe-on-surface">Product Inventory Database</CardTitle>
              <CardDescription className="text-[13px] text-luxe-on-surface-variant">Manage products — Add, Edit, or Delete</CardDescription>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxe-outline size-4" />
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-64 bg-luxe-surface border border-luxe-outline-variant/40 rounded-lg text-[14px] focus-visible:ring-1 focus-visible:ring-luxe-primary outline-none"
                />
              </div>
              <Button variant="outline" onClick={exportToCSV} className="border-luxe-outline-variant bg-transparent text-luxe-on-surface hover:bg-luxe-surface-container font-semibold rounded-lg text-[13px] flex items-center gap-1.5">
                <Download className="size-3.5" /> Export
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            {loading && <div className="flex items-center justify-center py-12"><Loader2 className="size-6 text-luxe-primary animate-spin" /></div>}

            {!loading && (
              <>
                <table className="w-full text-[14px] text-left border-collapse">
                  <thead>
                    <tr className="bg-luxe-surface-container/50 border-b border-luxe-outline-variant/20 text-[11px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">
                      <th className="py-4 px-6 cursor-pointer hover:text-luxe-primary transition-colors" onClick={() => handleSort("id")}>
                        <div className="flex items-center gap-1">ID <ArrowUpDown className="size-3" /></div>
                      </th>
                      <th className="py-4 px-6 cursor-pointer hover:text-luxe-primary transition-colors" onClick={() => handleSort("name")}>
                        <div className="flex items-center gap-1">Name <ArrowUpDown className="size-3" /></div>
                      </th>
                      <th className="py-4 px-6 cursor-pointer hover:text-luxe-primary transition-colors" onClick={() => handleSort("category")}>
                        <div className="flex items-center gap-1">Category <ArrowUpDown className="size-3" /></div>
                      </th>
                      <th className="py-4 px-6 cursor-pointer hover:text-luxe-primary transition-colors" onClick={() => handleSort("price")}>
                        <div className="flex items-center gap-1">Price <ArrowUpDown className="size-3" /></div>
                      </th>
                      <th className="py-4 px-6 cursor-pointer hover:text-luxe-primary transition-colors" onClick={() => handleSort("stock")}>
                        <div className="flex items-center gap-1">Stock <ArrowUpDown className="size-3" /></div>
                      </th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <motion.tbody variants={staggerContainer} initial="hidden" animate="visible">
                    <AnimatePresence>
                      {paginatedProducts.map((p) => (
                        <motion.tr key={p.id} variants={cascadeItem} layout exit={{ opacity: 0, x: -20 }} className="border-b border-luxe-outline-variant/10 hover:bg-luxe-surface-container/10 transition-colors">
                          <td className="py-4 px-6 font-mono text-[12px] text-luxe-on-surface">PROD-{p.id}</td>
                          <td className="py-4 px-6">
                            {editingId === p.id ? (
                              <input
                                type="text"
                                value={editForm.name || ""}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                                className="w-full px-2 py-1 bg-luxe-surface border border-luxe-primary/30 rounded text-[14px] focus:outline-none focus:ring-1 focus:ring-luxe-primary"
                                aria-label="Edit product name"
                              />
                            ) : (
                              <span className="font-semibold text-luxe-on-surface">{p.name}</span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            {editingId === p.id ? (
                              <select
                                value={editForm.category_id || ""}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, category_id: e.target.value ? Number(e.target.value) : null }))}
                                className="w-full px-2 py-1 bg-luxe-surface border border-luxe-primary/30 rounded text-[14px] focus:outline-none focus:ring-1 focus:ring-luxe-primary"
                                aria-label="Edit product category"
                              >
                                <option value="">No Category</option>
                                {categories.map((cat) => (
                                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-[11px] font-bold text-luxe-on-surface-variant tracking-[0.05em] uppercase">{p.categories?.name || "UNCATEGORIZED"}</span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            {editingId === p.id ? (
                              <input
                                type="number"
                                step="0.01"
                                value={editForm.price || ""}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, price: Number(e.target.value) }))}
                                className="w-24 px-2 py-1 bg-luxe-surface border border-luxe-primary/30 rounded text-[14px] focus:outline-none focus:ring-1 focus:ring-luxe-primary"
                                aria-label="Edit product price"
                              />
                            ) : (
                              <span className="text-luxe-primary font-semibold">${Number(p.price).toLocaleString()}</span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            {editingId === p.id ? (
                              <input
                                type="number"
                                value={editForm.stock !== undefined ? editForm.stock : ""}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, stock: Number(e.target.value) }))}
                                className="w-20 px-2 py-1 bg-luxe-surface border border-luxe-primary/30 rounded text-[14px] focus:outline-none focus:ring-1 focus:ring-luxe-primary"
                                aria-label="Edit product stock"
                              />
                            ) : (
                              <span className="text-luxe-on-surface-variant">{p.stock} units</span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <StockBadge stock={p.stock} />
                          </td>
                          <td className="py-4 px-6 text-right">
                            {editingId === p.id ? (
                              <div className="flex items-center justify-end gap-2">
                                <Button size="sm" onClick={() => saveEdit(p.id)} className="bg-luxe-primary text-luxe-on-primary hover:bg-luxe-primary/90 h-8 px-3" aria-label="Save changes">
                                  <Check className="size-3.5" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={cancelEdit} className="border-luxe-outline-variant h-8 px-3" aria-label="Cancel editing">
                                  <X className="size-3.5" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => startEdit(p)} className="text-luxe-primary hover:bg-luxe-primary/10 h-8 px-3" aria-label="Edit product">
                                  <Pencil className="size-3.5" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(p.id)} className="text-luxe-error hover:bg-luxe-error/10 h-8 px-3" aria-label="Delete product">
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </motion.tbody>
                </table>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-luxe-outline-variant/20">
                    <span className="text-[12px] text-luxe-on-surface-variant">
                      Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedProducts.length)} of {sortedProducts.length}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0 border-luxe-outline-variant"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="size-4" />
                      </Button>
                      <span className="text-[13px] font-medium text-luxe-on-surface min-w-[3rem] text-center">
                        {currentPage} / {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0 border-luxe-outline-variant"
                        aria-label="Next page"
                      >
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
            {!loading && products.length === 0 && <div className="text-center py-12 text-luxe-on-surface-variant">No products found</div>}
          </CardContent>
        </Card>
      )}

      {/* ─── ADD PRODUCT MODAL ───────────────────────────── */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              ref={addModalRef}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-luxe-surface border border-luxe-outline-variant/30 rounded-xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-luxe-primary/10 flex items-center justify-center">
                    <Package className="size-5 text-luxe-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-luxe-on-surface">Add New Product</h3>
                    <p className="text-sm text-luxe-on-surface-variant">Fill in the product details below</p>
                  </div>
                </div>
                <button onClick={() => setShowAddModal(false)} className="hover:bg-luxe-surface-container rounded-lg p-2 transition-colors" aria-label="Close modal">
                  <X className="size-5 text-luxe-on-surface-variant" />
                </button>
              </div>
              <form onSubmit={addProduct} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="add-name" className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">Product Name *</label>
                  <input
                    id="add-name"
                    type="text"
                    required
                    value={addForm.name}
                    onChange={(e) => setAddForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. The Horizon Chronograph"
                    className="w-full px-4 py-2.5 bg-luxe-surface border border-luxe-outline-variant/40 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-luxe-primary/20 focus:border-luxe-primary transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="add-desc" className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">Description</label>
                  <textarea
                    id="add-desc"
                    value={addForm.description}
                    onChange={(e) => setAddForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Product description..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-luxe-surface border border-luxe-outline-variant/40 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-luxe-primary/20 focus:border-luxe-primary transition-all resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="add-price" className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">Price ($) *</label>
                    <input
                      id="add-price"
                      type="number"
                      required
                      min="0.01"
                      step="0.01"
                      value={addForm.price}
                      onChange={(e) => setAddForm((prev) => ({ ...prev, price: e.target.value }))}
                      placeholder="1,250"
                      className="w-full px-4 py-2.5 bg-luxe-surface border border-luxe-outline-variant/40 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-luxe-primary/20 focus:border-luxe-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="add-stock" className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">Stock</label>
                    <input
                      id="add-stock"
                      type="number"
                      min="0"
                      value={addForm.stock}
                      onChange={(e) => setAddForm((prev) => ({ ...prev, stock: e.target.value }))}
                      placeholder="10"
                      className="w-full px-4 py-2.5 bg-luxe-surface border border-luxe-outline-variant/40 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-luxe-primary/20 focus:border-luxe-primary transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="add-category" className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">Category</label>
                  <select
                    id="add-category"
                    value={addForm.category_id}
                    onChange={(e) => setAddForm((prev) => ({ ...prev, category_id: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-luxe-surface border border-luxe-outline-variant/40 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-luxe-primary/20 focus:border-luxe-primary transition-all"
                  >
                    <option value="">Select category...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="add-image" className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">Image URL</label>
                  <input
                    id="add-image"
                    type="url"
                    value={addForm.image_url}
                    onChange={(e) => {
                      setAddForm((prev) => ({ ...prev, image_url: e.target.value }));
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2.5 bg-luxe-surface border border-luxe-outline-variant/40 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-luxe-primary/20 focus:border-luxe-primary transition-all"
                  />
                  {imagePreview && (
                    <div className="mt-2 relative rounded-lg overflow-hidden border border-luxe-outline-variant/30 h-32 bg-luxe-surface-container flex items-center justify-center">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => setImagePreview("")}
                      />
                    </div>
                  )}
                  {!imagePreview && addForm.image_url && (
                    <div className="mt-2 flex items-center gap-2 text-luxe-error text-[12px]">
                      <ImageIcon className="size-3.5" /> Invalid image URL
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-4 border-t border-luxe-outline-variant/20">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1 border-luxe-outline-variant py-5 text-[13px] font-semibold">Cancel</Button>
                  <Button type="submit" disabled={addingProduct} className="flex-1 bg-luxe-primary text-luxe-on-primary hover:bg-luxe-primary/95 py-5 text-[13px] font-semibold flex items-center justify-center gap-2">
                    {addingProduct ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                    {addingProduct ? "Adding..." : "Add Product"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── DELETE CONFIRMATION MODAL ───────────────────── */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              ref={deleteModalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-luxe-surface border border-luxe-outline-variant/30 rounded-xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-full bg-luxe-error/10 flex items-center justify-center">
                  <AlertTriangle className="size-5 text-luxe-error" />
                </div>
                <h3 className="text-lg font-semibold text-luxe-on-surface">Confirm Deletion</h3>
              </div>
              <p className="text-luxe-on-surface-variant text-sm mb-6">
                Are you sure you want to delete <strong className="text-luxe-on-surface">{products.find((p) => p.id === showDeleteConfirm)?.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(null)} className="border-luxe-outline-variant">Cancel</Button>
                <Button onClick={() => deleteProduct(showDeleteConfirm)} disabled={deletingId === showDeleteConfirm} className="bg-luxe-error text-white hover:bg-luxe-error/90">
                  {deletingId === showDeleteConfirm ? <Loader2 className="size-4 animate-spin" /> : "Delete"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}