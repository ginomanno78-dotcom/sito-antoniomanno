"use client";

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GALLERIES } from "@/lib/content/galleries";
import { playRadioTick } from "@/lib/ui-sounds";
import styles from "./Navbar.module.css";

/* Ordine voci = menù Portfolio originale (antoniomanno.it) */
const PORTFOLIO_DROPDOWN = [
  { href: "/portraits", label: "Portraits" },
  { href: "/street", label: "Street" },
  { href: "/jazz", label: "Jazz" },
  { href: "/processions", label: "Processions" },
  { href: "/arti-mestieri", label: "Arti e mestieri" },
  { href: "/fulvio-vellone", label: "Fulvio Vellone" },
  { href: "/country-market", label: "Country market" },
  { href: "/giochi-di-paese", label: "Giochi di paese" },
  { href: "/windows", label: "Windows" },
  { href: "/urban", label: "Urban" },
  { href: "/train", label: "Train" },
  { href: "/auschwitz", label: "Auschwitz" },
  { href: "/colours", label: "Colours" },
  { href: "/landscapes", label: "Landscapes" },
] as const;

/* Sotto-menu Biografia: sezione dedicata tra Mostre e Contatti */
const BIOGRAFIA_DROPDOWN = [
  { href: "/#laboratorio", label: "Laboratorio" },
] as const;

const VOCI = [
  { href: "/#hero", label: "home" },
  {
    href: "/#biografia",
    label: "biografia",
    dropdown: true,
    items: BIOGRAFIA_DROPDOWN,
    compatto: true,
  },
  { href: "/#portfolio", label: "portfolio", dropdown: true, items: PORTFOLIO_DROPDOWN },
  { href: "/#mostre", label: "mostre" },
  { href: "/#contatti", label: "contatti" },
] as const;

const GALLERY_SLUGS = new Set(GALLERIES.map((g) => g.slug));

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890*#@/*!%&^";
const NUM_MAJOR = 5;
const MINOR_TRA = 4;
const TICK_TOTALE = (NUM_MAJOR - 1) * (MINOR_TRA + 1) + 1;
const LERP = 0.12;

/**
 * Navbar da prova-navbar.html: scramble hover + esposimetro + dropdown Biografia/Portfolio.
 * Montata una sola volta (layout) su tutte le pagine.
 */
