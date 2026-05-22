import React from 'react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-outline-variant/20 flex flex-col group hover:shadow-lg transition-all duration-300">
      <div className="aspect-square relative overflow-hidden bg-surface-container/50">
        <img 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          alt={product.name}
          src={product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'} 
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <h4 className="font-bold text-base text-on-surface line-clamp-1 group-hover:text-primary-custom transition-colors">
            {product.name}
          </h4>
          <p className="text-primary-custom font-extrabold text-lg mt-1">
            ${formatPrice(product.price)}
          </p>
        </div>
        <div className="mt-auto pt-2 border-t border-surface-container/50">
          <button className="w-full text-primary-custom font-bold text-xs flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-primary-custom/5 transition-all cursor-pointer">
            Quick Add <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
