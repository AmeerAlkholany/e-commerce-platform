import React from 'react';
import { Category } from '@/types';

interface CategoryListProps {
  categories: Category[];
  loading?: boolean;
}

export const CategoryList = ({ categories, loading }: CategoryListProps) => {
  if (loading) {
    return (
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex gap-10 overflow-x-auto no-scrollbar justify-center">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center gap-4 min-w-[120px]">
              <div className="w-24 h-24 rounded-full bg-surface-container animate-pulse"></div>
              <div className="h-4 w-20 bg-surface-container animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-on-surface mb-2">Browse by Category</h2>
        <p className="text-on-surface-variant">Explore our wide range of curated collections</p>
      </div>
      <div className="flex gap-8 md:gap-12 overflow-x-auto no-scrollbar pb-4 md:justify-start lg:justify-start">
        {categories.map((category) => (
          <div key={category.id} className="flex flex-col items-center gap-4 min-w-[100px] group cursor-pointer">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-primary-custom transition-all duration-300 scale-110"></div>
              <div className="w-full h-full rounded-full overflow-hidden bg-surface-container shadow-sm p-1">
                <img 
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500" 
                  alt={category.name}
                  src={category.image_url || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop`} 
                />
              </div>
            </div>
            <span className="font-bold text-sm text-on-surface group-hover:text-primary-custom transition-colors">{category.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
