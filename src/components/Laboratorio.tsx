import { SectionTitle } from "./SectionTitle";
import { ApertureDepthOfField } from "./laboratorio/ApertureDepthOfField";
import { TempoDiPosa } from "./laboratorio/TempoDiPosa";
import styles from "./Laboratorio.module.css";

/**
 * Sezione Laboratorio — due box: sx profondità di campo, dx tempo di posa.
 */
export function Laboratorio() {
  return (
    <section id="laboratorio" className="w-full text-white" style={{ backgroundColor: "#000" }}>
      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20 md:px-10 lg:py-32">
        <SectionTitle>Laboratorio</SectionTitle>
        <div className={styles.grid}>
          {/* Colonna sinistra */}
          <div className={styles.box}>
            <ApertureDepthOfField />
          </div>
          {/* Colonna destra */}
          <div className={styles.box}>
            <TempoDiPosa />
          </div>
        </div>
      </div>
    </section>
  );
}
