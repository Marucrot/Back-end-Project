const paymentRepo = require('./paymentRepo');
const tiketingRepo = require('../tiketing/tiketingRepo');

async function createPayment(payload) {
  const {
    user_id: userId,
    ticket_ids: ticketIds,
    metode_pembayaran: metodePembayaran,
  } = payload;

  if (!userId || !ticketIds || ticketIds.length === 0 || !metodePembayaran) {
    throw new Error('Semua field wajib diisi');
  }

  let totalAmount = 0;
  for (const tId of ticketIds) {
    const tiket = await tiketingRepo.cariId(tId);
    if (!tiket) {
      throw new Error(`Tiket dengan ID ${tId} tidak ditemukan`);
    }
    if (tiket.paymentId) {
      throw new Error(`Tiket ${tId} sudah masuk dalam proses pembayaran lain`);
    }
    totalAmount += tiket.seat.price;
  }

  const payment = await paymentRepo.createPayment({
    userId,
    ticketIds,
    total_amount: totalAmount,
    metode_pembayaran: metodePembayaran,
    status: 'pending',
  });

  await paymentRepo.updateTicketsStatus(ticketIds, {
    status: 'pending',
    paymentId: payment.id,
  });

  return {
    message: 'Tagihan pembayaran berhasil dibuat',
    data: payment,
  };
}

async function checkoutPayment(payload) {
  const { user_id: userId, payment_id: paymentId } = payload;

  if (!userId || !paymentId) {
    throw new Error('Semua field wajib diisi');
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

  await paymentRepo.updateTicketsStatus(payment.ticketIds, { status: 'aktif' });

  return {
    message: 'Pembayaran berhasil dikonfirmasi',
    data: updatedPayment,
  };
}

async function checkStatus(payload) {
  const { user_id: userId, payment_id: paymentId } = payload;

  if (!userId || !paymentId) {
    throw new Error('Semua field wajib diisi');
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
    throw new Error('Semua field wajib diisi');
  }

  const payment = await paymentRepo.findPaymentById(paymentId);
  if (!payment) {
    throw new Error('Payment tidak ditemukan');
  }

  if (payment.userId.toString() !== userId.toString()) {
    throw new Error('Akses ditolak, ini bukan tagihan Anda');
  }

  if (payment.status === 'berhasil') {
    throw new Error('Pembayaran yang sudah lunas tidak bisa dibatalkan');
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
    throw new Error('Semua field wajib diisi');
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
