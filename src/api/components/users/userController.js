const userService = require('./userService');

async function register(req, res, next) {
  try {
    const result = await userService.register(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await userService.login(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function requestChangePassword(req, res, next) {
  try {
    const result = await userService.requestChangePassword(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function changePassword(req, res, next) {
  try {
    const result = await userService.changePassword(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function requestChangeEmail(req, res, next) {
  try {
    const result = await userService.requestChangeEmail(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function changeEmail(req, res, next) {
  try {
    const result = await userService.changeEmail(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function requestChangePhone(req, res, next) {
  try {
    const result = await userService.requestChangePhone(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function changePhone(req, res, next) {
  try {
    const result = await userService.changePhone(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function requestDeleteAccount(req, res, next) {
  try {
    const result = await userService.requestDeleteAccount(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function deleteAccount(req, res, next) {
  try {
    const result = await userService.deleteAccount(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  requestChangePassword,
  changePassword,
  requestChangeEmail,
  changeEmail,
  requestChangePhone,
  changePhone,
  requestDeleteAccount,
  deleteAccount,
};
