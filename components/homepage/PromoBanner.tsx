import React from 'react';

export const PromoBanner = () => {
  return (
    <section className="max-w-container-max mx-auto px-md py-xl">
      <div className="bg-primary-custom rounded-xl overflow-hidden relative min-h-[300px] flex items-center">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 p-xl max-w-lg">
          <h2 className="text-[48px] leading-[1.1] tracking-[-0.02em] font-bold text-white mb-md">Join the Modern Club</h2>
          <p className="text-[18px] leading-[1.6] text-white/90 mb-lg">
            Subscribe to get early access to new drops and exclusive member-only pricing.
          </p>
          <form className="flex gap-xs" onSubmit={(e) => e.preventDefault()}>
            <input 
              className="flex-1 px-md py-md rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/40 focus:bg-white/20 transition-all outline-none" 
              placeholder="Enter your email" 
              type="email"
              required
            />
            <button 
              type="submit"
              className="px-xl py-md bg-white text-primary-custom font-semibold text-[14px] rounded-lg hover:bg-surface transition-all cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>
        <div className="hidden md:block absolute right-0 bottom-0 h-full w-1/2">
          <img 
            className="w-full h-full object-cover opacity-50" 
            alt="Abstract design for premium club"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiJsWmetjJ9_-kQ3Axa_JGpMU3R0NVV2t7IWp49_JtpDBQteKHJa0w8smkyQK2MRijn01ZBsIjxYYUDmMyiBId8tdCzGt5g_Bx447vEdTMtaFVz0A1MhTxqOAABvDpnSdCMPqKq1vaPXjjOgV21e55t5qDHSpfJu3euE0yWPb1CRsW_BwkwA7XmSW_P7vRC-nAueysMHTywmPKVhMJtpK4s8M_syR1JZQxqN3qsR5QcSswU8-uY0QZFRTlw7zr3W3-Q3LZoBP3HLo"
          />
        </div>
      </div>
    </section>
  );
};
