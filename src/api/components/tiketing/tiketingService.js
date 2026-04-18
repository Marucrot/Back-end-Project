const repo = require('./tiketingRepo');

const getTicketById = async (ticketId, requestingUserId) => {
  const ticket = await repo.cariId(ticketId);

  if (!ticket) {
    const err = new Error('Ticket not found.');
    err.statusCode = 404;
    throw err;
  }

  if (ticket.userId._id.toString() !== requestingUserId.toString()) {
    const err = new Error('Access denied. This ticket does not belong to you.');
    err.statusCode = 403;
    throw err;
  }

  return ticket;
};


const getMyTickets = async (userId) => {
  const tickets = await repo.cariUser(userId);
  return tickets;
};

const getSeatAvailability = async (eventId) => {
  const tickets = await repo.cariEvent(eventId);

  if (!tickets.length) {
    return { takenSeats: [], message: 'No tickets booked for this event yet.' };
  }

  const takenSeats = tickets
    .filter((t) => t.status === 'aktif')
    .map((t) => ({
      label: t.seat.label,
      section: t.seat.section,
    }));

  return { takenSeats };
};

const cancelTicket = async (ticketId, requestingUserId) => {
  const ticket = await repo.cariId(ticketId);

  if (!ticket) {
    const err = new Error('Ticket not found.');
    err.statusCode = 404;
    throw err;
  }

  if (ticket.userId._id.toString() !== requestingUserId.toString()) {
    const err = new Error('Access denied. This ticket does not belong to you.');
    err.statusCode = 403;
    throw err;
  }

  if (ticket.status !== 'aktif') {
    const err = new Error(
      `Tiket tidak dapat dibatalkan. Status saat ini: "${ticket.status}".`
    );
    err.statusCode = 400;
    throw err;
  }

  return repo.ubahStatus(ticketId, 'dibatalkan', { cancelledAt: new Date() });
};

const refundTicket = async (ticketId, requestingUserId) => {
  const ticket = await repo.cariId(ticketId);

  if (!ticket) {
    const err = new Error('Ticket not found.');
    err.statusCode = 404;
    throw err;
  }

  if (ticket.userId._id.toString() !== requestingUserId.toString()) {
    const err = new Error('Access denied. This ticket does not belong to you.');
    err.statusCode = 403;
    throw err;
  }

  if (ticket.status !== 'dibatalkan') {
    const err = new Error('Tiket harus dibatalkan terlebih dahulu sebelum dapat direfund.');
    err.statusCode = 400;
    throw err;
  }


    // REMINDER: MASUKIN SISTEM REFUND WOI KALO UDAH ADA

  return repo.ubahStatus(ticketId, 'dikembalikan', { refundedAt: new Date() });
};

module.exports = {
  getTicketById,
  getMyTickets,
  getSeatAvailability,
  cancelTicket,
  refundTicket,
};