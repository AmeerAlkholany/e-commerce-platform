import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface CategoryCardProps {
  title: string;
  linkLabel: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  /** Use to control heading size: "lg" for main categories, "md" for secondary */
  headingSize?: "lg" | "md";
  className?: string;
}

export function CategoryCard({
  title,
  linkLabel,
  href,
  imageSrc,
  imageAlt,
  headingSize = "md",
  className,
}: CategoryCardProps) {
  return (
    <div
      className={cn(
        "relative group overflow-hidden rounded-xl bg-luxe-surface-container-high",
        className
      )}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
      <div className="absolute bottom-6 left-6 p-6">
        <h3
          className={cn(
            "text-white mb-1",
            headingSize === "lg"
              ? "text-[32px] font-semibold leading-[1.2] tracking-[-0.02em]"
              : "text-[24px] font-semibold leading-[1.3]"
          )}
        >
          {title}
        </h3>
        <Link
          href={href}
          className="text-white text-[14px] font-medium leading-[1.4] tracking-[0.05em] underline underline-offset-4"
        >
          {linkLabel}
        </Link>
      </div>
    </div>
  );
}
