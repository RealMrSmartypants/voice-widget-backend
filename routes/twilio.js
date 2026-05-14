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
