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
  twiml.say('Connecting you to Michelle.'); // Name: Michelle [6]
  twiml.dial(process.env.INBOUND_PHONE_NUMBER); 
  res.type('text/xml');
  res.send(twiml.toString());
});

module.exports = router;
3. Update server.js
Ensure your server.js correctly references the updated twilio.js and allows CORS from your website
:
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const twilioRoutes = require('./twilio'); // Matches filename twilio.js
app.use('/api', twilioRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
