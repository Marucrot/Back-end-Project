const Ticket = require('../../../models');

const cariId = (ticketId) => {
  return Ticket.findById(ticketId)
    .populate('userId', 'nama email')
    .populate('eventId', 'nama')     
    .populate('paymentId');
};

const cariUser = (userId) => {
  return Ticket.find({ userId })
    .populate('eventId', 'nama')
    .populate('paymentId')
    .sort({ createdAt: -1 });
};

const cariEvent = (eventId) => {
  return Ticket.find({ eventId });
};

const buat = (ticketData) => {
  const ticket = new Ticket(ticketData);
  return ticket.save();
};

const ubahStatus = (ticketId, status, extraFields = {}) => {
  return Ticket.findByIdAndUpdate(
    ticketId,
    { status, ...extraFields },
    { new: true }
  );
};

const cariKursi = (eventId, seatLabel) => {
  return Ticket.findOne({
    eventId,
    'seat.label': seatLabel,
    status: 'aktif', 
  });
};

module.exports = {
  cariId,
  cariUser,
  cariEvent,
  buat,
  ubahStatus,
  cariKursi,
};