import { HeroSection } from "@/components/HeroSection";
import { FeaturedCategories } from "@/components/FeaturedCategories";
import { FeaturedProducts } from "@/components/FeaturedProducts";

export default function Home() {
  return (
    <>
      <HeroSection
        subtitle="SUMMER 2026 COLLECTION"
        title="Redefine Your Aesthetic"
        description="Discover curated luxury pieces that blend timeless elegance with contemporary design. Each item tells a story of craftsmanship."
        primaryCta={{ label: "EXPLORE COLLECTION", href: "/collections" }}
        secondaryCta={{ label: "VIEW LOOKBOOK", href: "/lookbook" }}
        imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuD__Cn26y7P769GD0Ok2wEWmZecxJgXCxgE-Sc6CAMFiizkR25aJv_D7ZYfzJPoz6PIeYYiJANJH698gDmfDBW5wihiIosgmqy4YCx-kTw5yD1Vt2v1I7MyrWVO5_QcOw-MhC7f98sQl9kfib6kGZWMiCPVD058RManzqgMrucRRNYGTtmoHwIIOmNwKGx5IoqPZMUdI06BccpKHgqRu037TVVkAy1nws21I2-DAKhW-tRLwrqmDH-hLCgmYNRmkh5fXo6B986Bw-oN"
        imageAlt="A model in a luxurious indigo outfit walks through a sunlit atrium with modern architecture."
      />
      <FeaturedCategories />
      <FeaturedProducts />
    </>
  );
}
