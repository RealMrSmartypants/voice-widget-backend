const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/sdk', express.static(path.join(__dirname, '..', 'public')));

const twilioRoutes = require('./twilio');
app.use('/api', twilioRoutes);

app.get('/', (req, res) => {
  res.send('Voice Widget Backend Running');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const publicDir = path.join(__dirname, '..', 'public');
const sdkPath = path.join(publicDir, 'twilio.min.js');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

if (!fs.existsSync(sdkPath)) {
  console.log('Downloading Twilio SDK...');
  const file = fs.createWriteStream(sdkPath);
  https.get('https://cdn.jsdelivr.net/npm/@twilio/voice-sdk@2.12.0/dist/twilio.min.js', (res) => {
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Twilio SDK downloaded successfully.');
    });
  }).on('error', (err) => {
    fs.unlink(sdkPath, () => {});
    console.error('SDK download failed:', err.message);
  });
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
