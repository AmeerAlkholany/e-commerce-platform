"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/homepage/Navbar";
import { HeroSection } from "@/components/homepage/HeroSection";
import { CategoryList } from "@/components/homepage/CategoryList";
import { FeaturedProducts } from "@/components/homepage/FeaturedProducts";
import { TrendingCarousel } from "@/components/homepage/TrendingCarousel";
import { PromoBanner } from "@/components/homepage/PromoBanner";
import { Footer } from "@/components/homepage/Footer";
import { Product, Category } from "@/types";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories and products in parallel
        const [categoriesRes, productsRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/products")
        ]);

        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();

        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        }
        
        if (Array.isArray(productsData)) {
          // For demo purposes, we split products into featured and trending
          setFeaturedProducts(productsData.slice(0, 5));
          setTrendingProducts(productsData.slice(5, 12));
        }
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      
      <main className="pt-16">
        <HeroSection />
        
        <CategoryList 
          categories={categories} 
          loading={loading} 
        />
        
        <FeaturedProducts 
          products={featuredProducts} 
          loading={loading} 
        />
        
        <TrendingCarousel 
          products={trendingProducts} 
          loading={loading} 
        />
        
        <PromoBanner />
      </main>

      <Footer />
    </div>
  );
}
