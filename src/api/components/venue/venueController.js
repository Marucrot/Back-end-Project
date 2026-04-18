const venueService = require('./venueService');

async function semuaVenue(req, res, next) {
  try {
    const result = await venueService.semuaVenue();
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function detailVenue(req, res, next) {
  try {
    const result = await venueService.detailVenue(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function tambahVenue(req, res, next) {
  try {
    const result = await venueService.tambahVenue(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

async function updateVenue(req, res, next) {
  try {
    const result = await venueService.updateVenue(req.params.id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function hapusVenue(req, res, next) {
  try {
    const result = await venueService.hapusVenue(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function kursiVenue(req, res, next) {
  try {
    const result = await venueService.kursiVenue(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  semuaVenue,
  detailVenue,
  tambahVenue,
  updateVenue,
  hapusVenue,
  kursiVenue,
};