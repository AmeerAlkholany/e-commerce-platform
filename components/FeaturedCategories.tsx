"use client";

import { CategoryCard } from "@/components/CategoryCard";
import { motion } from "framer-motion";

const categories = [
  {
    title: "Fashion Essentials",
    linkLabel: "EXPLORE APPAREL",
    href: "/categories/fashion",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCjA_HJpOC7dPzy1BtFJmO-Bcqllo32slqZBTJ5_tKIemh3m5PUdpcbLGtzdV0VAWPwkEII2w6DHk8tKqXY9Px7x7T4zIEdeefSaKp5RJCMcKnZOebWG_5X1LHsMQ91BFEL85Yq28My_qN2LZm6TyHeqQAr9yN19iTLFohgZxleGIl5OraRd0eXunOYv24BB5bE1hLqu-PIwy564dr-ecdrVemFPNWYgh7fbgPbdJs1sBe1GF9ofHFSJIB92XcimKwZ-bJhdzX1v5jX",
    imageAlt:
      "A sophisticated fashion photography scene featuring high-end apparel in a minimalist studio.",
  },
  {
    title: "Next-Gen Electronics",
    linkLabel: "DISCOVER INNOVATIONS",
    href: "/categories/electronics",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6EFBnL-I3-jkKy3s1J7WqdZOteqgahWi2937kmzFzAGz4QVBRgqMskFdS00ft7LCd08r_6sLZI-rm0naLoYe_4iFYbVgSr9QhARtSgu1zNykqbkdox1UQ5Ja_SVVvvuq4Q1WcDzYmWroCCuWKTQMF_O1bT1P3yaBDjJPMS9fW_nrBT_cUzpCpTNyCrdB5aGbzHceRsSwE5V69zJPswy6vcrARyzOH8G2WsWL-F652QscEJEEcAtwbdrhRZ5qGH6363fCcb9MJaNRj",
    imageAlt:
      "High-end electronic devices displayed on a marble surface with minimalist styling.",
  },
  {
    title: "Curated Interiors",
    linkLabel: "BROWSE OBJECTS",
    href: "/categories/home-decor",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBewA7jgwZvc-ygXhQFIB9niS9eVf_LoDU0tKxkp6V9peGVk9W5jWMNCO5pXZ1A5jFkZ-MD_rEfNcTq_5Tbcu2xku9KXKo-WU5DBAJ0377yRa3M_gG8mjk5yW_bhLw9f-zPaR9UEkhrcutAzpvCCWp4RgxhEPVOlMksSOKhhRlC3KzPqDOfYEbepQiG-qMz8mHSV9BSFhf5FJuFXjAemxf5qUVhWwsr0FteQomDUcaJrEzNGM4loay9SBzfontYizsE05Yvt8TrnuJc",
    imageAlt:
      "A high-end home decor setting featuring a sculptural chair and minimalist art piece.",
  },
];

export function FeaturedCategories() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 16,
      },
    },
  };

  return (
    <section className="py-24 max-w-[1440px] mx-auto px-4 md:px-[64px]">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="space-y-2">
          <span className="text-[12px] font-bold tracking-[0.25em] text-luxe-primary uppercase block">
            VISUAL TAXONOMY
          </span>
          <h2 className="text-[36px] md:text-[44px] font-light leading-none tracking-tight text-luxe-on-surface">
            Curated Collections
          </h2>
        </div>
        <p className="text-[15px] leading-[1.6] text-luxe-on-surface-variant max-w-md font-light opacity-80">
          Explore our seasonal edits, meticulously categorized to complement your modern lifestyle with functional elegance.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[620px]"
      >
        {/* Main: Fashion — spans 8 columns, full height */}
        <motion.div variants={itemVariants} className="md:col-span-8 h-full">
          <CategoryCard
            {...categories[0]}
            headingSize="lg"
            className="h-full min-h-[380px] md:min-h-0"
          />
        </motion.div>

        {/* Side: 2 stacked cards — spans 4 columns */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-4 grid grid-rows-2 gap-6 h-full"
        >
          <CategoryCard
            {...categories[1]}
            headingSize="md"
            className="min-h-[240px] md:min-h-0 h-full"
          />
          <CategoryCard
            {...categories[2]}
            headingSize="md"
            className="min-h-[240px] md:min-h-0 h-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
