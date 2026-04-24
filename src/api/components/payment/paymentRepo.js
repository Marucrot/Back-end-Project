const db = require('../../../models');

const Payment = db.Payment;
const Tiket = db.Tiketing;

async function createPayment(payload) {
  return Payment.create(payload);
}

async function findPaymentById(paymentId) {
  return Payment.findById(paymentId).populate('ticketIds');
}

async function findPaymentByUserId(userId) {
  return Payment.find({ userId })
    .sort({ createdAt: -1 })
    .populate('ticketIds');
}

async function updatePaymentById(paymentId, payload) {
  return Payment.findByIdAndUpdate(paymentId, payload, { new: true });
}

async function findTicketById(ticketId) {
  return Tiket.findById(ticketId);
}

async function createTicket(payload) {
  return Tiket.create(payload);
}

async function findTakenSeat(eventId, seatLabel) {
  return Tiket.findOne({
    eventId,
    'seat.label': seatLabel,
    status: { $in: ['pending', 'aktif'] },
  });
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
  findTicketById,
  createTicket,
  findTakenSeat,
  updateTicketsStatus,
};