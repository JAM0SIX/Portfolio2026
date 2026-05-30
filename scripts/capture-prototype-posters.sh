#!/usr/bin/env bash
# Capture a poster screenshot for each embedded prototype. The
# poster is shown in place of the live iframe when the visitor has
# `prefers-reduced-motion: reduce` set, so motion-sensitive users
# still see the moment the prototype opens on. Run while the dev
# server is up on localhost:3000.
set -e
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT="${PORT:-3000}"
# Each entry is "<slug>:<window-size>:<url-suffix>". url-suffix
# carries the HashRouter route (empty means /). We let Chrome wait
# for the natural network-idle signal before snapshotting rather
# than capping it with --virtual-time-budget — the heavier
# prototypes (Q4's editorial-pace verification flow especially)
# need real wall-clock time for their opening frame to settle.
CAPTURES=(
  "q1-contextual-search:1920,1080:#/q1"
  "q2-elaboration:1440,1080:#/q2"
  "q3-branching:1440,1080:#/q3"
  "q4-verification:1440,1080:#/q4"
)
for entry in "${CAPTURES[@]}"; do
  IFS=":" read -r slug size suffix <<< "$entry"
  echo "→ $slug ($size$suffix)"
  "$CHROME" \
    --headless=new \
    --disable-gpu \
    --hide-scrollbars \
    --window-size="$size" \
    --screenshot="public/prototypes/${slug}/poster.png" \
    "http://localhost:${PORT}/prototypes/${slug}/index.html${suffix}"
done
echo "✓ wrote ${#CAPTURES[@]} posters"
