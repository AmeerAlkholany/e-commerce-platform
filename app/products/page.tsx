"use client";

import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ChevronDown, SlidersHorizontal, Grid, List, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Local static products list representing a fully populated premium catalogue
const ALL_PRODUCTS = [
  {
    id: 1,
    brand: "LUXE TIMEPIECES",
    name: "The Horizon Chronograph",
    price: 1250,
    category: "Timepieces",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXufWm6FbZJ8NWggI_uqTag4zyANYjc7GViyC4Dix3RLWJl2EEJoAJxveBSIpSVpZAFWRaoRK47sm3UgppFeOI8u7kPJnzYKzFfHNMV1gotzHdSK_zCWWDLYEqJXpzeHFtAzZfzjRp6cisxyCQJo87IyM3ajdOiaDsDXFs08IuwM5xwEB2AaQlYsQwefDQG1ZlHuT4W-hkN_6eQA7_Al9Sz-omX5mL5pXvL6AgDOrx-aqF9xpJYEB4ydBeyki7cT4mzVd5S8aeHt44hb",
    imageAlt: "A high-end luxury watch with a leather strap displayed on a dark, reflective surface.",
    badge: "FEATURED",
  },
  {
    id: 2,
    brand: "LEATHER GOODS",
    name: "Crescent Atelier Bag",
    price: 890,
    category: "Fashion",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCOM0EDAPsFT6d6b-3s34TmLFwuQD4xeltVY2xAajVxdwLUtdI1hqRig2hmkTqFf2VjRtD3tm6VHF71biuhlBDKtrUwCEInA55tAlTvPANnk0zuggrB-Hg4G42sAqGLs0agJSFESbgpl7sk4fwPg7hXa0BwjsNn_mWeisdFl81lx1B0mIs61_s-HA3luRjzHVDeOx5O9tBR32yBZ9xMiM5kzyQuoD9tqktxQjq-Co5bQ6v2UjarlJQotbIPjuq8-v7u-MeOEA0OM7qK",
    imageAlt: "A sleek, designer leather handbag in a muted earth tone, photographed against a minimalist architectural background.",
    badge: "LIMITED",
  },
  {
    id: 3,
    brand: "ACTIVE TECH",
    name: "Pulse Smart Bracelet",
    price: 420,
    category: "Electronics",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCYuC-9bVEubhEvvo2Powvh29JmhA_ExfYvE76CstI-94URj9ud_froQLblqVk9DyN4DEju5GnK7yM5bX41eZ1fush0wvciFMquNGNSoyTwsJIKAIH3gI04lhy1vb1PeW-7MXsDH_ZH2sFnAdjk4ktRNFWX249IVEVAg1FND0EpWe0HrINYTtbji8eL2VQrlptANgC2maROBPm-k84lN3OM67G4yrvvdVZpjIlLDDQc7jYtwu7KKI_PeLG8WFWmtxIgX7UiFOpcBrDI",
    imageAlt: "A premium minimalist smartwatch featuring a clean white band and a high-resolution glass display.",
  },
  {
    id: 4,
    brand: "COLLECTIONS",
    name: "Silk Minimalist Blouse",
    price: 350,
    category: "Fashion",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC56yEybdfcEBXD8wnBDrr0--z70us3KsV6MeQNgOCnkvpwMhS0QeAOrb9Jb2fc0wa38R2uz-yUTjY46VrFstXWb8zFZlstb01eM6140tUF7AIIPxv3Z-G-yp2WmhUYE7x1xZRC2GsBCGHVoByOstTfhTClb8tr-0ZkxkWWzLXNsSDfRgvfnmlTNhNJGtpf1kdo8-9tKRx0vqGcFUl2iFWk2L91inA5yhA73yUzGLRonXo9TOtVZwZQk3fcOZ9EE397KSDlwTIqZ9Qa",
    imageAlt: "A curated arrangement of high-end fashion apparel, featuring a premium silk blouse and tailored trousers in soft cream colors.",
  },
  {
    id: 5,
    brand: "LIVING STUDIO",
    name: "Travertine Sculptural Vessel",
    price: 280,
    category: "Home Decor",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBewA7jgwZvc-ygXhQFIB9niS9eVf_LoDU0tKxkp6V9peGVk9W5jWMNCO5pXZ1A5jFkZ-MD_rEfNcTq_5Tbcu2xku9KXKo-WU5DBAJ0377yRa3M_gG8mjk5yW_bhLw9f-zPaR9UEkhrcutAzpvCCWp4RgxhEPVOlMksSOKhhRlC3KzPqDOfYEbepQiG-qMz8mHSV9BSFhf5FJuFXjAemxf5qUVhWwsr0FteQomDUcaJrEzNGM4loay9SBzfontYizsE05Yvt8TrnuJc",
    imageAlt: "A luxury sculptural stone vase.",
    badge: "BESTSELLER",
  },
  {
    id: 6,
    brand: "SOUND LAB",
    name: "Aero Over-Ear Headphones",
    price: 650,
    category: "Electronics",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6EFBnL-I3-jkKy3s1J7WqdZOteqgahWi2937kmzFzAGz4QVBRgqMskFdS00ft7LCd08r_6sLZI-rm0naLoYe_4iFYbVgSr9QhARtSgu1zNykqbkdox1UQ5Ja_SVVvvuq4Q1WcDzYmWroCCuWKTQMF_O1bT1P3yaBDjJPMS9fW_nrBT_cUzpCpTNyCrdB5aGbzHceRsSwE5V69zJPswy6vcrARyzOH8G2WsWL-F652QscEJEEcAtwbdrhRZ5qGH6363fCcb9MJaNRj",
    imageAlt: "Over-ear luxury audio headphones.",
  },
  {
    id: 7,
    brand: "LEATHER GOODS",
    name: "Atelier Travel Wallet",
    price: 320,
    category: "Fashion",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCOM0EDAPsFT6d6b-3s34TmLFwuQD4xeltVY2xAajVxdwLUtdI1hqRig2hmkTqFf2VjRtD3tm6VHF71biuhlBDKtrUwCEInA55tAlTvPANnk0zuggrB-Hg4G42sAqGLs0agJSFESbgpl7sk4fwPg7hXa0BwjsNn_mWeisdFl81lx1B0mIs61_s-HA3luRjzHVDeOx5O9tBR32yBZ9xMiM5kzyQuoD9tqktxQjq-Co5bQ6v2UjarlJQotbIPjuq8-v7u-MeOEA0OM7qK",
    imageAlt: "A fine leather card wallet.",
    badge: "NEW ARRIVAL",
  },
  {
    id: 8,
    brand: "LUXE TIMEPIECES",
    name: "The Meridian Skeleton Automatic",
    price: 2450,
    category: "Timepieces",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXufWm6FbZJ8NWggI_uqTag4zyANYjc7GViyC4Dix3RLWJl2EEJoAJxveBSIpSVpZAFWRaoRK47sm3UgppFeOI8u7kPJnzYKzFfHNMV1gotzHdSK_zCWWDLYEqJXpzeHFtAzZfzjRp6cisxyCQJo87IyM3ajdOiaDsDXFs08IuwM5xwEB2AaQlYsQwefDQG1ZlHuT4W-hkN_6eQA7_Al9Sz-omX5mL5pXvL6AgDOrx-aqF9xpJYEB4ydBeyki7cT4mzVd5S8aeHt44hb",
    imageAlt: "A highly complex luxury automatic watch showing moving parts.",
    badge: "LIMITED",
  },
];

