const express = require('express');
const twilio = require('twilio');

const router = express.Router();

const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

router.get('/twilio-token', (req, res) => {
  try {
    const requiredVars = [
      'TWILIO_ACCOUNT_SID',
      'TWILIO_API_KEY',
      'TWILIO_API_SECRET',
      'TWIML_APP_SID',
      'INBOUND_PHONE_NUMBER'
    ];

    const missingVars = requiredVars.filter((key) => !process.env[key]);

    if (missingVars.length > 0) {
      return res.status(500).json({
        error: 'Missing required Railway variables',
        missing: missingVars
      });
    }

    const identity = `user_${Date.now()}`;

    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY,
      process.env.TWILIO_API_SECRET,
      { identity }
    );

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: process.env.TWIML_APP_SID,
      incomingAllow: true
    });

    token.addGrant(voiceGrant);

    res.json({
      token: token.toJwt(),
      identity
    });
  } catch (error) {
    console.error('Token generation failed:', error);

    res.status(500).json({
      error: 'Token generation failed',
      details: error.message
    });
  }
});

router.post('/twiml/handle-call', (req, res) => {
  try {
    const twiml = new twilio.twiml.VoiceResponse();

    twiml.say('Connecting you to Michelle.');
    twiml.dial(process.env.INBOUND_PHONE_NUMBER);

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('TwiML generation failed:', error);

    res.status(500).json({
      error: 'TwiML generation failed',
      details: error.message
    });
  }
});

router.post('/webhooks/recording-status', (req, res) => {
  console.log('Recording status webhook:', req.body);
  res.sendStatus(200);
});

router.post('/webhooks/call-status', (req, res) => {
  console.log('Call status webhook:', req.body);
  res.sendStatus(200);
});

module.exports = router;
