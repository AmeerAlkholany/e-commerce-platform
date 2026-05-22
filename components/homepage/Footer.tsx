import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-surface-container border-t border-outline-variant mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-lg px-md py-xl max-w-container-max mx-auto">
        <div className="flex flex-col gap-md">
          <span className="text-[24px] leading-[1.3] font-bold text-on-surface">ShopModern</span>
          <p className="text-[14px] leading-[1.5] text-on-surface-variant">
            The destination for modern essentials, curated with a focus on quality, aesthetics, and lasting performance.
          </p>
          <div className="flex gap-sm">
            <button className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-on-surface-variant hover:text-primary-custom transition-all cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">public</span>
            </button>
            <button className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-on-surface-variant hover:text-primary-custom transition-all cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>
          </div>
        </div>
        
        <div>
          <h5 className="font-semibold text-[14px] text-on-surface mb-md">Shop</h5>
          <ul className="flex flex-col gap-xs">
            <li><Link href="/categories" className="text-[14px] text-on-surface-variant hover:text-primary-custom hover:underline transition-all">Categories</Link></li>
            <li><Link href="/new-arrivals" className="text-[14px] text-on-surface-variant hover:text-primary-custom hover:underline transition-all">New Arrivals</Link></li>
            <li><Link href="/best-sellers" className="text-[14px] text-on-surface-variant hover:text-primary-custom hover:underline transition-all">Best Sellers</Link></li>
            <li><Link href="/sale" className="text-[14px] text-on-surface-variant hover:text-primary-custom hover:underline transition-all">Sale</Link></li>
          </ul>
        </div>
        
        <div>
          <h5 className="font-semibold text-[14px] text-on-surface mb-md">Support</h5>
          <ul className="flex flex-col gap-xs">
            <li><Link href="/shipping" className="text-[14px] text-on-surface-variant hover:text-primary-custom hover:underline transition-all">Shipping Info</Link></li>
            <li><Link href="/returns" className="text-[14px] text-on-surface-variant hover:text-primary-custom hover:underline transition-all">Returns</Link></li>
            <li><Link href="/contact" className="text-[14px] text-on-surface-variant hover:text-primary-custom hover:underline transition-all">Contact</Link></li>
            <li><Link href="/help" className="text-[14px] text-on-surface-variant hover:text-primary-custom hover:underline transition-all">Help Center</Link></li>
          </ul>
        </div>
        
        <div>
          <h5 className="font-semibold text-[14px] text-on-surface mb-md">Legal</h5>
          <ul className="flex flex-col gap-xs">
            <li><Link href="/privacy" className="text-[14px] text-on-surface-variant hover:text-primary-custom hover:underline transition-all">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-[14px] text-on-surface-variant hover:text-primary-custom hover:underline transition-all">Terms of Service</Link></li>
            <li><Link href="/about" className="text-[14px] text-on-surface-variant hover:text-primary-custom hover:underline transition-all">About Us</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="px-md py-md border-t border-outline-variant max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-md">
        <p className="text-[14px] text-on-surface-variant">© 2024 ShopModern. All rights reserved.</p>
        <div className="flex gap-md">
          <span className="material-symbols-outlined text-on-surface-variant/50">credit_card</span>
          <span className="material-symbols-outlined text-on-surface-variant/50">account_balance</span>
          <span className="material-symbols-outlined text-on-surface-variant/50">payments</span>
        </div>
      </div>
    </footer>
  );
};
