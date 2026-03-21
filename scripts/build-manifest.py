#!/usr/bin/env python3
"""
Scans docs/s/*/index.html and builds docs/sounds.json
Run: python3 scripts/build-manifest.py
"""
import os, re, json

DOCS = os.path.join(os.path.dirname(__file__), '..', 'docs')
SOUNDS_DIR = os.path.join(DOCS, 's')
OUT = os.path.join(DOCS, 'sounds.json')

sounds = []

for slug in sorted(os.listdir(SOUNDS_DIR)):
    index = os.path.join(SOUNDS_DIR, slug, 'index.html')
    if not os.path.isfile(index):
        continue

    with open(index) as f:
        html = f.read()

    # Extract emoji + name from og:title
    og_title = re.search(r'og:title"\s+content="([^"]+)"', html)
    if not og_title:
        continue
    og = og_title.group(1).strip()
    # Split emoji from name — emoji is first "word" if it's non-ASCII
    parts = og.split(' ', 1)
    emoji = parts[0] if len(parts[0]) <= 4 and not parts[0].isascii() else '🔊'
    name  = parts[1] if len(parts) > 1 else og

    # Extract mp3 src from Audio() call
    mp3_match = re.search(r"new Audio\('../../sounds/([^']+)'\)", html)
    if not mp3_match:
        # Fallback: from og:audio
        mp3_match = re.search(r'og:audio"\s+content="[^"]+/sounds/([^"]+)"', html)
    if not mp3_match:
        print(f"SKIP (no mp3): {slug}")
        continue
    mp3 = mp3_match.group(1)

    # Extract category from inline comment or data attr (best effort)
    cat_match = re.search(r'data-cat="([^"]+)"', html)
    cat = cat_match.group(1) if cat_match else 'meme'

    sounds.append({
        "slug":  slug,
        "name":  name,
        "emoji": emoji,
        "src":   f"sounds/{mp3}",
        "cat":   cat,
    })
    print(f"  ✓ {slug}")

with open(OUT, 'w') as f:
    json.dump(sounds, f, indent=2, ensure_ascii=False)

print(f"\n✅ Wrote {len(sounds)} sounds to sounds.json")
