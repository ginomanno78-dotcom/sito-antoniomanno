"use client";

import { useState } from "react";
import type { GalleryPhoto } from "@/lib/content/gallery-photos";
import { Lightbox } from "./Lightbox";
import styles from "./GalleryPage.module.css";

/** Griglia gallery 1:1 con l’originale: 5 colonne, bordo bianco, ordine file numerico */
export function MasonryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  return (
    <>
      <div className={styles.grid}>
        {photos.map((photo, i) => (
          <button
            key={photo.thumb}
            type="button"
            className={styles.item}
            onClick={() => setOpenIndex(i)}
            data-index={i}
          >
            <img
              className={styles.thumb}
              src={photo.thumb}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>

      <Lightbox
        photos={photos}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </>
  );
}
