const express = require('express');
const router = express.Router();
const { Partenaire } = require('../models');

/* GET Partenaires listing. */
router.get('/', async (req, res) => {
  try {
    const partenaires = await Partenaire.findAll();
    res.json(partenaires);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch partenaires' });
  }
});

/* GET partenaire by code. */
router.get('/code/:code', async function(req, res, next) {
  try {
    const code = req.params.code;
    const partenaire = await Partenaire.findOne({ where: { code } });
    if (!partenaire) {
      return res.status(404).json({ error: 'Partenaire not found' });
    }
    res.json(partenaire);
  } catch (error) {
    next(error);
  }
});

/* GET partenaire by ID. */
router.get('/:id', async function(req, res, next) {
  try {
    const partenaireId = parseInt(req.params.id);
    if (isNaN(partenaireId)) {
      return res.status(400).json({ error: 'Invalid partenaire ID' });
    }
    const partenaire = await Partenaire.findByPk(partenaireId);
    if (!partenaire) {
      return res.status(404).json({ error: 'Partenaire not found' });
    }
    res.json(partenaire);
  } catch (error) {
    next(error);
  }
});

/* POST create new partenaire. */
router.post('/', async function(req, res, next) {
  try {
    const { nom, description, code } = req.body;
    if (!nom || !code) {
      return res.status(400).json({ error: 'Nom and code are required' });
    }
    const newPartenaire = await Partenaire.create({ nom, description, code });
    res.status(201).json(newPartenaire);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Code already exists' });
    }
    next(error);
  }
});

/* PATCH update partenaire by ID. */
router.patch('/:id', async function(req, res, next) {
  try {
    const partenaireId = parseInt(req.params.id);
    if (isNaN(partenaireId)) {
      return res.status(400).json({ error: 'Invalid partenaire ID' });
    }
    const { nom, description, code } = req.body;
    const partenaire = await Partenaire.findByPk(partenaireId);
    if (!partenaire) {
      return res.status(404).json({ error: 'Partenaire not found' });
    }
    if (nom) partenaire.nom = nom;
    if (description !== undefined) partenaire.description = description;
    if (code) partenaire.code = code;
    await partenaire.save();
    res.json(partenaire);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Code already exists' });
    }
    next(error);
  }
});

/* DELETE partenaire by ID. */
router.delete('/:id', async function(req, res, next) {
  try {
    const partenaireId = parseInt(req.params.id);
    if (isNaN(partenaireId)) {
      return res.status(400).json({ error: 'Invalid partenaire ID' });
    }
    const partenaire = await Partenaire.findByPk(partenaireId);
    if (!partenaire) {
      return res.status(404).json({ error: 'Partenaire not found' });
    }
    await partenaire.destroy();
    res.json({ message: 'Partenaire deleted successfully', id: partenaireId });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
