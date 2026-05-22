import React from 'react';
import Link from 'next/link';

export const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface shadow-sm">
      <div className="flex justify-between items-center w-full px-md py-xs max-w-container-max mx-auto h-16">
        <div className="flex items-center gap-lg">
          <Link href="/" className="font-bold text-[30px] leading-[1.25] tracking-[-0.01em] text-primary-custom">
            ShopModern
          </Link>
          <nav className="hidden md:flex items-center gap-md">
            <Link 
              href="/" 
              className="font-medium text-[16px] text-primary-custom border-b-2 border-primary-custom pb-1"
            >
              Home
            </Link>
            <Link 
              href="/categories" 
              className="font-medium text-[16px] text-on-surface-variant hover:text-primary-custom transition-colors duration-200"
            >
              Categories
            </Link>
          </nav>
        </div>
        
        <div className="flex-1 max-w-md mx-lg hidden lg:block">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
            <input 
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-[14px] focus:ring-2 focus:ring-primary-custom/20 outline-none" 
              placeholder="Search products..." 
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-md">
          <button className="p-2 text-on-surface-variant hover:text-primary-custom transition-all active:opacity-80 scale-95 cursor-pointer">
            <span className="material-symbols-outlined">shopping_cart</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:text-primary-custom transition-all active:opacity-80 scale-95 cursor-pointer">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
};
