const express = require('express');
const router = express.Router();
const { Astuce } = require('../models');

/* GET Astuces listing. */
router.get('/', async (req, res) => {
  try {
    const astuces = await Astuce.findAll();
    res.json(astuces);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch astuces' });
  }
});

/* GET astuce by ID. */
router.get('/:id', async function(req, res, next) {
  try {
    const astuceId = parseInt(req.params.id);
    if (isNaN(astuceId)) {
      return res.status(400).json({ error: 'Invalid astuce ID' });
    }
    const astuce = await Astuce.findByPk(astuceId);
    if (!astuce) {
      return res.status(404).json({ error: 'Astuce not found' });
    }
    res.json(astuce);
  } catch (error) {
    next(error);
  }
});

/* GET astuces by category. */
router.get('/categorie/:categorie', async function(req, res, next) {
  try {
    const categorie = req.params.categorie;
    const astuces = await Astuce.findAll({ where: { categorie } });
    res.json(astuces);
  } catch (error) {
    next(error);
  }
});

/* POST create new astuce. */
router.post('/', async function(req, res, next) {
  try {
    const { titre, contenu, categorie } = req.body;
    if (!titre || !contenu) {
      return res.status(400).json({ error: 'Titre and contenu are required' });
    }
    const newAstuce = await Astuce.create({ titre, contenu, categorie });
    res.status(201).json(newAstuce);
  } catch (error) {
    next(error);
  }
});

/* PATCH update astuce by ID. */
router.patch('/:id', async function(req, res, next) {
  try {
    const astuceId = parseInt(req.params.id);
    if (isNaN(astuceId)) {
      return res.status(400).json({ error: 'Invalid astuce ID' });
    }
    const { titre, contenu, categorie } = req.body;
    const astuce = await Astuce.findByPk(astuceId);
    if (!astuce) {
      return res.status(404).json({ error: 'Astuce not found' });
    }
    if (titre) astuce.titre = titre;
    if (contenu) astuce.contenu = contenu;
    if (categorie !== undefined) astuce.categorie = categorie;
    await astuce.save();
    res.json(astuce);
  } catch (error) {
    next(error);
  }
});

/* DELETE astuce by ID. */
router.delete('/:id', async function(req, res, next) {
  try {
    const astuceId = parseInt(req.params.id);
    if (isNaN(astuceId)) {
      return res.status(400).json({ error: 'Invalid astuce ID' });
    }
    const astuce = await Astuce.findByPk(astuceId);
    if (!astuce) {
      return res.status(404).json({ error: 'Astuce not found' });
    }
    await astuce.destroy();
    res.json({ message: 'Astuce deleted successfully', id: astuceId });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
