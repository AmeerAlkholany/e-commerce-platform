import { CategoryCard } from "@/components/category/CategoryCard";

const categories = [
  {
    title: "Fashion",
    linkLabel: "VIEW ESSENTIALS",
    href: "/categories/fashion",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCjA_HJpOC7dPzy1BtFJmO-Bcqllo32slqZBTJ5_tKIemh3m5PUdpcbLGtzdV0VAWPwkEII2w6DHk8tKqXY9Px7x7T4zIEdeefSaKp5RJCMcKnZOebWG_5X1LHsMQ91BFEL85Yq28My_qN2LZm6TyHeqQAr9yN19iTLFohgZxleGIl5OraRd0eXunOYv24BB5bE1hLqu-PIwy564dr-ecdrVemFPNWYgh7fbgPbdJs1sBe1GF9ofHFSJIB92XcimKwZ-bJhdzX1v5jX",
    imageAlt:
      "A sophisticated fashion photography scene featuring high-end apparel in a minimalist studio.",
  },
  {
    title: "Electronics",
    linkLabel: "SHOP TECH",
    href: "/categories/electronics",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6EFBnL-I3-jkKy3s1J7WqdZOteqgahWi2937kmzFzAGz4QVBRgqMskFdS00ft7LCd08r_6sLZI-rm0naLoYe_4iFYbVgSr9QhARtSgu1zNykqbkdox1UQ5Ja_SVVvvuq4Q1WcDzYmWroCCuWKTQMF_O1bT1P3yaBDjJPMS9fW_nrBT_cUzpCpTNyCrdB5aGbzHceRsSwE5V69zJPswy6vcrARyzOH8G2WsWL-F652QscEJEEcAtwbdrhRZ5qGH6363fCcb9MJaNRj",
    imageAlt:
      "High-end electronic devices displayed on a marble surface with minimalist styling.",
  },
  {
    title: "Home Decor",
    linkLabel: "BROWSE INTERIORS",
    href: "/categories/home-decor",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBewA7jgwZvc-ygXhQFIB9niS9eVf_LoDU0tKxkp6V9peGVk9W5jWMNCO5pXZ1A5jFkZ-MD_rEfNcTq_5Tbcu2xku9KXKo-WU5DBAJ0377yRa3M_gG8mjk5yW_bhLw9f-zPaR9UEkhrcutAzpvCCWp4RgxhEPVOlMksSOKhhRlC3KzPqDOfYEbepQiG-qMz8mHSV9BSFhf5FJuFXjAemxf5qUVhWwsr0FteQomDUcaJrEzNGM4loay9SBzfontYizsE05Yvt8TrnuJc",
    imageAlt:
      "A high-end home decor setting featuring a sculptural chair and minimalist art piece.",
  },
];

export function FeaturedCategories() {
  return (
    <section className="py-20 max-w-[1440px] mx-auto px-4 md:px-[64px]">
      {/* Bento Grid: 12-col, 8+4 split, h-[600px] — exact Stitch dims */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
        {/* Main: Fashion — spans 8 columns, full height */}
        <CategoryCard
          {...categories[0]}
          headingSize="lg"
          className="md:col-span-8 min-h-[300px] md:min-h-0"
        />

        {/* Side: 2 stacked cards — spans 4 columns */}
        <div className="md:col-span-4 grid grid-rows-2 gap-6">
          <CategoryCard
            {...categories[1]}
            headingSize="md"
            className="min-h-[200px] md:min-h-0"
          />
          <CategoryCard
            {...categories[2]}
            headingSize="md"
            className="min-h-[200px] md:min-h-0"
          />
        </div>
      </div>
    </section>
  );
}
