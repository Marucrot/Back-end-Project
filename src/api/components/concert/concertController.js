const concertService = require('./concertService');

async function createConcert(req, res, next) {
    try {
        const result = await concertService.createConcert(req.body);
        return res.status(201).json(result);
    } catch (error) {
        return next(error);
    }
}

async function getAllConcerts(req, res, next) {
    try {
        const result = await concertService.getAllConcerts(req.query);
        return res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
}

async function getConcertDetail(req, res, next) {
    try {
        const result = await concertService.getConcertDetail(req.params);
        return res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
}

async function updateConcert(req, res, next) {
    try {
        const result = await concertService.updateConcert({
        concert_id: req.params.concert_id,
        ...req.body,
        });
        return res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
}

async function publishConcert(req, res, next) {
    try {
        const result = await concertService.publishConcert(req.body);
        return res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
}

async function cancelConcert(req, res, next) {
    try {
        const result = await concertService.cancelConcert(req.body);
        return res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
}

async function addArtist(req, res, next) {
    try {
        const result = await concertService.addArtist({
        concert_id: req.params.concert_id,
        ...req.body,
        });
        return res.status(201).json(result);
    } catch (error) {
        return next(error);
    }
}

async function removeArtist(req, res, next) {
    try {
        const result = await concertService.removeArtist({
        concert_id: req.params.concert_id,
        artist_id: req.params.artist_id,
        });
        return res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
}

async function addTicketCategory(req, res, next) {
    try {
        const result = await concertService.addTicketCategory({
        concert_id: req.params.concert_id,
        ...req.body,
        });
        return res.status(201).json(result);
    } catch (error) {
        return next(error);
    }
}

async function deleteConcert(req, res, next) {
    try {
        const result = await concertService.deleteConcert(req.params);
        return res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    createConcert,
    getAllConcerts,
    getConcertDetail,
    updateConcert,
    publishConcert,
    cancelConcert,
    addArtist,
    removeArtist,
    addTicketCategory,
    deleteConcert,
};