const express = require('express');
const router = express.Router();
const terrainCtrl = require('../controllers/terrainController');

const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

// Public
router.get('/', terrainCtrl.getTerrains);
router.get('/:id', terrainCtrl.getTerrainById);

// Protégé (admin plus tard)
router.post('/', protect, isAdmin, terrainCtrl.createTerrain);
router.put('/:id', protect, isAdmin, terrainCtrl.updateTerrain);
router.delete('/:id', protect, isAdmin, terrainCtrl.deleteTerrain);

module.exports = router;
