import React from 'react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { formatPrice } from '@/lib/utils';

interface FeaturedProductsProps {
  products: Product[];
  loading?: boolean;
}

export const FeaturedProducts = ({ products, loading }: FeaturedProductsProps) => {
  if (loading) {
    return (
      <section className="py-20 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-10 w-64 mx-auto bg-surface-container animate-pulse rounded mb-12"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[800px]">
            <div className="lg:col-span-2 lg:row-span-2 bg-white rounded-2xl animate-pulse"></div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const largeProduct = products[0];
  const smallProducts = products.slice(1, 5);

  return (
    <section className="py-20 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-on-surface mb-2">Featured Essentials</h2>
          <p className="text-on-surface-variant">Selected by our design experts for quality and performance</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Large Feature */}
          {largeProduct && (
            <div className="md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2 bg-white rounded-2xl shadow-sm overflow-hidden group border border-outline-variant/30 flex flex-col hover:shadow-md transition-all duration-300">
              <div className="aspect-[4/3] lg:aspect-auto lg:flex-1 relative overflow-hidden bg-[#1a1c1e]">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  alt={largeProduct.name}
                  src={largeProduct.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop'} 
                />
                <span className="absolute top-4 left-4 bg-primary-custom text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-sm">
                  Best Seller
                </span>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold text-on-surface group-hover:text-primary-custom transition-colors">{largeProduct.name}</h3>
                  <span className="text-2xl font-bold text-primary-custom">
                    ${formatPrice(largeProduct.price)}
                  </span>
                </div>
                <p className="text-on-surface-variant mb-6 line-clamp-2 leading-relaxed">
                  {largeProduct.description}
                </p>
                <button className="w-full py-4 bg-[#059669] text-white font-bold rounded-xl cursor-pointer hover:bg-[#047857] hover:shadow-lg transition-all active:scale-[0.98]">
                  Add to Cart
                </button>
              </div>
            </div>
          )}

          {/* Small Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:col-span-2 lg:col-span-2 gap-6">
            {smallProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
