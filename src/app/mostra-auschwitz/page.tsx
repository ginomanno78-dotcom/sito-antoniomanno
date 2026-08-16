import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { RevealOnView } from "@/components/motion/RevealOnView";

export const metadata: Metadata = {
  title: "Auschwitz Reportage",
  alternates: { canonical: "/mostra-auschwitz" },
};

const ITINERARY = ["Carugate", "Terracina", "Cellole", "Pignataro Maggiore", "Sessa Aurunca", "Capua", "Caserta"];

export default function MostraAuschwitzPage() {
  return (
    <>
      <main className="mx-auto max-w-[1400px] px-4 pb-24 pt-14 sm:px-8 lg:px-10">
        <section className="mx-auto max-w-3xl px-2 pb-14 text-center">
          <h1 className="font-display text-4xl text-ink sm:text-5xl">Auschwitz Reportage</h1>
          <p className="mt-2 font-nav text-xs font-bold uppercase tracking-[0.16em] text-accent">
            Mostra fotografica e memoria
          </p>
        </section>

        <RevealOnView className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Link href="/auschwitz" className="group block overflow-hidden rounded-sm">
            <img
              src="/assets/images/mostre/mostra-auschwitz/11.webp"
              alt="Vai alla galleria Auschwitz"
              loading="lazy"
              decoding="async"
              className="w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03]"
            />
          </Link>
          <div className="flex flex-col justify-center">
            <p className="text-[17px] leading-relaxed text-ink-soft">
              Il reportage di Auschwitz racconta luoghi e segni della memoria storica. Il progetto fotografico
              nasce per testimoniare e trasmettere alle nuove generazioni il valore del ricordo attraverso immagini
              essenziali e dirette.
            </p>
            <h3 className="mt-8 font-display text-xl text-ink">&quot;Viaggio nella Inenarrabilita di Auschwitz&quot;</h3>
            <ul className="mt-4 flex flex-col gap-2 border-l-2 border-line-strong pl-5 text-[15px] text-ink-soft">
              {ITINERARY.map((place) => (
                <li key={place}>{place}</li>
              ))}
            </ul>
          </div>
        </RevealOnView>
      </main>
      <Footer variant="standard" />
    </>
  );
}
