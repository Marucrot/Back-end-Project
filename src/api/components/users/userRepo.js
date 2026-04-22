const db = require('../../../models');

const User = db.users;

async function findByEmail(email) {
  return User.findOne({ email: email.toLowerCase() });
}

async function findByPhone(nomorTelp) {
  return User.findOne({ nomor_telp: nomorTelp });
}

async function findByNik(nik) {
  return User.findOne({ nik });
}

async function createUser(payload) {
  return User.create(payload);
}

async function updateUserById(userId, payload) {
  return User.findByIdAndUpdate(userId, payload, { new: true });
}

async function deleteUserById(userId) {
  return User.findByIdAndDelete(userId);
}

module.exports = {
  findByEmail,
  findByPhone,
  findByNik,
  createUser,
  updateUserById,
  deleteUserById,
};
