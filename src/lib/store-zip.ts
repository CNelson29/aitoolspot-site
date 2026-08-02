// Empaqueta los archivos de un producto (src/product-files/<slug>/) en un ZIP en memoria.
// Usa import.meta.url para resolver la ruta de forma segura tanto en dev como en el bundle
// serverless de Vercel (los archivos están incluidos porque viven dentro de src/).
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import archiver from 'archiver';

export async function buildProductZip(filesDir: string): Promise<Buffer> {
  const dir = fileURLToPath(new URL(`../product-files/${filesDir}/`, import.meta.url));
  if (!fs.existsSync(dir)) throw new Error(`product-files no encontrado: ${filesDir}`);

  return new Promise((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const chunks: Buffer[] = [];
    archive.on('data', (chunk) => chunks.push(chunk));
    archive.on('error', reject);
    archive.on('end', () => resolve(Buffer.concat(chunks)));
    archive.directory(dir, false);
    archive.finalize();
  });
}
