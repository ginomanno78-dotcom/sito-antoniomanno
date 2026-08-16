"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { StaggerGroup, StaggerItem } from "./motion/RevealOnView";
import { SectionTitle } from "./SectionTitle";

const MOSTRE = [
  {
    slug: "mostra-auschwitz",
    title: "Auschwitz Reportage",
    subtitle: "Mostra fotografica e memoria",
    cover: "/assets/images/mostre/mostra-auschwitz/fotomostra-auschwitz.webp",
  },
  {
    slug: "mostra-jazz",
    title: "Jazz Festival",
    subtitle: "Mostre e concerti",
    cover: "/assets/images/mostre/mostra-jazz/fotomostra-jazz.webp",
  },
  {
    slug: "mostra-storie",
    title: "Storie",
    subtitle: "Mostre 2019 - 2020",
    cover: "/assets/images/mostre/mostra-storie/fotomostra-storie.webp",
  },
] as const;

export function Mostre() {
  const [hovered, setHovered] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <section id="mostre" className="w-full text-white" style={{ backgroundColor: "#000" }}>
      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20 md:px-10 lg:py-32">
        <SectionTitle>Mostre</SectionTitle>
        <StaggerGroup className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:mt-16 lg:gap-8">
          {MOSTRE.map((m) => {
            const dimmed = !reduceMotion && hovered !== null && hovered !== m.slug;
            return (
              <StaggerItem key={m.slug}>
                <motion.div
                  animate={{ opacity: dimmed ? 0.5 : 1, filter: dimmed ? "saturate(0.6)" : "saturate(1)" }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  <Link
                    href={`/${m.slug}`}
                    onMouseEnter={() => setHovered(m.slug)}
                    onMouseLeave={() => setHovered(null)}
                    className="group relative block aspect-[4/5] overflow-hidden rounded-sm"
                  >
                    <motion.img
                      src={m.cover}
                      alt={m.title}
                      loading="lazy"
                      decoding="async"
                      whileHover={reduceMotion ? undefined : { scale: 1.06 }}
                      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute inset-0 size-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <h3 className="font-display text-xl text-white sm:text-2xl">{m.title}</h3>
                      <p className="mt-1 font-nav text-[11px] font-bold uppercase tracking-[0.14em] text-white/85">
                        {m.subtitle}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1.5 font-nav text-xs font-bold uppercase tracking-[0.1em] text-white/90">
                        Scopri
                        <ArrowUpRight
                          className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          weight="bold"
                        />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
