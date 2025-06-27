const sharp = require('sharp');
const files = [
  'screen1.png',
  'screen2.png',
  'screen3.png',
  'screen4.png',
  'screen5.png'
];
const dir = 'public/images/screenshots/';
files.forEach(file => {
  sharp(dir + file)
    .webp({ quality: 80 })
    .toFile(dir + file.replace('.png', '.webp'))
    .then(() => console.log(`${file} convertie en webp`))
    .catch(err => console.error(`Erreur pour ${file}:`, err));
});
