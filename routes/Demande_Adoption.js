const express = require('express');
const router = express.Router();
const { Demande, User, Animal } = require('../models');

/* GET DemandeAdoption listing. */
router.get('/', async (req, res) => {
  try {
    const demandes = await Demande.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Animal }
      ]
    });
    res.json(demandes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch demandes' });
  }
});

/* GET demande by ID. */
router.get('/:id', async function(req, res, next) {
  try {
    const demandeId = parseInt(req.params.id);
    if (isNaN(demandeId)) {
      return res.status(400).json({ error: 'Invalid demande ID' });
    }
    const demande = await Demande.findByPk(demandeId, {
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Animal }
      ]
    });
    if (!demande) {
      return res.status(404).json({ error: 'Demande not found' });
    }
    res.json(demande);
  } catch (error) {
    next(error);
  }
});

/* POST create new demande. */
router.post('/', async function(req, res, next) {
  try {
    const { user_id, animal_id, status } = req.body;
    if (!user_id || !animal_id) {
      return res.status(400).json({ error: 'user_id and animal_id are required' });
    }
    const newDemande = await Demande.create({ user_id, animal_id, status });
    res.status(201).json(newDemande);
  } catch (error) {
    next(error);
  }
});

/* PATCH update demande by ID. */
router.patch('/:id', async function(req, res, next) {
  try {
    const demandeId = parseInt(req.params.id);
    if (isNaN(demandeId)) {
      return res.status(400).json({ error: 'Invalid demande ID' });
    }
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const demande = await Demande.findByPk(demandeId);
    if (!demande) {
      return res.status(404).json({ error: 'Demande not found' });
    }
    demande.status = status;
    await demande.save();
    res.json(demande);
  } catch (error) {
    next(error);
  }
});

/* DELETE demande by ID. */
router.delete('/:id', async function(req, res, next) {
  try {
    const demandeId = parseInt(req.params.id);
    if (isNaN(demandeId)) {
      return res.status(400).json({ error: 'Invalid demande ID' });
    }
    const demande = await Demande.findByPk(demandeId);
    if (!demande) {
      return res.status(404).json({ error: 'Demande not found' });
    }
    await demande.destroy();
    res.json({ message: 'Demande deleted successfully', id: demandeId });
  } catch (error) {
    next(error);
  }
});

module.exports = router;