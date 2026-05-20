const express = require('express');
const router = express.Router();
const { Like, User, Animal } = require('../models');

/* GET Likes listing. */
router.get('/', async (req, res) => {
  try {
    const likes = await Like.findAll({
      include: [
        { model: User, attributes: ['id', 'name'] },
        { model: Animal }
      ]
    });
    res.json(likes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch likes' });
  }
});

/* GET like by ID. */
router.get('/:id', async function(req, res, next) {
  try {
    const likeId = parseInt(req.params.id);
    if (isNaN(likeId)) {
      return res.status(400).json({ error: 'Invalid like ID' });
    }
    const like = await Like.findByPk(likeId, {
      include: [
        { model: User, attributes: ['id', 'name'] },
        { model: Animal }
      ]
    });
    if (!like) {
      return res.status(404).json({ error: 'Like not found' });
    }
    res.json(like);
  } catch (error) {
    next(error);
  }
});

/* POST create new like. */
router.post('/', async function(req, res, next) {
  try {
    const { user_id, animal_id } = req.body;
    if (!user_id || !animal_id) {
      return res.status(400).json({ error: 'user_id and animal_id are required' });
    }
    const newLike = await Like.create({ user_id, animal_id });
    res.status(201).json(newLike);
  } catch (error) {
    next(error);
  }
});

/* DELETE like by ID. */
router.delete('/:id', async function(req, res, next) {
  try {
    const likeId = parseInt(req.params.id);
    if (isNaN(likeId)) {
      return res.status(400).json({ error: 'Invalid like ID' });
    }
    const like = await Like.findByPk(likeId);
    if (!like) {
      return res.status(404).json({ error: 'Like not found' });
    }
    await like.destroy();
    res.json({ message: 'Like deleted successfully', id: likeId });
  } catch (error) {
    next(error);
  }
});

module.exports = router;