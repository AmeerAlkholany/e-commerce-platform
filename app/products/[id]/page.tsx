import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailClient } from "./ProductDetailClient";
import { ArrowLeft } from "lucide-react";

// Local static catalog matching listing page
const PRODUCTS = [
  {
    id: 1,
    brand: "LUXE TIMEPIECES",
    name: "The Horizon Chronograph",
    price: 1250,
    category: "Timepieces",
    description: "Architectural structure meets functional elegance. The Horizon Chronograph is detailed with premium Horween leather straps and hand-assembled mechanical gears that run flawlessly. Featuring double-domed sapphire glass and water resistance up to 100 meters, it represents the absolute peak of modern luxury timekeeping.",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXufWm6FbZJ8NWggI_uqTag4zyANYjc7GViyC4Dix3RLWJl2EEJoAJxveBSIpSVpZAFWRaoRK47sm3UgppFeOI8u7kPJnzYKzFfHNMV1gotzHdSK_zCWWDLYEqJXpzeHFtAzZfzjRp6cisxyCQJo87IyM3ajdOiaDsDXFs08IuwM5xwEB2AaQlYsQwefDQG1ZlHuT4W-hkN_6eQA7_Al9Sz-omX5mL5pXvL6AgDOrx-aqF9xpJYEB4ydBeyki7cT4mzVd5S8aeHt44hb",
    imageAlt: "A high-end luxury watch with a leather strap displayed on a dark, reflective surface.",
    badge: "FEATURED",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXufWm6FbZJ8NWggI_uqTag4zyANYjc7GViyC4Dix3RLWJl2EEJoAJxveBSIpSVpZAFWRaoRK47sm3UgppFeOI8u7kPJnzYKzFfHNMV1gotzHdSK_zCWWDLYEqJXpzeHFtAzZfzjRp6cisxyCQJo87IyM3ajdOiaDsDXFs08IuwM5xwEB2AaQlYsQwefDQG1ZlHuT4W-hkN_6eQA7_Al9Sz-omX5mL5pXvL6AgDOrx-aqF9xpJYEB4ydBeyki7cT4mzVd5S8aeHt44hb",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBewA7jgwZvc-ygXhQFIB9niS9eVf_LoDU0tKxkp6V9peGVk9W5jWMNCO5pXZ1A5jFkZ-MD_rEfNcTq_5Tbcu2xku9KXKo-WU5DBAJ0377yRa3M_gG8mjk5yW_bhLw9f-zPaR9UEkhrcutAzpvCCWp4RgxhEPVOlMksSOKhhRlC3KzPqDOfYEbepQiG-qMz8mHSV9BSFhf5FJuFXjAemxf5qUVhWwsr0FteQomDUcaJrEzNGM4loay9SBzfontYizsE05Yvt8TrnuJc",
    ]
  },
  {
    id: 2,
    brand: "LEATHER GOODS",
    name: "Crescent Atelier Bag",
    price: 890,
    category: "Fashion",
    description: "Crafted from fine-grain Italian calfskin, the Crescent Atelier Bag features architectural paneling and a modular gold-brass chain. Inside, it boasts premium suede lining and organizational card slots. Designed to be worn as a shoulder bag or clutch, it seamlessly adapts to your day-to-night transitions.",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCOM0EDAPsFT6d6b-3s34TmLFwuQD4xeltVY2xAajVxdwLUtdI1hqRig2hmkTqFf2VjRtD3tm6VHF71biuhlBDKtrUwCEInA55tAlTvPANnk0zuggrB-Hg4G42sAqGLs0agJSFESbgpl7sk4fwPg7hXa0BwjsNn_mWeisdFl81lx1B0mIs61_s-HA3luRjzHVDeOx5O9tBR32yBZ9xMiM5kzyQuoD9tqktxQjq-Co5bQ6v2UjarlJQotbIPjuq8-v7u-MeOEA0OM7qK",
    imageAlt: "A sleek, designer leather handbag in a muted earth tone, photographed against a minimalist architectural background.",
    badge: "LIMITED",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCOM0EDAPsFT6d6b-3s34TmLFwuQD4xeltVY2xAajVxdwLUtdI1hqRig2hmkTqFf2VjRtD3tm6VHF71biuhlBDKtrUwCEInA55tAlTvPANnk0zuggrB-Hg4G42sAqGLs0agJSFESbgpl7sk4fwPg7hXa0BwjsNn_mWeisdFl81lx1B0mIs61_s-HA3luRjzHVDeOx5O9tBR32yBZ9xMiM5kzyQuoD9tqktxQjq-Co5bQ6v2UjarlJQotbIPjuq8-v7u-MeOEA0OM7qK",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC56yEybdfcEBXD8wnBDrr0--z70us3KsV6MeQNgOCnkvpwMhS0QeAOrb9Jb2fc0wa38R2uz-yUTjY46VrFstXWb8zFZlstb01eM6140tUF7AIIPxv3Z-G-yp2WmhUYE7x1xZRC2GsBCGHVoByOstTfhTClb8tr-0ZkxkWWzLXNsSDfRgvfnmlTNhNJGtpf1kdo8-9tKRx0vqGcFUl2iFWk2L91inA5yhA73yUzGLRonXo9TOtVZwZQk3fcOZ9EE397KSDlwTIqZ9Qa",
    ]
  },
  {
    id: 3,
    brand: "ACTIVE TECH",
    name: "Pulse Smart Bracelet",
    price: 420,
    category: "Electronics",
    description: "Reimagining smart wearables. The Pulse Smart Bracelet blends into your formal attire while monitoring advanced biometrics. With its custom curved sapphire display and titanium build, it tracks recovery, activity levels, and stress in high fidelity. Fully waterproof with a 10-day battery life.",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCYuC-9bVEubhEvvo2Powvh29JmhA_ExfYvE76CstI-94URj9ud_froQLblqVk9DyN4DEju5GnK7yM5bX41eZ1fush0wvciFMquNGNSoyTwsJIKAIH3gI04lhy1vb1PeW-7MXsDH_ZH2sFnAdjk4ktRNFWX249IVEVAg1FND0EpWe0HrINYTtbji8eL2VQrlptANgC2maROBPm-k84lN3OM67G4yrvvdVZpjIlLDDQc7jYtwu7KKI_PeLG8WFWmtxIgX7UiFOpcBrDI",
    imageAlt: "A premium minimalist smartwatch featuring a clean white band and a high-resolution glass display.",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCYuC-9bVEubhEvvo2Powvh29JmhA_ExfYvE76CstI-94URj9ud_froQLblqVk9DyN4DEju5GnK7yM5bX41eZ1fush0wvciFMquNGNSoyTwsJIKAIH3gI04lhy1vb1PeW-7MXsDH_ZH2sFnAdjk4ktRNFWX249IVEVAg1FND0EpWe0HrINYTtbji8eL2VQrlptANgC2maROBPm-k84lN3OM67G4yrvvdVZpjIlLDDQc7jYtwu7KKI_PeLG8WFWmtxIgX7UiFOpcBrDI",
    ]
  },
  {
    id: 4,
    brand: "COLLECTIONS",
    name: "Silk Minimalist Blouse",
    price: 350,
    category: "Fashion",
    description: "Flowing organic mulberry silk blouse with relaxed dropped shoulders and architectural cuffs. Designed as a luxury staple that breathes naturally, this piece hangs beautifully. Ideal for styling with structured linen trousers or high-end tailoring.",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC56yEybdfcEBXD8wnBDrr0--z70us3KsV6MeQNgOCnkvpwMhS0QeAOrb9Jb2fc0wa38R2uz-yUTjY46VrFstXWb8zFZlstb01eM6140tUF7AIIPxv3Z-G-yp2WmhUYE7x1xZRC2GsBCGHVoByOstTfhTClb8tr-0ZkxkWWzLXNsSDfRgvfnmlTNhNJGtpf1kdo8-9tKRx0vqGcFUl2iFWk2L91inA5yhA73yUzGLRonXo9TOtVZwZQk3fcOZ9EE397KSDlwTIqZ9Qa",
    imageAlt: "A curated arrangement of high-end fashion apparel, featuring a premium silk blouse and tailored trousers in soft cream colors.",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC56yEybdfcEBXD8wnBDrr0--z70us3KsV6MeQNgOCnkvpwMhS0QeAOrb9Jb2fc0wa38R2uz-yUTjY46VrFstXWb8zFZlstb01eM6140tUF7AIIPxv3Z-G-yp2WmhUYE7x1xZRC2GsBCGHVoByOstTfhTClb8tr-0ZkxkWWzLXNsSDfRgvfnmlTNhNJGtpf1kdo8-9tKRx0vqGcFUl2iFWk2L91inA5yhA73yUzGLRonXo9TOtVZwZQk3fcOZ9EE397KSDlwTIqZ9Qa",
    ]
  },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === Number(id)) || PRODUCTS[0];
  
  // Fetch related products (same category or others, up to 3)
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

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
      <ProductDetailClient product={product} />

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
                  brand={p.brand}
                  name={p.name}
                  price={`$${p.price.toLocaleString()}`}
                  imageSrc={p.imageSrc}
                  imageAlt={p.imageAlt}
                  badge={p.badge}
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
