const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'docs'), {
  setHeaders(res, filePath) {
    if (filePath.endsWith('.mp3')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('Accept-Ranges', 'bytes');
    }
  }
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Semes running at:`);
  console.log(`  Local:     http://localhost:${PORT}`);
  console.log(`  Tailscale: http://100.85.14.119:${PORT}`);
});
