const concertRepo = require('./concertRepo');

async function getAllConcerts() {
  const concerts = await concertRepo.findAll();
  return {
    message: 'Berhasil mengambil data concert',
    data: concerts,
  };
}

async function getConcertById(concertId) {
  const concert = await concertRepo.findById(concertId);
  if (!concert) {
    throw new Error('Concert tidak ditemukan');
  }
  return {
    message: 'Berhasil mengambil detail concert',
    data: concert,
  };
}

async function createConcert(payload) {
  const {
    nama_concert: namaConcert,
    artis,
    tanggal,
    lokasi,
    deskripsi,
    harga_tiket: hargaTiket,
    kuota_tiket: kuotaTiket,
  } = payload;

  if (
    !namaConcert ||
    !artis ||
    !tanggal ||
    !lokasi ||
    hargaTiket === undefined ||
    kuotaTiket === undefined
  ) {
    throw new Error('Semua field wajib diisi');
  }

  if (hargaTiket < 0) {
    throw new Error('Harga tiket tidak boleh negatif');
  }

  if (kuotaTiket < 1) {
    throw new Error('Kuota tiket minimal 1');
  }

  if (new Date(tanggal) < new Date()) {
    throw new Error('Tanggal concert tidak boleh di masa lalu');
  }

  const concert = await concertRepo.createConcert({
    nama_concert: namaConcert,
    artis,
    tanggal: new Date(tanggal),
    lokasi,
    deskripsi: deskripsi || null,
    harga_tiket: hargaTiket,
    kuota_tiket: kuotaTiket,
  });

  return {
    message: 'Concert berhasil ditambahkan',
    data: concert,
  };
}

async function updateConcert(concertId, payload) {
  const concert = await concertRepo.findById(concertId);
  if (!concert) {
    throw new Error('Concert tidak ditemukan');
  }

  const {
    nama_concert: namaConcert,
    artis,
    tanggal,
    lokasi,
    deskripsi,
    harga_tiket: hargaTiket,
    kuota_tiket: kuotaTiket,
  } = payload;

  if (hargaTiket !== undefined && hargaTiket < 0) {
    throw new Error('Harga tiket tidak boleh negatif');
  }

  if (kuotaTiket !== undefined && kuotaTiket < concert.tiket_terjual) {
    throw new Error(
      'Kuota tiket tidak boleh kurang dari tiket yang sudah terjual'
    );
  }

  if (tanggal && new Date(tanggal) < new Date()) {
    throw new Error('Tanggal concert tidak boleh di masa lalu');
  }

  const updatePayload = {};
  if (namaConcert !== undefined) updatePayload.nama_concert = namaConcert;
  if (artis !== undefined) updatePayload.artis = artis;
  if (tanggal !== undefined) updatePayload.tanggal = new Date(tanggal);
  if (lokasi !== undefined) updatePayload.lokasi = lokasi;
  if (deskripsi !== undefined) updatePayload.deskripsi = deskripsi;
  if (hargaTiket !== undefined) updatePayload.harga_tiket = hargaTiket;
  if (kuotaTiket !== undefined) updatePayload.kuota_tiket = kuotaTiket;

  const updated = await concertRepo.updateConcertById(concertId, updatePayload);

  return {
    message: 'Concert berhasil diperbarui',
    data: updated,
  };
}

async function deleteConcert(concertId) {
  const concert = await concertRepo.findById(concertId);
  if (!concert) {
    throw new Error('Concert tidak ditemukan');
  }

  if (concert.tiket_terjual > 0) {
    throw new Error(
      'Concert tidak dapat dihapus karena sudah ada tiket yang terjual'
    );
  }

  await concertRepo.deleteConcertById(concertId);

  return {
    message: 'Concert berhasil dihapus',
  };
}

module.exports = {
  getAllConcerts,
  getConcertById,
  createConcert,
  updateConcert,
  deleteConcert,
};
