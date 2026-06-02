import { HeroSection } from "@/components/HeroSection"
import { FlavorCarousel } from "@/components/FlavorCarousel"
import { BentoGrid } from "@/components/BentoGrid"
import { ActivationsSection } from "@/components/ActivationsSection"
import { SocialSection } from "@/components/SocialSection"
import { FeaturedProducts } from "@/components/FeaturedProducts"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Flavor Showcase Carousel */}
      <FlavorCarousel />

      {/* 3. Formula & Bento Grid Benefits */}
      <BentoGrid />

      {/* 4. Brand Activations Card Grid */}
      <ActivationsSection />

      {/* 5. Instagram Creators Feed */}
      <SocialSection />

      {/* 6. Curated E-Commerce Catalog Highlights */}
      <div className="border-t border-white/5 bg-[#121212]">
        <FeaturedProducts />
      </div>
    </main>
  )
}
