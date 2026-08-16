"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle, EnvelopeSimple, Phone, WarningCircle } from "@phosphor-icons/react";
import { CONTACT, ANALYTICS } from "@/lib/content/site";
import { RevealOnView } from "./motion/RevealOnView";
import { SectionTitle } from "./SectionTitle";

type Status = "idle" | "sending" | "success" | "error";

export function Contatti() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contatti" className="w-full text-white" style={{ backgroundColor: "#000" }}>
      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20 md:px-10 lg:py-32">
        <SectionTitle>Contatti</SectionTitle>
        <div className="mt-8 grid gap-10 sm:mt-10 sm:gap-14 lg:mt-16 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <RevealOnView>
            {status === "success" ? (
              <div
                role="status"
                aria-live="polite"
                className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/[0.04] p-6"
              >
                <CheckCircle className="mt-0.5 size-6 shrink-0 text-[#f63724]" weight="fill" />
                <p className="text-[15px] leading-relaxed text-white/70">
                  Grazie! Il tuo messaggio è stato inviato con successo. Ti risponderemo entro 48 ore.
                </p>
              </div>
            ) : (
              <form
                action="https://formspree.io/f/mgojyloa"
                method="POST"
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
              >
                <Field label="Nome*" htmlFor="contatti-nome">
                  <input
                    type="text"
                    id="contatti-nome"
                    name="nome"
                    required
                    placeholder="Il tuo nome"
                    className={inputClass}
                  />
                </Field>
                <Field label="Email*" htmlFor="contatti-email">
                  <input
                    type="email"
                    id="contatti-email"
                    name="email"
                    required
                    placeholder="la-tua@email.it"
                    className={inputClass}
                  />
                </Field>
                <Field label="Telefono" htmlFor="contatti-tel">
                  <input type="tel" id="contatti-tel" name="tel" placeholder="Num." className={inputClass} />
                </Field>
                <Field label="Messaggio*" htmlFor="contatti-messaggio">
                  <textarea
                    id="contatti-messaggio"
                    name="messaggio"
                    required
                    placeholder="Scrivi il tuo messaggio..."
                    rows={5}
                    className={inputClass + " resize-y"}
                  />
                </Field>

                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="contatti-privacy"
                    name="privacy_consent"
                    value="si"
                    required
                    className="mt-1 size-4 shrink-0 accent-[#f63724]"
                  />
                  <label htmlFor="contatti-privacy" className="text-[13px] leading-relaxed text-white/55">
                    Dichiaro di aver preso visione della{" "}
                    <a
                      href={`https://www.iubenda.com/privacy-policy/${ANALYTICS.iubendaPolicyId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-white/30 underline-offset-2 hover:text-[#f63724]"
                    >
                      privacy policy
                    </a>{" "}
                    e acconsento al trattamento dei miei dati personali al fine di venire ricontattato.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="mt-2 inline-flex w-fit items-center rounded-full border border-white/70 bg-transparent px-7 py-3 font-nav text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:border-[#f63724] hover:bg-[#f63724] hover:text-black disabled:opacity-60"
                >
                  {status === "sending" ? "Invio in corso…" : "Invia messaggio"}
                </button>

                {status === "error" && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="flex items-start gap-3 rounded-xl border border-[#f63724]/40 bg-[#f63724]/10 p-4"
                  >
                    <WarningCircle className="mt-0.5 size-5 shrink-0 text-[#f63724]" weight="fill" />
                    <p className="text-[14px] leading-relaxed text-white/70">
                      Si è verificato un problema e il messaggio non è stato inviato. Riprova tra qualche istante o
                      contattaci via email.
                    </p>
                  </div>
                )}
              </form>
            )}
          </RevealOnView>

          <RevealOnView delay={0.1}>
            <h3 className="font-nav text-xs font-bold uppercase tracking-[0.16em] text-white">Info:</h3>
            <div className="mt-5 flex flex-col gap-4">
              <p className="flex items-center gap-3 text-[15px]">
                <span className="font-nav text-xs font-bold uppercase tracking-[0.08em] text-white/45">Tel</span>
                <span className="inline-flex items-center gap-2 text-white/70">
                  <Phone className="size-[18px]" aria-hidden />
                  <a
                    href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`}
                    className="transition-colors hover:text-[#f63724]"
                  >
                    {CONTACT.phoneDisplay}
                  </a>
                </span>
              </p>
              <p className="flex items-center gap-3 text-[15px]">
                <span className="font-nav text-xs font-bold uppercase tracking-[0.08em] text-white/45">Email</span>
                <span className="inline-flex items-center gap-2 text-white/70">
                  <EnvelopeSimple className="size-[18px]" aria-hidden />
                  <a href={`mailto:${CONTACT.email}`} className="transition-colors hover:text-[#f63724]">
                    {CONTACT.email}
                  </a>
                </span>
              </p>
            </div>
          </RevealOnView>
        </div>
      </div>
    </section>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/20 bg-white/[0.04] px-4 py-3 text-[15px] text-white placeholder:text-white/35 transition-colors focus:border-[#f63724] focus:outline-none";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="font-nav text-xs font-bold uppercase tracking-[0.08em] text-white/70">
        {label}
      </label>
      {children}
    </div>
  );
}
