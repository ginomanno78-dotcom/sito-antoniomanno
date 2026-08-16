import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GALLERIES, getGallery } from "@/lib/content/galleries";
import { getGalleryPhotos } from "@/lib/content/gallery-photos";
import { MasonryGrid } from "@/components/gallery/MasonryGrid";
import { Footer } from "@/components/Footer";
import styles from "@/components/gallery/GalleryPage.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return GALLERIES.map((g) => ({ gallery: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ gallery: string }>;
}): Promise<Metadata> {
  const { gallery: slug } = await params;
  const gallery = getGallery(slug);
  if (!gallery) return {};
  return {
    title: gallery.label,
    description: gallery.desc,
    alternates: { canonical: `/${gallery.slug}` },
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ gallery: string }>;
}) {
  const { gallery: slug } = await params;
  const gallery = getGallery(slug);
  if (!gallery) notFound();

  const photos = getGalleryPhotos(gallery.folder, gallery.altPrefix);

  return (
    <>
      <main className={styles.page}>
        <section className={styles.intro}>
          <h1 className={styles.title}>{gallery.label}</h1>
          {gallery.subtitle ? (
            <p className={styles.subtitle}>{gallery.subtitle}</p>
          ) : null}
          {gallery.desc ? <p className={styles.desc}>{gallery.desc}</p> : null}
        </section>

        <div className={styles.wrap}>
          <MasonryGrid photos={photos} />
        </div>
      </main>
      <Footer variant="standard" />
    </>
  );
}
