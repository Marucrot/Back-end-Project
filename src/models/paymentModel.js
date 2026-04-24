module.exports = (mongoose) => {
  const paymentSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },

      ticketIds: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Tiketing',
          required: true,
        },
      ],

      total_amount: {
        type: Number,
        required: true,
      },

      metode_pembayaran: {
        type: String,
        enum: ['transfer_bank', 'kartu_kredit', 'e_wallet', 'qris'],
        required: true,
      },

      status: {
        type: String,
        enum: ['pending', 'berhasil', 'gagal', 'dibatalkan'],
        default: 'pending',
      },

      paid_at: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

  return mongoose.model('Payment', paymentSchema);
};