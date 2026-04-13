const express = require('express');
const users = require('./components/users/userRoute');

module.exports = () => {
  const app = express.Router();

  users(app);

  return app;
};
