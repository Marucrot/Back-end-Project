const express = require('express');
const users = require('./components/users/userRoute');
const payment = require('./components/payment/paymentRoute');

module.exports = () => {
  const app = express.Router();

  users(app);
  payment(app);

  return app;
};
