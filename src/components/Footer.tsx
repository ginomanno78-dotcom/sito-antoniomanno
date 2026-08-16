import Link from "next/link";
import { EnvelopeSimple, Phone } from "@phosphor-icons/react/dist/ssr";
import { CONTACT, ANALYTICS } from "@/lib/content/site";
import { VisitCounter } from "./VisitCounter";

type FooterVariant = "home" | "standard" | "minimal";

export function Footer({ variant }: { variant: FooterVariant }) {
  return (
    <footer
      className="border-t border-white/15 px-6 py-10 text-center text-sm text-white/55 sm:px-10"
      style={{ backgroundColor: "#000" }}
    >
      {variant === "standard" && (
        <div className="mx-auto mb-6 max-w-lg">
          <p className="mb-3 font-nav text-xs font-bold uppercase tracking-[0.16em] text-white">
            Contatti
          </p>
          <p className="mb-1 text-white/70">Info:</p>
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-white/70">
            <span className="inline-flex items-center gap-2">
              <Phone className="size-[18px]" aria-hidden />
              <a href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`} className="transition-colors hover:text-[#f63724]">
                {CONTACT.phoneDisplay}
              </a>
            </span>
            <span aria-hidden>-</span>
            <span className="inline-flex items-center gap-2">
              <EnvelopeSimple className="size-[18px]" aria-hidden />
              <a href={`mailto:${CONTACT.email}`} className="transition-colors hover:text-[#f63724]">
                {CONTACT.email}
              </a>
            </span>
          </p>
        </div>
      )}

      {variant === "home" && <VisitCounter />}

      <p className="text-white/55">
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> - ph. antonio manno. Tutti i diritti
        sono riservati.
      </p>
      <p className="mt-2 flex items-center justify-center gap-4">
        <a
          href={`https://www.iubenda.com/privacy-policy/${ANALYTICS.iubendaPolicyId}`}
          className="transition-colors hover:text-[#f63724]"
        >
          Privacy Policy
        </a>
        <a
          href={`https://www.iubenda.com/privacy-policy/${ANALYTICS.iubendaPolicyId}/cookie-policy`}
          className="transition-colors hover:text-[#f63724]"
        >
          Cookie Policy
        </a>
      </p>
      {variant === "minimal" && (
        <p className="mt-4">
          <Link href="/#contatti" className="transition-colors hover:text-[#f63724]">
            &larr; Torna ai Contatti
          </Link>
        </p>
      )}
    </footer>
  );
}
