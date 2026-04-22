const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      required: true,
    },
    artists: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        genre: {
          type: String,
          default: '',
        },
        setDuration: {
          type: Number,
          default: 60,
        },
        orderAppearance: {
          type: Number,
          default: 0,
        },
      },
    ],
    date: {
      type: Date,
      required: true,
    },
    openGateTime: {
      type: Date,
      required: true,
    },
    showTime: {
      type: Date,
      required: true,
    },
    ticketCategories: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quota: {
          type: Number,
          required: true,
        },
        sold: {
          type: Number,
          default: 0,
        },
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'published', 'ongoing', 'selesai', 'dibatalkan'],
      default: 'draft',
    },
    posterUrl: {
      type: String,
      default: '',
    },
    minAge: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Concert', concertSchema);