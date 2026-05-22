import React from 'react';

export const PromoBanner = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="bg-[#004d3d] rounded-3xl overflow-hidden relative min-h-[400px] flex items-center shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>

        <div className="relative z-10 p-12 lg:p-20 w-full lg:w-1/2">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Join the Modern Club
          </h2>
          <p className="text-lg lg:text-xl text-white/80 mb-10  leading-relaxed">
            Subscribe to get early access to new drops and exclusive member-only pricing.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md" onSubmit={(e) => e.preventDefault()}>
            <input
              className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/40 focus:bg-white/20 transition-all outline-none backdrop-blur-sm"
              placeholder="Enter your email"
              type="email"
              required
            />
            <button
              type="submit"
              className="px-10 py-4 bg-white text-[#004d3d] font-bold rounded-xl hover:bg-surface-bright hover:shadow-xl transition-all cursor-pointer active:scale-95"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2 h-full">
          <div className="relative w-full h-full">
            <img
              className="w-full h-full object-cover mix-blend-overlay opacity-80"
              alt="Abstract modern 3D shapes"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiJsWmetjJ9_-kQ3Axa_JGpMU3R0NVV2t7IWp49_JtpDBQteKHJa0w8smkyQK2MRijn01ZBsIjxYYUDmMyiBId8tdCzGt5g_Bx447vEdTMtaFVz0A1MhTxqOAABvDpnSdCMPqKq1vaPXjjOgV21e55t5qDHSpfJu3euE0yWPb1CRsW_BwkwA7XmSW_P7vRC-nAueysMHTywmPKVhMJtpK4s8M_syR1JZQxqN3qsR5QcSswU8-uY0QZFRTlw7zr3W3-Q3LZoBP3HLo"
            />
            {/* Overlay to create the deep emerald effect on the right */}
            <div className="absolute inset-0 bg-[#004d3d]/40"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
