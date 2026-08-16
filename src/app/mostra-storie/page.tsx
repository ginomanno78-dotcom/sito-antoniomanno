import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { RevealOnView } from "@/components/motion/RevealOnView";
import { MasonryGrid } from "@/components/gallery/MasonryGrid";
import { getGalleryPhotos } from "@/lib/content/gallery-photos";

export const metadata: Metadata = {
  title: "Storie",
  alternates: { canonical: "/mostra-storie" },
};

const ITINERARIO = [
  "Mondragone dal 6 al 9 giugno 2019",
  "Sessa Aurunca dal 19 al 21 luglio 2019",
  "Capua gennaio 2020",
];

export default function MostraStoriePage() {
  const photos = getGalleryPhotos("mostre/mostra-storie", "Storie");

  return (
    <>
      <main className="mx-auto max-w-[1400px] px-4 pb-24 pt-14 sm:px-8 lg:px-10">
        <section className="mx-auto max-w-3xl px-2 pb-14 text-center">
          <h1 className="font-display text-4xl text-ink sm:text-5xl">Storie</h1>
          <p className="mt-2 font-nav text-xs font-bold uppercase tracking-[0.16em] text-accent">
            Mostre 2019 - 2020
          </p>
        </section>

        <RevealOnView className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <img
            src="/assets/images/mostre/mostra-storie/thumbs/017.webp"
            alt="Mostra Storie - fotografia 017"
            loading="lazy"
            decoding="async"
            className="w-full rounded-sm object-cover"
          />
          <div className="flex flex-col justify-center">
            <p className="text-[17px] leading-relaxed text-ink-soft">
              &quot;Storie&quot; all&apos;Art Garage di Pozzuoli dal 16 aprile al 3 maggio 2019
            </p>
            <h3 className="mt-6 font-display text-xl text-ink">Itinerario</h3>
            <ul className="mt-4 flex flex-col gap-2 border-l-2 border-line-strong pl-5 text-[15px] text-ink-soft">
              {ITINERARIO.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </RevealOnView>

        <RevealOnView delay={0.1} className="mx-auto mt-16 max-w-3xl border-t border-line pt-14 text-center">
          <h3 className="font-display text-2xl text-ink">Photogallery della mostra &quot;STORIE&quot;</h3>
          <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-soft">
            Una raccolta di 40 fotografie dedicate alla mostra &quot;Storie&quot;: frammenti di vita, attimi
            quotidiani e volti che raccontano esperienze autentiche. Ogni immagine nasce dal desiderio di osservare
            da vicino la dimensione umana dei luoghi e delle persone, trasformando scene apparentemente semplici in
            narrazioni visive cariche di memoria, identita ed emozione.
          </p>
        </RevealOnView>

        <div className="mt-12">
          <MasonryGrid photos={photos} />
        </div>
      </main>
      <Footer variant="standard" />
    </>
  );
}
