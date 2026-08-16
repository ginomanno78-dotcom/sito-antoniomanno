import localFont from "next/font/local";

/** Display face for section headings and the wordmark — brand-distinctive, kept from the legacy site. */
export const displayFont = localFont({
  src: "../../public/assets/font/arriere_garde.ttf",
  variable: "--font-display",
  display: "swap",
});

/** Hero title, nav links, labels. */
export const navFont = localFont({
  src: [
    {
      path: "../../public/assets/font/MontserratAlternates-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/assets/font/MontserratAlternates-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-nav",
  display: "swap",
});

/**
 * Body copy. The legacy site referenced "Century Gothic" in CSS but never shipped an
 * @font-face for it, so it silently fell back to the OS-installed font (present on Windows,
 * inconsistent elsewhere). GOTHIC.TTF sat in assets/font/ unused. Self-hosting it here makes
 * the original design intent actually render for every visitor.
 */
export const bodyFont = localFont({
  src: "../../public/assets/font/gothic.ttf",
  variable: "--font-body",
  weight: "400",
  display: "swap",
});
