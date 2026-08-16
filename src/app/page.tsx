import type { Metadata } from "next";
import { Intro } from "@/components/Intro";
import { Hero } from "@/components/Hero";
import { Biografia } from "@/components/Biografia";
import { Portfolio } from "@/components/Portfolio";
import { Mostre } from "@/components/Mostre";
import { Laboratorio } from "@/components/Laboratorio";
import { Contatti } from "@/components/Contatti";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Antonio Manno - photography",
  description:
    "Antonio Manno — fotografo professionista. Portfolio di jazz, ritratti, street photography, paesaggi e reportage. Sparanise, Caserta.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* Overlay solo home; main/footer montano subito (caricamento in parallelo) */}
      <Intro />
      <main>
        <Hero />
        <Biografia />
        <Portfolio />
        <Mostre />
        <Laboratorio />
        <Contatti />
      </main>
      <Footer variant="home" />
    </>
  );
}
