from pathlib import Path
from PIL import Image

BASE = Path("F:/GRAFICA LAVORI/SITIART/sito-antoniomanno/assets/images/photo-street")
FOLDERS = ["thumbs", "full"]
QUALITY = 80

total_converted = 0
total_skipped = 0

for folder in FOLDERS:
    folder_path = BASE / folder
    jpgs = list(folder_path.glob("*.jpg")) + list(folder_path.glob("*.JPG")) + list(folder_path.glob("*.jpeg"))
    converted = 0
    skipped = 0
    sizes = []

    for jpg in sorted(jpgs):
        webp_path = jpg.with_suffix(".webp")
        if webp_path.exists():
            skipped += 1
            continue
        with Image.open(jpg) as img:
            img.save(webp_path, "WEBP", quality=QUALITY)
        sizes.append(webp_path.stat().st_size)
        converted += 1

    total_converted += converted
    total_skipped += skipped

    if sizes:
        print(f"\n{folder}/")
        print(f"  Convertiti: {converted}, Saltati (webp già esistenti): {skipped}")
        print(f"  Dimensioni WebP — min: {min(sizes)//1024}KB, max: {max(sizes)//1024}KB, media: {sum(sizes)//len(sizes)//1024}KB")
    else:
        print(f"\n{folder}/: nessun nuovo JPEG da convertire (saltati: {skipped})")

print(f"\nTotale convertiti: {total_converted} | Totale saltati: {total_skipped}")
