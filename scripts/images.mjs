import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIR = 'images-src';
const OUT_DIR = 'src/assets/images';

// Ширини = реальні пікселі (1x і 2x), більші за оригінал не робимо
const WIDTHS = {
  work: [358, 716],
  journal: [150, 300],
};

const ENCODERS = {
  avif: (img) => img.avif({ quality: 50 }),
  webp: (img) => img.webp({ quality: 75 }),
  jpg: (img) => img.jpeg({ quality: 80, mozjpeg: true }),
};

await mkdir(OUT_DIR, { recursive: true });

const files = (await readdir(SRC_DIR)).filter((f) => f.endsWith('.webp'));

for (const file of files) {
  const name = path.parse(file).name; // work-1
  const group = name.split('-')[0]; // work
  const widths = WIDTHS[group];

  if (!widths) {
    console.warn(`Пропущено ${file}: невідома група "${group}"`);
    continue;
  }

  for (const width of widths) {
    for (const [ext, encode] of Object.entries(ENCODERS)) {
      const outFile = path.join(OUT_DIR, `${name}-${width}.${ext}`);
      const image = sharp(path.join(SRC_DIR, file)).resize({ width });
      await encode(image).toFile(outFile);
    }
  }

  console.log(`✓ ${file}`);
}