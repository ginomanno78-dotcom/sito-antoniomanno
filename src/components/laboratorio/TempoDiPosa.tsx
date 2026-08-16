"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./TempoDiPosa.module.css";

const ASSET = "https://assets.codepen.io/9400490";

type DotLottieInst = {
  destroy?: () => void;
  play?: () => void;
  stop?: () => void;
};

type DotLottieCtor = new (opts: {
  autoplay: boolean;
  loop: boolean;
  mode: string;
  speed: number;
  canvas: HTMLCanvasElement;
  src: string;
}) => DotLottieInst;

type ShutterOption = {
  id: string;
  label: string;
  colorClass: string;
  img: string;
  lottie: string;
  audio: string;
};

const OPTIONS: ShutterOption[] = [
  {
    id: "1",
    label: "1s",
    colorClass: styles.color1,
    img: `${ASSET}/shutter_1.jpg`,
    lottie: `${ASSET}/shutter_1.lottie`,
    audio: `${ASSET}/shutter_1.mp3`,
  },
  {
    id: "0-5",
    label: "1/2",
    colorClass: styles.color2,
    img: `${ASSET}/${encodeURIComponent("shutter_1:2.jpg")}`,
    lottie: `${ASSET}/shutter_0.5.lottie`,
    audio: `${ASSET}/shutter_0.5.mp3`,
  },
  {
    id: "0-10",
    label: "1/10",
    colorClass: styles.color3,
    img: `${ASSET}/${encodeURIComponent("shutter_1:10.jpg")}`,
    lottie: `${ASSET}/shutter_0.10.lottie`,
    audio: `${ASSET}/shutter_0.10.mp3`,
  },
  {
    id: "0-100",
    label: "1/100",
    colorClass: styles.color4,
    img: `${ASSET}/${encodeURIComponent("shutter_1:100.jpg")}`,
    lottie: `${ASSET}/shutter_0.100.lottie`,
    audio: `${ASSET}/shutter_0.100.mp3`,
  },
  {
    id: "0-200",
    label: "1/200",
    colorClass: styles.color5,
    img: `${ASSET}/${encodeURIComponent("shutter_1:200.jpg")}`,
    lottie: `${ASSET}/shutter_0.200.lottie`,
    audio: `${ASSET}/shutter_0.200.mp3`,
  },
  {
    id: "0-400",
    label: "1/400",
    colorClass: styles.color6,
    img: `${ASSET}/${encodeURIComponent("shutter_1:400.jpg")}`,
    lottie: `${ASSET}/shutter_0.400.lottie`,
    audio: `${ASSET}/shutter_0.400.mp3`,
  },
];

/**
 * Modulo interattivo: Tempo di posa (seconda funzione Laboratorio).
 * Come il CodePen: un canvas Lottie per ogni tempo, show/hide + play allo scatto.
 */
