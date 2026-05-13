const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware setup to allow your GHL website to talk to this server
app.use(cors({
  origin: '*', 
  credentials: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Import the Twilio logic from the routes folder
const twilioRoutes = require('./routes/twilio');
app.use('/api', twilioRoutes);

// Simple health check to see if the server is alive
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Twilio backend running on port ${PORT}`);
});
