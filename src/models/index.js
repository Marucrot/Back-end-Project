const mongoose = require('mongoose');

const db = {};

db.users = require('./userModel');
db.payments = require('./paymentModel');
db.venues = require('./venueModel');

module.exports = db;
