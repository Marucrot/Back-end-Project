const concertService = require('./concertService');

async function getAllConcerts(req, res, next) {
  try {
    const result = await concertService.getAllConcerts();
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function getConcertById(req, res, next) {
  try {
    const result = await concertService.getConcertById(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function createConcert(req, res, next) {
  try {
    const result = await concertService.createConcert(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

async function updateConcert(req, res, next) {
  try {
    const result = await concertService.updateConcert(req.params.id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function deleteConcert(req, res, next) {
  try {
    const result = await concertService.deleteConcert(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getAllConcerts,
  getConcertById,
  createConcert,
  updateConcert,
  deleteConcert,
};
