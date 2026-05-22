import React from 'react';

export const HeroSection = () => {
  return (
    <section className="relative w-full h-[700px] flex items-center overflow-hidden bg-[#f0f2f5]">
      <div className="absolute inset-0 z-0">
        <img 
          className="w-full h-full object-cover" 
          alt="Modern desk setup with cinema display" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwwkeZ7m-S_DhUV1uLuyRdmLInTBGHxTADb8clIlBj9NPNAtAy05-Xu9JEKPI76bDjVdjWu59j8kCdSQz2Ur5jg7l-Z01mHsJvPnuzH2uPb7HJmBwFHtZOjuoKMmBVXo0qF37OwMoBGBVqjfW6-c5ezYnKK6o-FKyAIAcoW0UjFacekPinKrkYGbggXbCB4saaQzAmisY5FF-ZZRTFsXeeiJA4knJO5o1gDoS0QBhbZUREPDySmqTSs0vh0z8p0bRr8xdVReh5O8Y"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/20 to-transparent"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-2xl">
          <span className="inline-block px-4 py-1.5 bg-[#059669]/10 text-[#059669] font-bold text-xs tracking-wider rounded-lg mb-6 backdrop-blur-sm">
            NEW COLLECTION 2024
          </span>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-[#111827] leading-[1.05] tracking-tight mb-8">
            Elevate Your <br/> Everyday Essentials
          </h1>
          <p className="text-lg lg:text-xl text-[#4b5563] mb-10 max-w-lg leading-relaxed">
            Experience the perfect blend of performance and aesthetics with our curated selection of premium lifestyle products.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-10 py-4 bg-[#059669] text-white font-bold rounded-xl hover:bg-[#047857] hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer active:scale-95 shadow-lg shadow-emerald-500/20">
              Shop Now
            </button>
            <button className="px-10 py-4 border-2 border-[#111827]/10 bg-white/50 backdrop-blur-md text-[#111827] font-bold rounded-xl hover:bg-white hover:border-[#111827] transition-all cursor-pointer active:scale-95">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
