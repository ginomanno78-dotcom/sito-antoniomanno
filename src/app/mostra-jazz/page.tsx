import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { RevealOnView } from "@/components/motion/RevealOnView";

export const metadata: Metadata = {
  title: "Jazz Festival",
  alternates: { canonical: "/mostra-jazz" },
};

const RASSEGNE = [
  "Teano Jazz Festival - luglio 2004",
  "Autumn Jazz Festival di Campobasso - ottobre 2004 e 2005",
  "Jazz Flirt festival di Formia (Lt) - agosto 2005",
  'Jazz club "La Palma" di Roma - marzo/aprile 2006',
  'Art-Cafe "Za drzwiami" di Katowice (Poland) settembre 2007',
];

export default function MostraJazzPage() {
  return (
    <>
      <main className="mx-auto max-w-[1400px] px-4 pb-24 pt-14 sm:px-8 lg:px-10">
        <section className="mx-auto max-w-3xl px-2 pb-14 text-center">
          <h1 className="font-display text-4xl text-ink sm:text-5xl">Jazz</h1>
          <p className="mt-2 font-nav text-xs font-bold uppercase tracking-[0.16em] text-accent">
            Mostre e concerti
          </p>
        </section>

        <RevealOnView className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Link href="/jazz" className="group block overflow-hidden rounded-sm">
            <img
              src="/assets/images/mostre/mostra-jazz/02.webp"
              alt="Vai alla galleria Jazz"
              loading="lazy"
              decoding="async"
              className="w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03]"
            />
          </Link>
          <div className="flex flex-col justify-center">
            <p className="font-nav text-xs font-bold uppercase tracking-[0.14em] text-muted">
              Mostre fotografiche sul jazz:
            </p>
            <h3 className="mt-4 font-display text-xl text-ink">Rassegne</h3>
            <ul className="mt-4 flex flex-col gap-2 border-l-2 border-line-strong pl-5 text-[15px] text-ink-soft">
              {RASSEGNE.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </RevealOnView>

        <RevealOnView delay={0.1} className="mt-20 grid gap-10 border-t border-line pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <figure>
            <img
              src="/assets/images/mostre/mostra-jazz/articolo.webp"
              alt="Ritaglio articolo Katowice 2007"
              loading="lazy"
              decoding="async"
              className="w-full rounded-sm object-cover"
            />
          </figure>
          <div>
            <h3 className="font-display text-xl text-ink">Mostre</h3>
            <p className="mt-2 text-[15px] text-ink-soft">Katowice (PL) 2007 - Galleria Za Szyba</p>
            <h3 className="mt-6 font-display text-xl text-ink">Articolo Katowice 2007</h3>
            <p className="mt-2 font-nav text-sm italic text-ink-soft">&quot;Italiani in Slesia&quot;</p>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
              Buone notizie per gli amanti della cultura italiana. A Katowice ha iniziato a operare la filiale
              della Societa Dante Alighieri. Stanno organizzando mostre, concerti e spettacoli con artisti
              provenienti dalla penisola appenninica. Per ora possiamo vedere le fotografie di Antonio Manno nella
              galleria di Katowice Za Szyba.
            </p>
          </div>
        </RevealOnView>

        <RevealOnView delay={0.15} className="mx-auto mt-16 max-w-3xl">
          <p className="text-[16px] leading-relaxed text-ink-soft">
            A Katowice ha iniziato a operare la filiale della Societa Dante Alighieri che ha una lunga tradizione:
            e stata fondata nel 1889 con l&apos;obiettivo di promuovere la cultura e la lingua italiana. I suoi
            fondatori furono il poeta e premio Nobel Giosue Carducci. Nel corso della sua esistenza ha superato 400
            filiali. Katowice e la seconda, dopo Cracovia, citta in Polonia dove la Societa ha iniziato le sue
            attivita.
          </p>
          <figure className="my-8">
            <img
              src="/assets/images/mostre/mostra-jazz/Manno-Gazzetta2007.webp"
              alt="Ritaglio Gazzetta 2007"
              loading="lazy"
              decoding="async"
              className="mx-auto rounded-sm object-cover"
            />
          </figure>
          <p className="text-[16px] leading-relaxed text-ink-soft">
            L&apos;obiettivo della Societa e la lingua italiana, ma vogliamo anche promuovere la cultura italiana,
            aiutare a comprenderla. Per il giorno di San Silvestro la Societa ha portato a Katowice una mostra
            fotografica di Antonio Manno. A Katowice presenta fotografie in bianco e nero, dalle radici della luce
            allo sviluppo della loro vita spirituale interna.
          </p>
          <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
            Sotto la lente del fotografo sono finiti diversi bambini che guardano il mondo in modi diversi,
            giocano, a volte ridono. Fotografie, ritratti, paesaggi - tutto questo cattura la passione. E rimasto
            fotografo ufficiale del Teano Jazz Festival, ha visitato anche molti altri festival e concerti jazz.
            Ecco perche il suo obiettivo cattura anche jazzisti e musicisti di blues di fama mondiale.
          </p>
        </RevealOnView>
      </main>
      <Footer variant="standard" />
    </>
  );
}
