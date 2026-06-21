#!/usr/bin/env bash
# Sync Coach 2026 font files from the shared Tapestry asset library into this app.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="/Users/johnnymartinez/Documents/Cursor - Tapestry/Coach/_assets/fonts"
APP_FONTS="$ROOT/src/app/fonts"
PUBLIC_FONTS="$ROOT/public/fonts/coach"

declare -A MAP=(
  ["HelveticaNeueLTPro-Lt.woff2"]="helvetica-neue-lt-pro-light.woff2"
  ["HelveticaNeueLTPro-Roman.woff2"]="helvetica-neue-lt-pro-roman.woff2"
  ["HelveticaNeueLTPro-Md.woff2"]="helvetica-neue-lt-pro-bold.woff2"
  ["HelveticaNeueLTPro-LtEx.woff2"]="helvetica-neue-lt-pro-light-extended.woff2"
  ["HelveticaNeueLTPro-Ex.woff2"]="helvetica-neue-lt-pro-extended.woff2"
)

mkdir -p "$APP_FONTS" "$PUBLIC_FONTS"

for src_name in "${!MAP[@]}"; do
  dst_name="${MAP[$src_name]}"
  cp "$SRC/$src_name" "$APP_FONTS/$dst_name"
  cp "$SRC/$src_name" "$PUBLIC_FONTS/$src_name"
  cp "$SRC/$src_name" "$PUBLIC_FONTS/$dst_name"
done

cp "$SRC/HelveticaNeueLTPro-Ex.woff2" "$APP_FONTS/helvetica-neue-lt-pro-extended-bold.woff2"

echo "Synced Coach fonts from $SRC"
