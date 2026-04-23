const express = require('express');
const tiketingController = require('./tiketingController');

const route = express.Router();

module.exports = (app) => {
  app.use('/tiketing', route);

  route.post('/detail', tiketingController.getTicketById);

  route.post('/my-tickets', tiketingController.getMyTickets);

  route.post('/seats', tiketingController.getSeatAvailability);

  route.post('/cancel', tiketingController.cancelTicket);

  route.post('/refund', tiketingController.refundTicket);
};
