const express = require('express');
const router = express.Router();
const {
  createReservation,
  getMyReservations,
} = require('../controllers/reservationController');

const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReservation);
router.get('/my', protect, getMyReservations);

module.exports = router;
