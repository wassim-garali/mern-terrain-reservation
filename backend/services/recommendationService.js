const Terrain = require('../models/Terrain');
const Reservation = require('../models/Reservation');

exports.generateRecommendation = async (data) => {
  const { sport, players, date, startTime, endTime, budget } = data;

  // 1️⃣ Terrains compatibles
  const terrains = await Terrain.find({
    sport,
    capacity: { $gte: players },
    pricePerHour: { $lte: budget }
  }).sort({ pricePerHour: 1, capacity: -1 }); // tri par prix croissant, capacité décroissante

  if (terrains.length === 0) {
    return { message: "Aucun terrain ne correspond à vos critères." };
  }

  // 2️⃣ Vérifier disponibilité et collecter plusieurs options
  const availableTerrains = [];

  for (const terrain of terrains) {
    const conflict = await Reservation.findOne({
      terrain: terrain._id,
      date,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime }
    });

    if (!conflict) {
      availableTerrains.push({
        terrain,
        reason: "Terrain disponible et adapté"
      });
    }
  }

  if (availableTerrains.length === 0) {
    return { message: "Tous les terrains sont occupés à ce créneau." };
  }

  return {
    message: `${availableTerrains.length} terrains disponibles`,
    options: availableTerrains
  };
};
