const paymentRepo = require('./paymentRepo');

async function createPayment(payload) {
  const {
    user_id: userId,
    ticket_ids: ticketIds,
    event_id: eventId,
    seat,
    metode_pembayaran: metodePembayaran,
  } = payload;

  if (!userId || !metodePembayaran) {
    throw new Error('user_id dan metode_pembayaran wajib diisi');
  }

  let finalTicketIds = [];
  let totalAmount = 0;

  if (ticketIds && ticketIds.length > 0) {
    for (const ticketId of ticketIds) {
      const tiket = await paymentRepo.findTicketById(ticketId);

      if (!tiket) {
        throw new Error(`Tiket dengan ID ${ticketId} tidak ditemukan`);
      }

      if (tiket.userId.toString() !== userId.toString()) {
        throw new Error(`Tiket ${ticketId} bukan milik user ini`);
      }

      if (tiket.paymentId) {
        throw new Error(`Tiket ${ticketId} sudah masuk proses pembayaran lain`);
      }

      if (tiket.status === 'aktif') {
        throw new Error(`Tiket ${ticketId} sudah aktif dan tidak perlu dibayar lagi`);
      }

      finalTicketIds.push(tiket._id);
      totalAmount += tiket.seat.price;
    }
  } else {
    if (!eventId || !seat || !seat.label || !seat.section || !seat.price) {
      throw new Error(
        'Jika tidak memakai ticket_ids, maka event_id dan seat wajib diisi'
      );
    }

    const takenSeat = await paymentRepo.findTakenSeat(eventId, seat.label);

    if (takenSeat) {
      throw new Error(`Kursi ${seat.label} sudah dipilih atau sudah aktif`);
    }

    const tiketBaru = await paymentRepo.createTicket({
      userId,
      eventId,
      seat: {
        label: seat.label,
        section: seat.section,
        price: seat.price,
      },
      status: 'pending',
      paymentId: null,
    });

    finalTicketIds.push(tiketBaru._id);
    totalAmount += tiketBaru.seat.price;
  }

  const payment = await paymentRepo.createPayment({
    userId,
    ticketIds: finalTicketIds,
    total_amount: totalAmount,
    metode_pembayaran: metodePembayaran,
    status: 'pending',
  });

  await paymentRepo.updateTicketsStatus(finalTicketIds, {
    status: 'pending',
    paymentId: payment._id,
  });

  return {
    message: 'Tagihan pembayaran berhasil dibuat',
    data: payment,
  };
}

async function checkoutPayment(payload) {
  const { user_id: userId, payment_id: paymentId } = payload;

  if (!userId || !paymentId) {
    throw new Error('user_id dan payment_id wajib diisi');
  }

  const payment = await paymentRepo.findPaymentById(paymentId);

  if (!payment) {
    throw new Error('Payment tidak ditemukan');
  }

  if (payment.userId.toString() !== userId.toString()) {
    throw new Error('Akses ditolak, ini bukan tagihan Anda');
  }

  if (payment.status !== 'pending') {
    throw new Error('Pembayaran gagal, status tagihan bukan pending');
  }

  const updatedPayment = await paymentRepo.updatePaymentById(paymentId, {
    status: 'berhasil',
    paid_at: new Date(),
  });

  await paymentRepo.updateTicketsStatus(payment.ticketIds, {
    status: 'aktif',
  });

  return {
    message: 'Pembayaran berhasil dikonfirmasi',
    data: updatedPayment,
  };
}

async function checkStatus(payload) {
  const { user_id: userId, payment_id: paymentId } = payload;

  if (!userId || !paymentId) {
    throw new Error('user_id dan payment_id wajib diisi');
  }

  const payment = await paymentRepo.findPaymentById(paymentId);

  if (!payment) {
    throw new Error('Payment tidak ditemukan');
  }

  if (payment.userId.toString() !== userId.toString()) {
    throw new Error('Akses ditolak, ini bukan tagihan Anda');
  }

  return {
    message: 'Status pembayaran berhasil diambil',
    data: payment,
  };
}

async function cancelPayment(payload) {
  const { user_id: userId, payment_id: paymentId } = payload;

  if (!userId || !paymentId) {
    throw new Error('user_id dan payment_id wajib diisi');
  }

  const payment = await paymentRepo.findPaymentById(paymentId);

  if (!payment) {
    throw new Error('Payment tidak ditemukan');
  }

  if (payment.userId.toString() !== userId.toString()) {
    throw new Error('Akses ditolak, ini bukan tagihan Anda');
  }

  if (payment.status === 'berhasil') {
    throw new Error('Pembayaran yang sudah berhasil tidak bisa dibatalkan');
  }

  const updatedPayment = await paymentRepo.updatePaymentById(paymentId, {
    status: 'dibatalkan',
  });

  await paymentRepo.updateTicketsStatus(payment.ticketIds, {
    status: 'dibatalkan',
  });

  return {
    message: 'Tagihan pembayaran berhasil dibatalkan',
    data: updatedPayment,
  };
}

async function paymentHistory(payload) {
  const { user_id: userId } = payload;

  if (!userId) {
    throw new Error('user_id wajib diisi');
  }

  const history = await paymentRepo.findPaymentByUserId(userId);

  return {
    message: 'Riwayat pembayaran berhasil diambil',
    data: history,
  };
}

module.exports = {
  createPayment,
  checkoutPayment,
  checkStatus,
  cancelPayment,
  paymentHistory,
};