import Link from "next/link";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <main className="flex min-h-[70dvh] flex-col items-center justify-center px-6 text-center">
        <p className="font-nav text-xs font-bold uppercase tracking-[0.2em] text-accent">Errore 404</p>
        <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl">Pagina non trovata</h1>
        <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ink-soft">
          La pagina che cerchi non esiste o è stata spostata. Torna alla home per esplorare il portfolio.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center rounded-full bg-ink px-7 py-3 font-nav text-xs font-bold uppercase tracking-[0.14em] text-paper transition-colors duration-200 hover:bg-accent hover:text-ink"
        >
          Torna alla home
        </Link>
      </main>
      <Footer variant="standard" />
    </>
  );
}
