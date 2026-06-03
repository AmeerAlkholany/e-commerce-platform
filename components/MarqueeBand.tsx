"use client";

import { Marquee } from "@/components/magicui/marquee";

const items = [
  "FREE SHIPPING WORLDWIDE",
  "CURATED LUXURY PIECES",
  "EXCLUSIVE COLLABORATIONS",
  "SUMMER 2026 PRE-LAUNCH ACTIVE",
  "COMPLIMENTARY GIFT PACKAGING",
  "24/7 CONCIERGE SUPPORT",
];

export function MarqueeBand() {
  return (
    <div className="w-full bg-luxe-primary text-luxe-on-primary py-1 overflow-hidden relative border-y border-luxe-primary-container z-20 shadow-sm">
      {/* Magic UI styling edge-fade mask layout */}
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
        <Marquee pauseOnHover className="[--duration:25s]">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-6 text-[11px] font-bold tracking-[0.25em] uppercase mx-4"
            >
              <span>{item}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-luxe-tertiary-fixed-dim" />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
