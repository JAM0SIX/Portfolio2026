#!/usr/bin/env bash
# Capture a 1200x720 screenshot of each experiment route into
# /public/experiments/<slug>.png. Run while the dev server is up
# on localhost:3000. Each route is loaded with ?embed=1 so the
# sidebar/footer/clock chrome is hidden — the screenshot shows
# only the experiment.
set -e
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT="${PORT:-3000}"
SLUGS=(stack booklog notebook dial sounds comet)
OUT="public/experiments"
mkdir -p "$OUT"
for slug in "${SLUGS[@]}"; do
  echo "→ $slug"
  "$CHROME" \
    --headless=new \
    --disable-gpu \
    --hide-scrollbars \
    --window-size=1200,720 \
    --virtual-time-budget=3000 \
    --screenshot="$OUT/${slug}.png" \
    "http://localhost:${PORT}/experiments/${slug}?embed=1"
done
echo "✓ wrote ${#SLUGS[@]} screenshots to $OUT/"
