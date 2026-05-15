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
  const dial = twiml.dial({ callerId: process.env.TWILIO_PHONE_NUMBER });
  dial.client({
    identity: process.env.SIMPLETALK_AGENT_ID,
    statusCallbackEvent: 'initiated ringing answered completed',
  }, process.env.SIMPLETALK_CLIENT_ID);
  res.type('text/xml');
  res.send(twiml.toString());
});

module.exports = router;
