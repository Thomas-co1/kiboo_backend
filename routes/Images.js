const express = require('express');
const router = express.Router();
const { Image, Animal } = require('../models');

/* GET Images listing. */
router.get('/', async (req, res) => {
  try {
    const images = await Image.findAll({
      include: [{ model: Animal }]
    });
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

/* GET image by ID. */
router.get('/:id', async function(req, res, next) {
  try {
    const imageId = parseInt(req.params.id);
    if (isNaN(imageId)) {
      return res.status(400).json({ error: 'Invalid image ID' });
    }
    const image = await Image.findByPk(imageId, {
      include: [{ model: Animal }]
    });
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json(image);
  } catch (error) {
    next(error);
  }
});

/* POST create new image. */
router.post('/', async function(req, res, next) {
  try {
    const { url, animal_id } = req.body;
    if (!url || !animal_id) {
      return res.status(400).json({ error: 'URL and animal_id are required' });
    }
    const newImage = await Image.create({ url, animal_id });
    res.status(201).json(newImage);
  } catch (error) {
    next(error);
  }
});

/* DELETE image by ID. */
router.delete('/:id', async function(req, res, next) {
  try {
    const imageId = parseInt(req.params.id);
    if (isNaN(imageId)) {
      return res.status(400).json({ error: 'Invalid image ID' });
    }
    const image = await Image.findByPk(imageId);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    await image.destroy();
    res.json({ message: 'Image deleted successfully', id: imageId });
  } catch (error) {
    next(error);
  }
});

module.exports = router;