// Leonida Platinum — the hand-in program.
//
// Running this file is how the entry is delivered. It assembles a complete,
// self-contained copy of the guide in the output folder: the app/ directory
// (the whole offline web app, exactly as a browser would receive it), the
// screenshots/ directory, and a dossier.json describing both, generated with
// the vendored library in vendor/ — which stays untouched on purpose, because
// the scorer rebuilds the dossier with its own copy of that library and
// expects identical bytes.
//
// The destination is the MAKEFUN_OUTPUT_DIR environment variable when set,
// and /output otherwise:
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// To look at the app itself instead, serve app/ with `node serve.ts` and open
// http://localhost:8080 in a browser. Node 22, standard library only.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const entryDir = path.dirname(fileURLToPath(import.meta.url));
const destination = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The gate's limits, mirrored so the hand-in refuses nothing the scorer
// would accept and accepts nothing it would refuse: a source-text budget,
// at most four screenshots of at most 256 KiB each, and room for the app
// tree beside the output folder's own entries.
const gateCaps = {
  text_max_bytes: 163_840,
  screenshots: { max: 4, max_bytes: 262_144 },
  app_max_files: 993,
  app_max_bytes: 50_331_648,
};

mkdirSync(destination, { recursive: true });
for (const part of ['app', 'screenshots']) {
  const from = path.join(entryDir, part);
  if (existsSync(from)) {
    cpSync(from, path.join(destination, part), { recursive: true });
  }
}

const dossier = buildDossier(destination, gateCaps);
writeFileSync(path.join(destination, 'dossier.json'), dossier);
console.log(`Leonida Platinum handed in at ${destination} (dossier: ${dossier.length} bytes)`);
