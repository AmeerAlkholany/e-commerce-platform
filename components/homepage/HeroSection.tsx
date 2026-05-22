import React from 'react';

export const HeroSection = () => {
  return (
    <section className="relative w-full h-[600px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          className="w-full h-full object-cover" 
          alt="Modern living room with premium lifestyle products" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwwkeZ7m-S_DhUV1uLuyRdmLInTBGHxTADb8clIlBj9NPNAtAy05-Xu9JEKPI76bDjVdjWu59j8kCdSQz2Ur5jg7l-Z01mHsJvPnuzH2uPb7HJmBwFHtZOjuoKMmBVXo0qF37OwMoBGBVqjfW6-c5ezYnKK6o-FKyAIAcoW0UjFacekPinKrkYGbggXbCB4saaQzAmisY5FF-ZZRTFsXeeiJA4knJO5o1gDoS0QBhbZUREPDySmqTSs0vh0z8p0bRr8xdVReh5O8Y"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest/80 to-transparent"></div>
      </div>
      <div className="relative z-10 max-w-container-max mx-auto px-md w-full">
        <div className="max-w-xl">
          <span className="inline-block px-3 py-1 bg-primary-custom/10 text-primary-custom font-semibold text-[14px] rounded-full mb-md">
            NEW COLLECTION 2024
          </span>
          <h1 className="text-[48px] leading-[1.1] tracking-[-0.02em] font-bold text-on-surface mb-md">
            Elevate Your Everyday Essentials
          </h1>
          <p className="text-[18px] leading-[1.6] text-on-surface-variant mb-lg">
            Experience the perfect blend of performance and aesthetics with our curated selection of premium lifestyle products.
          </p>
          <div className="flex gap-md">
            <button className="px-xl py-md bg-[#059669] text-white font-semibold text-[14px] rounded-lg hover:shadow-lg transition-all cursor-pointer">
              Shop Now
            </button>
            <button className="px-xl py-md border border-[#1e293b] text-[#1e293b] font-semibold text-[14px] rounded-lg hover:bg-[#1e293b]/5 transition-all cursor-pointer">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
