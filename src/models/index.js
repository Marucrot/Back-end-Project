const mongoose = require('mongoose');

const db = {};

db.users = require('./userModel')(mongoose);
db.payments = require('./paymentModel');

module.exports = db;
