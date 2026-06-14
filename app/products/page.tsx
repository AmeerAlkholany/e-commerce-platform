"use client";

import { useState, useEffect, useCallback } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ChevronDown, SlidersHorizontal, Grid, List, X, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number | string;
  stock: number;
  image_url: string;
  category_id: number;
  categories: Category;
}

interface PaginationData {
  total: number;
  pages: number;
  currentPage: number;
  pageSize: number;
}

const SORT_OPTIONS = [
  { label: "Featured First", value: "featured" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Alphabetical (A-Z)", value: "alpha_asc" },
];

const MAX_PRICE_LIMIT = 50000;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState(MAX_PRICE_LIMIT);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Initial Fetch of Categories
  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(err => console.error("Failed to fetch categories:", err));
  }, []);

  // Main Data Fetcher
  const fetchData = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setIsLoading(true);
      else setIsRefetching(true);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: "12",
        sortBy: sortBy,
        maxPrice: priceRange.toString(),
      });

      if (selectedCategory !== "All") {
        params.append("categoryName", selectedCategory);
      }

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      
      setProducts(data.products || []);
      setPagination(data.pagination || null);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [currentPage, selectedCategory, priceRange, sortBy]);

  // Effect to trigger fetch on changes
  useEffect(() => {
    fetchData(products.length === 0);
  }, [currentPage, selectedCategory, priceRange, sortBy]);

  // Reset page when filters change
  const handleFilterChange = (setter: any, value: any) => {
    setter(value);
    setCurrentPage(1);
  };

  const categoryNames = ["All", ...categories.map(c => c.name)];

  const clearFilters = () => {
    setSelectedCategory("All");
    setPriceRange(MAX_PRICE_LIMIT);
    setCurrentPage(1);
  };

  return (
    <div className="bg-luxe-surface dark:bg-luxe-inverse-surface/10 min-h-screen pb-24">
      {/* Page Header */}
      <div className="bg-luxe-surface-container-low border-b border-luxe-outline-variant/10 py-16">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[64px] space-y-4">
          <nav className="text-xs font-semibold tracking-widest text-luxe-on-surface-variant/65 flex gap-2 uppercase">
            <a href="/" className="hover:text-luxe-primary">Home</a>
            <span>/</span>
            <span className="text-luxe-primary font-bold">Products</span>
          </nav>

          <h1 className="text-[40px] md:text-[52px] font-light leading-none tracking-tight text-luxe-on-surface">
            Curated Catalogue
          </h1>
          <p className="text-sm font-light text-luxe-on-surface-variant max-w-xl">
            Acquire masterfully constructed elements created with unyielding focus on design details and architectural structure.
          </p>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-[64px] py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* Desktop Filters Sidebar - Column 1 */}
          <aside className="hidden lg:block space-y-8">
            <div>
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xs font-bold tracking-[0.2em] text-luxe-on-surface uppercase">Filters</h3>
                {(selectedCategory !== "All" || priceRange !== MAX_PRICE_LIMIT) && (
                  <button
                    onClick={clearFilters}
                    className="text-[11px] font-bold text-luxe-primary hover:underline uppercase"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <Separator />
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h4 className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">Category</h4>
              <div className="flex flex-col gap-2.5">
                {categoryNames.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleFilterChange(setSelectedCategory, cat)}
                    className={`text-left text-sm font-light py-1 px-2.5 rounded-md transition-all ${selectedCategory === cat
                      ? "bg-luxe-primary text-luxe-on-primary font-medium"
                      : "text-luxe-on-surface-variant hover:bg-luxe-accent/5"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">
                <span>Max Price</span>
                <span className="text-luxe-primary">${priceRange.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max={MAX_PRICE_LIMIT}
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-luxe-primary cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-semibold text-luxe-on-surface-variant opacity-60">
                <span>$0</span>
                <span>${MAX_PRICE_LIMIT.toLocaleString()}</span>
              </div>
            </div>

            {/* Promo banner */}
            <div className="glass-panel p-6 rounded-2xl border border-luxe-outline-variant/20 relative overflow-hidden bg-luxe-primary-container/20">
              <h5 className="text-xs font-bold text-luxe-primary tracking-widest uppercase mb-2">Summer Drops</h5>
              <p className="text-xs font-light text-luxe-on-surface-variant leading-relaxed">
                Unlock complimentary express delivery on selections exceeding $1,000.
              </p>
            </div>
          </aside>

          {/* Products Grid & Sorting - Column 2-4 (3 columns) */}
          <div className="lg:col-span-3 space-y-8">

            {/* Action Bar (Sorting, View, Filter Button on Mobile) */}
            <div className="flex justify-between items-center bg-luxe-surface-container-lowest p-4 rounded-xl border border-luxe-outline-variant/10 shadow-sm flex-wrap gap-4 px-6">
              <div className="flex items-center gap-3 text-xs font-semibold text-luxe-on-surface-variant">
                <SlidersHorizontal className="size-4 lg:hidden cursor-pointer" onClick={() => setIsMobileFilterOpen(true)} />
                <span>Showing <strong className={cn("text-luxe-on-surface font-bold transition-opacity", isRefetching ? "opacity-40" : "opacity-100")}>{pagination?.total || products.length}</strong> Products</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-luxe-on-surface-variant hidden sm:inline">Sort By</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => handleFilterChange(setSortBy, e.target.value)}
                      className="bg-luxe-surface text-xs font-bold text-luxe-on-surface border border-luxe-outline-variant/20 rounded-md py-1.5 px-3.5 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-luxe-primary cursor-pointer uppercase tracking-tight"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="size-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filter Tags */}
            {(selectedCategory !== "All" || priceRange !== MAX_PRICE_LIMIT) && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-luxe-on-surface-variant font-medium">Active:</span>
                {selectedCategory !== "All" && (
                  <Badge variant="secondary" className="gap-1 bg-luxe-primary/10 text-luxe-primary hover:bg-luxe-primary/15 border-none px-3.5 py-1.5 rounded-full">
                    {selectedCategory}
                    <X className="size-3 cursor-pointer" onClick={() => handleFilterChange(setSelectedCategory, "All")} />
                  </Badge>
                )}
                {priceRange !== MAX_PRICE_LIMIT && (
                  <Badge variant="secondary" className="gap-1 bg-luxe-primary/10 text-luxe-primary hover:bg-luxe-primary/15 border-none px-3.5 py-1.5 rounded-full">
                    Under ${priceRange.toLocaleString()}
                    <X className="size-3 cursor-pointer" onClick={() => handleFilterChange(setPriceRange, MAX_PRICE_LIMIT)} />
                  </Badge>
                )}
              </div>
            )}

            {/* Products Grid State */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-luxe-outline-variant/10 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-luxe-surface-container-lowest rounded-2xl border border-dashed border-luxe-outline-variant/30 space-y-4">
                <Info className="size-10 text-luxe-primary mx-auto opacity-70" />
                <h3 className="text-lg font-light text-luxe-on-surface">No Masterpieces Found</h3>
                <p className="text-xs text-luxe-on-surface-variant max-w-sm mx-auto font-light leading-relaxed">
                  Refine your category filters or expand the price range threshold to find curated items.
                </p>
                <Button onClick={clearFilters} className="bg-luxe-primary text-luxe-on-primary">
                  RESET FILTERS
                </Button>
              </div>
            ) : (
              <div className="space-y-12">
                <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-300", isRefetching ? "opacity-40" : "opacity-100")}>
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      brand={product.categories?.name || "LUXE"}
                      name={product.name}
                      price={`$${Number(product.price).toLocaleString()}`}
                      imageSrc={product.image_url || "/placeholder.jpg"}
                      imageAlt={product.name}
                      href={`/products/${product.id}`}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-4 pt-8">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage === 1 || isRefetching}
                      onClick={() => setCurrentPage(p => p - 1)}
                      className="rounded-xl border-luxe-outline-variant/20 hover:bg-luxe-primary/10 hover:text-luxe-primary transition-colors"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    
                    <div className="flex items-center gap-2">
                       {[...Array(pagination.pages)].map((_, i) => {
                          const pageNum = i + 1;
                          if (Math.abs(pageNum - currentPage) > 1 && pageNum !== 1 && pageNum !== pagination.pages) {
                            if (pageNum === 2 || pageNum === pagination.pages - 1) return <span key={i} className="text-luxe-on-surface-variant/40">...</span>;
                            return null;
                          }
                          return (
                            <button
                              key={i}
                              onClick={() => setCurrentPage(pageNum)}
                              className={cn(
                                "size-10 rounded-xl text-xs font-bold transition-all",
                                currentPage === pageNum 
                                  ? "bg-luxe-primary text-luxe-on-primary shadow-lg" 
                                  : "text-luxe-on-surface-variant hover:bg-luxe-primary/10 hover:text-luxe-primary"
                              )}
                            >
                              {pageNum}
                            </button>
                          );
                       })}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage === pagination.pages || isRefetching}
                      onClick={() => setCurrentPage(p => p + 1)}
                      className="rounded-xl border-luxe-outline-variant/20 hover:bg-luxe-primary/10 hover:text-luxe-primary transition-colors"
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Mobile Drawer Filter Dialog */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsMobileFilterOpen(false)} />

          <div className="relative w-[80vw] max-w-sm bg-luxe-surface dark:bg-luxe-inverse-surface h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold tracking-[0.2em] text-luxe-on-surface uppercase">Filters</h3>
                <X className="size-5 cursor-pointer text-luxe-on-surface" onClick={() => setIsMobileFilterOpen(false)} />
              </div>
              <Separator />

              {/* Categories */}
              <div className="space-y-4">
                <h4 className="text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">Category</h4>
                <div className="flex flex-col gap-2.5">
                  {categoryNames.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        handleFilterChange(setSelectedCategory, cat);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`text-left text-sm font-light py-2 px-3 rounded-md transition-all ${selectedCategory === cat
                        ? "bg-luxe-primary text-luxe-on-primary font-medium"
                        : "text-luxe-on-surface-variant hover:bg-luxe-accent/5"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[12px] font-bold tracking-[0.05em] text-luxe-on-surface-variant uppercase">
                  <span>Max Price</span>
                  <span className="text-luxe-primary">${priceRange.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={MAX_PRICE_LIMIT}
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-luxe-primary cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-luxe-outline-variant/20 flex gap-4">
              <Button onClick={clearFilters} variant="outline" className="flex-1 text-xs">
                CLEAR ALL
              </Button>
              <Button onClick={() => setIsMobileFilterOpen(false)} className="flex-1 text-xs bg-luxe-primary text-luxe-on-primary">
                APPLY
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
