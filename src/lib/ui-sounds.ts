/**
 * Suoni UI via Web Audio (file in public/assets/audio).
 * Dopo il primo click sulla pagina, hover link/card riproducono senza errori.
 */

let audioCtx: AudioContext | null = null;
let navBuffer: AudioBuffer | null = null;
let portfolioBuffer: AudioBuffer | null = null;
let caricamentoNav: Promise<AudioBuffer> | null = null;
let caricamentoPortfolio: Promise<AudioBuffer> | null = null;
let ultimoNavClick = 0;
let ultimoFocus = 0;
let sbloccoRegistrato = false;

function haHoverReale() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

async function resumeCtx(): Promise<AudioContext | null> {
  const ctx = getCtx();
  if (!ctx) return null;
  if (ctx.state === "suspended") {
    try {
      await ctx.resume();
    } catch {
      return null;
    }
  }
  return ctx.state === "running" ? ctx : null;
}

async function caricaBuffer(url: string): Promise<AudioBuffer> {
  const ctx = getCtx();
  if (!ctx) throw new Error("AudioContext non disponibile");
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Audio non trovato: ${url}`);
  const data = await res.arrayBuffer();
  /* slice: alcuni browser richiedono una copia staccata dalla Response */
  return ctx.decodeAudioData(data.slice(0));
}

function getNavBuffer() {
  if (!caricamentoNav) {
    caricamentoNav = caricaBuffer(
      "/assets/audio/mixkit-mouse-hard-clicking.mp3",
    ).then((b) => {
      navBuffer = b;
      return b;
    });
  }
  return caricamentoNav;
}

function getPortfolioBuffer() {
  if (!caricamentoPortfolio) {
    caricamentoPortfolio = caricaBuffer(
      "/assets/audio/mixkit-camera-auto-focus.mp3",
    ).then((b) => {
      portfolioBuffer = b;
      return b;
    });
  }
  return caricamentoPortfolio;
}

function riproduci(buffer: AudioBuffer, volume: number) {
  const ctx = getCtx();
  if (!ctx || ctx.state !== "running") return false;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.value = volume;
  src.connect(gain);
  gain.connect(ctx.destination);
  src.start(0);
  return true;
}

/** Sblocco obbligatorio: Chrome consente AudioContext solo dopo un gesto utente. */
async function sbloccaAudioUi() {
  const ctx = await resumeCtx();
  if (!ctx) return;
  try {
    await Promise.all([getNavBuffer(), getPortfolioBuffer()]);
  } catch {
    /* ignore */
  }
}

function assicuratiSblocco() {
  if (sbloccoRegistrato || typeof window === "undefined") return;
  sbloccoRegistrato = true;
  const unlock = () => {
    void sbloccaAudioUi();
  };
  window.addEventListener("pointerdown", unlock, { once: true, passive: true });
  window.addEventListener("keydown", unlock, { once: true });
}

assicuratiSblocco();

/** Hover link navbar + esposimetro */
export function playRadioTick() {
  if (typeof window === "undefined") return;
  if (!haHoverReale()) return;

  const now = performance.now();
  if (now - ultimoNavClick < 70) return;
  ultimoNavClick = now;

  assicuratiSblocco();
  void (async () => {
    const ctx = await resumeCtx();
    if (!ctx) return;
    try {
      const buffer = navBuffer ?? (await getNavBuffer());
      riproduci(buffer, 0.65);
    } catch {
      /* ignore */
    }
  })();
}

/** Hover card portfolio / foto profilo (solo pointer fine) */
export function playCameraFocus() {
  if (typeof window === "undefined") return;
  if (!haHoverReale()) return;

  const now = performance.now();
  if (now - ultimoFocus < 100) return;
  ultimoFocus = now;

  assicuratiSblocco();
  void (async () => {
    try {
      const ctx = await resumeCtx();
      if (!ctx) return;
      const buffer = portfolioBuffer ?? (await getPortfolioBuffer());
      riproduci(buffer, 0.7);
    } catch {
      /* ignore */
    }
  })();
}

let introHtmlAudio: HTMLAudioElement | null = null;

/** Precarica il file intro (HTMLAudio + buffer Web Audio) */
export function preloadIntroFocus(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  void getPortfolioBuffer().catch(() => {});

  if (!introHtmlAudio) {
    introHtmlAudio = new Audio("/assets/audio/mixkit-camera-auto-focus.mp3");
    introHtmlAudio.preload = "auto";
    introHtmlAudio.volume = 0.9;
  }

  return new Promise((resolve) => {
    const audio = introHtmlAudio!;
    if (audio.readyState >= 3) {
      resolve();
      return;
    }
    const done = () => resolve();
    audio.addEventListener("canplaythrough", done, { once: true });
    audio.addEventListener("error", done, { once: true });
    try {
      audio.load();
    } catch {
      done();
    }
    window.setTimeout(done, 2500);
  });
}

/**
 * Intro: HTMLAudio prima (affidabile al gesto utente). true = riproduzione avviata.
 */
export async function playIntroFocus(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  assicuratiSblocco();

  try {
    if (!introHtmlAudio) {
      introHtmlAudio = new Audio("/assets/audio/mixkit-camera-auto-focus.mp3");
      introHtmlAudio.volume = 0.9;
    }
    introHtmlAudio.pause();
    introHtmlAudio.currentTime = 0;
    await introHtmlAudio.play();
    return true;
  } catch {
    /* fallback Web Audio se HTMLAudio bloccato */
  }

  try {
    const ctx = getCtx();
    if (!ctx) return false;
    if (ctx.state === "suspended") await ctx.resume();
    if (ctx.state === "running" && portfolioBuffer) {
      return riproduci(portfolioBuffer, 0.9);
    }
  } catch {
    /* ignore */
  }

  return false;
}
