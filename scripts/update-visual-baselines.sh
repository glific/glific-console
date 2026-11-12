#!/bin/sh
# Regenerates Playwright visual baselines inside the official Playwright image so they match CI
# pixel-for-pixel (fonts, anti-aliasing). Never commit baselines generated on your own machine.
set -eu

PLAYWRIGHT_VERSION=$(node -p "require('./node_modules/@playwright/test/package.json').version")
IMAGE="mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble"

docker run --rm --ipc=host \
  -v "$(pwd)":/work -w /work \
  -v glific-console-node-modules:/work/node_modules \
  -e CI=1 \
  "$IMAGE" \
  sh -c "corepack enable && pnpm install --frozen-lockfile && pnpm exec playwright test --grep @visual --update-snapshots=all ${*:-}"
