const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const brainDir = path.join('C:', 'Users', 'ashra', '.gemini', 'antigravity-ide', 'brain', 'fe49eaec-3302-426c-a3e3-516ae7df74cb');
const destDir = path.join(__dirname, '..', 'public', 'categories');

const updates = [
  {
    src: path.join(brainDir, 'brazilian_farm_1789772020447.jpg'),
    dest: path.join(destDir, 'brazilian.jpg')
  },
  {
    src: path.join(brainDir, 'indian_farm_1789772111385.jpg'),
    dest: path.join(destDir, 'indian.jpg')
  },
  {
    src: path.join(brainDir, 'habashi_farm_1789772173906.jpg'),
    dest: path.join(destDir, 'habashi.jpg')
  },
  {
    src: path.join(brainDir, 'arabicas_farm_1789772280740.jpg'),
    dest: path.join(destDir, 'arabicas.jpg')
  },
  {
    src: path.join(brainDir, 'basics_roastery_1789772339128.jpg'),
    dest: path.join(destDir, 'basics.jpg')
  },
  {
    src: path.join(brainDir, 'blends_craft_1789772427780.jpg'),
    dest: path.join(destDir, 'blends.jpg')
  },
  {
    src: path.join(brainDir, 'french_bistro_1789772519874.jpg'),
    dest: path.join(destDir, 'french.jpg')
  }
];

async function updateCategoryImages() {
  for (const item of updates) {
    if (fs.existsSync(item.src)) {
      await sharp(item.src)
        .jpeg({ quality: 88, mozjpeg: true })
        .toFile(item.dest);
      console.log('Successfully updated:', path.basename(item.dest));
    } else {
      console.warn('Source file not found:', item.src);
    }
  }
  console.log('Category images update completed!');
}

updateCategoryImages().catch(console.error);
