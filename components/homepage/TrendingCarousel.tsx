import React, { useRef } from 'react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface TrendingProps {
  products: Product[];
  loading?: boolean;
}

export const TrendingCarousel = ({ products, loading }: TrendingProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340; // width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <section className="py-20 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6">
           <div className="h-10 w-48 bg-surface-container animate-pulse rounded mb-10"></div>
           <div className="flex gap-6">
             {[1,2,3,4].map(i => (
               <div key={i} className="min-w-[300px] h-[420px] bg-surface-container animate-pulse rounded-2xl"></div>
             ))}
           </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-on-surface mb-2">Trending Now</h2>
            <p className="text-on-surface-variant">The most wanted items this week</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container hover:border-primary-custom transition-all cursor-pointer active:scale-95 group shadow-sm"
            >
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary-custom">chevron_left</span>
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container hover:border-primary-custom transition-all cursor-pointer active:scale-95 group shadow-sm"
            >
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary-custom">chevron_right</span>
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 no-scrollbar overflow-x-auto pb-4"
        >
          {products.map((product) => {
            const avgRating = product.reviews && product.reviews.length > 0
              ? (product.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / product.reviews.length).toFixed(1)
              : "0.0";
            
            return (
              <div key={product.id} className="min-w-[300px] bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/20 hover:shadow-xl transition-all duration-300 group">
                <div className="aspect-square rounded-xl overflow-hidden bg-surface-container-low mb-4 relative">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    alt={product.name}
                    src={product.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'} 
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-on-surface shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    QUICK VIEW
                  </div>
                </div>
                
                <span className="font-bold text-[10px] text-primary-custom uppercase tracking-[0.15em] mb-1 block">
                  {product.categories?.name || 'ESSENTIALS'}
                </span>
                
                <h4 className="font-bold text-base text-on-surface mt-1 group-hover:text-primary-custom transition-colors line-clamp-1">{product.name}</h4>
                
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-surface-container/30">
                  <span className="material-symbols-outlined text-primary-custom text-[16px] fill-current">star</span>
                  <span className="font-bold text-sm text-on-surface">{avgRating}</span>
                  <span className="font-bold text-lg text-primary-custom ml-auto">
                    ${formatPrice(product.price)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
