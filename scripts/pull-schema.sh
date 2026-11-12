#!/bin/sh
# Regenerates schema/glific.graphql from a local checkout of the glific backend, then the TypeScript types.
set -eu
BACKEND_DIR="${GLIFIC_BACKEND_DIR:-../glific}"
OUT="$(pwd)/schema/glific.graphql"
(cd "$BACKEND_DIR" && mix absinthe.schema.sdl --schema GlificWeb.Schema "$OUT")
pnpm codegen
