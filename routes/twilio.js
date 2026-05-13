const express = require('express');
const twilio = require('twilio');
const router = express.Router();

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

const CONFIG = {
  inboundPhoneNumber: process.env.INBOUND_PHONE_NUMBER,
  apiKey: process.env.TWILIO_API_KEY,
  apiSecret: process.env.TWILIO_API_SECRET,
};

// This handles the call when Twilio starts the connection
router.post('/twiml/handle-call', (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  
  // Optional greeting before connecting to the AI
  twiml.say('Connecting you to the AI Assistant. Please wait.');
  twiml.pause({ length: 1 });

  // Connect the user directly to your SimpleTalk agent's number
  twiml.dial(CONFIG.inboundPhoneNumber);

  // Fallback if the connection fails
  twiml.say('We were unable to connect your call. Please try again later.');

  res.type('text/xml');
  res.send(twiml.toString());
});

// Endpoint for call status updates
router.post('/webhooks/call-status', (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
