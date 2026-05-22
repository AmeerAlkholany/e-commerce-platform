import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-outline-variant/30 flex flex-col group hover:shadow-md transition-all">
      <div className="h-48 relative overflow-hidden bg-surface-container">
        <img 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          alt={product.name}
          src={product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'} 
        />
      </div>
      <div className="p-sm flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-semibold text-[14px] text-on-surface line-clamp-1">{product.name}</h4>
          <p className="text-primary-custom font-bold mt-xs">${formatPrice(product.price)}</p>
        </div>
        <button className="mt-sm text-primary-custom font-semibold text-[12px] flex items-center gap-xs cursor-pointer hover:underline">
          Quick Add <span className="material-symbols-outlined text-[18px]">add</span>
        </button>
      </div>
    </div>
  );
};
