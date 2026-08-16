"use client";

import { useEffect, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "motion/react";
import type { GalleryPhoto } from "@/lib/content/gallery-photos";
import styles from "./Lightbox.module.css";

const SWIPE_VELOCITY_THRESHOLD = 400;

export function Lightbox({
  photos,
  index,
  onIndexChange,
  onClose,
}: {
  photos: GalleryPhoto[];
  index: number | null;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const open = index !== null;
  const current = open ? photos[index] : null;

  const showPrev = useCallback(() => {
    if (index === null) return;
    onIndexChange((index - 1 + photos.length) % photos.length);
  }, [index, photos.length, onIndexChange]);

  const showNext = useCallback(() => {
    if (index === null) return;
    onIndexChange((index + 1) % photos.length);
  }, [index, photos.length, onIndexChange]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") showPrev();
      else if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, showPrev, showNext]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.velocity.x < -SWIPE_VELOCITY_THRESHOLD) showNext();
    else if (info.velocity.x > SWIPE_VELOCITY_THRESHOLD) showPrev();
  }

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          aria-hidden="false"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          className={styles.root}
        >
          <div className={styles.backdrop} aria-hidden="true" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi"
            className={styles.close}
          >
            &times;
          </button>

          <div className={styles.content}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label="Foto precedente"
              className={styles.prev}
            >
              &larr;
            </button>

            <AnimatePresence initial={false}>
              <motion.img
                key={current.full}
                src={current.full}
                alt={current.alt}
                drag={reduceMotion ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={styles.img}
              />
            </AnimatePresence>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label="Foto successiva"
              className={styles.next}
            >
              &rarr;
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
