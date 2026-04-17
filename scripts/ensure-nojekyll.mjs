import { mkdir, writeFile } from 'node:fs/promises';

const docsDir = new URL('../docs/', import.meta.url);
await mkdir(docsDir, { recursive: true });
await writeFile(new URL('.nojekyll', docsDir), '');
