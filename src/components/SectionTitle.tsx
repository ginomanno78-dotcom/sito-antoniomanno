/** Titolo di sezione con barra arancione a sinistra (stessa riga). */
export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row items-center gap-3">
      <div
        aria-hidden="true"
        style={{
          width: 7,
          height: 30,
          backgroundColor: "#f63724",
          flexShrink: 0,
        }}
      />
      <h2 className="m-0 font-display text-2xl leading-[1.15] font-normal text-white sm:text-3xl md:text-4xl">
        {children}
      </h2>
    </div>
  );
}
