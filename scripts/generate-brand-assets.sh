#!/usr/bin/env bash
#
# Regenerates the derived brand assets that the storefront ships:
#   - public/icons/icon-{192,512}.png + icon-maskable-512.png  (manifest / PWA)
#   - src/app/apple-icon.png (180x180 iOS home screen)
#   - src/app/favicon.ico (16/32/48 legacy favicon)
#   - public/og/site-og.png (1200x630 default share card)
#   - public/og/collection-<slug>.png (1200x630 share card per collection)
#
# Everything is derived from the OWNER-SUPPLIED assets only:
#   public/images/products/real/Picsart_26-09-26_18-26-44-656.jpg (the MM logo)
#   public/images/products/real/*.jpg (the photographed collection)
# No artwork is invented. Requires ImageMagick (convert).
set -euo pipefail

cd "$(dirname "$0")/.."

LOGO="public/images/products/real/Picsart_26-09-26_18-26-44-656.jpg"
INK="#11110f"
PAPER="#f3f1eb"
SANS="DejaVu-Sans-Bold"
# The brand serif italic ships as WOFF1 in node_modules; freetype needs TTF.
SERIF="${TMPDIR:-/tmp}/instrument-serif-latin-400-italic.ttf"
if [ ! -f "$SERIF" ] && [ -f node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff ]; then
  python3 scripts/woff_to_ttf.py \
    node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff "$SERIF" >/dev/null
fi

if ! command -v convert >/dev/null 2>&1; then
  echo "ImageMagick (convert) is required to regenerate brand assets." >&2
  exit 1
fi

mkdir -p public/icons public/og

# --- 1. Monogram mask: white MM mark on transparent, from the supplied logo.
# The logo's monogram sits around the centre of the 4096x4096 original.
MONO_MASK="$(mktemp /tmp/mm-mask-XXXX.png)"
convert "$LOGO" -crop 2100x2100+1000+650 +repage \
  -colorspace Gray -threshold 45% -negate \
  -resize 1024x1024 "$MONO_MASK"

# Simpler, robust route: screen-blend the white monogram over an ink square.
mono_icon() { # $1 = output, $2 = size, $3 = mask scale (%)
  local out="$1" size="$2" scale="$3"
  local mask
  mask="$(mktemp /tmp/mm-scaled-XXXX.png)"
  convert "$MONO_MASK" -resize "${scale}%" "$mask"
  convert -size "${size}x${size}" "xc:${INK}" "$mask" -gravity center \
    -compose Screen -composite -colorspace sRGB "$out"
  rm -f "$mask"
}

mono_icon public/icons/icon-512.png 512 72%
mono_icon public/icons/icon-192.png 192 68%
mono_icon public/icons/icon-maskable-512.png 512 58%
mono_icon src/app/apple-icon.png 180 66%

convert public/icons/icon-512.png -resize 48x48 /tmp/mm-48.png
convert public/icons/icon-512.png -resize 32x32 /tmp/mm-32.png
convert public/icons/icon-512.png -resize 16x16 /tmp/mm-16.png
convert /tmp/mm-16.png /tmp/mm-32.png /tmp/mm-48.png src/app/favicon.ico

# --- 2. Share cards (1200x630).
share_card() { # $1 out, $2 photo, $3 eyebrow, $4 line1, $5 line1 pt, $6 line2, $7 footnote
  local out="$1" photo="$2" eyebrow="$3" l1="$4" l1pt="$5" l2="$6" foot="$7"
  convert -size 1200x630 "xc:${INK}" \
    \( "$photo" -resize 620x630^ -gravity center -extent 620x630 \
       -modulate 100,96 -brightness-contrast -2x6 \) \
    -gravity East -geometry +0+0 -composite \
    \( -size 560x630 -debug none "xc:${INK}" \) -gravity West -geometry +0+0 -composite \
    -fill "${PAPER}" -font "$SANS" -pointsize 20 -kerning 5 \
    -gravity NorthWest -annotate +64+86 "$eyebrow" \
    -fill "${PAPER}" -draw "rectangle 64,124 128,127" \
    -font "$SANS" -pointsize "$l1pt" -kerning -2 \
    -annotate +60+170 "$l1" \
    -font "$SERIF" -pointsize 82 -kerning 0 \
    -annotate +60+262 "$l2" \
    -font "$SANS" -pointsize 19 -kerning 3 \
    -fill "#8f8d85" \
    -annotate +64+470 "$foot" \
    -fill "${PAPER}" -draw "rectangle 64,520 520,521" \
    -font "$SANS" -pointsize 21 -kerning 4 \
    -fill "${PAPER}" \
    -annotate +64+548 "MEMORY MAKERS  /  MM WEARABLE" \
    -depth 8 -strip -quality 84 -colorspace sRGB "$out"
}

share_card public/og/site-og.jpg \
  public/images/products/real/photo_14_2026-11-05_14-26-43.jpg \
  "THE PHOTOGRAPHED COLLECTION" \
  "WEAR YOUR" 78 \
  "Memories." \
  "INR 600 PER TEE · FREE SHIPPING INDIA-WIDE"

share_card public/og/collection-graphic-tees.jpg \
  public/images/products/real/photo_4_2026-11-05_14-26-42.jpg \
  "COLLECTION 01" \
  "GRAPHIC" 78 \
  "Tees." \
  "CREW NECKS · INR 600 EACH"

share_card public/og/collection-graphic-polos.jpg \
  public/images/products/real/photo_2_2026-11-05_14-26-42.jpg \
  "COLLECTION 02" \
  "GRAPHIC" 78 \
  "Polos." \
  "FOLD-DOWN COLLARS · INR 600 EACH"

share_card public/og/collection-stand-collar-tees.jpg \
  public/images/products/real/photo_10_2026-11-05_14-26-42.jpg \
  "COLLECTION 03" \
  "STAND-COLLAR" 60 \
  "Tees." \
  "UPRIGHT COLLARS · INR 600 EACH"

rm -f "$MONO_MASK" /tmp/mm-16.png /tmp/mm-32.png /tmp/mm-48.png

echo "Brand assets regenerated:"
identify public/icons/*.png src/app/apple-icon.png src/app/favicon.ico public/og/*.jpg | sed 's/^/  /'
