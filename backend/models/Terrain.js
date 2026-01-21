const mongoose = require('mongoose');

const terrainSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    sport: {                      // ✅ utilisé par l'IA
      type: String,
      required: true,
      enum: ['foot', 'basket', 'tennis','padel'],
    },

    capacity: {                   // ✅ utilisé par l'IA
      type: Number,
      required: true,
    },

    pricePerHour: {
      type: Number,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Terrain', terrainSchema);
