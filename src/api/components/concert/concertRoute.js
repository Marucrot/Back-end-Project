const express = require('express');

const concertController = require('./concertController');

const route = express.Router();

module.exports = (app) => {
  app.use('/concerts', route);

  route.get('/', concertController.getAllConcerts);
  route.get('/:id', concertController.getConcertById);
  route.post('/', concertController.createConcert);
  route.patch('/:id', concertController.updateConcert);
  route.delete('/:id', concertController.deleteConcert);
};
