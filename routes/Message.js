const express = require('express');
const router = express.Router();
const { Message, User } = require('../models');

/* GET Messages listing. */
router.get('/', async (req, res) => {
  try {
    const messages = await Message.findAll({
      include: [
        { model: User, as: 'Sender', foreignKey: 'sender_id', attributes: ['id', 'name'] },
        { model: User, as: 'Receiver', foreignKey: 'receiver_id', attributes: ['id', 'name'] }
      ]
    });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

/* GET message by ID. */
router.get('/:id', async function(req, res, next) {
  try {
    const messageId = parseInt(req.params.id);
    if (isNaN(messageId)) {
      return res.status(400).json({ error: 'Invalid message ID' });
    }
    const message = await Message.findByPk(messageId, {
      include: [
        { model: User, as: 'Sender', foreignKey: 'sender_id', attributes: ['id', 'name'] },
        { model: User, as: 'Receiver', foreignKey: 'receiver_id', attributes: ['id', 'name'] }
      ]
    });
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    next(error);
  }
});

/* POST create new message. */
router.post('/', async function(req, res, next) {
  try {
    const { content, sender_id, receiver_id } = req.body;
    if (!content || !sender_id || !receiver_id) {
      return res.status(400).json({ error: 'content, sender_id, and receiver_id are required' });
    }
    const newMessage = await Message.create({ content, sender_id, receiver_id });
    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
});

/* DELETE message by ID. */
router.delete('/:id', async function(req, res, next) {
  try {
    const messageId = parseInt(req.params.id);
    if (isNaN(messageId)) {
      return res.status(400).json({ error: 'Invalid message ID' });
    }
    const message = await Message.findByPk(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    await message.destroy();
    res.json({ message: 'Message deleted successfully', id: messageId });
  } catch (error) {
    next(error);
  }
});

module.exports = router;