const CATEGORIES = ["All", "Fashion", "Electronics", "Home Decor", "Timepieces"];
const SORT_OPTIONS = [
  { label: "Featured First", value: "featured" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Alphabetical (A-Z)", value: "alpha_asc" },
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState(2500);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter products
  const filteredProducts = ALL_PRODUCTS.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesPrice = product.price <= priceRange;
    return matchesCategory && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "alpha_asc") return a.name.localeCompare(b.name);
    // 'featured' defaults to order in original list (featured first has badges)
    return a.id - b.id;
  });

  const clearFilters = () => {
    setSelectedCategory("All");
    setPriceRange(2500);
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
                {(selectedCategory !== "All" || priceRange !== 2500) && (
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
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left text-sm font-light py-1 px-2.5 rounded-md transition-all ${
                      selectedCategory === cat
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
                min="200"
                max="2500"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-luxe-primary cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-semibold text-luxe-on-surface-variant opacity-60">
                <span>$200</span>
                <span>$2,500</span>
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
            <div className="flex justify-between items-center bg-luxe-surface-container-lowest p-4 rounded-xl border border-luxe-outline-variant/10 shadow-sm flex-wrap gap-4">
              <div className="flex items-center gap-3 text-xs font-semibold text-luxe-on-surface-variant">
                <SlidersHorizontal className="size-4 lg:hidden cursor-pointer" onClick={() => setIsMobileFilterOpen(true)} />
                <span>Showing <strong className="text-luxe-on-surface font-bold">{sortedProducts.length}</strong> Products</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-luxe-on-surface-variant hidden sm:inline">Sort By</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-xs font-bold text-luxe-on-surface border border-luxe-outline-variant/20 rounded-md py-1.5 px-3.5 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-luxe-primary cursor-pointer"
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
            {(selectedCategory !== "All" || priceRange !== 2500) && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-luxe-on-surface-variant font-medium">Active:</span>
                {selectedCategory !== "All" && (
                  <Badge variant="secondary" className="gap-1 bg-luxe-primary/10 text-luxe-primary hover:bg-luxe-primary/15 border-none px-3.5 py-1.5 rounded-full">
                    {selectedCategory}
                    <X className="size-3 cursor-pointer" onClick={() => setSelectedCategory("All")} />
                  </Badge>
                )}
                {priceRange !== 2500 && (
                  <Badge variant="secondary" className="gap-1 bg-luxe-primary/10 text-luxe-primary hover:bg-luxe-primary/15 border-none px-3.5 py-1.5 rounded-full">
                    Under ${priceRange}
                    <X className="size-3 cursor-pointer" onClick={() => setPriceRange(2500)} />
                  </Badge>
                )}
              </div>
            )}

            {/* Empty State */}
            {sortedProducts.length === 0 && (
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
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  brand={product.brand}
                  name={product.name}
                  price={`$${product.price.toLocaleString()}`}
                  imageSrc={product.imageSrc}
                  imageAlt={product.imageAlt}
                  badge={product.badge}
                  href={`/products/${product.id}`}
                />
              ))}
            </div>

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
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`text-left text-sm font-light py-2 px-3 rounded-md transition-all ${
                        selectedCategory === cat
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
                  min="200"
                  max="2500"
                  step="50"
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
