/**
 * Pre-build: generate multi-size icon.ico from icon.png for Windows.
 * Must run before electron-builder so it uses the proper ICO (fixes taskbar pin icon).
 */
const path = require('path');
const fs = require('fs');
const os = require('os');

const ICO_SIZES = [256, 48, 32, 16];
const ROOT = path.join(__dirname, '..');
const ICON_PNG = path.join(ROOT, 'build', 'icon.png');
const ICON_ICO = path.join(ROOT, 'build', 'icon.ico');

async function main() {
  if (!fs.existsSync(ICON_PNG)) {
    console.warn('icon.png not found, skipping');
    return;
  }
  const Jimp = (await import('jimp')).default;
  const mod = await import('png-to-ico');
  const pngToIco = mod.default || mod;

  const src = await Jimp.read(ICON_PNG);
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bruno-icon-'));
  const pngPaths = [];

  try {
    for (const size of ICO_SIZES) {
      const resized = src.clone().resize(size, size);
      const outPath = path.join(tmpDir, `icon-${size}.png`);
      await resized.writeAsync(outPath);
      pngPaths.push(outPath);
    }
    pngPaths.reverse();
    const buf = await pngToIco(pngPaths);
    fs.mkdirSync(path.dirname(ICON_ICO), { recursive: true });
    fs.writeFileSync(ICON_ICO, buf);
    console.log('Generated build/icon.ico (multi-size for Windows taskbar)');
  } finally {
    for (const p of pngPaths) try { fs.unlinkSync(p); } catch (_) {}
    try { fs.rmdirSync(tmpDir); } catch (_) {}
  }
}

main().catch((err) => {
  console.error('Failed to generate icon:', err);
  process.exit(1);
});
