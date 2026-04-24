module.exports = (mongoose) => {
  const tiketingSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },

      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'concerts',
        required: true,
      },

      seat: {
        label: {
          type: String,
          required: true,
        },
        section: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },

      status: {
        type: String,
        enum: ['pending', 'aktif', 'dibatalkan', 'dikembalikan', 'terpakai'],
        default: 'pending',
      },

      paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        default: null,
      },

      cancelledAt: {
        type: Date,
        default: null,
      },

      refundedAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

  return mongoose.model('Tiketing', tiketingSchema);
};