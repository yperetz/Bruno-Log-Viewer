const path = require('path');
const fs = require('fs');
const os = require('os');

async function getRcedit() {
  const mod = await import('rcedit');
  return mod.rcedit || mod.default;
}

async function getPngToIco() {
  const mod = await import('png-to-ico');
  return mod.default || mod;
}

/** Windows requires these sizes for proper taskbar/explorer icon display */
const ICO_SIZES = [256, 48, 32, 16];

const ROOT = path.join(__dirname, '..');
const EXE = path.join(ROOT, 'release', 'win-unpacked', 'Bruno Log Viewer.exe');
const ICON_PNG = path.join(ROOT, 'build', 'icon.png');
const ICON_ICO = path.join(ROOT, 'build', 'icon.ico');
const BUILDER_ICO = path.join(ROOT, 'release', '.icon-ico', 'icon.ico');

async function createMultiSizeIco(pngPath) {
  const Jimp = (await import('jimp')).default;
  const pngToIco = await getPngToIco();

  const src = await Jimp.read(pngPath);
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bruno-icon-'));
  const pngPaths = [];

  try {
    for (const size of ICO_SIZES) {
      const resized = src.clone().resize(size, size);
      const outPath = path.join(tmpDir, `icon-${size}.png`);
      await resized.writeAsync(outPath);
      pngPaths.push(outPath);
    }
    // Order matters: largest first for Windows
    pngPaths.reverse();
    const buf = await pngToIco(pngPaths);
    return buf;
  } finally {
    for (const p of pngPaths)
      try { fs.unlinkSync(p); } catch (_) {}
    try { fs.rmdirSync(tmpDir); } catch (_) {}
  }
}

async function main() {
  if (!fs.existsSync(EXE)) {
    console.warn('Exe not found, skipping icon embed:', EXE);
    return;
  }

  let icoPath;

  if (fs.existsSync(ICON_ICO)) {
    // Pre-built multi-size ICO from user - use as-is
    icoPath = ICON_ICO;
  } else if (fs.existsSync(ICON_PNG)) {
    // Generate proper multi-size ICO from PNG (fixes taskbar pin icon)
    console.log('Generating multi-size ICO for Windows taskbar...');
    const icoBuffer = await createMultiSizeIco(ICON_PNG);
    fs.mkdirSync(path.dirname(ICON_ICO), { recursive: true });
    fs.writeFileSync(ICON_ICO, icoBuffer);
    icoPath = ICON_ICO;
  } else if (fs.existsSync(BUILDER_ICO)) {
    icoPath = BUILDER_ICO;
  } else {
    console.warn('No icon file found, skipping');
    return;
  }

  const rcedit = await getRcedit();
  await rcedit(EXE, { icon: icoPath });
  console.log('Icon embedded successfully');
}

main().catch((err) => {
  console.error('Failed to embed icon:', err);
  process.exit(1);
});
