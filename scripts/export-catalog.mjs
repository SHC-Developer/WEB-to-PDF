import { CATALOG_PAGES } from '../Templates/01. Patent catalog/catalog.ts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '../Templates/01. Patent catalog/catalog.json');
fs.writeFileSync(outPath, JSON.stringify(CATALOG_PAGES, null, 2));
console.log('Generated catalog.json');
