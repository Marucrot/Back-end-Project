const mongoose = require('mongoose');

const tiketingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
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
      enum: ['aktif', 'dibatalkan', 'refunded', 'terpakai'],
      default: 'active',
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
  { timestamps: true }
);

module.exports = mongoose.model('Tiketing', tiketingSchema);