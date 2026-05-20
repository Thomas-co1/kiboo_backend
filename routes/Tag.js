const express = require('express');
const router = express.Router();
const { Tag, User } = require('../models');

/* GET Tags listing. */
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });
    res.json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

/* GET tags by user ID. */
router.get('/user/:userId', async function(req, res, next) {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const tags = await Tag.findAll({ 
      where: { user_id: userId },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });
    res.json(tags);
  } catch (error) {
    next(error);
  }
});

/* GET tag by ID. */
router.get('/:id', async function(req, res, next) {
  try {
    const tagId = parseInt(req.params.id);
    if (isNaN(tagId)) {
      return res.status(400).json({ error: 'Invalid tag ID' });
    }
    const tag = await Tag.findByPk(tagId, {
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    res.json(tag);
  } catch (error) {
    next(error);
  }
});

/* POST create new tag. */
router.post('/', async function(req, res, next) {
  try {
    const { nom, couleur, user_id } = req.body;
    if (!nom || !user_id) {
      return res.status(400).json({ error: 'Nom and user_id are required' });
    }
    const newTag = await Tag.create({ nom, couleur, user_id });
    res.status(201).json(newTag);
  } catch (error) {
    next(error);
  }
});

/* PATCH update tag by ID. */
router.patch('/:id', async function(req, res, next) {
  try {
    const tagId = parseInt(req.params.id);
    if (isNaN(tagId)) {
      return res.status(400).json({ error: 'Invalid tag ID' });
    }
    const { nom, couleur } = req.body;
    const tag = await Tag.findByPk(tagId);
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    if (nom) tag.nom = nom;
    if (couleur !== undefined) tag.couleur = couleur;
    await tag.save();
    res.json(tag);
  } catch (error) {
    next(error);
  }
});

/* DELETE tag by ID. */
router.delete('/:id', async function(req, res, next) {
  try {
    const tagId = parseInt(req.params.id);
    if (isNaN(tagId)) {
      return res.status(400).json({ error: 'Invalid tag ID' });
    }
    const tag = await Tag.findByPk(tagId);
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    await tag.destroy();
    res.json({ message: 'Tag deleted successfully', id: tagId });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
