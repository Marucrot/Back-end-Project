const express = require('express');
const venueController = require('./venueController');

const route = express.Router();

module.exports = (app) => {
  app.use('/venues', route);

  route.get('/', venueController.semuaVenue);
  route.get('/:id', venueController.detailVenue);
  route.get('/:id/kursi', venueController.kursiVenue);
  route.post('/', venueController.tambahVenue);
  route.put('/:id', venueController.updateVenue);
  route.delete('/:id', venueController.hapusVenue);
};