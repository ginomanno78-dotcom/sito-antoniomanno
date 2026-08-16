"use client";

import Link from "next/link";
import { playCameraFocus } from "@/lib/ui-sounds";
import styles from "./PortfolioCard.module.css";

export function PortfolioCard({
  href,
  label,
  count,
  coverSrc,
  coverAlt,
  index,
}: {
  href: string;
  label: string;
  count: number;
  coverSrc: string;
  coverAlt: string;
  /** Indice 1-based per anteporre "01." al titolo */
  index: number;
}) {
  const num = String(index).padStart(2, "0");

  return (
    <Link
      href={href}
      className="group block"
      onClick={() => {
        playCameraFocus();
      }}
    >
      {/* Titolo + contatore */}
      <div className="flex items-baseline justify-between gap-2 pb-2 sm:gap-3 sm:pb-3">
        <span className="font-body text-xs font-bold uppercase tracking-[0.08em] text-white transition-colors group-hover:text-[#f63724] sm:text-sm">
          <span className="font-normal text-white/33">{num}. </span>
          {label}
        </span>
        <span className="shrink-0 whitespace-nowrap font-nav text-[10px] uppercase tracking-[0.08em] text-white/55 tabular-nums sm:text-[11px]">
          {count} photos
        </span>
      </div>

      <div
        className={styles.card}
        style={{ ["--bg" as string]: `url("${coverSrc}")` }}
        role="img"
        aria-label={coverAlt}
      >
        <div className={styles.borderBox} />
      </div>
    </Link>
  );
}
