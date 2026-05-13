const express = require('express');
const twilio = require('twilio');
const router = express.Router();

// ... (Keep your variable declarations)

/**
 * GET /api/twilio-token 
 * (Mapped correctly because server.js uses app.use('/api', twilioRoutes))
 */
router.get('/twilio-token', (req, res) => {
  // ... (Keep token generation logic)
});

/**
 * POST /api/twiml/handle-call
 * (This must match what you enter in the Twilio Console)
 */
router.post('/twiml/handle-call', (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  twiml.say('Connecting you to Michelle.');
  twiml.pause({ length: 1 });
  twiml.dial(process.env.INBOUND_PHONE_NUMBER); 

  res.type('text/xml');
  res.send(twiml.toString());
});

module.exports = router;
