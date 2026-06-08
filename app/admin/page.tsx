"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
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
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  DollarSign,
  Users,
  Percent,
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
  Download,
  ArrowUpDown,
  ClipboardList,
  Eye,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  FileText,
  Crown,
  Star,
  Layers
} from "lucide-react";

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
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

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

interface OrderUser {
  id: number;
  name: string;
  email: string;
}

interface OrderItemProduct {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
}

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  products: OrderItemProduct;
}

interface Payment {
  id: number;
  order_id: number;
  method: string | null;
  status: string | null;
  transaction_id: string | null;
}

interface Order {
  id: number;
  user_id: number | null;
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  created_at: string;
  users: OrderUser | null;
  order_items: OrderItem[];
  payments: Payment[];
}

interface ReportData {
  salesByMonth: { name: string; sales: number }[];
  topProducts: { id: number; name: string; quantity: number; revenue: number }[];
  topCustomers: { id: number; name: string; email: string; ordersCount: number; totalSpent: number }[];
  categoryData: { name: string; value: number }[];
  totalOrders: number;
  totalRevenue: number;
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
            <button onClick={() => removeToast(toast.id)} className="ml-auto hover:opacity-70">
              <X className="size-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Stock Badge ──────────────────────────────────────
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

// ─── Order Status Badge ────────────────────────────────
function OrderStatusBadge({ status }: { status: string }) {
  const configs: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    pending: { bg: "bg-luxe-tertiary-fixed", text: "text-luxe-tertiary", icon: <Clock className="size-3" /> },
    paid: { bg: "bg-luxe-primary/10", text: "text-luxe-primary", icon: <CreditCard className="size-3" /> },
    shipped: { bg: "bg-blue-100", text: "text-blue-700", icon: <Truck className="size-3" /> },
    delivered: { bg: "bg-green-100", text: "text-green-700", icon: <CheckCircle2 className="size-3" /> },
    cancelled: { bg: "bg-luxe-error-container", text: "text-luxe-error", icon: <XCircle className="size-3" /> },
  };
  const config = configs[status] || configs.pending;
  return (
    <Badge className={`text-[10px] font-bold uppercase py-0.5 px-2 rounded-md ${config.bg} ${config.text} flex items-center gap-1 w-fit`}>
      {config.icon} {status}
    </Badge>
  );
}