export function TempoDiPosa() {
  const [selected, setSelected] = useState<string>("1");
  const [ready, setReady] = useState(false);
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const lottieRefs = useRef<Record<string, DotLottieInst | null>>({});

  useEffect(() => {
    let cancelled = false;

    async function loadDotLottie(): Promise<DotLottieCtor> {
      const w = window as Window & { __DotLottie?: DotLottieCtor };
      if (w.__DotLottie) return w.__DotLottie;

      await new Promise<void>((resolve, reject) => {
        const existing = document.getElementById("dotlottie-cdn");
        if (existing) {
          if (w.__DotLottie) {
            resolve();
            return;
          }
          window.addEventListener("dotlottie-ready", () => resolve(), { once: true });
          return;
        }
        const s = document.createElement("script");
        s.id = "dotlottie-cdn";
        s.type = "module";
        s.textContent = `
          import { DotLottie } from "https://esm.sh/@lottiefiles/dotlottie-web";
          window.__DotLottie = DotLottie;
          window.dispatchEvent(new Event("dotlottie-ready"));
        `;
        s.onerror = () => reject(new Error("DotLottie CDN"));
        window.addEventListener("dotlottie-ready", () => resolve(), { once: true });
        document.head.appendChild(s);
      });

      if (!w.__DotLottie) throw new Error("DotLottie non disponibile");
      return w.__DotLottie;
    }

    async function init() {
      try {
        const DotLottie = await loadDotLottie();
        if (cancelled) return;

        for (const opt of OPTIONS) {
          const canvas = canvasRefs.current[opt.id];
          if (!canvas) continue;
          lottieRefs.current[opt.id]?.destroy?.();
          lottieRefs.current[opt.id] = new DotLottie({
            autoplay: false,
            loop: false,
            mode: "forward",
            speed: 1,
            canvas,
            src: opt.lottie,
          });
        }

        if (cancelled) return;
        setReady(true);
        /* Avvio: mostra subito l’obiettivo del primo tempo (come apertura a sx) */
        lottieRefs.current["1"]?.play?.();
      } catch {
        /* Immagini/audio restano usabili anche senza Lottie */
        if (!cancelled) setReady(true);
      }
    }

    void init();

    return () => {
      cancelled = true;
      Object.values(lottieRefs.current).forEach((inst) => inst?.destroy?.());
      lottieRefs.current = {};
    };
  }, []);

  function stopAllAudio() {
    Object.values(audioRefs.current).forEach((a) => {
      if (!a) return;
      a.pause();
      a.currentTime = 0;
    });
  }

  function onSelect(opt: ShutterOption) {
    setSelected(opt.id);
    stopAllAudio();
    const audio = audioRefs.current[opt.id];
    if (audio) {
      void audio.play().catch(() => {});
    }
    const inst = lottieRefs.current[opt.id];
    inst?.stop?.();
    inst?.play?.();
  }

  return (
    <div className={styles.root}>
      <div className={styles.mainContainer}>
        <h3 className={styles.title}>Tempo di posa</h3>
        <p className={styles.lead}>
          Nella fotografia digitale, il tempo di posa controlla per quanto tempo
          il sensore della fotocamera è esposto alla luce, e questa durata
          influisce direttamente su come viene catturato il movimento. Tempi di
          posa rapidi (tipicamente tra 1/500s e 1/1000s) congelano l&apos;azione,
          producendo immagini nitide e senza mosso di soggetti in movimento
          veloce, come nello sport o nella fauna. Al contrario, tempi di posa
          lenti (tipicamente 1/30s o più lunghi) creano mosso, che può essere
          usato in modo artistico per trasmettere il movimento.
        </p>

        <div className={styles.imgContainer}>
          <div className={styles.mediaCol}>
            <p className={styles.exampleLabel}>Immagine di esempio</p>
            <div className={styles.exampleImgContainer}>
              {OPTIONS.map((opt) => (
                <img
                  key={opt.id}
                  className={
                    styles.exampleImg +
                    (selected === opt.id ? " " + styles.exampleImgVisible : "")
                  }
                  alt="immagine che dimostra il mosso da tempo di posa"
                  src={opt.img}
                  decoding="async"
                />
              ))}
            </div>
          </div>

          <div className={styles.mediaCol + " " + styles.mediaColLens}>
            <p className={styles.exampleLabel}>Tempo di posa</p>
            <div
              className={styles.shutterLottieContainer}
              data-lottie-ready={ready ? "1" : "0"}
            >
              {OPTIONS.map((opt) => (
                <canvas
                  key={opt.id}
                  ref={(el) => {
                    canvasRefs.current[opt.id] = el;
                  }}
                  className={
                    styles.lottieCanvas +
                    (selected === opt.id ? " " + styles.lottieCanvasVisible : "")
                  }
                  width={260}
                  height={260}
                  aria-hidden={selected !== opt.id}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.optionContainer}>
          <p className={styles.optionLabel}>Valore del tempo di posa in secondi</p>
          <form
            className={styles.shutterOptionContainer}
            onSubmit={(e) => e.preventDefault()}
          >
            {OPTIONS.map((opt) => (
              <label key={opt.id} className={styles.shutterOption}>
                <input
                  type="radio"
                  name="shutter-option"
                  checked={selected === opt.id}
                  onChange={() => {}}
                  onClick={() => onSelect(opt)}
                />
                <span className={styles.shutterToggle + " " + opt.colorClass}>
                  {opt.label}
                </span>
                <audio
                  ref={(el) => {
                    audioRefs.current[opt.id] = el;
                  }}
                  preload="auto"
                >
                  <source src={opt.audio} type="audio/mpeg" />
                </audio>
              </label>
            ))}
          </form>
          <div className={styles.gradientLine} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
