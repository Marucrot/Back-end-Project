const express = require('express');
const concertController = require('./concertController');

const route = express.Router();

module.exports = (app) => {
    app.use('/concerts', route);

    route.post('/create', concertController.createConcert);
    route.get('/', concertController.getAllConcerts);
    route.get('/:concert_id', concertController.getConcertDetail);
    route.put('/:concert_id', concertController.updateConcert);
    route.delete('/:concert_id', concertController.deleteConcert);

    route.post('/publish', concertController.publishConcert);
    route.post('/cancel', concertController.cancelConcert);

    route.post('/:concert_id/artists', concertController.addArtist);
    route.delete('/:concert_id/artists/:artist_id', concertController.removeArtist);

    route.post('/:concert_id/ticket-categories', concertController.addTicketCategory);
};