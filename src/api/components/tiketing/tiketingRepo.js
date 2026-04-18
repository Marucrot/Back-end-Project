const Ticket = require('../../../models/tiketingModel');

const cariId = (ticketId) => {
  return Ticket.findById(ticketId)
    .populate('userId', 'name email')   // adjust fields to match userModel
    .populate('eventId', 'name date')   // adjust fields to match eventModel
    .populate('paymentId');             // adjust fields to match paymentModel
};

const cariUser = (userId) => {
  return Ticket.find({ userId })
    .populate('eventId', 'name date')
    .populate('paymentId')
    .sort({ createdAt: -1 }); // newest first
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