import { GALLERIES } from "@/lib/content/galleries";
import { getGalleryPhotos } from "@/lib/content/gallery-photos";
import { PORTFOLIO_ORDER } from "@/lib/content/site";
import { PortfolioCard } from "./PortfolioCard";
import { SectionTitle } from "./SectionTitle";
import { StaggerGroup, StaggerItem } from "./motion/RevealOnView";

const PROCESSIONS_FOLDERS = [
  "photo-processions/photogallery-cascano",
  "photo-processions/photogallery-guardia",
  "photo-processions/photogallery-sessa",
  "photo-processions/photogallery-troia",
];

// Alt text as written on the legacy homepage; falls back to the gallery label where none was set.
const COVER_ALT: Record<string, string> = {
  portraits: "Ritratto in bianco e nero",
  street: "Scena di street photography in bianco e nero",
  jazz: "Jazz - Copertina galleria",
  processions: "Processions",
  auschwitz: "Deportati in arrivo a Auschwitz",
  landscapes: "Paesaggio marino drammatico in bianco e nero",
};

function buildCards() {
  return PORTFOLIO_ORDER.map((slug) => {
    if (slug === "processions") {
      const count = PROCESSIONS_FOLDERS.reduce(
        (sum, folder) => sum + getGalleryPhotos(folder, "").length,
        0
      );
      return {
        href: "/processions",
        label: "processions",
        count,
        coverSrc: "/assets/images/photo-processions/cover-photo-processions.webp",
        coverAlt: COVER_ALT.processions,
      };
    }
    const g = GALLERIES.find((item) => item.slug === slug);
    if (!g) return null;
    const count = getGalleryPhotos(g.folder, g.altPrefix).length;
    return {
      href: `/${g.slug}`,
      label: g.label.toLowerCase(),
      count,
      coverSrc: `/assets/images/${g.folder}/cover-${g.folder}.webp`,
      coverAlt: COVER_ALT[g.slug] ?? g.label,
    };
  }).filter((c): c is NonNullable<typeof c> => c !== null);
}

export function Portfolio() {
  const cards = buildCards();

  return (
    /* Sezione nera a tutta larghezza */
    <section id="portfolio" className="w-full text-white" style={{ backgroundColor: "#000" }}>
      <div className="mx-auto max-w-[1400px] px-5 py-16 pr-10 sm:px-8 sm:py-20 sm:pr-12 md:px-10 lg:py-32">
        <SectionTitle>Portfolio</SectionTitle>
        <StaggerGroup className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:mt-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:mt-16 lg:grid-cols-3">
          {cards.map((card, i) => (
            <StaggerItem key={card.href}>
              <PortfolioCard {...card} index={i + 1} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
