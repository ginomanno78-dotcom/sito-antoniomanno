"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

/**
 * Hero photo: per the migration's absolute rule, this image is never
 * recompressed, reformatted, or cropped by the framework. Plain <picture>/
 * <img> pointing straight at the original files in /public — no next/image.
 *
 * H1: dopo l'intro, fade + zoom-out da pieno schermo fino alla riga in alto a destra.
 * H2: zoom-in sotto l'H1.
 * Navbar: montata nel layout root (non qui).
 */
export function Hero() {
  const reduceMotion = useReducedMotion();
  const [avviaTitoli, setAvviaTitoli] = useState(false);

  /* Parte solo quando l'intro non copre più la pagina */
  useEffect(() => {
    function introFinita() {
      return document.documentElement.getAttribute("data-intro") !== "1";
    }

    if (introFinita()) {
      const t = window.setTimeout(() => setAvviaTitoli(true), 40);
      return () => window.clearTimeout(t);
    }

    const obs = new MutationObserver(() => {
      if (introFinita()) setAvviaTitoli(true);
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-intro"],
    });

    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="hero"
      aria-label="Hero"
      className={
        "relative w-full bg-ink " +
        "min-h-[70dvh] aspect-[3/4] sm:aspect-[4/5] sm:min-h-[65dvh] md:aspect-[16/10] md:min-h-0 " +
        "max-lg:landscape:aspect-auto max-lg:landscape:min-h-0 max-lg:landscape:h-[100dvh] max-lg:landscape:max-h-[100dvh] " +
        "lg:aspect-auto lg:h-[100dvh] lg:min-h-[100dvh]"
      }
    >
      {/* Overflow solo sull'immagine */}
      <div className="absolute inset-0 overflow-hidden">
        <picture>
          <source
            media="(max-width: 768px) and (orientation: portrait)"
            srcSet="/assets/images/hero-1280.webp"
          />
          <source
            media="(min-width: 769px) and (max-width: 1366px) and (orientation: portrait)"
            srcSet="/assets/images/hero-1280.webp"
          />
          <img
            src="/assets/images/hero-828.webp"
            srcSet="/assets/images/hero-828.webp 828w, /assets/images/hero-1280.webp 1280w, /assets/images/hero.webp 1920w"
            sizes="100vw"
            alt="Antonio Manno — ritratto fotografico"
            className={
              "absolute inset-0 size-full object-cover " +
              "object-[center_calc(50%+0.5cm)] " +
              /* Mobile portrait: volto al centro dello schermo */
              "max-md:portrait:object-[30%_67%] " +
              "max-lg:landscape:object-center lg:object-center"
            }
            decoding="async"
            fetchPriority="high"
          />
        </picture>
      </div>

      {/* Linea 1px bianca a sx: spezzi con ISO/F e TEMPO in verticale */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute font-nav"
        style={{
          top: "4.5rem",
          bottom: 0,
          left: "1.25rem",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 1,
            height: "3cm",
            backgroundColor: "#ffffff",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            color: "#ffffff",
            fontSize: 10,
            fontWeight: 400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            margin: "8px 0",
            flexShrink: 0,
            textShadow: "0 1px 6px rgba(0,0,0,0.75)",
            whiteSpace: "nowrap",
          }}
        >
          ISO 300 - F 4.0
        </span>
        <div
          style={{
            width: 1,
            flex: 1,
            minHeight: 24,
            backgroundColor: "#ffffff",
          }}
        />
        <span
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            color: "#ffffff",
            fontSize: 10,
            fontWeight: 400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            margin: "8px 0",
            flexShrink: 0,
            textShadow: "0 1px 6px rgba(0,0,0,0.75)",
            whiteSpace: "nowrap",
          }}
        >
          TEMPO 1/30
        </span>
        <div
          style={{
            width: 1,
            height: "1cm",
            backgroundColor: "#ffffff",
            flexShrink: 0,
          }}
        />
      </div>

      {/* Titoli: desktop in alto a dx; mobile portrait centrati (come allegato) */}
      <div
        className={
          "absolute z-10 flex flex-col " +
          "right-5 top-20 items-end text-right " +
          "sm:right-8 sm:top-24 md:right-12 md:top-28 lg:right-16 lg:top-32 " +
          "max-md:portrait:left-1/2 max-md:portrait:right-auto " +
          "max-md:portrait:top-[calc(50%+1cm)] max-md:portrait:-translate-x-1/2 max-md:portrait:-translate-y-1/2 " +
          "max-md:portrait:items-center max-md:portrait:text-center " +
          "max-md:portrait:sm:right-auto max-md:portrait:sm:top-[calc(50%+1cm)] " +
          /* h1 + h2: 3px più in basso */
          "pt-[3px]"
        }
      >
        <motion.h1
          className={
            "whitespace-nowrap font-nav font-light leading-none tracking-tight text-white " +
            /* Ombra leggera solo sotto h1 */
            "[text-shadow:0_3px_6px_rgba(0,0,0,0.55)] " +
            "text-[clamp(1.925rem,6.05vw,4.125rem)] sm:text-[3.3rem] md:text-[4.125rem] lg:text-[4.95rem] " +
            /* Solo mobile portrait: +5px (anche sopra sm entro i 768px) */
            "max-md:portrait:!text-[calc(clamp(1.925rem,6.05vw,4.125rem)+5px)] " +
            "max-md:portrait:sm:!text-[calc(3.3rem+5px)]"
          }
          initial={
            reduceMotion
              ? false
              : { opacity: 0, scale: 5.5, filter: "blur(8px)" }
          }
          animate={
            reduceMotion || !avviaTitoli
              ? reduceMotion
                ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                : { opacity: 0, scale: 5.5, filter: "blur(8px)" }
              : { opacity: 1, scale: 1, filter: "blur(0px)" }
          }
          transition={{
            duration: 1.45,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ transformOrigin: "center center" }}
        >
          Antonio Manno
        </motion.h1>

        {/* fade-up equivalente a data-aos="fade-up" data-aos-duration="3000" */}
        <motion.h2
          className="mt-1 font-nav text-[33px] font-bold lowercase tracking-[0.04em] text-black"

          initial={reduceMotion ? false : { opacity: 0, y: 36 }}
          animate={
            reduceMotion || !avviaTitoli
              ? reduceMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 36 }
              : { opacity: 1, y: 0 }
          }
          transition={{
            duration: 3,
            ease: [0.16, 1, 0.3, 1],
            delay: reduceMotion ? 0 : 0.25,
          }}
        >
          photography
        </motion.h2>
      </div>

      {/* CTA: desktop in basso a dx; mobile portrait centrata in basso */}
      <div
        className={
          "absolute inset-x-0 bottom-0 flex flex-col items-end " +
          "p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] " +
          "sm:p-8 md:p-10 " +
          "max-lg:landscape:p-4 max-lg:landscape:pb-[max(0.75rem,env(safe-area-inset-bottom))] " +
          "max-md:portrait:items-center " +
          "lg:bottom-16 lg:right-16 lg:left-auto lg:p-0"
        }
      >
        <Link
          href="/#portfolio"
          className={
            "inline-flex items-center rounded-full border-[3px] border-[#f63724] bg-white/20 font-nav font-bold lowercase tracking-[0.16em] text-white lg:!text-black " +
            /* Ombra solo a riposo (pre-hover / pre-focus) */
            "shadow-[0_10px_28px_rgba(0,0,0,0.45)] backdrop-blur-[2px] " +
            "transition-[color,background-color,border-color,box-shadow,transform] duration-200 " +
            "hover:border-[#f63724] hover:bg-[#f63724] hover:text-black hover:-translate-y-0.5 hover:shadow-none " +
            "focus-visible:shadow-none active:shadow-none " +
            "px-5 py-2.5 text-[15px] sm:px-6 sm:py-3 sm:text-[15px] " +
            "max-lg:landscape:px-4 max-lg:landscape:py-2 max-lg:landscape:text-[15px]"
          }
        >
          scopri il portfolio
        </Link>
      </div>
    </section>
  );
}
