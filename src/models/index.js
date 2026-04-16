const mongoose = require('mongoose');

const db = {};

db.users = require('./userModel')(mongoose);

module.exports = db;