// ─── Main Component ────────────────────────────────────
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "reports">("products");
  const { toasts, addToast, removeToast } = useToast();

  // ─── Products State ─────────────────────────────────
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [sortKey, setSortKey] = useState<keyof Product | "category">("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", description: "", price: "", stock: "", category_id: "", image_url: "" });
  const [addingProduct, setAddingProduct] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Orders State ───────────────────────────────────
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [orderPage, setOrderPage] = useState(1);
  const orderPageSize = 10;
  const [showOrderDetail, setShowOrderDetail] = useState<Order | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  // ─── Reports State ──────────────────────────────────
  const [reports, setReports] = useState<ReportData | null>(null);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);

  // ─── Fetch Products ─────────────────────────────────
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  async function fetchProducts() {
    try {
      setProductLoading(true);
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setProducts(data);
      setProductError(null);
    } catch (err: any) {
      setProductError(err.message);
      addToast(err.message, "error");
    } finally {
      setProductLoading(false);
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

  // ─── Search Products ─────────────────────────────────
  useEffect(() => {
    const timeoutId = setTimeout(() => searchProducts(), 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  async function searchProducts() {
    try {
      setProductLoading(true);
      setCurrentPage(1);
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      addToast("Search failed", "error");
    } finally {
      setProductLoading(false);
    }
  }

  // ─── Fetch Orders ───────────────────────────────────
  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab, orderStatusFilter]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (activeTab === "orders") fetchOrders();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [orderSearch]);

  async function fetchOrders() {
    try {
      setOrderLoading(true);
      const params = new URLSearchParams();
      if (orderStatusFilter !== "all") params.append("status", orderStatusFilter);
      if (orderSearch) params.append("search", orderSearch);

      const response = await fetch(`/api/orders?all=true&${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
      setOrderError(null);
    } catch (err: any) {
      setOrderError(err.message);
      addToast(err.message, "error");
    } finally {
      setOrderLoading(false);
    }
  }

  // ─── Fetch Reports ──────────────────────────────────
  useEffect(() => {
    if (activeTab === "reports") {
      fetchReports();
    }
  }, [activeTab]);

  async function fetchReports() {
    try {
      setReportsLoading(true);
      const response = await fetch("/api/reports");
      if (!response.ok) throw new Error("Failed to fetch reports");
      const data = await response.json();
      setReports(data);
      setReportsError(null);
    } catch (err: any) {
      setReportsError(err.message);
      addToast(err.message, "error");
    } finally {
      setReportsLoading(false);
    }
  }

  // ─── Update Order Status ────────────────────────────
  async function updateOrderStatus(orderId: number, newStatus: string) {
    try {
      setUpdatingOrderId(orderId);
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update");

      const updated = await response.json();
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      if (showOrderDetail?.id === orderId) {
        setShowOrderDetail(updated);
      }
      addToast(`Order #${orderId} updated to ${newStatus}`, "success");
    } catch (err: any) {
      addToast(err.message, "error");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  // ─── Product CRUD ────────────────────────────────────
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 11)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to 'products' bucket
      const { data, error } = await supabase.storage
        .from('products-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('products-images')
        .getPublicUrl(filePath);

      setAddForm(prev => ({ ...prev, image_url: publicUrl }));
      setImagePreview(publicUrl);
      addToast("Image uploaded successfully", "success");
    } catch (err: any) {
      console.error("Upload error:", err);
      addToast(`Upload failed: ${err.message}`, "error");
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
    }
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    if (isUploading) {
      addToast("Please wait for image upload to complete", "warning");
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
      if (!response.ok) throw new Error("Failed");
      const newProduct = await response.json();
      setProducts(prev => [newProduct, ...prev]);
      setAddForm({ name: "", description: "", price: "", stock: "", category_id: "", image_url: "" });
      setImagePreview("");
      setShowAddModal(false);
      addToast("Product added!", "success");
    } catch (err: any) {
      addToast(err.message, "error");
    } finally {
      setAddingProduct(false);
    }
  }

  async function deleteProduct(id: number) {
    try {
      setDeletingId(id);
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed");
      setProducts(prev => prev.filter(p => p.id !== id));
      setShowDeleteConfirm(null);
      addToast("Product deleted", "success");
    } catch (err: any) {
      addToast(err.message, "error");
    } finally {
      setDeletingId(null);
    }
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setEditForm({ name: product.name, price: product.price, stock: product.stock, description: product.description || "", category_id: product.category_id });
  }

  async function saveEdit(id: number) {
    try {
      const updateData: any = {};
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
      if (!response.ok) throw new Error("Failed");
      const updated = await response.json();
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
      setEditingId(null);
      addToast("Product updated!", "success");
    } catch (err: any) {
      addToast(err.message, "error");
    }
  }

  // ─── Sorting & Pagination ───────────────────────────
  function handleSort(key: keyof Product | "category") {
    if (sortKey === key) setSortDir(prev => prev === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setCurrentPage(1);
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

  // ─── Orders Pagination ──────────────────────────────
  const orderTotalPages = Math.ceil(orders.length / orderPageSize) || 1;
  const paginatedOrders = orders.slice((orderPage - 1) * orderPageSize, orderPage * orderPageSize);

  // ─── Export CSV ───────────────────────────────────────
  function exportToCSV() {
    const headers = ["ID", "Name", "Category", "Price", "Stock", "Status"];
    const rows = sortedProducts.map(p => [p.id, `"${p.name.replace(/"/g, '""')}"`, p.categories?.name || "Uncategorized", p.price, p.stock, p.stock === 0 ? "Out of Stock" : p.stock <= 5 ? "Low Stock" : "In Stock"]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast("CSV exported!", "success");
  }

  // ─── Metrics ─────────────────────────────────────────
  const { totalRevenue, totalProducts, lowStockCount, outOfStockCount } = useMemo(() => {
    const revenue = products.reduce((sum, p) => sum + Number(p.price) * p.stock, 0);
    return {
      totalRevenue: revenue,
      totalProducts: products.length,
      lowStockCount: products.filter(p => p.stock > 0 && p.stock <= 5).length,
      outOfStockCount: products.filter(p => p.stock === 0).length,
    };
  }, [products]);

  const salesData = [
    { name: "Jan", sales: 4000 }, { name: "Feb", sales: 3000 },
    { name: "Mar", sales: 5000 }, { name: "Apr", sales: 2780 },
    { name: "May", sales: 1890 }, { name: "Jun", sales: 6390 },
  ];

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => { const cat = p.categories?.name || "Uncategorized"; counts[cat] = (counts[cat] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [products]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const cascadeItem = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } } };

  const adminMetricsData = [
    { title: "Store Revenue", value: `$${totalRevenue.toLocaleString()}`, change: "+12.4% vs last month", trend: "up" as const, icon: DollarSign },
    { title: "Total Products", value: totalProducts.toString(), change: "+8.2% vs last month", trend: "up" as const, icon: ShoppingBag },
    { title: "Low Stock Items", value: lowStockCount.toString(), change: lowStockCount > 0 ? "Needs attention" : "All good", trend: lowStockCount > 0 ? "down" as const : "up" as const, icon: Percent },
    { title: "Out of Stock", value: outOfStockCount.toString(), change: outOfStockCount > 0 ? "Restock needed" : "Fully stocked", trend: outOfStockCount > 0 ? "down" as const : "up" as const, icon: Users },
  ];

  // ─── Loading State ───────────────────────────────────
  if (productLoading && products.length === 0 && activeTab !== "orders" && activeTab !== "reports") {
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
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-luxe-surface">
        {/* Left Sidebar */}
        <Sidebar className="border-r border-luxe-outline-variant/30 bg-luxe-surface">
          <SidebarHeader className="p-6 border-b border-luxe-outline-variant/20 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-[0.2em] text-luxe-primary uppercase bg-luxe-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="size-1.5 bg-luxe-primary rounded-full animate-ping" />
                Live Data
              </span>
            </div>
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
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeTab === "overview"}
                      onClick={() => setActiveTab("overview")}
                      className={cn(
                        "w-full text-left font-medium tracking-wide transition-all duration-200 py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm select-none",
                        activeTab === "overview" 
                          ? "bg-luxe-primary/10 text-luxe-primary hover:bg-luxe-primary/15" 
                          : "text-luxe-on-surface-variant hover:text-white hover:bg-luxe-surface-container-high"
                      )}
                    >
                      <BarChart3 className="size-4" />
                      <span>Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "products"}
                        onClick={() => setActiveTab("products")}
                        className={cn(
                          "w-full text-left font-medium tracking-wide transition-all duration-200 py-2.5 px-3 rounded-lg flex items-center justify-between text-sm select-none",
                          activeTab === "products" 
                            ? "bg-luxe-primary/10 text-luxe-primary hover:bg-luxe-primary/15" 
                            : "text-luxe-on-surface-variant hover:text-white hover:bg-luxe-surface-container-high"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Package className="size-4" />
                          <span>Inventory Catalog</span>
                        </div>
                        <Badge className="bg-luxe-surface-container text-luxe-on-surface-variant text-[10px] px-2 py-0.5 border border-luxe-outline-variant/30">
                          {products.length}
                        </Badge>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <Link href="/admin/categories" className="w-full">
                        <SidebarMenuButton
                          className="w-full text-left font-medium tracking-wide transition-all duration-200 py-2.5 px-3 rounded-lg flex items-center justify-between text-sm select-none text-luxe-on-surface-variant hover:text-white hover:bg-luxe-surface-container-high"
                        >
                          <div className="flex items-center gap-3">
                            <Layers className="size-4" />
                            <span>Categories</span>
                          </div>
                          <Badge className="bg-luxe-surface-container text-luxe-on-surface-variant text-[10px] px-2 py-0.5 border border-luxe-outline-variant/30">
                            {categories.length}
                          </Badge>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeTab === "orders"}
                      onClick={() => setActiveTab("orders")}
                      className={cn(
                        "w-full text-left font-medium tracking-wide transition-all duration-200 py-2.5 px-3 rounded-lg flex items-center justify-between text-sm select-none",
                        activeTab === "orders" 
                          ? "bg-luxe-primary/10 text-luxe-primary hover:bg-luxe-primary/15" 
                          : "text-luxe-on-surface-variant hover:text-white hover:bg-luxe-surface-container-high"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <ClipboardList className="size-4" />
                        <span>Orders</span>
                      </div>
                      <Badge className="bg-luxe-surface-container text-luxe-on-surface-variant text-[10px] px-2 py-0.5 border border-luxe-outline-variant/30">
                        {orders.length}
                      </Badge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeTab === "reports"}
                      onClick={() => setActiveTab("reports")}
                      className={cn(
                        "w-full text-left font-medium tracking-wide transition-all duration-200 py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm select-none",
                        activeTab === "reports" 
                          ? "bg-luxe-primary/10 text-luxe-primary hover:bg-luxe-primary/15" 
                          : "text-luxe-on-surface-variant hover:text-white hover:bg-luxe-surface-container-high"
                      )}
                    >
                      <FileText className="size-4" />
                      <span>Reports</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-luxe-outline-variant/20 flex flex-col gap-2">
            {activeTab === "products" && (
              <Button 
                onClick={() => setShowAddModal(true)} 
                className="w-full bg-luxe-primary text-luxe-on-primary hover:bg-luxe-primary/95 py-2.5 rounded-lg text-xs font-bold tracking-wider flex items-center justify-center gap-1.5"
              >
                <Plus className="size-3.5" /> Add Luxury Item
              </Button>
            )}
            <Button 
              asChild 
              variant="outline" 
              className="w-full border-luxe-outline-variant bg-transparent text-luxe-on-surface-variant hover:text-white hover:bg-luxe-surface-container-high py-2.5 rounded-lg text-xs font-bold tracking-wider flex items-center justify-center gap-1.5"
            >
              <Link href="/dashboard">
                <ChevronLeft className="size-3.5" /> Client View
              </Link>
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Inset Main Content Area */}
        <SidebarInset className="flex-1 flex flex-col min-h-screen bg-luxe-surface">
          {/* Top Control Bar */}
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-luxe-outline-variant/20 bg-luxe-surface px-6 md:px-8">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-luxe-on-surface hover:bg-luxe-surface-container size-9" />
              <div className="h-4 w-px bg-luxe-outline-variant/30" />
              <span className="text-[12px] font-semibold text-luxe-on-surface-variant/80 tracking-wider">
                ADMIN CONSOLE
              </span>
              <span className="text-luxe-on-surface-variant/40">/</span>
              <span className="text-[12px] font-bold text-white uppercase tracking-wider">
                {activeTab === "overview" && "Performance Overview"}
                {activeTab === "products" && "Inventory Catalog"}
                {activeTab === "orders" && "Orders Management"}
                {activeTab === "reports" && "Analytics Reports"}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="size-2 bg-luxe-primary rounded-full animate-ping" />
                <span className="text-[10px] text-luxe-primary font-bold tracking-widest uppercase">Live Connect</span>
              </div>
            </div>
          </header>

          {/* Main Content Pane */}
          <main className="flex-1 p-6 md:p-8 space-y-8 max-w-[1440px] w-full mx-auto">
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            {/* Error Banner */}
            <AnimatePresence>
              {(productError || orderError || reportsError) && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-luxe-error-container border border-luxe-error/20 rounded-lg p-4 flex items-center gap-3">
                  <AlertTriangle className="size-5 text-luxe-error" />
                  <span className="text-luxe-on-error-container text-sm">{productError || orderError || reportsError}</span>
                  <button onClick={() => { setProductError(null); setOrderError(null); setReportsError(null); }} className="ml-auto hover:bg-luxe-error/10 rounded p-1">
                    <X className="size-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

      {/* ─── OVERVIEW TAB ───────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="space-y-12">
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
                        {categoryData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <span className="text-luxe-on-surface-variant text-sm">No category data</span>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ─── PRODUCTS TAB ───────────────────────────────── */}
      {activeTab === "products" && (
        <Card className="glass-panel border-none shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="border-b border-luxe-outline-variant/20 pb-6 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-[20px] font-semibold text-luxe-on-surface">Product Inventory Database</CardTitle>
              <CardDescription className="text-[13px] text-luxe-on-surface-variant">Manage products — Add, Edit, or Delete</CardDescription>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxe-outline size-4" />
                <input type="text" placeholder="Search catalog..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full sm:w-64 bg-luxe-surface border border-luxe-outline-variant/40 rounded-lg text-[14px] focus-visible:ring-1 focus-visible:ring-luxe-primary outline-none" />
              </div>
              <Button variant="outline" onClick={exportToCSV} className="border-luxe-outline-variant bg-transparent text-luxe-on-surface hover:bg-luxe-surface-container font-semibold rounded-lg text-[13px] flex items-center gap-1.5">
                <Download className="size-3.5" /> Export
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            {productLoading && <div className="flex items-center justify-center py-12"><Loader2 className="size-6 text-luxe-primary animate-spin" /></div>}
            {!productLoading && (
              <>
                <table className="w-full text-[14px] text-left border-collapse">
                  <thead>
                    <tr className="bg-luxe-surface-container/50 border-b border-luxe-outline-variant/20 text-[11px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">
                      <th className="py-4 px-6 cursor-pointer hover:text-luxe-primary transition-colors" onClick={() => handleSort("id")}><div className="flex items-center gap-1">ID <ArrowUpDown className="size-3" /></div></th>
                      <th className="py-4 px-6 cursor-pointer hover:text-luxe-primary transition-colors" onClick={() => handleSort("name")}><div className="flex items-center gap-1">Name <ArrowUpDown className="size-3" /></div></th>
                      <th className="py-4 px-6 cursor-pointer hover:text-luxe-primary transition-colors" onClick={() => handleSort("category")}><div className="flex items-center gap-1">Category <ArrowUpDown className="size-3" /></div></th>
                      <th className="py-4 px-6 cursor-pointer hover:text-luxe-primary transition-colors" onClick={() => handleSort("price")}><div className="flex items-center gap-1">Price <ArrowUpDown className="size-3" /></div></th>
                      <th className="py-4 px-6 cursor-pointer hover:text-luxe-primary transition-colors" onClick={() => handleSort("stock")}><div className="flex items-center gap-1">Stock <ArrowUpDown className="size-3" /></div></th>
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
                              <input type="text" value={editForm.name || ""} onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))} className="w-full px-2 py-1 bg-luxe-surface border border-luxe-primary/30 rounded text-[14px] focus:outline-none focus:ring-1 focus:ring-luxe-primary" />
                            ) : <span className="font-semibold text-luxe-on-surface">{p.name}</span>}
                          </td>
                          <td className="py-4 px-6">
                            {editingId === p.id ? (
                              <select value={editForm.category_id || ""} onChange={(e) => setEditForm(prev => ({ ...prev, category_id: e.target.value ? Number(e.target.value) : null }))} className="w-full px-2 py-1 bg-luxe-surface border border-luxe-primary/30 rounded text-[14px] focus:outline-none focus:ring-1 focus:ring-luxe-primary">
                                <option value="">No Category</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                              </select>
                            ) : <span className="text-[11px] font-bold text-luxe-on-surface-variant tracking-[0.05em] uppercase">{p.categories?.name || "UNCATEGORIZED"}</span>}
                          </td>
                          <td className="py-4 px-6">
                            {editingId === p.id ? (
                              <input type="number" step="0.01" value={editForm.price || ""} onChange={(e) => setEditForm(prev => ({ ...prev, price: Number(e.target.value) }))} className="w-24 px-2 py-1 bg-luxe-surface border border-luxe-primary/30 rounded text-[14px] focus:outline-none focus:ring-1 focus:ring-luxe-primary" />
                            ) : <span className="text-luxe-primary font-semibold">${Number(p.price).toLocaleString()}</span>}
                          </td>
                          <td className="py-4 px-6">
                            {editingId === p.id ? (
                              <input type="number" value={editForm.stock !== undefined ? editForm.stock : ""} onChange={(e) => setEditForm(prev => ({ ...prev, stock: Number(e.target.value) }))} className="w-20 px-2 py-1 bg-luxe-surface border border-luxe-primary/30 rounded text-[14px] focus:outline-none focus:ring-1 focus:ring-luxe-primary" />
                            ) : <span className="text-luxe-on-surface-variant">{p.stock} units</span>}
                          </td>
                          <td className="py-4 px-6"><StockBadge stock={p.stock} /></td>
                          <td className="py-4 px-6 text-right">
                            {editingId === p.id ? (
                              <div className="flex items-center justify-end gap-2">
                                <Button size="sm" onClick={() => saveEdit(p.id)} className="bg-luxe-primary text-luxe-on-primary hover:bg-luxe-primary/90 h-8 px-3"><Check className="size-3.5" /></Button>
                                <Button size="sm" variant="outline" onClick={() => { setEditingId(null); setEditForm({}); }} className="border-luxe-outline-variant h-8 px-3"><X className="size-3.5" /></Button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => startEdit(p)} className="text-luxe-primary hover:bg-luxe-primary/10 h-8 px-3"><Pencil className="size-3.5" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(p.id)} className="text-luxe-error hover:bg-luxe-error/10 h-8 px-3"><Trash2 className="size-3.5" /></Button>
                              </div>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </motion.tbody>
                </table>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-luxe-outline-variant/20">
                    <span className="text-[12px] text-luxe-on-surface-variant">Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedProducts.length)} of {sortedProducts.length}</span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 w-8 p-0 border-luxe-outline-variant"><ChevronLeft className="size-4" /></Button>
                      <span className="text-[13px] font-medium text-luxe-on-surface min-w-[3rem] text-center">{currentPage} / {totalPages}</span>
                      <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 w-8 p-0 border-luxe-outline-variant"><ChevronRight className="size-4" /></Button>
                    </div>
                  </div>
                )}
              </>
            )}
            {!productLoading && products.length === 0 && <div className="text-center py-12 text-luxe-on-surface-variant">No products found</div>}
          </CardContent>
        </Card>
      )}

      {/* ─── ORDERS TAB ─────────────────────────────────── */}
      {activeTab === "orders" && (
        <Card className="glass-panel border-none shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="border-b border-luxe-outline-variant/20 pb-6 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-[20px] font-semibold text-luxe-on-surface flex items-center gap-2">
                <ClipboardList className="size-5 text-luxe-primary" /> Orders Management
              </CardTitle>
              <CardDescription className="text-[13px] text-luxe-on-surface-variant">View and manage customer orders</CardDescription>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxe-outline size-4" />
                <input type="text" placeholder="Search by customer..." value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} className="pl-10 pr-4 py-2 w-full sm:w-64 bg-luxe-surface border border-luxe-outline-variant/40 rounded-lg text-[14px] focus-visible:ring-1 focus-visible:ring-luxe-primary outline-none" />
              </div>
              <select value={orderStatusFilter} onChange={(e) => setOrderStatusFilter(e.target.value)} className="px-4 py-2 bg-luxe-surface border border-luxe-outline-variant/40 rounded-lg text-[14px] focus:outline-none focus:ring-1 focus:ring-luxe-primary">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            {orderLoading && <div className="flex items-center justify-center py-12"><Loader2 className="size-6 text-luxe-primary animate-spin" /></div>}

            {!orderLoading && (
              <>
                <table className="w-full text-[14px] text-left border-collapse">
                  <thead>
                    <tr className="bg-luxe-surface-container/50 border-b border-luxe-outline-variant/20 text-[11px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">
                      <th className="py-4 px-6">Order ID</th>
                      <th className="py-4 px-6">Customer</th>
                      <th className="py-4 px-6">Items</th>
                      <th className="py-4 px-6">Total</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">Date</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <motion.tbody variants={staggerContainer} initial="hidden" animate="visible">
                    <AnimatePresence>
                      {paginatedOrders.map((order) => (
                        <motion.tr key={order.id} variants={cascadeItem} layout className="border-b border-luxe-outline-variant/10 hover:bg-luxe-surface-container/10 transition-colors">
                          <td className="py-4 px-6 font-mono text-[12px] text-luxe-on-surface">#{order.id}</td>
                          <td className="py-4 px-6">
                            <div className="flex flex-col">
                              <span className="font-semibold text-luxe-on-surface">{order.users?.name || "Guest"}</span>
                              <span className="text-[11px] text-luxe-on-surface-variant">{order.users?.email || "No email"}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-luxe-on-surface-variant">{order.order_items.length} items</span>
                          </td>
                          <td className="py-4 px-6 text-luxe-primary font-semibold">${Number(order.total).toLocaleString()}</td>
                          <td className="py-4 px-6"><OrderStatusBadge status={order.status} /></td>
                          <td className="py-4 px-6 text-[12px] text-luxe-on-surface-variant">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => setShowOrderDetail(order)} className="text-luxe-primary hover:bg-luxe-primary/10 h-8 px-3">
                                <Eye className="size-3.5" />
                              </Button>
                              {order.status === "pending" && (
                                <Button variant="ghost" size="sm" onClick={() => updateOrderStatus(order.id, "paid")} disabled={updatingOrderId === order.id} className="text-green-600 hover:bg-green-50 h-8 px-3">
                                  {updatingOrderId === order.id ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
                                </Button>
                              )}
                              {order.status === "paid" && (
                                <Button variant="ghost" size="sm" onClick={() => updateOrderStatus(order.id, "shipped")} disabled={updatingOrderId === order.id} className="text-blue-600 hover:bg-blue-50 h-8 px-3">
                                  {updatingOrderId === order.id ? <Loader2 className="size-3.5 animate-spin" /> : <Truck className="size-3.5" />}
                                </Button>
                              )}
                              {order.status === "shipped" && (
                                <Button variant="ghost" size="sm" onClick={() => updateOrderStatus(order.id, "delivered")} disabled={updatingOrderId === order.id} className="text-green-600 hover:bg-green-50 h-8 px-3">
                                  {updatingOrderId === order.id ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
                                </Button>
                              )}
                              {(order.status === "pending" || order.status === "paid") && (
                                <Button variant="ghost" size="sm" onClick={() => updateOrderStatus(order.id, "cancelled")} disabled={updatingOrderId === order.id} className="text-luxe-error hover:bg-luxe-error/10 h-8 px-3">
                                  {updatingOrderId === order.id ? <Loader2 className="size-3.5 animate-spin" /> : <XCircle className="size-3.5" />}
                                </Button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </motion.tbody>
                </table>

                {orderTotalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-luxe-outline-variant/20">
                    <span className="text-[12px] text-luxe-on-surface-variant">Showing {(orderPage - 1) * orderPageSize + 1} to {Math.min(orderPage * orderPageSize, orders.length)} of {orders.length}</span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setOrderPage(p => Math.max(1, p - 1))} disabled={orderPage === 1} className="h-8 w-8 p-0 border-luxe-outline-variant"><ChevronLeft className="size-4" /></Button>
                      <span className="text-[13px] font-medium text-luxe-on-surface min-w-[3rem] text-center">{orderPage} / {orderTotalPages}</span>
                      <Button variant="outline" size="sm" onClick={() => setOrderPage(p => Math.min(orderTotalPages, p + 1))} disabled={orderPage === orderTotalPages} className="h-8 w-8 p-0 border-luxe-outline-variant"><ChevronRight className="size-4" /></Button>
                    </div>
                  </div>
                )}
              </>
            )}
            {!orderLoading && orders.length === 0 && <div className="text-center py-12 text-luxe-on-surface-variant">No orders found</div>}
          </CardContent>
        </Card>
      )}

      {/* ─── REPORTS TAB ─────────────────────────────────── */}
      {activeTab === "reports" && (
        <div className="space-y-8">
          {/* Reports Loading */}
          {reportsLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="size-10 text-luxe-primary animate-spin" />
                <span className="text-luxe-on-surface-variant text-sm">Loading analytics...</span>
              </div>
            </div>
          )}

          {/* Reports Error */}
          {reportsError && !reportsLoading && (
            <div className="bg-luxe-error-container border border-luxe-error/20 rounded-lg p-6 text-center">
              <AlertTriangle className="size-8 text-luxe-error mx-auto mb-2" />
              <p className="text-luxe-on-error-container font-medium">{reportsError}</p>
              <Button variant="outline" onClick={fetchReports} className="mt-4 border-luxe-outline-variant">
                Retry
              </Button>
            </div>
          )}

          {/* Reports Content */}
          {reports && !reportsLoading && (
            <>
              {/* Top Metrics */}
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div variants={cascadeItem}>
                  <Card className="glass-panel border-none shadow-sm rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">Total Orders</span>
                      <div className="size-8 rounded-lg bg-luxe-primary/10 flex items-center justify-center text-luxe-primary">
                        <ClipboardList className="size-4" />
                      </div>
                    </div>
                    <h3 className="text-[32px] font-bold text-luxe-on-surface tracking-tight">{reports.totalOrders.toLocaleString()}</h3>
                    <p className="text-[11px] text-luxe-on-surface-variant mt-1">Completed orders</p>
                  </Card>
                </motion.div>
                <motion.div variants={cascadeItem}>
                  <Card className="glass-panel border-none shadow-sm rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">Total Revenue</span>
                      <div className="size-8 rounded-lg bg-luxe-primary/10 flex items-center justify-center text-luxe-primary">
                        <DollarSign className="size-4" />
                      </div>
                    </div>
                    <h3 className="text-[32px] font-bold text-luxe-primary tracking-tight">${Number(reports.totalRevenue).toLocaleString()}</h3>
                    <p className="text-[11px] text-luxe-on-surface-variant mt-1">Lifetime revenue</p>
                  </Card>
                </motion.div>
                <motion.div variants={cascadeItem}>
                  <Card className="glass-panel border-none shadow-sm rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">Avg Order Value</span>
                      <div className="size-8 rounded-lg bg-luxe-primary/10 flex items-center justify-center text-luxe-primary">
                        <TrendingUp className="size-4" />
                      </div>
                    </div>
                    <h3 className="text-[32px] font-bold text-luxe-on-surface tracking-tight">
                      ${reports.totalOrders > 0 ? Math.round(reports.totalRevenue / reports.totalOrders).toLocaleString() : "0"}
                    </h3>
                    <p className="text-[11px] text-luxe-on-surface-variant mt-1">Per transaction</p>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales by Month */}
                <Card className="glass-panel border-none shadow-sm rounded-xl p-6">
                  <CardHeader className="px-0 pt-0 pb-4">
                    <CardTitle className="text-[18px] font-semibold text-luxe-on-surface flex items-center gap-2">
                      <BarChart3 className="size-5 text-luxe-primary" /> Sales by Month
                    </CardTitle>
                  </CardHeader>
                  <div className="h-[300px] w-full">
                    {reports.salesByMonth.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={reports.salesByMonth}>
                          <defs>
                            <linearGradient id="colorSalesReport" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                          <Area type="monotone" dataKey="sales" stroke="#8884d8" fillOpacity={1} fill="url(#colorSalesReport)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-luxe-on-surface-variant text-sm">No sales data available</div>
                    )}
                  </div>
                </Card>

                {/* Category Revenue */}
                <Card className="glass-panel border-none shadow-sm rounded-xl p-6">
                  <CardHeader className="px-0 pt-0 pb-4">
                    <CardTitle className="text-[18px] font-semibold text-luxe-on-surface flex items-center gap-2">
                      <Package className="size-5 text-luxe-primary" /> Revenue by Category
                    </CardTitle>
                  </CardHeader>
                  <div className="h-[300px] w-full flex items-center justify-center">
                    {reports.categoryData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={reports.categoryData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {reports.categoryData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <span className="text-luxe-on-surface-variant text-sm">No category data</span>
                    )}
                  </div>
                </Card>
              </div>

              {/* Tables Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Products */}
                <Card className="glass-panel border-none shadow-sm rounded-xl overflow-hidden">
                  <CardHeader className="border-b border-luxe-outline-variant/20 pb-4 p-6">
                    <CardTitle className="text-[18px] font-semibold text-luxe-on-surface flex items-center gap-2">
                      <Crown className="size-5 text-luxe-primary" /> Top Selling Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {reports.topProducts.length > 0 ? (
                      <table className="w-full text-[14px] text-left border-collapse">
                        <thead>
                          <tr className="bg-luxe-surface-container/50 border-b border-luxe-outline-variant/20 text-[11px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">
                            <th className="py-4 px-6">Product</th>
                            <th className="py-4 px-6 text-center">Qty Sold</th>
                            <th className="py-4 px-6 text-right">Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reports.topProducts.map((product, idx) => (
                            <tr key={product.id} className="border-b border-luxe-outline-variant/10 hover:bg-luxe-surface-container/10 transition-colors">
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="size-8 rounded-full bg-luxe-primary/10 flex items-center justify-center text-[11px] font-bold text-luxe-primary">
                                    {idx + 1}
                                  </div>
                                  <span className="font-semibold text-luxe-on-surface">{product.name}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-center text-luxe-on-surface-variant">{product.quantity}</td>
                              <td className="py-4 px-6 text-right text-luxe-primary font-semibold">${Number(product.revenue).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center py-12 text-luxe-on-surface-variant">No product sales data</div>
                    )}
                  </CardContent>
                </Card>

                {/* Top Customers */}
                <Card className="glass-panel border-none shadow-sm rounded-xl overflow-hidden">
                  <CardHeader className="border-b border-luxe-outline-variant/20 pb-4 p-6">
                    <CardTitle className="text-[18px] font-semibold text-luxe-on-surface flex items-center gap-2">
                      <Star className="size-5 text-luxe-primary" /> Top Customers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {reports.topCustomers.length > 0 ? (
                      <table className="w-full text-[14px] text-left border-collapse">
                        <thead>
                          <tr className="bg-luxe-surface-container/50 border-b border-luxe-outline-variant/20 text-[11px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">
                            <th className="py-4 px-6">Customer</th>
                            <th className="py-4 px-6 text-center">Orders</th>
                            <th className="py-4 px-6 text-right">Total Spent</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reports.topCustomers.map((customer, idx) => (
                            <tr key={customer.id} className="border-b border-luxe-outline-variant/10 hover:bg-luxe-surface-container/10 transition-colors">
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="size-8 rounded-full bg-luxe-primary/10 flex items-center justify-center text-[11px] font-bold text-luxe-primary">
                                    {idx + 1}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-luxe-on-surface">{customer.name}</p>
                                    <p className="text-[11px] text-luxe-on-surface-variant">{customer.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <Badge className="bg-luxe-primary/10 text-luxe-primary text-[10px]">{customer.ordersCount}</Badge>
                              </td>
                              <td className="py-4 px-6 text-right text-luxe-primary font-semibold">${Number(customer.totalSpent).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center py-12 text-luxe-on-surface-variant">No customer data</div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      )}

      {/* ─── ORDER DETAIL MODAL ──────────────────────────── */}
      <AnimatePresence>
        {showOrderDetail && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowOrderDetail(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-luxe-surface border border-luxe-outline-variant/30 rounded-xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-luxe-primary/10 flex items-center justify-center">
                    <ClipboardList className="size-5 text-luxe-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-luxe-on-surface">Order #{showOrderDetail.id}</h3>
                    <p className="text-sm text-luxe-on-surface-variant">{new Date(showOrderDetail.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <button onClick={() => setShowOrderDetail(null)} className="hover:bg-luxe-surface-container rounded-lg p-2"><X className="size-5 text-luxe-on-surface-variant" /></button>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div className="bg-luxe-surface-container/30 rounded-lg p-4">
                  <h4 className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase mb-2">Customer</h4>
                  <p className="text-luxe-on-surface font-semibold">{showOrderDetail.users?.name || "Guest"}</p>
                  <p className="text-luxe-on-surface-variant text-sm">{showOrderDetail.users?.email || "No email"}</p>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase mb-3">Order Items</h4>
                  <div className="space-y-2">
                    {showOrderDetail.order_items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-luxe-surface-container/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-lg bg-luxe-surface-container flex items-center justify-center">
                            {item.products.image_url ? (
                              <img src={item.products.image_url} alt={item.products.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <Package className="size-5 text-luxe-on-surface-variant" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-luxe-on-surface">{item.products.name}</p>
                            <p className="text-[11px] text-luxe-on-surface-variant">Qty: {item.quantity} × ${Number(item.price).toLocaleString()}</p>
                          </div>
                        </div>
                        <span className="text-luxe-primary font-semibold">${(Number(item.price) * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Info */}
                {showOrderDetail.payments.length > 0 && (
                  <div className="bg-luxe-surface-container/30 rounded-lg p-4">
                    <h4 className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase mb-2">Payment</h4>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-luxe-on-surface capitalize">Method: {showOrderDetail.payments[0].method}</span>
                      <Badge className={`text-[10px] uppercase ${showOrderDetail.payments[0].status === "paid" ? "bg-green-100 text-green-700" : "bg-luxe-tertiary-fixed text-luxe-tertiary"}`}>
                        {showOrderDetail.payments[0].status}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="flex items-center justify-between pt-4 border-t border-luxe-outline-variant/20">
                  <span className="text-lg font-bold text-luxe-on-surface">Total</span>
                  <span className="text-2xl font-black text-luxe-primary">${Number(showOrderDetail.total).toLocaleString()}</span>
                </div>

                {/* Status Actions */}
                <div className="flex gap-2 pt-2">
                  {showOrderDetail.status === "pending" && (
                    <Button onClick={() => { updateOrderStatus(showOrderDetail.id, "paid"); setShowOrderDetail(null); }} className="flex-1 bg-luxe-primary text-luxe-on-primary">
                      <CreditCard className="size-4 mr-2" /> Mark as Paid
                    </Button>
                  )}
                  {showOrderDetail.status === "paid" && (
                    <Button onClick={() => { updateOrderStatus(showOrderDetail.id, "shipped"); setShowOrderDetail(null); }} className="flex-1 bg-blue-600 text-white">
                      <Truck className="size-4 mr-2" /> Mark as Shipped
                    </Button>
                  )}
                  {showOrderDetail.status === "shipped" && (
                    <Button onClick={() => { updateOrderStatus(showOrderDetail.id, "delivered"); setShowOrderDetail(null); }} className="flex-1 bg-green-600 text-white">
                      <CheckCircle2 className="size-4 mr-2" /> Mark as Delivered
                    </Button>
                  )}
                  {(showOrderDetail.status === "pending" || showOrderDetail.status === "paid") && (
                    <Button variant="outline" onClick={() => { updateOrderStatus(showOrderDetail.id, "cancelled"); setShowOrderDetail(null); }} className="border-luxe-error text-luxe-error hover:bg-luxe-error/10">
                      <XCircle className="size-4 mr-2" /> Cancel
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── ADD PRODUCT MODAL ───────────────────────────── */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-luxe-surface border border-luxe-outline-variant/30 rounded-xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-luxe-primary/10 flex items-center justify-center"><Package className="size-5 text-luxe-primary" /></div>
                  <div>
                    <h3 className="text-lg font-semibold text-luxe-on-surface">Add New Product</h3>
                    <p className="text-sm text-luxe-on-surface-variant">Fill in the product details below</p>
                  </div>
                </div>
                <button onClick={() => setShowAddModal(false)} className="hover:bg-luxe-surface-container rounded-lg p-2"><X className="size-5 text-luxe-on-surface-variant" /></button>
              </div>
              <form onSubmit={addProduct} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">Product Name *</label>
                  <input type="text" required value={addForm.name} onChange={(e) => setAddForm(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. The Horizon Chronograph" className="w-full px-4 py-2.5 bg-luxe-surface border border-luxe-outline-variant/40 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-luxe-primary/20 focus:border-luxe-primary transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">Description</label>
                  <textarea value={addForm.description} onChange={(e) => setAddForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Product description..." rows={3} className="w-full px-4 py-2.5 bg-luxe-surface border border-luxe-outline-variant/40 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-luxe-primary/20 focus:border-luxe-primary transition-all resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">Price ($) *</label>
                    <input type="number" required min="0.01" step="0.01" value={addForm.price} onChange={(e) => setAddForm(prev => ({ ...prev, price: e.target.value }))} placeholder="1,250" className="w-full px-4 py-2.5 bg-luxe-surface border border-luxe-outline-variant/40 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-luxe-primary/20 focus:border-luxe-primary transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">Stock</label>
                    <input type="number" min="0" value={addForm.stock} onChange={(e) => setAddForm(prev => ({ ...prev, stock: e.target.value }))} placeholder="10" className="w-full px-4 py-2.5 bg-luxe-surface border border-luxe-outline-variant/40 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-luxe-primary/20 focus:border-luxe-primary transition-all" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">Category</label>
                  <select value={addForm.category_id} onChange={(e) => setAddForm(prev => ({ ...prev, category_id: e.target.value }))} className="w-full px-4 py-2.5 bg-luxe-surface border border-luxe-outline-variant/40 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-luxe-primary/20 focus:border-luxe-primary transition-all">
                    <option value="">Select category...</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">Product Image *</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const file = e.dataTransfer.files?.[0];
                      if (file && fileInputRef.current) {
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        fileInputRef.current.files = dataTransfer.files;
                        handleImageUpload({ target: fileInputRef.current } as any);
                      }
                    }}
                    className={cn(
                      "group relative min-h-[140px] rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden bg-luxe-surface-container/20 hover:bg-luxe-accent/5",
                      imagePreview ? "border-luxe-primary/50" : "border-luxe-outline-variant/40 hover:border-luxe-primary/60"
                    )}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />

                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <Check className="size-6 mb-1" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Change Selection</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="size-10 rounded-full bg-luxe-primary/10 flex items-center justify-center">
                          <Plus className="size-5 text-luxe-primary" />
                        </div>
                        <div className="text-center">
                          <p className="text-[13px] font-semibold text-luxe-on-surface">Choose Artwork</p>
                          <p className="text-[11px] text-luxe-on-surface-variant">SVG, PNG, JPG (Max 5MB)</p>
                        </div>
                      </>
                    )}

                    {isUploading && (
                      <div className="absolute inset-0 bg-luxe-surface/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 space-y-3 z-20">
                        <Loader2 className="size-6 text-luxe-primary animate-spin" />
                        <div className="w-full bg-luxe-outline-variant/30 h-1 rounded-full overflow-hidden">
                          <motion.div
                            className="bg-luxe-primary h-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-luxe-primary uppercase tracking-widest">Mastering Upload...</span>
                      </div>
                    )}
                  </div>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-luxe-surface border border-luxe-outline-variant/30 rounded-xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-full bg-luxe-error/10 flex items-center justify-center"><AlertTriangle className="size-5 text-luxe-error" /></div>
                <h3 className="text-lg font-semibold text-luxe-on-surface">Confirm Deletion</h3>
              </div>
              <p className="text-luxe-on-surface-variant text-sm mb-6">Are you sure you want to delete <strong className="text-luxe-on-surface">{products.find(p => p.id === showDeleteConfirm)?.name}</strong>? This action cannot be undone.</p>
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}