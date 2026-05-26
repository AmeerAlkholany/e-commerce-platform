import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface HeroSectionProps {
  subtitle: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  imageSrc: string;
  imageAlt: string;
}

export function HeroSection({
  subtitle,
  title,
  description,
  primaryCta,
  secondaryCta,
  imageSrc,
  imageAlt,
}: HeroSectionProps) {
  return (
    <section className="relative h-[870px] w-full overflow-hidden bg-luxe-surface-dim">
      {/* Background Image — LCP element */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="100vw"
        preload={true}
        className="object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Content */}
      <div className="relative h-full max-w-[1440px] mx-auto px-4 md:px-[64px] flex flex-col justify-end pb-20">
        <div className="max-w-2xl text-white">
          <span className="text-[14px] font-medium leading-[1.4] tracking-[0.2em] mb-6 block">
            {subtitle}
          </span>
          <h1 className="text-[40px] md:text-[64px] font-bold leading-[1.1] tracking-[-0.04em] mb-6">
            {title}
          </h1>
          <p className="text-[18px] leading-[1.6] mb-12 opacity-90">
            {description}
          </p>
          <div className="flex gap-6 flex-wrap">
            <Button
              asChild
              className="bg-luxe-primary text-luxe-on-primary px-12 py-6 rounded-lg text-[14px] font-medium tracking-[0.05em] hover:-translate-y-[2px] transition-all duration-300 shadow-lg h-auto"
            >
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="glass-panel text-luxe-on-surface px-12 py-6 rounded-lg text-[14px] font-medium tracking-[0.05em] hover:bg-luxe-surface/90 transition-all duration-300 h-auto border-none"
            >
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
