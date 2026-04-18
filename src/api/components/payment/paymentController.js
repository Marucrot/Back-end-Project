const paymentService = require('./paymentService');

async function createPayment(req, res, next) {
  try {
    const result = await paymentService.createPayment(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

async function checkoutPayment(req, res, next) {
  try {
    const result = await paymentService.checkoutPayment(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function checkStatus(req, res, next) {
  try {
    const result = await paymentService.checkStatus(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function cancelPayment(req, res, next) {
  try {
    const result = await paymentService.cancelPayment(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function paymentHistory(req, res, next) {
  try {
    const result = await paymentService.paymentHistory(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createPayment,
  checkoutPayment,
  checkStatus,
  cancelPayment,
  paymentHistory,
};