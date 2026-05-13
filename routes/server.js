const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Absolute Instruction: Use origin '*' for GHL compatibility
app.use(cors({
  origin: '*'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Nomenclature: Import the router from your specific filename
const twilioRoutes = require('./twilio-backend');

app.use('/api', twilioRoutes);

app.get('/', (req, res) => {
  res.send('Voice Widget Backend Running');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Operational Requirement: Listen on Port 8080 as identified in your logs
const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
Step 3: Update twilio-backend.js
The current source for twilio-backend.js has empty logic for token generation
. Update it with the following to ensure the widget can actually receive a valid JWT:
const express = require('express');
const twilio = require('twilio');
const router = express.Router();

const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

router.get('/twilio-token', (req, res) => {
  try {
    const identity = 'user_' + Math.random().toString(36).substring(7);
    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY,
      process.env.TWILIO_API_SECRET,
      { identity: identity }
    );

    const grant = new VoiceGrant({
      outgoingApplicationSid: process.env.TWIML_APP_SID,
      incomingAllow: true,
    });

    token.addGrant(grant);
    res.json({ token: token.toJwt() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/twiml/handle-call', (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  twiml.say('Connecting you to Michelle.'); // Name: Michelle [8]
  twiml.dial(process.env.INBOUND_PHONE_NUMBER); 
  res.type('text/xml');
  res.send(twiml.toString());
});

module.exports = router;
