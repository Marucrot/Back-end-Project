const express = require('express');

const userController = require('./userController');

const route = express.Router();

module.exports = (app) => {
  app.use('/users', route);

  route.post('/register', userController.register);
  route.post('/login', userController.login);

  route.post('/req-change-password', userController.requestChangePassword);
  route.patch('/change-password', userController.changePassword);

  route.post('/req-change-email', userController.requestChangeEmail);
  route.patch('/change-email', userController.changeEmail);

  route.post('/req-change-phone', userController.requestChangePhone);
  route.patch('/change-phone', userController.changePhone);

  route.post('/req-delete-account', userController.requestDeleteAccount);
  route.delete('/delete-account', userController.deleteAccount);
};
