import type { Metadata } from "next";
import Script from "next/script";
import { displayFont, navFont, bodyFont } from "@/lib/fonts";
import { ANALYTICS, PERSON_JSON_LD, SERVICE_JSON_LD, SITE_URL } from "@/lib/content/site";
import { Navbar } from "@/components/navbar/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Antonio Manno - photography",
    template: "%s - ph. antonio manno",
  },
  description:
    "Antonio Manno — fotografo professionista. Portfolio di jazz, ritratti, street photography, paesaggi e reportage. Sparanise, Caserta.",
  icons: {
    icon: "/assets/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="it"
      className={`${displayFont.variable} ${navFont.variable} ${bodyFont.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-paper text-ink antialiased">
        {/* Prima del paint: intro in home se non ancora vista, oppure se ?intro=1 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=location.pathname;if(p!=="/"&&p!=="")return;var q=new URLSearchParams(location.search);var forza=q.has("intro");if(forza){try{sessionStorage.removeItem("antoniomanno_intro_seen");}catch(e){}document.documentElement.setAttribute("data-intro","1");return;}if(sessionStorage.getItem("antoniomanno_intro_seen")!=="1")document.documentElement.setAttribute("data-intro","1");}catch(e){document.documentElement.setAttribute("data-intro","1");}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_JSON_LD) }}
        />

        {/* Navbar globale: logo + menu + esposimetro (fixed) */}
        <Navbar />
        {children}

        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS.ga4Id}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${ANALYTICS.ga4Id}');`}
        </Script>
        <Script
          src={`https://embeds.iubenda.com/widgets/${ANALYTICS.iubendaSiteId}.js`}
          strategy="afterInteractive"
        />
        <Script id="iubenda-loader" strategy="lazyOnload">
          {`(function (w, d) {
  var loader = function () {
    var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0];
    s.src = "https://cdn.iubenda.com/iubenda.js";
    tag.parentNode.insertBefore(s, tag);
  };
  if (w.addEventListener) { w.addEventListener("load", loader, false); }
  else if (w.attachEvent) { w.attachEvent("onload", loader); }
  else { w.onload = loader; }
})(window, document);`}
        </Script>
      </body>
    </html>
  );
}
