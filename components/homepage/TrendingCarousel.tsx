import React from 'react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface TrendingProps {
  products: Product[];
  loading?: boolean;
}

export const TrendingCarousel = ({ products, loading }: TrendingProps) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <section className="py-xl overflow-hidden">
        <div className="max-w-container-max mx-auto px-md">
           <div className="h-10 w-48 bg-surface-container animate-pulse rounded mb-lg"></div>
           <div className="flex gap-md">
             {[1,2,3,4].map(i => (
               <div key={i} className="min-w-[300px] h-[400px] bg-surface-container animate-pulse rounded-xl"></div>
             ))}
           </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-xl overflow-hidden">
      <div className="max-w-container-max mx-auto px-md">
        <div className="flex justify-between items-center mb-lg">
          <div>
            <h2 className="text-[30px] leading-[1.25] tracking-[-0.01em] font-semibold text-on-surface">Trending Now</h2>
            <p className="text-[16px] leading-[1.5] text-on-surface-variant">The most wanted items this week</p>
          </div>
          <div className="flex gap-sm">
            <button 
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary-custom/5 hover:border-primary-custom transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary-custom/5 hover:border-primary-custom transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollContainerRef}
          className="flex gap-md no-scrollbar overflow-x-auto"
        >
          {products.map((product) => {
            // Calculate average rating
            const avgRating = product.reviews && product.reviews.length > 0
              ? (product.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / product.reviews.length).toFixed(1)
              : "0.0";
            
            return (
              <div key={product.id} className="min-w-[300px] bg-white rounded-xl p-sm shadow-sm border border-outline-variant/20 hover:shadow-md transition-all">
                <div className="aspect-square rounded-lg overflow-hidden bg-surface-container-low mb-sm">
                  <img 
                    className="w-full h-full object-cover" 
                    alt={product.name}
                    src={product.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'} 
                  />
                </div>
                <span className="font-semibold text-[12px] text-on-surface-variant uppercase tracking-wider">
                  {product.categories?.name || 'ESSENTIALS'}
                </span>
                <h4 className="font-semibold text-[14px] text-on-surface mt-xs line-clamp-1">{product.name}</h4>
                <div className="flex items-center gap-xs mt-xs">
                  <span className="material-symbols-outlined text-primary-custom text-[16px] fill-current">star</span>
                  <span className="font-semibold text-[14px] text-on-surface">{avgRating}</span>
                  <span className="font-medium text-[14px] text-on-surface-variant ml-auto">
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
