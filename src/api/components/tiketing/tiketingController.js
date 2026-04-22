const tiketingService = require('./tiketingService');

const getTicketById = async (req, res) => {
  try {
    const { user_id: userId, ticket_id: ticketId } = req.body;

    if (!userId || !ticketId) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    const ticket = await tiketingService.getTicketById(ticketId, userId);

    return res.status(200).json({
      message: 'Tiket berhasil diambil',
      data: ticket,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message || 'Internal server error.',
    });
  }
};

const getMyTickets = async (req, res) => {
  try {
    const { user_id: userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'user_id wajib diisi' });
    }

    const tickets = await tiketingService.getMyTickets(userId);

    return res.status(200).json({
      message: 'Tiket berhasil diambil',
      count: tickets.length,
      data: tickets,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message || 'Internal server error.',
    });
  }
};

// POST body: { event_id }
const getSeatAvailability = async (req, res) => {
  try {
    const { event_id: eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: 'event_id wajib diisi' });
    }

    const result = await tiketingService.getSeatAvailability(eventId);

    return res.status(200).json({
      message: 'Kursi berhasil diambil',
      data: result,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message || 'Internal server error.',
    });
  }
};

// POST body: { user_id, ticket_id }
const cancelTicket = async (req, res) => {
  try {
    const { user_id: userId, ticket_id: ticketId } = req.body;

    if (!userId || !ticketId) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    const updated = await tiketingService.cancelTicket(ticketId, userId);

    return res.status(200).json({
      message: 'Tiket berhasil dibatalkan',
      data: updated,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message || 'Internal server error.',
    });
  }
};

// POST body: { user_id, ticket_id }
const refundTicket = async (req, res) => {
  try {
    const { user_id: userId, ticket_id: ticketId } = req.body;

    if (!userId || !ticketId) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    const updated = await tiketingService.refundTicket(ticketId, userId);

    return res.status(200).json({
      message: 'Refund tiket berhasil diproses',
      data: updated,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message || 'Internal server error.',
    });
  }
};

module.exports = {
  getTicketById,
  getMyTickets,
  getSeatAvailability,
  cancelTicket,
  refundTicket,
};