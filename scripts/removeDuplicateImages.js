// Script to remove products with duplicate image URLs from sampleData.js
const fs = require('fs');
const path = require('path');

const sampleDataPath = path.join(__dirname, '../src/sampleData.js');
let fileContent = fs.readFileSync(sampleDataPath, 'utf-8');

// Extract the products array
const productsMatch = fileContent.match(/const sampleProducts = (\[.*?\]);/s);
if (!productsMatch) {
  console.error('Could not find sampleProducts array in sampleData.js');
  process.exit(1);
}

const productsArrayStr = productsMatch[1];
let products;
try {
  products = eval(productsArrayStr);
} catch (e) {
  console.error('Error parsing products array:', e);
  process.exit(1);
}

const seenImages = new Set();
const filteredProducts = products.filter(product => {
  const imageUrl = product.images && product.images[0];
  if (!imageUrl) return true;
  if (seenImages.has(imageUrl)) return false;
  seenImages.add(imageUrl);
  return true;
});

// Rebuild the file content
const newProductsStr = JSON.stringify(filteredProducts, null, 2);
const newFileContent = fileContent.replace(/const sampleProducts = (\[.*?\]);/s, `const sampleProducts = ${newProductsStr};`);

fs.writeFileSync(sampleDataPath, newFileContent);
console.log('Duplicate images removed from sampleData.js!');
