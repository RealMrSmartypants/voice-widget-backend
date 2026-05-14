const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const https = require('https');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const twilioRoutes = require('./twilio');
app.use('/api', twilioRoutes);

app.get('/', (req, res) => {
  res.send('Voice Widget Backend Running');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/sdk/twilio-voice.js', (req, res) => {
  const url = 'https://sdk.twilio.com/js/voice/releases/2.12.0/twilio.min.js';
  https.get(url, (sdkRes) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Access-Control-Allow-Origin', '*');
    sdkRes.pipe(res);
  }).on('error', (e) => {
    res.status(500).send('SDK fetch failed');
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
