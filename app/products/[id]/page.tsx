import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailClient } from "./ProductDetailClient";
import { ArrowLeft } from "lucide-react";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/json";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: any; // Prisma Decimal
  stock: number | null;
  image_url: string | null;
  category_id: number | null;
  categories: Category | null;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  const rawProduct = await prisma.products.findUnique({
    where: { id: parseInt(id) },
    include: { categories: true }
  });

  if (!rawProduct) {
    notFound();
  }

  const product = serializeBigInt(rawProduct) as any;
  
  // Fetch related products (same category, up to 3)
  const relatedProductsRaw = await prisma.products.findMany({
    where: { 
      category_id: product.category_id,
      id: { not: product.id }
    },
    take: 3,
    include: { categories: true }
  });

  const relatedProducts = serializeBigInt(relatedProductsRaw) as any[];

  // Mapper for UI
  const productUI = {
    ...product,
    brand: product.categories?.name || "LUXE",
    price: Number(product.price),
    category: product.categories?.name || "General",
    imageSrc: product.image_url || "/placeholder.jpg",
    imageAlt: product.name,
    gallery: product.image_url ? [product.image_url] : ["/placeholder.jpg"]
  };

  return (
    <div className="bg-luxe-surface dark:bg-luxe-inverse-surface/10 min-h-screen pb-24">
      {/* Breadcrumbs Banner */}
      <div className="bg-luxe-surface-container-low border-b border-luxe-outline-variant/10 py-6">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[64px] flex items-center justify-between">
          <nav className="text-xs font-semibold tracking-widest text-luxe-on-surface-variant/65 flex gap-2 uppercase">
            <Link href="/" className="hover:text-luxe-primary">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-luxe-primary">Products</Link>
            <span>/</span>
            <span className="text-luxe-primary font-bold">{product.name}</span>
          </nav>
          
          <Link href="/products" className="text-xs font-bold text-luxe-on-surface-variant hover:text-luxe-primary flex items-center gap-1 uppercase tracking-widest">
            <ArrowLeft className="size-3.5" /> Back to Catalog
          </Link>
        </div>
      </div>

      {/* Main product configuration component */}
      <ProductDetailClient product={productUI} />

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-4 md:px-[64px] mt-24">
          <div className="border-t border-luxe-outline-variant/10 pt-16 space-y-12">
            <div className="space-y-2">
              <span className="text-[12px] font-bold tracking-[0.25em] text-luxe-primary uppercase block">
                COMPLEMENTARY EDITS
              </span>
              <h3 className="text-2xl md:text-3xl font-light tracking-tight text-luxe-on-surface">
                You May Also Appreciate
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  brand={p.categories?.name || "LUXE"}
                  name={p.name}
                  price={`$${Number(p.price).toLocaleString()}`}
                  imageSrc={p.image_url || "/placeholder.jpg"}
                  imageAlt={p.name}
                  href={`/products/${p.id}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
