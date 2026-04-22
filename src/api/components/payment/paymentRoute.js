const express = require('express');
const paymentController = require('./paymentController');

const route = express.Router();

module.exports = (app) => {
  app.use('/payments', route);
  
  route.post('/create', paymentController.createPayment);
  route.post('/checkout', paymentController.checkoutPayment);
  route.post('/status', paymentController.checkStatus);
  route.post('/cancel', paymentController.cancelPayment);
  route.post('/history', paymentController.paymentHistory);
};