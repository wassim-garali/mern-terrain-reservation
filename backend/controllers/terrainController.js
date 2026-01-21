const Terrain = require('../models/Terrain');

/**
 * @desc    Créer un terrain (admin)
 * @route   POST /api/terrains
 */
exports.createTerrain = async (req, res, next) => {
  try {
    const terrain = await Terrain.create(req.body);
    res.status(201).json(terrain);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtenir tous les terrains
 * @route   GET /api/terrains
 */
exports.getTerrains = async (req, res, next) => {
  try {
    const terrains = await Terrain.find();
    res.json(terrains);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtenir un terrain par ID
 * @route   GET /api/terrains/:id
 */
exports.getTerrainById = async (req, res, next) => {
  try {
    const terrain = await Terrain.findById(req.params.id);

    if (!terrain) {
      return res.status(404).json({ message: 'Terrain non trouvé' });
    }

    res.json(terrain);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Modifier un terrain (admin)
 * @route   PUT /api/terrains/:id
 */
exports.updateTerrain = async (req, res, next) => {
  try {
    const terrain = await Terrain.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!terrain) {
      return res.status(404).json({ message: 'Terrain non trouvé' });
    }

    res.json(terrain);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Supprimer un terrain (admin)
 * @route   DELETE /api/terrains/:id
 */
exports.deleteTerrain = async (req, res, next) => {
  try {
    const terrain = await Terrain.findByIdAndDelete(req.params.id);

    if (!terrain) {
      return res.status(404).json({ message: 'Terrain non trouvé' });
    }

    res.json({ message: 'Terrain supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};
