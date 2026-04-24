const { Tiketing } = require('../../../models');

const cariId = (ticketId) => {
  return Tiketing.findById(ticketId)
    .populate('eventId', 'nama')
    .populate('paymentId')
    .lean();
};

const cariUser = (userId) => {
  return Tiketing.find({ userId })
    .populate('eventId', 'nama')
    .populate('paymentId')
    .sort({ createdAt: -1 })
    .lean();
};

const cariEvent = (eventId) => {
  return Tiketing.find({ eventId }).lean();
};

const buat = (ticketData) => {
  const ticket = new Tiketing(ticketData);
  return ticket.save();
};

const ubahStatus = (ticketId, status, extraFields = {}) => {
  return Tiketing.findByIdAndUpdate(
    ticketId,
    { status, ...extraFields },
    { new: true }
  );
};

const cariKursi = (eventId, seatLabel) => {
  return Tiketing.findOne({
    eventId,
    'seat.label': seatLabel,
    status: 'aktif',
  }).lean();
};

module.exports = {
  cariId,
  cariUser,
  cariEvent,
  buat,
  ubahStatus,
  cariKursi,
};