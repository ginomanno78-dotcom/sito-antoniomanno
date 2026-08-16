"use client";

import { useEffect, useRef, useState } from "react";
import { playIntroFocus, preloadIntroFocus } from "@/lib/ui-sounds";
import styles from "./Intro.module.css";

/** Durata totale intro (~3s) prima di smontare l'overlay */
const DURATA_MS = 3100;

/** Una sola intro per scheda/sessione browser (non su F5 ripetuti) */
const SESSION_KEY = "antoniomanno_intro_seen";

type IntroProps = {
  /** Chiamato quando l'animazione è finita o saltata */
  onComplete?: () => void;
};

/**
 * Intro obiettivo: diaframma → anelli → nome → zoom out.
 * Solo home: overlay sopra il contenuto già montato (caricamento in parallelo).
 */
export function Intro({ onComplete }: IntroProps) {
  /* null = check sessionStorage non ancora fatto (evita flash su refresh) */
  const [visibile, setVisibile] = useState<boolean | null>(null);
  const antonioRef = useRef<HTMLSpanElement>(null);
  const mannoRef = useRef<HTMLSpanElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  function togliCoperturaPrepaint() {
    document.documentElement.removeAttribute("data-intro");
  }

  function chiudi() {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* storage pieno o privato: chiudiamo comunque */
    }
    togliCoperturaPrepaint();
    setVisibile(false);
    onCompleteRef.current?.();
  }

  /* Decide se mostrare: sessione nuova, oppure ?intro / ?intro=1 (forza replay) */
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const forzaIntro = params.has("intro");
      if (forzaIntro) {
        sessionStorage.removeItem(SESSION_KEY);
        setVisibile(true);
        return;
      }
      const mostra = sessionStorage.getItem(SESSION_KEY) !== "1";
      setVisibile(mostra);
      if (!mostra) togliCoperturaPrepaint();
    } catch {
      setVisibile(true);
    }
  }, []);

  /* Allinea la larghezza di "manno" a quella di "antonio" */
  useEffect(() => {
    if (visibile !== true) return;

    const antonio = antonioRef.current;
    const manno = mannoRef.current;
    if (!antonio || !manno) return;

    function allinea() {
      if (!antonio || !manno) return;
      manno.style.fontSize = "";
      const target = antonio.getBoundingClientRect().width;
      let basso = 8;
      let alto = 160;
      for (let i = 0; i < 24; i++) {
        const mezzo = (basso + alto) / 2;
        manno.style.fontSize = mezzo + "px";
        if (manno.getBoundingClientRect().width < target) {
          basso = mezzo;
        } else {
          alto = mezzo;
        }
      }
      manno.style.fontSize = alto + "px";
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(allinea);
    } else {
      allinea();
    }
  }, [visibile]);

  /* Tentativo autoplay 0,5s dopo lo start del diaframma */
  useEffect(() => {
    if (visibile !== true) return;
    void preloadIntroFocus();
    const id = window.setTimeout(() => {
      void playIntroFocus();
    }, 500);
    return () => window.clearTimeout(id);
  }, [visibile]);

  /* Smonta l'overlay a fine animazione */
  useEffect(() => {
    if (visibile !== true) return;
    const id = window.setTimeout(() => chiudi(), DURATA_MS);
    return () => window.clearTimeout(id);
  }, [visibile]);

  if (visibile !== true) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-label="Introduzione al sito">
      <div className={styles.sfondoIris} aria-hidden="true">
        {/* Grigio a tutto schermo per tutta la durata */}
        <div className={styles.irisGrigio} />
        {/* Buco nero esagonale regolare che si allarga */}
        <div className={styles.iris} />
      </div>

      <div className={styles.intro} aria-hidden="true">
        <ul className={styles.diaframma}>
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
        </ul>

        <svg
          className={styles.anelli}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 340 340"
        >
          <defs>
            <path
              id="intro-path-testo"
              d="M170,38 a132,132 0 1,1 0,264 a132,132 0 1,1 0,-264"
            />
            <radialGradient id="intro-vetro" cx="46%" cy="38%" r="62%">
              <stop offset="0%" stopColor="#14181f" />
              <stop offset="42%" stopColor="#07080a" />
              <stop offset="70%" stopColor="#0c1018" />
              <stop offset="86%" stopColor="#2a3a32" />
              <stop offset="100%" stopColor="#101214" />
            </radialGradient>
          </defs>

          <g className={`${styles.barrel} ${styles.barrel1}`}>
            <g className={styles.spinLento}>
              <circle cx="170" cy="170" r="168" fill="none" stroke="#2a2a2a" strokeWidth="14" />
              <circle
                cx="170"
                cy="170"
                r="168"
                fill="none"
                stroke="#8a8a8a"
                strokeWidth="8"
                strokeDasharray="1.2 3.4"
              />
            </g>
          </g>

          <g className={`${styles.barrel} ${styles.barrel2}`}>
            <g className={styles.spinLento}>
              <circle cx="170" cy="170" r="148" fill="none" stroke="#111" strokeWidth="22" />
              <circle cx="170" cy="170" r="137" fill="none" stroke="#3a3a3a" strokeWidth="1.2" />
              <circle cx="170" cy="170" r="159" fill="none" stroke="#555" strokeWidth="1" />

              <text className={styles.dicitura}>
                <textPath href="#intro-path-testo" startOffset="0%" textAnchor="middle">
                  ANTONIO MANNO
                </textPath>
              </text>
              <text className={styles.dicituraSmall}>
                <textPath href="#intro-path-testo" startOffset="22%" textAnchor="middle">
                  50mm
                </textPath>
              </text>
              <text className={styles.dicitura}>
                <textPath href="#intro-path-testo" startOffset="50%" textAnchor="middle">
                  PHOTOGRAPHY · ITALY
                </textPath>
              </text>
              <text className={styles.dicituraSmall}>
                <textPath href="#intro-path-testo" startOffset="78%" textAnchor="middle">
                  f/1.4
                </textPath>
              </text>
            </g>
          </g>

          <g className={`${styles.barrel} ${styles.barrel3}`}>
            <g className={`${styles.spin} ${styles.spin2}`}>
              <circle cx="170" cy="170" r="118" fill="none" stroke="#cfcfcf" strokeWidth="2.2" />
              <circle cx="170" cy="170" r="108" fill="none" stroke="#666" strokeWidth="1.4" />
            </g>
          </g>

          <g className={`${styles.barrel} ${styles.barrel4}`}>
            <circle cx="170" cy="170" r="96" fill="url(#intro-vetro)" />
            <g className={`${styles.spin} ${styles.spin3}`}>
              <circle cx="170" cy="170" r="96" fill="none" stroke="#9aa39a" strokeWidth="1.6" />
              <circle
                cx="170"
                cy="170"
                r="88"
                fill="none"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1"
              />
            </g>
            <ellipse cx="148" cy="138" rx="28" ry="16" fill="rgba(255,255,255,0.08)" />
          </g>
        </svg>

        <p className={styles.nome}>
          <span ref={antonioRef} className={styles.riga}>
            antonio
          </span>
          <span ref={mannoRef} className={styles.riga}>
            manno
          </span>
        </p>
      </div>

      <button type="button" className={styles.salta} onClick={chiudi}>
        Salta
      </button>
    </div>
  );
}
