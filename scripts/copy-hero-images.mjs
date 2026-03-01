#!/usr/bin/env node
/**
 * Copy hero images from public/images to public/med_images so that
 * blog heroImage paths (/med_images/...) resolve correctly.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const imagesDir = path.join(root, 'public', 'images');
const medImagesDir = path.join(root, 'public', 'med_images');
const optimizedDir = path.join(medImagesDir, 'optimized');

// med_files_XX.webp used by blog heroImage (from hero-image-from-backup-mapping.md)
const MED_FILES_NEEDED = new Set([
  '0', '2', '5', '7', '8', '9', '11', '12', '13', '14', '15', '17', '19', '24', '25', '26', '28', '29',
  '31', '32', '33', '35', '37', '40', '42', '43', '44', '46', '47', '51', '55', '57', '58', '59', '60',
  '62', '69', '73', '74', '78', '87', '89', '95', '96', '99', '103', '109', '110', '127', '132', '163', '177', '184'
]);

// Files to copy to med_images/ (root), not optimized/
const ROOT_COPY = [
  { src: 'cranberry.jpg', dest: 'cranberry.jpg' },
  { src: 'calorie-calculation.png', dest: 'calorie-calculation.png' },
  { src: 'calorie-calculation.png', dest: 'nutrition-labels-guide.png' },
  { src: 'calorie-calculation.png', dest: 'micronutrients-guide.png' },
  { src: 'vitamin-D.webp', dest: 'vitamin-D.webp' },
  { src: 'healthy-plate.webp', dest: 'healthy-plate.webp' },
  { src: 'healthy-plate.webp', dest: 'gut-health-fundamentals.webp' },
  { src: 'healthy-plate.webp', dest: 'probiotics-prebiotics-guide.webp' },
  { src: 'intermittent-fasting-schedule.webp', dest: 'intermittent-fasting-schedule.webp' },
  // 主題圖（補充品／年齡／慢性病／心理健康／環境）
  { src: 'supplement-safety.webp', dest: 'supplement-safety.webp' },
  { src: 'age-specific-health.webp', dest: 'age-specific-health.webp' },
  { src: 'chronic-disease.webp', dest: 'chronic-disease.webp' },
  { src: 'healthy-mind.webp', dest: 'healthy-mind.webp' },
  { src: 'environmental-safety.webp', dest: 'environmental-safety.webp' },
  { src: 'beauty-category.webp', dest: 'beauty-category.webp' },
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('Created:', dir);
  }
}

function copyFile(srcPath, destPath) {
  if (!fs.existsSync(srcPath)) {
    console.warn('Skip (missing):', srcPath);
    return false;
  }
  fs.copyFileSync(srcPath, destPath);
  console.log('Copied:', path.relative(root, destPath));
  return true;
}

ensureDir(medImagesDir);
ensureDir(optimizedDir);

// Copy med_files_XX.webp to optimized/
for (const num of MED_FILES_NEEDED) {
  const name = `med_files_${num}.webp`;
  copyFile(path.join(imagesDir, name), path.join(optimizedDir, name));
}

// Copy root-level assets
for (const { src, dest } of ROOT_COPY) {
  copyFile(path.join(imagesDir, src), path.join(medImagesDir, dest));
}

console.log('Done. Hero images are in public/med_images/ and public/med_images/optimized/');
