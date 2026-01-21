const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    terrain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Terrain',
      required: true,
    },

    date: {
      type: String, // ex: 2025-02-20
      required: true,
    },

    startTime: String,
    endTime: String,

    durationHours: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    sport: String,       // duplication volontaire (BI & IA)
    terrainName: String, // pour les dashboards
  },
  { timestamps: true }
);
module.exports = mongoose.model('Reservation', reservationSchema);
