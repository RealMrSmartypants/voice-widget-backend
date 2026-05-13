const express = require('express');
const twilio = require('twilio');
const router = express.Router();

// Access the credentials you saved in Railway
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKey = process.env.TWILIO_API_KEY;
const twilioApiSecret = process.env.TWILIO_API_SECRET;
const twimlAppSid = process.env.TWIML_APP_SID;
const inboundPhoneNumber = process.env.INBOUND_PHONE_NUMBER;

const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

/**
 * GET /api/twilio-token
 * This generates the security token that allows your website widget to start a call.
 */
router.get('/twilio-token', (req, res) => {
  try {
    const identity = 'user_' + Math.random().toString(36).substring(7);
    
    const token = new AccessToken(
      twilioAccountSid,
      twilioApiKey,
      twilioApiSecret,
      { identity: identity }
    );

    const grant = new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true,
    });

    token.addGrant(grant);

    res.json({ 
      identity: identity,
      token: token.toJwt() 
    });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

/**
 * POST /api/twiml/handle-call
 * This tells Twilio exactly what to do (dial Michelle) once the call starts.
 */
router.post('/twiml/handle-call', (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  
  // Optional: A quick greeting
  twiml.say('Connecting you to Michelle.');
  twiml.pause({ length: 1 });

  // Dial your SimpleTalk-connected phone number
  twiml.dial(inboundPhoneNumber);

  res.type('text/xml');
  res.send(twiml.toString());
});

module.exports = router;
