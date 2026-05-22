import React from 'react';
import Link from 'next/link';

export const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-surface-container shadow-sm">
      <div className="flex justify-between items-center w-full px-6 py-3 max-w-7xl mx-auto h-16">
        <div className="flex items-center gap-10">
          <Link href="/" className="font-bold text-2xl text-[#006948] tracking-tight">
            ShopModern
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="font-semibold text-sm text-[#006948] border-b-2 border-[#006948] pb-1"
            >
              Home
            </Link>
            <Link 
              href="/categories" 
              className="font-medium text-sm text-on-surface-variant hover:text-[#006948] transition-colors duration-200"
            >
              Categories
            </Link>
          </nav>
        </div>
        
        <div className="flex-1 max-w-md mx-10 hidden md:block">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg group-focus-within:text-primary-custom transition-colors">
              search
            </span>
            <input 
              className="w-full pl-12 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:ring-2 focus:ring-primary-custom/10 outline-none transition-all placeholder:text-outline-variant" 
              placeholder="Search products..." 
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-on-surface hover:text-primary-custom transition-all hover:bg-surface-container rounded-full cursor-pointer relative">
            <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary-custom rounded-full ring-2 ring-white"></span>
          </button>
          <button className="p-2 text-on-surface hover:text-primary-custom transition-all hover:bg-surface-container rounded-full cursor-pointer">
            <span className="material-symbols-outlined text-[24px]">account_circle</span>
          </button>
          <button className="md:hidden p-2 text-on-surface hover:text-primary-custom transition-all">
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
};
