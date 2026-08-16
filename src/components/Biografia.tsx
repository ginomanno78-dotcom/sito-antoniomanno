"use client";

import { RevealOnView, StaggerGroup, StaggerItem } from "./motion/RevealOnView";
import { SectionTitle } from "./SectionTitle";
import { playCameraFocus } from "@/lib/ui-sounds";
import styles from "./Biografia.module.css";

const CHAPTERS = [
  {
    years: "1985 - 1992",
    title: "Dal Mare al Jazz",
    paragraphs: [
      "Dal 1985 al 1992 ho vissuto e lavorato a La Spezia, dove ho immortalato i borghi delle Cinque Terre e le persone che li abitavano. Negli anni seguenti ho realizzato diversi progetti sulla vita di mare, fino al 1999: l'anno in cui la fotografia jazz è entrata prepotentemente nella mia vita.",
    ],
    image: "/assets/images/biografia/dal-mare-al-jazz.png",
    imageAlt: "Porto mediterraneo all'alba, fotografia a colori",
  },
  {
    years: "2000 - 2015",
    title: "Quindici Anni di Jazz",
    paragraphs: [
      "L'incontro con il jazz è stato un crescendo continuo di emozioni visive, una sinestesia perfetta tra musica e immagine. Dal 2000 al 2015 sono stato fotografo ufficiale del Teano Jazz Festival, dove ho ritratto il mio primo musicista: Bill Frisell.",
      "In quegli anni ho catturato l'essenza di grandi artisti come Dave Holland, Paolo Fresu, Enrico Rava, Ron Carter, Chris Potter, Carla Bley, Stefano Bollani, Fabrizio Bosso, fino ai Buena Vista Social Club e Marcus Miller.",
    ],
    image: "/assets/images/biografia/quindici-anni-jazz.png",
    imageAlt: "Ritratto di musicista jazz con bacchette, fotografia in bianco e nero",
  },
  {
    years: "2007 - 2008",
    title: "Il Dovere della Memoria",
    paragraphs: [
      "Nel 2007 e 2008 ho realizzato un reportage fotografico ad Auschwitz. Da febbraio 2008 porto questo lavoro nelle scuole di ogni ordine e grado, trasformando il dolore di quei luoghi in testimonianza visiva per le nuove generazioni.",
    ],
    image: "/assets/images/biografia/dovere-memoria.png",
    imageAlt: "Paletto e filo spinato, fotografia in bianco e nero",
  },
  {
    years: "Oggi",
    title: "La Mia Fotografia Oggi",
    paragraphs: [
      "Il bianco e nero rimane la mia più grande passione. Cerco la mia fotografia tra la gente dei piccoli borghi, tra i viaggiatori dei treni, nelle processioni che sanno di sacro e di antico, nei mercati dove il diverso si annulla nelle voci e nei sorrisi.",
      "Ho costruito il mio stile attraverso la lezione dei Grandi Maestri, arrivando a una visione personale del mondo basata sul contrasto tra luci e ombre nella street photography dei \"grandi fotografi\" del passato.",
    ],
    image: "/assets/images/biografia/fotografia-oggi.png",
    imageAlt: "Uomo in abito ecclesiastico con libro davanti a un muro inciso, fotografia in bianco e nero",
  },
];

const COLLABORAZIONI = [
  {
    years: "2003 - 2004",
    text: 'Fotografa per la rivista "Jazzit" in occasione della rassegna "Umbria Jazz Winter", tra i festival jazz più prestigiosi d\'Italia.',
  },
  {
    years: "2004 - 2005",
    text: "Fotografo ufficiale del Campobasso Jazz Festival.",
  },
  {
    years: "2006",
    text: 'Repubblica.it ha dedicato spazio a tre sue gallery, "viaggi in treno" "ritratti della gente del suo paese" e una selezione di foto di "jazz".',
    links: [
      {
        label: "Gallery Jazz",
        href: "http://www.repubblica.it/2006/08/gallerie/spettacoliecultura/antonio-manno/1.html?ref=search",
      },
      {
        label: "Gallery Ritratti",
        href: "http://www.repubblica.it/2006/08/gallerie/spettacoliecultura/volti-fotografo/1.html?ref=search",
      },
      {
        label: "Gallery Viaggi in Treno",
        href: "http://www.repubblica.it/2006/08/gallerie/spettacoliecultura/viaggio-treno/1.html",
      },
    ],
  },
  {
    years: "2008",
    text: "Il riconoscimento internazionale è stato quando il Tokyo Jazz Festival ha pubblicato tre fotografie di Ron Carter nella brochure ufficiale del festival.",
  },
];

