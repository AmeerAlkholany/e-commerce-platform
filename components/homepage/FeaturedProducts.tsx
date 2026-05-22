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
      <section className="py-xl bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-md">
          <div className="h-20 w-1/3 mx-auto bg-surface-container animate-pulse rounded mb-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-md h-[800px]">
            <div className="md:col-span-2 md:row-span-2 bg-white rounded-xl animate-pulse"></div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const largeProduct = products[0];
  const smallProducts = products.slice(1, 5);

  return (
    <section className="py-xl bg-surface-container-low">
      <div className="max-w-container-max mx-auto px-md">
        <div className="mb-lg text-center">
          <h2 className="text-[30px] leading-[1.25] tracking-[-0.01em] font-semibold text-on-surface">Featured Essentials</h2>
          <p className="text-[16px] leading-[1.5] text-on-surface-variant">Selected by our design experts for quality and performance</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-md h-auto md:h-[800px]">
          {/* Large Feature */}
          {largeProduct && (
            <div className="md:col-span-2 md:row-span-2 bg-white rounded-xl shadow-sm overflow-hidden group border border-outline-variant/30 flex flex-col">
              <div className="flex-1 relative overflow-hidden">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt={largeProduct.name}
                  src={largeProduct.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop'} 
                />
                <span className="absolute top-4 left-4 bg-primary-custom text-white font-semibold text-[12px] px-3 py-1 rounded-full">
                  Best Seller
                </span>
              </div>
              <div className="p-lg">
                <div className="flex justify-between items-start mb-xs">
                  <h3 className="text-[24px] leading-[1.3] font-semibold text-on-surface">{largeProduct.name}</h3>
                  <span className="text-[24px] leading-[1.3] font-semibold text-primary-custom">
                    ${formatPrice(largeProduct.price)}
                  </span>
                </div>
                <p className="text-[16px] leading-[1.5] text-on-surface-variant mb-md line-clamp-2">
                  {largeProduct.description}
                </p>
                <button className="w-full py-sm bg-[#059669] text-white font-semibold text-[14px] rounded-lg cursor-pointer hover:bg-[#047857] transition-all">
                  Add to Cart
                </button>
              </div>
            </div>
          )}

          {/* Small Cards */}
          {smallProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
