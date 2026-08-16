import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { PROCESSIONS_HUB } from "@/lib/content/galleries";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: PROCESSIONS_HUB.title,
  description: PROCESSIONS_HUB.desc,
  alternates: { canonical: "/processions" },
};

export default function ProcessionsPage() {
  return (
    <>
      <main className="mx-auto max-w-[1400px] px-4 pb-24 pt-14 sm:px-8 lg:px-10">
        <section className="mx-auto max-w-3xl px-2 pb-14 text-center">
          <h1 className="font-display text-4xl text-ink sm:text-5xl">{PROCESSIONS_HUB.title}</h1>
          <p className="mt-2 font-nav text-xs font-bold uppercase tracking-[0.16em] text-accent">
            {PROCESSIONS_HUB.subtitle}
          </p>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-ink-soft">
            {PROCESSIONS_HUB.desc}
          </p>
        </section>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {PROCESSIONS_HUB.cards.map((card) => (
            <Link key={card.slug} href={`/${card.slug}`} className="group block">
              <div className="aspect-[4/3] overflow-hidden rounded-sm">
                <img
                  src={`/assets/images/${card.coverThumb}`}
                  alt={card.coverAlt}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04]"
                />
              </div>
              <div className="pt-4">
                <h2 className="font-display text-xl leading-tight text-ink sm:text-2xl">
                  {card.title.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h2>
                <p className="mt-1 text-sm text-muted">{card.location}</p>
                <span className="mt-2 inline-flex items-center gap-1.5 font-nav text-xs font-bold uppercase tracking-[0.1em] text-ink transition-colors group-hover:text-accent">
                  Vai alla gallery
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" weight="bold" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer variant="standard" />
    </>
  );
}
