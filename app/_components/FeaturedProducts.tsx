import { ProductGrid } from "@/components/product/ProductGrid";

const products = [
  {
    brand: "LUXE TIMEPIECES",
    name: "The Horizon Chronograph",
    price: "$1,250",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfWm6FbZJ8NWggI_uqTag4zyANYjc7GViyC4Dix3RLWJl2EEJoAJxveBSIpSVpZAFWRaoRK47sm3UgppFeOI8u7kPJnzYKzFfHNMV1gotzHdSK_zCWWDLYEqJXpzeHFtAzZfzjRp6cisxyCQJo87IyM3ajdOiaDsDXFs08IuwM5xwEB2AaQlYsQwefDQG1ZlHuT4W-hkN_6eQA7_Al9Sz-omX5mL5pXvL6AgDOrx-aqF9xpJYEB4ydBeyki7cT4mzVd5S8aeHt44hb",
    imageAlt:
      "A high-end luxury watch with a leather strap displayed on a dark, reflective surface.",
  },
  {
    brand: "LEATHER GOODS",
    name: "Crescent Atelier Bag",
    price: "$890",
    badge: "LIMITED",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCOM0EDAPsFT6d6b-3s34TmLFwuQD4xeltVY2xAajVxdwLUtdI1hqRig2hmkTqFf2VjRtD3tm6VHF71biuhlBDKtrUwCEInA55tAlTvPANnk0zuggrB-Hg4G42sAqGLs0agJSFESbgpl7sk4fwPg7hXa0BwjsNn_mWeisdFl81lx1B0mIs61_s-HA3luRjzHVDeOx5O9tBR32yBZ9xMiM5kzyQuoD9tqktxQjq-Co5bQ6v2UjarlJQotbIPjuq8-v7u-MeOEA0OM7qK",
    imageAlt:
      "A sleek, designer leather handbag in a muted earth tone, photographed against a minimalist architectural background.",
  },
  {
    brand: "ACTIVE TECH",
    name: "Pulse Smart Bracelet",
    price: "$420",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCYuC-9bVEubhEvvo2Powvh29JmhA_ExfYvE76CstI-94URj9ud_froQLblqVk9DyN4DEju5GnK7yM5bX41eZ1fush0wvciFMquNGNSoyTwsJIKAIH3gI04lhy1vb1PeW-7MXsDH_ZH2sFnAdjk4ktRNFWX249IVEVAg1FND0EpWe0HrINYTtbji8eL2VQrlptANgC2maROBPm-k84lN3OM67G4yrvvdVZpjIlLDDQc7jYtwu7KKI_PeLG8WFWmtxIgX7UiFOpcBrDI",
    imageAlt:
      "A premium minimalist smartwatch featuring a clean white band and a high-resolution glass display.",
  },
  {
    brand: "COLLECTIONS",
    name: "Silk Minimalist Blouse",
    price: "$350",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC56yEybdfcEBXD8wnBDrr0--z70us3KsV6MeQNgOCnkvpwMhS0QeAOrb9Jb2fc0wa38R2uz-yUTjY46VrFstXWb8zFZlstb01eM6140tUF7AIIPxv3Z-G-yp2WmhUYE7x1xZRC2GsBCGHVoByOstTfhTClb8tr-0ZkxkWWzLXNsSDfRgvfnmlTNhNJGtpf1kdo8-9tKRx0vqGcFUl2iFWk2L91inA5yhA73yUzGLRonXo9TOtVZwZQk3fcOZ9EE397KSDlwTIqZ9Qa",
    imageAlt:
      "A curated arrangement of high-end fashion apparel, featuring a premium silk blouse and tailored trousers in soft cream colors.",
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-20 bg-luxe-surface-container-lowest">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[64px]">
        <ProductGrid
          sectionLabel="CURATED SELECTION"
          sectionTitle="Featured Masterpieces"
          viewAllHref="/products"
          products={products}
          columns={4}
        />
      </div>
    </section>
  );
}
