import React from 'react';
import { Category } from '@/types';

interface CategoryListProps {
  categories: Category[];
  loading?: boolean;
}

export const CategoryList = ({ categories, loading }: CategoryListProps) => {
  if (loading) {
    return (
      <section className="py-xl max-w-container-max mx-auto px-md">
        <div className="h-8 w-48 bg-surface-container animate-pulse rounded mb-lg"></div>
        <div className="flex gap-lg overflow-x-auto no-scrollbar pb-xs">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center gap-sm min-w-[120px]">
              <div className="w-24 h-24 rounded-full bg-surface-container animate-pulse"></div>
              <div className="h-4 w-20 bg-surface-container animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-xl max-w-container-max mx-auto px-md">
      <div className="flex justify-between items-end mb-lg">
        <div>
          <h2 className="text-[30px] leading-[1.25] tracking-[-0.01em] font-semibold text-on-surface">Browse by Category</h2>
          <p className="text-[16px] leading-[1.5] text-on-surface-variant">Explore our wide range of curated collections</p>
        </div>
      </div>
      <div className="flex gap-lg overflow-x-auto no-scrollbar pb-xs">
        {categories.map((category) => (
          <div key={category.id} className="flex flex-col items-center gap-sm min-w-[120px] group cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary-custom transition-all p-1 bg-surface-container">
              <img 
                className="w-full h-full object-cover rounded-full" 
                alt={category.name}
                src={category.image_url || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop`} 
              />
            </div>
            <span className="font-semibold text-[14px] text-on-surface">{category.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
