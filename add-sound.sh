#!/usr/bin/env bash
# add-sound.sh — Add a new sound to Semes
#
# Usage:
#   ./add-sound.sh <myinstants-url>
#   ./add-sound.sh <myinstants-url> "Custom Name" "🎵" meme
#
# Examples:
#   ./add-sound.sh https://www.myinstants.com/en/instant/sad-trombone/
#   ./add-sound.sh https://www.myinstants.com/en/instant/sad-trombone/ "Sad Trombone" "🎺" meme

set -e

DOCS="$(dirname "$0")/docs"
SOUNDS_DIR="$DOCS/sounds"
PAGES_DIR="$DOCS/s"
BASE_URL="https://iamnick-e.github.io/semes"

URL="$1"
CUSTOM_NAME="$2"
CUSTOM_EMOJI="$3"
CUSTOM_CAT="${4:-meme}"

if [ -z "$URL" ]; then
  echo "Usage: $0 <myinstants-url> [name] [emoji] [cat]"
  echo "  cat options: meme viral sfx game tv"
  exit 1
fi

echo "🔍 Fetching page: $URL"

# Scrape name + mp3 from myinstants page
PAGE=$(curl -s -A "Mozilla/5.0" "$URL")

# Extract mp3 filename
MP3=$(echo "$PAGE" | grep -o "play('/media/sounds/[^']*\.mp3'" | head -1 | sed "s/play('\/media\/sounds\///" | sed "s/'//")
if [ -z "$MP3" ]; then
  echo "❌ Could not find MP3 on that page. Check the URL."
  exit 1
fi

# Extract title
PAGE_TITLE=$(echo "$PAGE" | grep -o '<title>[^<]*</title>' | sed 's/<[^>]*>//g' | sed 's/ sound button.*//i' | sed 's/ - Myinstants//' | xargs)

NAME="${CUSTOM_NAME:-$PAGE_TITLE}"
EMOJI="${CUSTOM_EMOJI:-🔊}"

# Derive slug from name
SLUG=$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')

echo "  Name:  $NAME"
echo "  Emoji: $EMOJI"
echo "  Slug:  $SLUG"
echo "  MP3:   $MP3"
echo "  Cat:   $CUSTOM_CAT"
echo ""

# Check if slug already exists
if [ -d "$PAGES_DIR/$SLUG" ]; then
  echo "⚠️  Slug '$SLUG' already exists. Use a custom name to override."
  exit 1
fi

# Download MP3
DEST="$SOUNDS_DIR/$MP3"
if [ -f "$DEST" ]; then
  echo "✓ MP3 already exists, skipping download"
else
  echo "⬇️  Downloading $MP3..."
  curl -s -L -A "Mozilla/5.0" -o "$DEST" "https://www.myinstants.com/media/sounds/$MP3"
  SIZE=$(wc -c < "$DEST")
  if [ "$SIZE" -lt 5000 ]; then
    rm "$DEST"
    echo "❌ Download failed or file too small (${SIZE} bytes)"
    exit 1
  fi
  echo "✓ Downloaded ($(( SIZE / 1024 ))KB)"
fi

