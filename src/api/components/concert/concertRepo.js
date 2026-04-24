const db = require('../../../models');

const Concert = db.concerts;

async function findAll() {
  return Concert.find().sort({ tanggal: 1 });
}

async function findById(concertId) {
  return Concert.findById(concertId);
}

async function createConcert(payload) {
  return Concert.create(payload);
}

async function updateConcertById(concertId, payload) {
  return Concert.findByIdAndUpdate(concertId, payload, { new: true });
}

async function deleteConcertById(concertId) {
  return Concert.findByIdAndDelete(concertId);
}

module.exports = {
  findAll,
  findById,
  createConcert,
  updateConcertById,
  deleteConcertById,
};
