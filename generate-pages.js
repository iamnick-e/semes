// Generates docs/s/<slug>/index.html for each sound.
// Run once before deploying to GitHub Pages: node generate-pages.js

const fs   = require('fs');
const path = require('path');

const BASE_URL = 'https://iamnick-e.github.io/semes';

const sounds = [
  { name: 'Vine Boom',                        src: 'sounds/vine-boom.mp3',                              cat: 'viral', emoji: '💥' },
  { name: 'FAHHHHHHHHHHHHHH',                 src: 'sounds/fahhhhhhhhhhhhhh.mp3',                       cat: 'viral', emoji: '😱' },
  { name: 'Anime Wow',                        src: 'sounds/anime-wow-sound-effect.mp3',                 cat: 'meme',  emoji: '🌸' },
  { name: 'SpongeBob Fail',                   src: 'sounds/spongebob-fail.mp3',                         cat: 'tv',    emoji: '🧽' },
  { name: 'Among Us Role Reveal',             src: 'sounds/among-us-role-reveal-sound.mp3',             cat: 'game',  emoji: '🎮' },
  { name: 'Metal Pipe Clang',                 src: 'sounds/metal-pipe-clang.mp3',                       cat: 'meme',  emoji: '🔧' },
  { name: 'Rizz Sound Effect',                src: 'sounds/rizz-sound-effect.mp3',                      cat: 'viral', emoji: '😎' },
  { name: 'Dun Dun DUNNN',                    src: 'sounds/dun-dun-dun-sound-effect-brass_8nFBccR.mp3', cat: 'meme',  emoji: '🎺' },
  { name: 'Apple Pay',                        src: 'sounds/applepay.mp3',                               cat: 'sfx',   emoji: '💳' },
  { name: 'Undertaker Bell',                  src: 'sounds/undertakers-bell_2UwFCIe.mp3',               cat: 'tv',    emoji: '🔔' },
  { name: 'Dexter Meme',                      src: 'sounds/dexter-meme.mp3',                            cat: 'tv',    emoji: '🧪' },
  { name: 'Tuco: GET OUT',                    src: 'sounds/tuco-get-out.mp3',                           cat: 'tv',    emoji: '😤' },
  { name: 'Bone Crack',                       src: 'sounds/bone-crack.mp3',                             cat: 'sfx',   emoji: '🦴' },
  { name: 'Fart',                             src: 'sounds/dry-fart.mp3',                               cat: 'meme',  emoji: '💨' },
  { name: 'Error Sound',                      src: 'sounds/error_CDOxCYm.mp3',                          cat: 'sfx',   emoji: '⚠️' },
  { name: 'Yeah Boiii',                       src: 'sounds/yeah-boiii-i-i-i.mp3',                       cat: 'viral', emoji: '🎉' },
  { name: 'Hub Intro Sound',                  src: 'sounds/hub-intro-sound.mp3',                        cat: 'meme',  emoji: '🎵' },
  { name: 'What a Good Boy',                  src: 'sounds/what-a-good-boy.mp3',                        cat: 'viral', emoji: '🐕' },
  { name: 'ACK',                              src: 'sounds/ack.mp3',                                    cat: 'meme',  emoji: '😵' },
  { name: 'Camera Click',                     src: 'sounds/zvuk-fotoapparata.mp3',                      cat: 'sfx',   emoji: '📷' },
  { name: 'Galaxy Brain',                     src: 'sounds/galaxy-meme.mp3',                            cat: 'meme',  emoji: '🌌' },
  { name: 'Lizard Button',                    src: 'sounds/lizard-button.mp3',                          cat: 'meme',  emoji: '🦎' },
  { name: 'Romance',                          src: 'sounds/romanceeeeeeeeeeeeee.mp3',                   cat: 'meme',  emoji: '💕' },
  { name: 'I Am Going to Commit Great Crime', src: 'sounds/i-am-going-to-commit-great-crime.mp3',       cat: 'meme',  emoji: '😈' },
  { name: 'Rip My Granny Bazooka',            src: 'sounds/rip-my-granny-she-got-hit-by-a-bazooka.mp3', cat: 'viral', emoji: '💣' },
  { name: 'Rip My Granny Loud',               src: 'sounds/rip-my-granny-loud-asf.mp3',                cat: 'viral', emoji: '💀' },
  { name: 'Your Phone is Ringing',            src: 'sounds/youre-phone-is-ringing.mp3',                cat: 'sfx',   emoji: '📱' },
  { name: 'Yes! (Lara)',                      src: 'sounds/yes-lara-voice.mp3',                         cat: 'viral', emoji: '✅' },
  { name: 'Chicken Screaming',                src: 'sounds/chicken-on-tree-screaming.mp3',              cat: 'meme',  emoji: '🐔' },
  { name: 'We Are Charlie Kirk',              src: 'sounds/we-are-charlie-kirk-phone.mp3',               cat: 'viral', emoji: '📞' },
  { name: 'I Like Femboys',                   src: 'sounds/i-like-femboys_6JHIoHH.mp3',                 cat: 'viral', emoji: '🏳️‍🌈' },
  { name: 'FAAAH',                            src: 'sounds/faaah.mp3',                                  cat: 'viral', emoji: '🗣️' },
];

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function esc(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildPage(sound) {
  const slug     = slugify(sound.name);
  const title    = `${sound.emoji} ${sound.name}`;
  const pageUrl  = `${BASE_URL}/s/${slug}/`;
  const audioUrl = `${BASE_URL}/${sound.src}`;
  const embedUrl = `${pageUrl}?embed=1`;
  // Relative paths from docs/s/<slug>/index.html
  const audioRel = `../../${sound.src}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)} — Semes</title>

  <!-- Open Graph -->
  <meta property="og:type"        content="website" />
  <meta property="og:url"         content="${esc(pageUrl)}" />
  <meta property="og:title"       content="${esc(title)}" />
  <meta property="og:description" content="🔊 Tap to play on Semes" />
  <meta property="og:audio"       content="${esc(audioUrl)}" />
  <meta property="og:audio:type"  content="audio/mpeg" />
  <meta property="og:site_name"   content="Semes" />

  <!-- Twitter / X player card -->
  <meta name="twitter:card"          content="player" />
  <meta name="twitter:title"         content="${esc(title)}" />
  <meta name="twitter:description"   content="🔊 Tap to play on Semes" />
  <meta name="twitter:player"        content="${esc(embedUrl)}" />
  <meta name="twitter:player:width"  content="480" />
  <meta name="twitter:player:height" content="140" />

  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      background: #111318;
      color: #e8e8ec;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.25rem;
      padding: 1.5rem;
    }
    .player {
      background: #1e2028;
      border: 1.5px solid #2e3040;
      border-radius: 14px;
      padding: 1.5rem 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.5);
    }
    .sound-emoji { font-size: 3rem; line-height: 1; }
    .sound-name  { font-size: 1.15rem; font-weight: 700; text-align: center; line-height: 1.3; }
    .btn-play {
      background: #ff6622;
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 64px; height: 64px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem;
      transition: background 0.1s, transform 0.1s;
    }
    .btn-play:hover   { background: #ff4400; transform: scale(1.06); }
    .btn-play:active  { transform: scale(0.96); }
    .btn-play.playing { background: #cc4400; }
    .progress-wrap {
      width: 100%; height: 4px;
      background: #2e3040; border-radius: 2px; overflow: hidden;
    }
    .progress-fill { height: 100%; background: #ff6622; width: 0%; transition: width 0.1s linear; }
    .status    { font-size: 0.78rem; color: #666; min-height: 1em; }
    .back-link { font-size: 0.8rem; color: #555; text-decoration: none; }
    .back-link:hover { color: #ff6622; }
  </style>
</head>
<body>
  <div class="player">
    <div class="sound-emoji">${sound.emoji}</div>
    <div class="sound-name">${esc(sound.name)}</div>
    <button class="btn-play" id="btn" aria-label="Play">▶</button>
    <div class="progress-wrap"><div class="progress-fill" id="prog"></div></div>
    <div class="status" id="status"></div>
  </div>
  <a class="back-link" href="../../">← Back to Semes soundboard</a>

  <script>
    const btn    = document.getElementById('btn');
    const prog   = document.getElementById('prog');
    const status = document.getElementById('status');
    let audio    = null;

    function startAudio() {
      audio = new Audio('${audioRel}');
      btn.textContent = '⏸';
      btn.classList.add('playing');
      audio.addEventListener('timeupdate', () => {
        if (audio.duration) prog.style.width = (audio.currentTime / audio.duration * 100) + '%';
      });
      audio.addEventListener('ended', () => {
        btn.textContent = '▶';
        btn.classList.remove('playing');
        prog.style.width = '0%';
        status.textContent = '';
        audio = null;
      });
      return audio.play();
    }

    btn.addEventListener('click', () => {
      if (audio && !audio.paused) {
        audio.pause(); audio.currentTime = 0;
        btn.textContent = '▶'; btn.classList.remove('playing');
        prog.style.width = '0%'; status.textContent = '';
        return;
      }
      startAudio().catch(() => { status.textContent = ''; });
    });

    // Auto-play on load
    window.addEventListener('load', () => {
      startAudio().then(() => {
        status.textContent = 'Playing…';
      }).catch(() => {
        btn.textContent = '▶';
        btn.classList.remove('playing');
        status.textContent = 'Tap play to listen';
        audio = null;
      });
    });
  </script>
</body>
</html>`;
}

const outDir = path.join(__dirname, 'docs', 's');
fs.mkdirSync(outDir, { recursive: true });

let count = 0;
for (const sound of sounds) {
  const slug    = slugify(sound.name);
  const dir     = path.join(outDir, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), buildPage(sound), 'utf8');
  count++;
}

console.log(`Generated ${count} sound pages in docs/s/`);