# Create player page
mkdir -p "$PAGES_DIR/$SLUG"
cat > "$PAGES_DIR/$SLUG/index.html" << HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${EMOJI} ${NAME} — Semes</title>
  <meta property="og:type"        content="website" />
  <meta property="og:url"         content="${BASE_URL}/s/${SLUG}/" />
  <meta property="og:title"       content="${EMOJI} ${NAME}" />
  <meta property="og:description" content="🔊 Tap to play on Semes" />
  <meta property="og:audio"       content="${BASE_URL}/sounds/${MP3}" />
  <meta property="og:audio:type"  content="audio/mpeg" />
  <meta property="og:site_name"   content="Semes" />
  <meta name="twitter:card"          content="player" />
  <meta name="twitter:title"         content="${EMOJI} ${NAME}" />
  <meta name="twitter:description"   content="🔊 Tap to play on Semes" />
  <meta name="twitter:player"        content="${BASE_URL}/s/${SLUG}/?embed=1" />
  <meta name="twitter:player:width"  content="480" />
  <meta name="twitter:player:height" content="140" />
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      background: #111318; color: #e8e8ec;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh; display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 1.25rem; padding: 1.5rem;
    }
    .player {
      background: #1e2028; border: 1.5px solid #2e3040; border-radius: 14px;
      padding: 1.5rem 2rem; display: flex; flex-direction: column;
      align-items: center; gap: 1rem; width: 100%; max-width: 420px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.5);
    }
    .sound-emoji { font-size: 3rem; line-height: 1; }
    .sound-name  { font-size: 1.15rem; font-weight: 700; text-align: center; line-height: 1.3; }
    .btn-play {
      background: #ff6622; color: #fff; border: none; border-radius: 50%;
      width: 64px; height: 64px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem; transition: background 0.1s, transform 0.1s;
    }
    .btn-play:hover   { background: #ff4400; transform: scale(1.06); }
    .btn-play:active  { transform: scale(0.96); }
    .btn-play.playing { background: #cc4400; }
    .progress-wrap { width: 100%; height: 4px; background: #2e3040; border-radius: 2px; overflow: hidden; }
    .progress-fill { height: 100%; background: #ff6622; width: 0%; transition: width 0.1s linear; }
    .status    { font-size: 0.78rem; color: #666; min-height: 1em; }
    .back-link { font-size: 0.8rem; color: #555; text-decoration: none; }
    .back-link:hover { color: #ff6622; }
  </style>
</head>
<body>
  <div class="player">
    <div class="sound-emoji">${EMOJI}</div>
    <div class="sound-name">${NAME}</div>
    <button class="btn-play" id="btn" aria-label="Play">▶</button>
    <div class="progress-wrap"><div class="progress-fill" id="prog"></div></div>
    <div class="status" id="status"></div>
  </div>
  <a class="back-link" href="../../">← Back to Semes soundboard</a>
  <script>
    const btn = document.getElementById('btn');
    const prog = document.getElementById('prog');
    const status = document.getElementById('status');
    let audio = null;
    function startAudio() {
      audio = new Audio('../../sounds/${MP3}');
      btn.textContent = '⏸'; btn.classList.add('playing');
      audio.addEventListener('timeupdate', () => {
        if (audio.duration) prog.style.width = (audio.currentTime / audio.duration * 100) + '%';
      });
      audio.addEventListener('ended', () => {
        btn.textContent = '▶'; btn.classList.remove('playing');
        prog.style.width = '0%'; status.textContent = ''; audio = null;
      });
      return audio.play();
    }
    btn.addEventListener('click', () => {
      if (audio && !audio.paused) {
        audio.pause(); audio.currentTime = 0;
        btn.textContent = '▶'; btn.classList.remove('playing');
        prog.style.width = '0%'; status.textContent = ''; return;
      }
      startAudio().catch(() => {});
    });
    window.addEventListener('load', () => {
      startAudio().then(() => { status.textContent = 'Playing…'; }).catch(() => {
        btn.textContent = '▶'; btn.classList.remove('playing');
        status.textContent = 'Tap play to listen'; audio = null;
      });
    });
  </script>
</body>
</html>
HTML

echo "✓ Created docs/s/$SLUG/index.html"

# Rebuild manifest
echo "🔄 Rebuilding sounds.json..."
python3 "$(dirname "$0")/scripts/build-manifest.py"

# Commit and push
echo ""
echo "📦 Committing..."
cd "$(dirname "$0")"
git add -A
git commit -m "feat: add sound — ${NAME}"
git push

echo ""
echo "✅ Done! Live at: ${BASE_URL}/s/${SLUG}/"
