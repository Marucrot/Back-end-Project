const Venue = require('../../../models/venueModel');

const cariSemua = () => {
  return Venue.find({ isAktif: true }).sort({ createdAt: -1 });
};

const cariId = (venueId) => {
  return Venue.findById(venueId);
};

const buat = (venueData) => {
  const venue = new Venue(venueData);
  return venue.save();
};

const ubah = (venueId, venueData) => {
  return Venue.findByIdAndUpdate(venueId, venueData, { new: true });
};

const hapus = (venueId) => {
  return Venue.findByIdAndUpdate(venueId, { isAktif: false }, { new: true });
};

const cariKursi = (venueId) => {
  return Venue.findById(venueId).select('kursi nama kapasitas');
};

module.exports = {
  cariSemua,
  cariId,
  buat,
  ubah,
  hapus,
  cariKursi,
};