const mongoose = require('mongoose');

const db = {};

db.users = require('./userModel');
db.payments = require('./paymentModel');
db.venues = require('./venueModel');
db.tiketing = require('./tiketingModel');
db.concert = require('./concertModel')

module.exports = db;