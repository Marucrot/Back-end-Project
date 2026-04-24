module.exports = (mongoose) => {
  const concertSchema = new mongoose.Schema(
    {
      nama_concert: {
        type: String,
        required: true,
        trim: true,
      },
      artis: {
        type: String,
        required: true,
        trim: true,
      },
      tanggal: {
        type: Date,
        required: true,
      },
      lokasi: {
        type: String,
        required: true,
        trim: true,
      },
      deskripsi: {
        type: String,
        default: null,
        trim: true,
      },
      harga_tiket: {
        type: Number,
        required: true,
        min: 0,
      },
      kuota_tiket: {
        type: Number,
        required: true,
        min: 0,
      },
      tiket_terjual: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    {
      timestamps: true,
    }
  );

  return mongoose.model('concerts', concertSchema);
};
