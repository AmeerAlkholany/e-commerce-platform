import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-[#f3f4f6] border-t border-surface-container mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-6 py-20 max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          <span className="text-2xl font-bold text-[#006948]">ShopModern</span>
          <p className="text-sm leading-relaxed text-[#4b5563] max-w-xs">
            The destination for modern essentials, curated with a focus on quality, aesthetics, and lasting performance.
          </p>
          <div className="flex gap-4">
            <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-on-surface-variant hover:text-primary-custom hover:shadow-md transition-all cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">public</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-on-surface-variant hover:text-primary-custom hover:shadow-md transition-all cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>
          </div>
        </div>
        
        <div>
          <h5 className="font-bold text-sm text-on-surface mb-6 uppercase tracking-wider">Shop</h5>
          <ul className="flex flex-col gap-4">
            <li><Link href="/categories" className="text-sm text-on-surface-variant hover:text-primary-custom transition-all">Categories</Link></li>
            <li><Link href="/new-arrivals" className="text-sm text-on-surface-variant hover:text-primary-custom transition-all">New Arrivals</Link></li>
            <li><Link href="/best-sellers" className="text-sm text-on-surface-variant hover:text-primary-custom transition-all">Best Sellers</Link></li>
            <li><Link href="/sale" className="text-sm text-on-surface-variant hover:text-primary-custom transition-all">Sale</Link></li>
          </ul>
        </div>
        
        <div>
          <h5 className="font-bold text-sm text-on-surface mb-6 uppercase tracking-wider">Support</h5>
          <ul className="flex flex-col gap-4">
            <li><Link href="/shipping" className="text-sm text-on-surface-variant hover:text-primary-custom transition-all">Shipping Info</Link></li>
            <li><Link href="/returns" className="text-sm text-on-surface-variant hover:text-primary-custom transition-all">Returns</Link></li>
            <li><Link href="/contact" className="text-sm text-on-surface-variant hover:text-primary-custom transition-all">Contact</Link></li>
            <li><Link href="/help" className="text-sm text-on-surface-variant hover:text-primary-custom transition-all">Help Center</Link></li>
          </ul>
        </div>
        
        <div>
          <h5 className="font-bold text-sm text-on-surface mb-6 uppercase tracking-wider">Legal</h5>
          <ul className="flex flex-col gap-4">
            <li><Link href="/privacy" className="text-sm text-on-surface-variant hover:text-primary-custom transition-all">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-sm text-on-surface-variant hover:text-primary-custom transition-all">Terms of Service</Link></li>
            <li><Link href="/about" className="text-sm text-on-surface-variant hover:text-primary-custom transition-all">About Us</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white px-6">
        <div className="max-w-7xl mx-auto py-8 border-t border-surface-container flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-medium text-on-surface-variant">
            © 2024 ShopModern. All rights reserved.
          </p>
          <div className="flex gap-6 items-center">
            <span className="material-symbols-outlined text-on-surface-variant/40 hover:text-primary-custom transition-colors cursor-help">credit_card</span>
            <span className="material-symbols-outlined text-on-surface-variant/40 hover:text-primary-custom transition-colors cursor-help">account_balance</span>
            <span className="material-symbols-outlined text-on-surface-variant/40 hover:text-primary-custom transition-colors cursor-help">payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
