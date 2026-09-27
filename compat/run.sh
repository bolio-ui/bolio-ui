#!/usr/bin/env bash
# Usage: compat/run.sh <next-version> <react-version> [port]
# Builds and serves the compat app against the locally packed @bolio-ui/core,
# then checks every route: HTTP status and whether styles reach the SSR HTML.
set -uo pipefail

NEXT_V="${1:?next version, e.g. 15}"
REACT_V="${2:?react version, e.g. 19}"
PORT="${3:-4100}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="$ROOT/compat/.work/next-$NEXT_V-react-$REACT_V"
TARBALL="$(ls -t "${PACK_DIR:-$ROOT}"/bolio-ui-core-*.tgz 2>/dev/null | head -1)"

[ -f "$TARBALL" ] || { echo "no tarball found: run 'npm pack' first (or set PACK_DIR)"; exit 2; }

rm -rf "$WORK" && mkdir -p "$WORK"
cp -R "$ROOT/compat/app/." "$WORK/"

cat > "$WORK/package.json" <<JSON
{
  "name": "bolio-compat-next-$NEXT_V",
  "private": true,
  "scripts": { "build": "next build", "start": "next start" },
  "dependencies": {
    "@bolio-ui/core": "file:$TARBALL",
    "next": "$NEXT_V",
    "react": "$REACT_V",
    "react-dom": "$REACT_V"
  }
}
JSON

cd "$WORK"
echo "== install (next@$NEXT_V react@$REACT_V)"
npm install --no-audit --no-fund --legacy-peer-deps > install.log 2>&1 || { echo "INSTALL FAILED"; tail -20 install.log; exit 1; }
echo "installed: next $(node -p "require('next/package.json').version") / react $(node -p "require('react/package.json').version")"

build() {
  # `next lint` during build was removed in Next 16, and the repo's ESLint
  # config is not meant for this app, so skip it where the flag exists.
  if [ "$(node -p "require('next/package.json').version.split('.')[0]")" -lt 16 ]; then
    npx next build --no-lint > build.log 2>&1
  else
    npx next build > build.log 2>&1
  fi
}

SERVER_ROUTE_BUILD="ok"
echo "== next build"
if build; then
  echo "build: OK"
else
  SERVER_ROUTE_BUILD="FAILED"
  echo "build: FAILED with all routes. Key errors:"
  grep -E "Error|error|Unhandled|not a function|use client" build.log | grep -v "Build error occurred" | head -6
  echo "-- end of build.log:"; grep -vE "^\s*$" build.log | tail -12
  echo "== retrying without the server-component route to measure the others"
  rm -rf app/app-server .next
  build && echo "build (without /app-server): OK" || { echo "build still FAILED"; grep -vE "^\s*$" build.log | tail -20; exit 1; }
fi

npx next start -p "$PORT" > start.log 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT
for i in $(seq 1 30); do curl -s -o /dev/null "http://localhost:$PORT/" && break; sleep 1; done

echo "== routes"
for route in / /app-client /app-server; do
  body="$(curl -s -w '\n%{http_code}' "http://localhost:$PORT$route")"
  code="$(echo "$body" | tail -1)"
  html="$(echo "$body" | sed '$d')"
  styles=$(echo "$html" | grep -o '<style' | wc -l | tr -d ' ')
  jsx=$(echo "$html" | grep -o 'jsx-[0-9]*' | sort -u | wc -l | tr -d ' ')
  [ "$route" = "/app-server" ] && [ "$SERVER_ROUTE_BUILD" = "FAILED" ] && { echo "$route -> BUILD FAILED (server component, see errors above)"; continue; }
  echo "$route -> HTTP $code | <style> tags in HTML: $styles | jsx- classes: $jsx"
done
