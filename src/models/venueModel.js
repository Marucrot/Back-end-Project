const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
      trim: true,
    },
    alamat: {
      type: String,
      required: true,
    },
    kota: {
      type: String,
      required: true,
    },
    kapasitas: {
      type: Number,
      required: true,
    },
    kursi: [
      {
        label: {
          type: String,
          required: true,
        },
        section: {
          type: String,
          required: true,
        },
        harga: {
          type: Number,
          required: true,
        },
      },
    ],
    fasilitas: {
      type: [String],
      default: [],
    },
    isAktif: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Venue', venueSchema);
