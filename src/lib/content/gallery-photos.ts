import fs from "fs";
import path from "path";

export type GalleryPhoto = {
  thumb: string;
  full: string;
  alt: string;
};

/**
 * Reads the real files under public/assets/images/{folder}/thumbs at build
 * time so the photo count and order always match what's actually on disk
 * (no hand-maintained counts to drift out of sync). Sorts numerically since
 * a couple of legacy folders mix 2- and 3-digit zero padding.
 *
 * Server-only (uses `fs`) -- kept out of galleries.ts so that file can still
 * be imported from Client Components like the navbar without pulling `fs`
 * into the browser bundle.
 */
export function getGalleryPhotos(folder: string, altPrefix: string): GalleryPhoto[] {
  const thumbsDir = path.join(process.cwd(), "public", "assets", "images", folder, "thumbs");
  let files: string[];
  try {
    files = fs.readdirSync(thumbsDir).filter((f) => /\.webp$/i.test(f));
  } catch {
    return [];
  }

  files.sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] ?? "0", 10);
    const numB = parseInt(b.match(/\d+/)?.[0] ?? "0", 10);
    return numA - numB;
  });

  return files.map((filename) => {
    const num = parseInt(filename.match(/\d+/)?.[0] ?? "0", 10);
    return {
      thumb: `/assets/images/${folder}/thumbs/${filename}`,
      full: `/assets/images/${folder}/full/${filename}`,
      alt: `${altPrefix} ${num}`,
    };
  });
}
