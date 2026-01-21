const Reservation = require('../models/Reservation');
const Terrain = require('../models/Terrain');
const User = require('../models/User');

/**
 * @desc    Réserver un terrain (utilisateur connecté)
 * @route   POST /api/reservations
 */
exports.createReservation = async (req, res, next) => {
  try {
    const { terrain, date, startTime, endTime } = req.body;

    // 1️⃣ Vérifier terrain
    const terrainDoc = await Terrain.findById(terrain);
    if (!terrainDoc) {
      return res.status(404).json({ message: 'Terrain non trouvé' });
    }

    // 2️⃣ Vérifier conflits
    const conflict = await Reservation.findOne({
      terrain,
      date,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    if (conflict) {
      return res.status(400).json({
        message: 'Ce créneau est déjà réservé',
      });
    }

    // 3️⃣ Calculs BI / IA
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);

    const durationHours = endHour - startHour;
    const totalPrice = durationHours * terrainDoc.pricePerHour;

    // 4️⃣ Création réservation enrichie
    const reservation = await Reservation.create({
      user: req.user._id,
      terrain,
      date,
      startTime,
      endTime,
      durationHours,
      totalPrice,
      sport: terrainDoc.sport,
      terrainName: terrainDoc.name,
    });

    res.status(201).json(reservation);
  } catch (error) {
    next(error);
  }
};

exports.getMyReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({
      user: req.user._id,
    }).populate('terrain');

    res.json(reservations);
  } catch (error) {
    next(error);
  }
};
