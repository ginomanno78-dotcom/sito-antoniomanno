"use client";

import { useState } from "react";
import styles from "./ApertureDepthOfField.module.css";

const ASSET = "https://assets.codepen.io/9400490";

const SAMPLE_IMGS = [
  { id: 1, src: `${ASSET}/image1.jpg`, alt: "image showing blurred background" },
  { id: 2, src: `${ASSET}/image2.jpg`, alt: "image showing blurred background" },
  { id: 3, src: `${ASSET}/image3.jpg`, alt: "image showing blurred background" },
  { id: 4, src: `${ASSET}/image4.jpg`, alt: "image showing blurred background" },
] as const;

const RING_IMGS = [
  { id: 1, src: `${ASSET}/aperture-ring_1.svg` },
  { id: 2, src: `${ASSET}/aperture-ring_2.svg` },
  { id: 3, src: `${ASSET}/aperture-ring_3.svg` },
  { id: 4, src: `${ASSET}/aperture-ring_4.svg` },
] as const;

/**
 * Modulo interattivo: Aperture and Depth of Field (prima funzione Laboratorio).
 */
export function ApertureDepthOfField() {
  const [aperture, setAperture] = useState(1);

  return (
    <div className={styles.root}>
      <div className={styles.mainContainer}>
        <h3 className={styles.title}>
          Apertura e profondità di campo
        </h3>
        <p className={styles.lead}>
          Nella fotografia di ritratto digitale, uno sfondo sfocato è spesso una
          caratteristica desiderabile di una fotografia. Tuttavia, il processo
          può risultare complesso per i fotografi principianti, poiché per
          ottenere uno sfondo sfocato, la cosiddetta &quot;profondità di campo
          ridotta&quot;, è necessario utilizzare un&apos;ampia apertura del
          diaframma, rappresentata da un numero f basso. Utilizza il cursore qui
          sotto per selezionare diversi valori di apertura e osserva come
          cambiano sia l&apos;anello del diaframma che lo sfondo nell&apos;immagine
          di esempio.
        </p>

        <div className={styles.imgContainer}>
          <div className={styles.mediaCol}>
            <p className={styles.exampleLabel}>Immagine di esempio</p>
            <div className={styles.sampleImgContainer}>
              {SAMPLE_IMGS.map((img) => (
                <img
                  key={img.id}
                  className={
                    styles.sampleImg +
                    (aperture === img.id ? " " + styles.sampleImgVisible : "")
                  }
                  alt={img.alt}
                  src={img.src}
                  decoding="async"
                />
              ))}
            </div>
          </div>

          <div className={styles.mediaCol + " " + styles.mediaColLens}>
            <p className={styles.exampleLabel}>Anello del diaframma</p>
            <div className={styles.ringImgContainer}>
              {RING_IMGS.map((ring) => (
                <img
                  key={ring.id}
                  className={
                    styles.ringImg +
                    (aperture === ring.id ? " " + styles.ringImgVisible : "")
                  }
                  alt="image showing an aperture ring"
                  src={ring.src}
                  decoding="async"
                />
              ))}
              <img
                className={styles.ringImg + " " + styles.flare}
                aria-hidden="true"
                src={`${ASSET}/lens-flare.png`}
                alt=""
                decoding="async"
              />
              <img
                className={styles.ringImg + " " + styles.reflection}
                aria-hidden="true"
                src={`${ASSET}/lens-front-reflection.svg`}
                alt=""
                decoding="async"
              />
            </div>
          </div>
        </div>

        <div className={styles.sliderContainer}>
          <p className={styles.sliderLabel}>Valore di apertura: numero F</p>
          <input
            type="range"
            className={styles.apertureSlider}
            min={1}
            max={4}
            value={aperture}
            aria-label="Aperture value"
            onChange={(e) => setAperture(Number(e.target.value))}
          />
          <div className={styles.sliderScale}>
            <div
              className={
                styles.scaleValue +
                " " +
                styles.value1 +
                (aperture === 1 ? " " + styles.scaleValueActive : "")
              }
            />
            <div className={styles.scaleValueSm} />
            <div className={styles.scaleValueSm} />
            <div className={styles.scaleValueSm} />
            <div className={styles.scaleValueSm} />
            <div
              className={
                styles.scaleValue +
                " " +
                styles.value2 +
                (aperture === 2 ? " " + styles.scaleValueActive : "")
              }
            />
            <div className={styles.scaleValueSm} />
            <div className={styles.scaleValueSm} />
            <div className={styles.scaleValueSm} />
            <div className={styles.scaleValueSm} />
            <div
              className={
                styles.scaleValue +
                " " +
                styles.value3 +
                (aperture === 3 ? " " + styles.scaleValueActive : "")
              }
            />
            <div className={styles.scaleValueSm} />
            <div className={styles.scaleValueSm} />
            <div className={styles.scaleValueSm} />
            <div className={styles.scaleValueSm} />
            <div
              className={
                styles.scaleValue +
                " " +
                styles.value4 +
                (aperture === 4 ? " " + styles.scaleValueActive : "")
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
