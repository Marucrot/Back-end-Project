const db = require('../../../models');

const Payment = db.payments;
const Tiket = db.tiketing;

async function createPayment(payload) {
  return Payment.create(payload);
}

async function findPaymentById(paymentId) {
  return Payment.findById(paymentId).populate('ticketIds');
}

async function findPaymentByUserId(userId) {
  return Payment.find({ userId }).sort({ createdAt: -1 }).populate('ticketIds');
}

async function updatePaymentById(paymentId, payload) {
  return Payment.findByIdAndUpdate(paymentId, payload, { new: true });
}

async function updateTicketsStatus(ticketIds, payload) {
  return Tiket.updateMany(
    { _id: { $in: ticketIds } },
    { $set: payload }
  );
}

module.exports = {
  createPayment,
  findPaymentById,
  findPaymentByUserId,
  updatePaymentById,
  updateTicketsStatus,
};