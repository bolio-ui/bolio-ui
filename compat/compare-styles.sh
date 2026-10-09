#!/usr/bin/env bash
# Usage: compat/compare-styles.sh
# Checks that the packed @bolio-ui/core, with its styles.css, looks like the
# source. The same page, with the default case of every component, is built
# twice: against the tarball (layered CSS) and against core/ (CSS Modules),
# and the computed style of every element is compared in both themes. A rule
# outside the layers, or layers in the wrong order, shows up as a difference.
# Needs Google Chrome. Set PACK_DIR to use a tarball you already have.
set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="$ROOT/compat/.work/styles"
PACK_DIR="${PACK_DIR:-$WORK/pack}"

if [ -z "$(ls "$PACK_DIR"/bolio-ui-core-*.tgz 2>/dev/null)" ]; then
  echo "== pack"
  mkdir -p "$PACK_DIR"
  (cd "$ROOT" && yarn -s build:package > "$WORK-build.log" 2>&1 && npm pack --pack-destination "$PACK_DIR" > /dev/null) \
    || { echo "PACK FAILED, see $WORK-build.log"; exit 2; }
fi
TARBALL="$(ls -t "$PACK_DIR"/bolio-ui-core-*.tgz | head -1)"

rm -rf "$WORK/app" && mkdir -p "$WORK/app/src"
cd "$WORK/app"
cp "$ROOT/compat/styles/index.html" .
cp "$ROOT/compat/styles/main.tsx" src/main.tsx
sed "s#import \* as Bolio from '..'#import * as Bolio from '@bolio-ui/core'#" "$ROOT/core/__tests__/cases.tsx" > src/cases.tsx

cat > package.json <<JSON
{
  "name": "bolio-compat-styles",
  "private": true,
  "type": "module",
  "dependencies": {
    "@bolio-ui/core": "file:$TARBALL",
    "@vitejs/plugin-react": "*",
    "playwright-core": "*",
    "react": "19",
    "react-dom": "19",
    "vite": "*"
  }
}
JSON
echo "== install ($(basename "$TARBALL"))"
npm install --no-audit --no-fund > install.log 2>&1 || { echo "INSTALL FAILED"; tail -20 install.log; exit 1; }

cat > vite.layered.config.mjs <<'JS'
import react from '@vitejs/plugin-react'
export default {
  plugins: [react()],
  build: { outDir: 'dist-layered' },
  define: { 'process.env.NODE_ENV': '"production"' }
}
JS
cat > vite.source.config.mjs <<JS
import react from '@vitejs/plugin-react'
export default {
  plugins: [react()],
  resolve: { alias: { '@bolio-ui/core': '$ROOT/core/index.ts' }, dedupe: ['react', 'react-dom'] },
  build: { outDir: 'dist-source' },
  server: { fs: { allow: ['/'] } }
}
JS

echo "== build"
# only the layered page imports the stylesheet
{ echo "import '@bolio-ui/core/styles.css'"; cat "$ROOT/compat/styles/main.tsx"; } > src/main.tsx
npx vite build --config vite.layered.config.mjs > layered.log 2>&1 || { echo "LAYERED BUILD FAILED"; tail -15 layered.log; exit 1; }
cp "$ROOT/compat/styles/main.tsx" src/main.tsx
npx vite build --config vite.source.config.mjs > source.log 2>&1 || { echo "SOURCE BUILD FAILED"; tail -15 source.log; exit 1; }

echo "== compare"
# next to node_modules, so playwright-core resolves
cp "$ROOT/compat/styles/compare.mjs" .
node compare.mjs .
