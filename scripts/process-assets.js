const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const honeyDir = path.join(__dirname, '..', 'public', 'honey');
const pouchesDir = path.join(__dirname, '..', 'public', 'pouches');

if (!fs.existsSync(honeyDir)) fs.mkdirSync(honeyDir, { recursive: true });
if (!fs.existsSync(pouchesDir)) fs.mkdirSync(pouchesDir, { recursive: true });

async function processHoney() {
  console.log('Processing honey images...');
  const honeyImages = [
    {
      source: '0ae93877-535d-42f1-b51b-8d17a1fd3c5b.jpeg',
      name: 'honey-citrus.jpg',
    },
    {
      source: '71b7fe68-2ca4-47f3-a5cc-8e81aaad6e97.jpeg',
      name: 'honey-clover.jpg',
    },
    {
      source: 'bbafc6bd-1b6f-4750-922a-079da3baa076.jpeg',
      name: 'honey-nuts.jpg',
    },
    {
      source: 'c28df525-5c46-463f-bf27-9e323a6d08ea.jpeg',
      name: 'honey-sidr.jpg',
    },
    {
      source: 'dcb28509-5291-4154-84ee-6de0822bda87.jpeg',
      name: 'honey-yemeni.jpg',
    }
  ];

  for (const item of honeyImages) {
    const srcPath = path.join(__dirname, '..', 'عسل', item.source);
    const destPath = path.join(honeyDir, item.name);
    await sharp(srcPath)
      .jpeg({ quality: 92, mozjpeg: true })
      .toFile(destPath);
    console.log(`Saved ${item.name}`);
  }
}

async function processPouches() {
  console.log('Processing coffee pouches with precision crops...');

  // 1. SADA POUCH
  const sadaSrc = path.join(__dirname, '..', 'عسل', 'ea0137c8-9059-470c-a2b8-fadbb93caaeb.jpeg');
  const sadaRaw = await sharp(sadaSrc)
    .extract({ left: 82, top: 340, width: 528, height: 755 })
    .toBuffer();

  const sadaMeta = await sharp(sadaRaw).metadata();
  const rightBorderSada = await sharp(sadaRaw)
    .extract({ left: sadaMeta.width - 20, top: 0, width: 20, height: sadaMeta.height })
    .flop()
    .toBuffer();

  const sadaClean = await sharp(sadaRaw)
    .composite([{ input: rightBorderSada, left: 0, top: 0 }])
    .toBuffer();

  const w1 = sadaMeta.width;
  const h1 = sadaMeta.height;
  const maskSvgSada = `<svg width="${w1}" height="${h1}">
    <rect x="0" y="0" width="${w1}" height="${h1}" rx="28" ry="28" fill="white" />
  </svg>`;

  await sharp(sadaClean)
    .ensureAlpha()
    .composite([{ input: Buffer.from(maskSvgSada), blend: 'dest-in' }])
    .png()
    .toFile(path.join(pouchesDir, 'pouch-sada.png'));

  console.log('Saved refined pouch-sada.png');

  // 2. MOHAWAJ POUCH
  const mohawajSrc = path.join(__dirname, '..', 'عسل', 'f9b5e4f3-92cb-49f0-b545-fa31bddaa8df.jpeg');
  const mohawajRaw = await sharp(mohawajSrc)
    .extract({ left: 74, top: 252, width: 540, height: 890 })
    .toBuffer();

  const mohawajMeta = await sharp(mohawajRaw).metadata();
  const rightBorderMohawaj = await sharp(mohawajRaw)
    .extract({ left: mohawajMeta.width - 22, top: 0, width: 22, height: mohawajMeta.height })
    .flop()
    .toBuffer();

  const mohawajClean = await sharp(mohawajRaw)
    .composite([{ input: rightBorderMohawaj, left: 0, top: 0 }])
    .toBuffer();

  const w2 = mohawajMeta.width;
  const h2 = mohawajMeta.height;
  const maskSvgMohawaj = `<svg width="${w2}" height="${h2}">
    <rect x="0" y="0" width="${w2}" height="${h2}" rx="28" ry="28" fill="white" />
  </svg>`;

  await sharp(mohawajClean)
    .ensureAlpha()
    .composite([{ input: Buffer.from(maskSvgMohawaj), blend: 'dest-in' }])
    .png()
    .toFile(path.join(pouchesDir, 'pouch-mohawaj.png'));

  console.log('Saved refined pouch-mohawaj.png');
}

async function main() {
  await processHoney();
  await processPouches();
  console.log('All refined assets generated successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
