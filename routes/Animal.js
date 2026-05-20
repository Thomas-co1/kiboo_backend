const express = require('express');
const router = express.Router();
const { Animal, User, Image } = require('../models');

/* GET Animals listing. */
router.get('/', async (req, res) => {
  try {
    const animals = await Animal.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Image }
      ]
    });
    res.json(animals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch animals' });
  }
});

/* GET animal by ID. */
router.get('/:id', async function(req, res, next) {
  try {
    const animalId = parseInt(req.params.id);
    if (isNaN(animalId)) {
      return res.status(400).json({ error: 'Invalid animal ID' });
    }
    const animal = await Animal.findByPk(animalId, {
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Image }
      ]
    });
    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    res.json(animal);
  } catch (error) {
    next(error);
  }
});

/* POST create new animal. */
router.post('/', async function(req, res, next) {
  try {
    const { content, user_id, image_id } = req.body;
    if (!content || !user_id) {
      return res.status(400).json({ error: 'Content and user_id are required' });
    }
    const newAnimal = await Animal.create({ content, user_id, image_id });
    res.status(201).json(newAnimal);
  } catch (error) {
    next(error);
  }
});

/* PATCH update animal by ID. */
router.patch('/:id', async function(req, res, next) {
  try {
    const animalId = parseInt(req.params.id);
    if (isNaN(animalId)) {
      return res.status(400).json({ error: 'Invalid animal ID' });
    }
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    const animal = await Animal.findByPk(animalId);
    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    animal.content = content;
    await animal.save();
    res.json(animal);
  } catch (error) {
    next(error);
  }
});

/* DELETE animal */
router.delete('/:id', async function(req, res, next) {
  try {
    const animalId = parseInt(req.params.id);
    if (isNaN(animalId)) {
      return res.status(400).json({ error: 'Invalid animal ID' });
    }
    const animal = await Animal.findByPk(animalId);
    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    await animal.destroy();
    res.json({ message: 'Animal deleted successfully', id: animalId });
  } catch (error) {
    next(error);
  }
});

module.exports = router;