const express = require('express');
const users = require('./components/users/userRoute');
const payment = require('./components/payment/paymentRoute');
const venue = require('./components/venue/venueRoute');
const tiketing = require('./components/tiketing/tiketingRoute');

module.exports = () => {
  const app = express.Router();

  users(app);
  payment(app);
  venue(app);
  tiketing(app);

  return app;
};
