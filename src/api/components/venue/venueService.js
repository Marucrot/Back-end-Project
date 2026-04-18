const repo = require('./venueRepo');

const semuaVenue = async () => {
  const venues = await repo.cariSemua();
  return venues;
};

const detailVenue = async (venueId) => {
  const venue = await repo.cariId(venueId);
  if (!venue) {
    const err = new Error('Venue tidak ditemukan.');
    err.statusCode = 404;
    throw err;
  }
  return venue;
};

const tambahVenue = async (venueData) => {
  const { nama, alamat, kota, kapasitas, kursi, fasilitas } = venueData;
  if (!nama || !alamat || !kota || !kapasitas) {
    const err = new Error('Nama, alamat, kota, dan kapasitas wajib diisi.');
    err.statusCode = 400;
    throw err;
  }
  const venue = await repo.buat({ nama, alamat, kota, kapasitas, kursi: kursi || [], fasilitas: fasilitas || [] });
  return venue;
};

const updateVenue = async (venueId, venueData) => {
  const venue = await repo.cariId(venueId);
  if (!venue) {
    const err = new Error('Venue tidak ditemukan.');
    err.statusCode = 404;
    throw err;
  }
  const updated = await repo.ubah(venueId, venueData);
  return updated;
};

const hapusVenue = async (venueId) => {
  const venue = await repo.cariId(venueId);
  if (!venue) {
    const err = new Error('Venue tidak ditemukan.');
    err.statusCode = 404;
    throw err;
  }
  await repo.hapus(venueId);
  return { message: 'Venue berhasil dihapus.' };
};

const kursiVenue = async (venueId) => {
  const venue = await repo.cariKursi(venueId);
  if (!venue) {
    const err = new Error('Venue tidak ditemukan.');
    err.statusCode = 404;
    throw err;
  }
  return venue;
};

module.exports = {
  semuaVenue,
  detailVenue,
  tambahVenue,
  updateVenue,
  hapusVenue,
  kursiVenue,
};