import sharp from "sharp";
import pngToIco from "png-to-ico";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");

// Lucide "graduation-cap" glyph paths (24x24 viewBox), matching the sidebar logo.
const GLYPH = `
  <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
  <path d="M22 10v6" />
  <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
`;

function iconSvg(size) {
  const glyphSize = size * 0.58;
  const offset = (size - glyphSize) / 2;
  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6d5bf6" />
      <stop offset="100%" stop-color="#22c3a6" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#bg)" />
  <g transform="translate(${offset}, ${offset}) scale(${glyphSize / 24})"
     fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    ${GLYPH}
  </g>
</svg>`;
}

function maskableIconSvg(size) {
  const glyphSize = size * 0.5;
  const offset = (size - glyphSize) / 2;
  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6d5bf6" />
      <stop offset="100%" stop-color="#22c3a6" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg)" />
  <g transform="translate(${offset}, ${offset}) scale(${glyphSize / 24})"
     fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    ${GLYPH}
  </g>
</svg>`;
}

async function main() {
  const targets = [
    { file: "icon-192x192.png", size: 192, svg: iconSvg },
    { file: "icon-512x512.png", size: 512, svg: iconSvg },
    { file: "apple-touch-icon.png", size: 180, svg: iconSvg },
    { file: "icon-maskable-512x512.png", size: 512, svg: maskableIconSvg },
    { file: "favicon-16x16.png", size: 16, svg: iconSvg },
    { file: "favicon-32x32.png", size: 32, svg: iconSvg },
    { file: "favicon-48x48.png", size: 48, svg: iconSvg },
  ];

  for (const t of targets) {
    const buffer = Buffer.from(t.svg(t.size));
    await sharp(buffer).png().toFile(path.join(PUBLIC_DIR, t.file));
    console.log(`Wrote public/${t.file}`);
  }

  // Also write the source SVG (crisp at any size, used for the in-app logo too).
  fs.writeFileSync(path.join(PUBLIC_DIR, "logo.svg"), iconSvg(64).trim());
  console.log("Wrote public/logo.svg");

  const icoBuffer = await pngToIco([
    path.join(PUBLIC_DIR, "favicon-16x16.png"),
    path.join(PUBLIC_DIR, "favicon-32x32.png"),
    path.join(PUBLIC_DIR, "favicon-48x48.png"),
  ]);
  fs.writeFileSync(path.join(PUBLIC_DIR, "favicon.ico"), icoBuffer);
  console.log("Wrote public/favicon.ico");
}

main();