export function Biografia() {
  return (
    <section id="biografia" className="w-full text-white" style={{ backgroundColor: "#000" }}>
      <div className="mx-auto max-w-[1400px] px-5 pt-8 pb-16 sm:px-8 sm:pt-10 sm:pb-20 md:px-10 lg:pt-12 lg:pb-28">
        <SectionTitle>Biografia</SectionTitle>

        {/* Obiettivo a sx + testo a dx (stessa riga da tablet in su) */}
        <RevealOnView className="mt-8 flex flex-col items-center gap-6 md:mt-10 md:flex-row md:items-center md:gap-10">
          <div
            className={styles.apertureOuter}
            onMouseEnter={() => {
              playCameraFocus();
            }}
          >
            <div className={styles.apertureWrap}>
              <img
                className={styles.aperturePhoto}
                src="/assets/images/foto-profilo.webp"
                alt="Antonio Manno mentre scatta con la fotocamera"
                loading="lazy"
                decoding="async"
              />
              <div className={styles.aperture} aria-hidden="true">
                <div className={styles.diaph} />
                <div className={styles.diaph} />
                <div className={styles.diaph} />
                <div className={styles.diaph} />
                <div className={styles.diaph} />
                <div className={styles.diaph} />
              </div>
            </div>
          </div>
          <div className={styles.introText}>
            <h3 className={styles.introHeading}>L&apos;Uomo Dietro L&apos;Obiettivo</h3>
            <p className={styles.introCopy}>
              La passione per la fotografia ha accompagnato la mia vita da sempre, nata dalla curiosità che ha
              sempre contraddistinto il mio sguardo sul mondo.
            </p>
            <blockquote className={styles.introQuote}>
              &ldquo;Se sapessi come si fa una buona fotografia, la farei sempre.&rdquo;
              <span className={styles.quoteFooter}>Robert Doisneau</span>
            </blockquote>
          </div>
        </RevealOnView>

        {/* 4 card: foto in alto, testo sotto — in riga su desktop, stack su mobile */}
        <StaggerGroup className={styles.cards}>
          {CHAPTERS.map((chapter) => (
            <StaggerItem key={chapter.title} className={styles.cardSlot}>
              <article className={styles.chapterCard}>
                <div className={styles.chapterMedia}>
                  {chapter.image ? (
                    <img
                      src={chapter.image}
                      alt={chapter.imageAlt ?? chapter.title}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                </div>
                <div className={styles.chapterBody}>
                  <h3>{chapter.title}</h3>
                  <h4>{chapter.years}</h4>
                  {chapter.paragraphs.map((p, i) => (
                    <p key={i} className={styles.text}>
                      {p}
                    </p>
                  ))}
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* Collaborazioni: bordo a tutta larghezza, contenuto invariato */}
        <RevealOnView className="relative left-1/2 mt-14 w-screen -translate-x-1/2 overflow-hidden border border-white/15 sm:mt-20 lg:mt-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.30]"
            style={{ backgroundImage: 'url("/assets/images/photo-jazz/full/01.webp")' }}
          />
          <div className="relative mx-auto max-w-[1400px] px-5 py-5 sm:px-8 sm:py-8 md:px-10 md:py-12">
            <h4 className="font-body text-[15.94px] font-bold uppercase tracking-[0.18em] text-white">
              Collaborazioni di Rilievo
            </h4>
            <ul className="mt-5 flex flex-col gap-5 sm:mt-6 sm:gap-6">
              {COLLABORAZIONI.map((item) => (
                <li key={item.years} className="grid gap-1 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-x-3">
                  <span className="font-nav text-[14.4px] font-bold uppercase tracking-[0.1em] text-[#f63724] tabular-nums leading-relaxed">
                    {item.years}
                  </span>
                  <div>
                    <p className="text-[16.8px] leading-relaxed text-white/70 sm:text-[18px]">{item.text}</p>
                    {item.links && (
                      <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                        {item.links.map((l) => (
                          <a
                            key={l.href}
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[13px] font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:text-[#f63724] hover:decoration-[#f63724]"
                          >
                            {l.label}
                          </a>
                        ))}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </RevealOnView>
      </div>
    </section>
  );
}