export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "";
  const isGalleryDark =
    !isHome && GALLERY_SLUGS.has(pathname.replace(/^\//, "").split("/")[0] ?? "");

  const [menuAperto, setMenuAperto] = useState(false);
  /* true = logo/menu bianchi (sopra sezioni nere); false = neri (sopra hero / pagine chiare) */
  const [suSezioniNere, setSuSezioniNere] = useState(!isHome && isGalleryDark);
  /* Dropdown aperto via click (mobile / touch); desktop resta su :hover */
  const [dropdownAperto, setDropdownAperto] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navRightRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);
  const liveRefs = useRef<(HTMLSpanElement | null)[]>([]);

  /* Allinea scroll-padding all'altezza reale della barra */
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const sync = () =>
      document.documentElement.style.setProperty("--navbar-scroll-offset", `${el.offsetHeight}px`);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Colore logo/menu: home = observer hero; gallery scure = bianco; altre = nero */
  useEffect(() => {
    if (!isHome) {
      setSuSezioniNere(isGalleryDark);
      return;
    }

    const hero = document.getElementById("hero");
    if (!hero) {
      setSuSezioniNere(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        setSuSezioniNere(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        /* Quando la cima dell'hero supera ~altezza barra, passa al bianco */
        rootMargin: "-72px 0px 0px 0px",
      }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, [isHome, isGalleryDark]);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", menuAperto);
    return () => document.body.classList.remove("overflow-hidden");
  }, [menuAperto]);

  /* Arrivo da altre pagine con /#sezione: scroll dopo il mount */
  useEffect(() => {
    if (!isHome) return;
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    const t = window.setTimeout(() => {
      const el = document.getElementById(hash.slice(1));
      if (!el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(t);
  }, [isHome, pathname]);

  useEffect(() => {
    if (!dropdownAperto) return;
    function onDoc(e: MouseEvent) {
      const t = e.target as Node | null;
      if (t && menuRef.current?.contains(t)) return;
      setDropdownAperto(null);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [dropdownAperto]);

  /* Scramble lettere al passaggio del mouse (desktop) */
  useEffect(() => {
    let attivo: HTMLSpanElement | null = null;

    function ferma(live: HTMLSpanElement | null) {
      if (!live) return;
      const id = (live as HTMLSpanElement & { _scrambleId?: number })._scrambleId;
      if (id) {
        cancelAnimationFrame(id);
        (live as HTMLSpanElement & { _scrambleId?: number })._scrambleId = undefined;
      }
      live.textContent = live.dataset.testo ?? live.textContent;
      /* A riposo: niente arancione */
      live.classList.remove(styles.navLabelScramble);
    }

    function scramble(live: HTMLSpanElement) {
      const testo = live.dataset.testo ?? "";
      if (attivo && attivo !== live) ferma(attivo);
      attivo = live;

      /* Arancione solo durante il movimento */
      live.classList.add(styles.navLabelScramble);

      const durata = 550;
      const inizio = performance.now();
      let ultimoAggiornamento = 0;
      const prev = (live as HTMLSpanElement & { _scrambleId?: number })._scrambleId;
      if (prev) cancelAnimationFrame(prev);

      function tick(ora: number) {
        if (attivo !== live) return;
        const t = Math.min(1, (ora - inizio) / durata);
        if (ora - ultimoAggiornamento < 45 && t < 1) {
          (live as HTMLSpanElement & { _scrambleId?: number })._scrambleId =
            requestAnimationFrame(tick);
          return;
        }
        ultimoAggiornamento = ora;

        const rivelati = Math.floor(t * testo.length);
        let out = "";
        for (let i = 0; i < testo.length; i++) {
          if (testo[i] === " ") {
            out += " ";
          } else if (i < rivelati) {
            out += testo[i];
          } else {
            const c = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            out += testo[i] === testo[i].toLowerCase() ? c.toLowerCase() : c;
          }
        }
        live.textContent = out;

        if (t < 1) {
          (live as HTMLSpanElement & { _scrambleId?: number })._scrambleId =
            requestAnimationFrame(tick);
        } else {
          live.textContent = testo;
          (live as HTMLSpanElement & { _scrambleId?: number })._scrambleId = undefined;
          live.classList.remove(styles.navLabelScramble);
          if (attivo === live) attivo = null;
        }
      }

      (live as HTMLSpanElement & { _scrambleId?: number })._scrambleId =
        requestAnimationFrame(tick);
    }

    const links = menuRef.current?.querySelectorAll(":scope > li > a") ?? [];
    const handlers: Array<{ a: Element; fn: (e: Event) => void }> = [];

    links.forEach((a, i) => {
      const live = liveRefs.current[i];
      if (!live) return;
      live.dataset.testo = live.textContent ?? "";
      const fn = (e: Event) => {
        e.stopPropagation();
        playRadioTick();
        scramble(live);
      };
      a.addEventListener("mouseenter", fn);
      handlers.push({ a, fn });
    });

    return () => {
      handlers.forEach(({ a, fn }) => a.removeEventListener("mouseenter", fn));
      if (attivo) ferma(attivo);
    };
  }, []);

  /* Esposimetro: scala fissa + angolo con lerp */
  useEffect(() => {
    const track = trackRef.current;
    const needle = needleRef.current;
    const navRight = navRightRef.current;
    const menu = menuRef.current;
    if (!track || !needle || !navRight || !menu) return;

    let target = 0;
    let current = 0;
    let verticale = false;
    let portraitMobile = false;
    let raf = 0;

    function aggiornaOrientamento() {
      /* Verticale solo in portrait sotto i 1024px; in landscape resta orizzontale */
      verticale = window.matchMedia("(max-width: 1023px) and (orientation: portrait)").matches;
      portraitMobile = verticale;
    }

    function setNeedle(pos: number) {
      const p = Math.max(0, Math.min(1, pos));
      if (verticale) {
        needle!.style.left = "-2px";
        needle!.style.top = `${p * 100}%`;
        needle!.style.transform = "translateY(-50%)";
      } else {
        needle!.style.top = "-2px";
        needle!.style.left = `${p * 100}%`;
        needle!.style.transform = "translateX(-50%)";
      }
    }

    function posDaEvento(e: MouseEvent) {
      const rect = track!.getBoundingClientRect();
      if (verticale) {
        if (rect.height <= 0) return target;
        return (e.clientY - rect.top) / rect.height;
      }
      if (rect.width <= 0) return target;
      return (e.clientX - rect.left) / rect.width;
    }

    function onPointer(e: MouseEvent) {
      if (portraitMobile) return;
      target = Math.max(0, Math.min(1, posDaEvento(e)));
    }

    function aggiornaDaScroll() {
      if (!portraitMobile) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = max <= 0 ? 0 : Math.max(0, Math.min(1, window.scrollY / max));
    }

    function loop() {
      current += (target - current) * LERP;
      setNeedle(current);
      raf = requestAnimationFrame(loop);
    }

    navRight.addEventListener("mousemove", onPointer);
    menu.addEventListener("mousemove", onPointer);
    window.addEventListener("scroll", aggiornaDaScroll, { passive: true });
    window.addEventListener("resize", onResize);

    function onResize() {
      aggiornaOrientamento();
      aggiornaDaScroll();
      setNeedle(current);
    }

    aggiornaOrientamento();
    aggiornaDaScroll();
    setNeedle(current);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      navRight.removeEventListener("mousemove", onPointer);
      menu.removeEventListener("mousemove", onPointer);
      window.removeEventListener("scroll", aggiornaDaScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  function chiudiMenu() {
    setMenuAperto(false);
    setDropdownAperto(null);
  }

  /** Scroll preciso a #sezione (Next Link spesso non scrolla sugli hash in-page). */
  function scrollToHash(hash: string) {
    const id = hash.replace(/^#/, "");
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }

  function onHashNavClick(e: ReactMouseEvent<HTMLAnchorElement>, href: string) {
    chiudiMenu();
    const hashIdx = href.indexOf("#");
    if (hashIdx < 0) return;
    const hash = href.slice(hashIdx);
    if (hash.length < 2) return;

    /* Già in home: evita salto assente e scrolla subito */
    if (isHome && (href.startsWith("/#") || href.startsWith("#"))) {
      e.preventDefault();
      window.history.pushState(null, "", hash);
      /* Piccolo delay: lascia chiudere il menu mobile */
      window.setTimeout(() => scrollToHash(hash), menuAperto ? 320 : 0);
    }
  }

  function onTriggerDropdown(e: ReactMouseEvent<HTMLAnchorElement>, voceHref: string) {
    /* Come originale: sotto 1024px il click apre/chiude invece di navigare */
    if (typeof window !== "undefined" && window.innerWidth <= 1023) {
      e.preventDefault();
      setDropdownAperto((prev) => (prev === voceHref ? null : voceHref));
      return;
    }
    onHashNavClick(e, voceHref);
  }

  const tickMarks = Array.from({ length: TICK_TOTALE }, (_, i) => {
    const pct = (i / (TICK_TOTALE - 1)) * 100;
    const major = i % (MINOR_TRA + 1) === 0;
    return (
      <span
        key={i}
        className={
          styles.esposimetroTick +
          " " +
          (major ? styles.esposimetroTickMajor : styles.esposimetroTickMinor)
        }
        style={{ left: `${pct}%`, top: `${pct}%` }}
      />
    );
  });

  return (
    <header
      ref={headerRef}
      className={
        styles.navbar +
        " " +
        (suSezioniNere ? styles.navbarSuNero : styles.navbarSuHero)
      }
    >
      <Link className={styles.logo} href="/#hero" onClick={(e) => onHashNavClick(e, "/#hero")}>
        ph.antoniomanno
      </Link>

      <button
        type="button"
        className={
          styles.menuToggle + (menuAperto ? " " + styles.menuToggleOpen : "")
        }
        aria-label={menuAperto ? "Chiudi menu" : "Apri menu"}
        aria-expanded={menuAperto}
        onClick={() => setMenuAperto((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      <div ref={navRightRef} className={styles.navRight}>
        <ul
          ref={menuRef}
          className={styles.navMenu + (menuAperto ? " " + styles.navMenuOpen : "")}
        >
          {VOCI.map((voce, i) => {
            const isDropdown = "dropdown" in voce && voce.dropdown;

            if (isDropdown) {
              const aperto = dropdownAperto === voce.href;
              const compatto = "compatto" in voce && voce.compatto;
              return (
                <li
                  key={voce.href}
                  className={
                    styles.navItemDropdown +
                    (aperto ? " " + styles.dropdownOpen : "")
                  }
                  onMouseLeave={() => {
                    if (dropdownAperto === voce.href) setDropdownAperto(null);
                  }}
                >
                  <Link
                    href={voce.href}
                    aria-haspopup="true"
                    aria-expanded={aperto}
                    onClick={(e) => onTriggerDropdown(e, voce.href)}
                  >
                    <span className={styles.navLabel}>
                      <span className={styles.navLabelGhost} aria-hidden="true">
                        {voce.label}
                      </span>
                      <span
                        className={styles.navLabelLive}
                        ref={(el) => {
                          liveRefs.current[i] = el;
                        }}
                      >
                        {voce.label}
                      </span>
                    </span>
                  </Link>
                  <ul
                    className={
                      styles.dropdownMenu +
                      (compatto ? " " + styles.dropdownMenuCompatto : "")
                    }
                  >
                    {voce.items.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} onClick={(e) => onHashNavClick(e, item.href)}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            }

            return (
              <li key={voce.href}>
                <Link href={voce.href} onClick={(e) => onHashNavClick(e, voce.href)}>
                  <span className={styles.navLabel}>
                    <span className={styles.navLabelGhost} aria-hidden="true">
                      {voce.label}
                    </span>
                    <span
                      className={styles.navLabelLive}
                      ref={(el) => {
                        liveRefs.current[i] = el;
                      }}
                    >
                      {voce.label}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div
          className={styles.esposimetro}
          aria-hidden="true"
          onMouseEnter={() => {
            playRadioTick();
          }}
        >
          <div ref={trackRef} className={styles.esposimetroTrack}>
            <div ref={needleRef} className={styles.esposimetroNeedle} />
            <div className={styles.esposimetroTicks}>{tickMarks}</div>
            <div className={styles.esposimetroLabels}>
              <span>-2</span>
              <span>-1</span>
              <span>0</span>
              <span>+1</span>
              <span>+2</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
