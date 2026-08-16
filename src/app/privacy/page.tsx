import type { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Informativa sulla privacy e sul trattamento dei dati personali — ph. Antonio Manno.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-14 sm:px-10">
        <article className="prose-privacy">
          <h1 className="font-display text-4xl text-ink">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted">Ultimo aggiornamento: luglio 2026</p>

          <p className="mt-8 text-[16px] leading-relaxed text-ink-soft">
            La presente informativa è resa ai sensi degli artt. 13 e 14 del Regolamento (UE) 2016/679 (GDPR) e
            descrive le modalità di trattamento dei dati personali degli utenti che visitano il sito{" "}
            <strong className="text-ink">antoniomanno.it</strong> e che utilizzano il modulo di contatto.
          </p>

          <H2>1. Titolare del trattamento</H2>
          <P>Il Titolare del trattamento è:</P>
          <Ul>
            <li>
              <strong className="text-ink">Antonio Manno</strong>
            </li>
            <li>
              Email: <A href="mailto:antoniomannoweb@gmail.com">antoniomannoweb@gmail.com</A>
            </li>
            <li>
              Telefono: <A href="tel:+393273229713">+39 327 322 9713</A>
            </li>
          </Ul>

          <H2>2. Dati personali trattati</H2>
          <P>Attraverso il modulo di contatto possono essere raccolti:</P>
          <Ul>
            <li>nome e cognome;</li>
            <li>indirizzo email;</li>
            <li>numero di telefono (facoltativo);</li>
            <li>contenuto del messaggio inviato;</li>
            <li>dato relativo al consenso privacy (checkbox).</li>
          </Ul>
          <P>
            Durante la navigazione possono inoltre essere trattati dati tecnici di connessione (ad esempio
            indirizzo IP, data/ora di accesso, tipo di browser) in forma aggregata o tramite servizi terzi
            utilizzati per il funzionamento del sito.
          </P>

          <H2>3. Finalità e base giuridica</H2>
          <P>I dati del modulo di contatto sono trattati per:</P>
          <Ul>
            <li>rispondere alle richieste inviate dall&rsquo;utente;</li>
            <li>ricontattare l&rsquo;utente via email e/o telefono, se i relativi dati sono stati forniti.</li>
          </Ul>
          <P>
            La base giuridica è il <strong className="text-ink">consenso</strong> dell&rsquo;interessato (art. 6,
            par. 1, lett. a GDPR), espresso tramite l&rsquo;apposita checkbox obbligatoria prima
            dell&rsquo;invio del modulo.
          </P>
          <P>
            Il consenso è libero e può essere revocato in qualsiasi momento, senza pregiudicare la liceità del
            trattamento basata sul consenso prestato prima della revoca.
          </P>

          <H2>4. Modalità del trattamento</H2>
          <P>
            I dati sono trattati con strumenti elettronici e misure organizzative adeguate a garantire sicurezza,
            riservatezza e integrità. Non vengono utilizzati per finalità di marketing automatizzato né per
            profilazione.
          </P>

          <H2>5. Destinatari dei dati</H2>
          <P>
            I dati possono essere comunicati a soggetti che forniscono servizi tecnici necessari al funzionamento
            del sito, in qualità di responsabili del trattamento o fornitori di servizi, tra cui:
          </P>
          <Ul>
            <li>
              <strong className="text-ink">Formspree</strong> &mdash; gestione dell&rsquo;invio dei messaggi del
              modulo di contatto;
            </li>
            <li>
              <strong className="text-ink">Vercel</strong> &mdash; hosting e distribuzione del sito;
            </li>
            <li>servizio di conteggio visite (API esterna) usato in forma aggregata sulla home page.</li>
          </Ul>
          <P>I dati non sono oggetto di diffusione pubblica.</P>

          <H2>6. Trasferimenti extra-UE</H2>
          <P>
            Alcuni fornitori tecnici possono trattare i dati anche fuori dallo Spazio Economico Europeo. In tali
            casi il trasferimento avviene nel rispetto del GDPR, mediante clausole contrattuali standard o altre
            garanzie previste dalla normativa vigente.
          </P>

          <H2>7. Periodo di conservazione</H2>
          <P>
            I dati raccolti tramite il modulo di contatto sono conservati per il tempo necessario a gestire la
            richiesta e, in ogni caso, non oltre <strong className="text-ink">12 mesi</strong> dall&rsquo;ultimo
            contatto utile, salvo obblighi di legge o esigenze di difesa in giudizio.
          </P>

          <H2>8. Natura del conferimento</H2>
          <P>
            Il conferimento di nome, email e messaggio è necessario per poter rispondere alla richiesta. Il
            telefono è facoltativo. Senza il consenso privacy non è possibile inviare il modulo.
          </P>

          <H2>9. Diritti dell&rsquo;interessato</H2>
          <P>
            L&rsquo;interessato può esercitare in qualsiasi momento i diritti previsti dagli artt. 15&ndash;22
            GDPR, tra cui: accesso, rettifica, cancellazione, limitazione, portabilità, opposizione e revoca del
            consenso.
          </P>
          <P>
            Le richieste possono essere inviate a{" "}
            <A href="mailto:antoniomannoweb@gmail.com">antoniomannoweb@gmail.com</A>.
          </P>
          <P>
            È inoltre possibile proporre reclamo all&rsquo;Autorità Garante per la protezione dei dati personali
            (
            <a
              href="https://www.garanteprivacy.it"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline decoration-line-strong underline-offset-2 hover:text-accent"
            >
              www.garanteprivacy.it
            </a>
            .
          </P>

          <H2>10. Cookie e strumenti di navigazione</H2>
          <P>
            Il sito utilizza principalmente strumenti tecnici necessari al funzionamento (ad esempio
            memorizzazione locale della sessione per il contatore visite). Non vengono utilizzati cookie di
            profilazione pubblicitaria.
          </P>

          <H2>11. Aggiornamenti</H2>
          <P>
            La presente informativa può essere aggiornata. La versione vigente è sempre disponibile su questa
            pagina.
          </P>
        </article>
      </main>
      <Footer variant="minimal" />
    </>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-10 font-display text-xl text-ink">{children}</h2>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">{children}</p>;
}
function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="mt-3 flex flex-col gap-1.5 pl-5 text-[16px] leading-relaxed text-ink-soft [list-style:disc]">{children}</ul>;
}
function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-ink underline decoration-line-strong underline-offset-2 hover:text-accent">
      {children}
    </a>
  );
}
