const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role, Animal } = require('../models');

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [{ model: Role }]
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/* GET user by ID. */
router.get('/:id', async function(req, res, next) {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Role },
        { model: Animal }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

/* POST create new user (Register). */
router.post('/', async function(req, res, next) {
  try {
    const { name, email, password, birthdate, role, description } = req.body;
    if (!name || !email || !password || !birthdate || !role) {
      return res.status(400).json({ error: 'Name, email, password, birthdate, and role are required' });
    }

    // Hacher le mot de passe avant insertion
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      birthdate,
      role,
      description
    });

    // Renvoyer l'utilisateur sans le mot de passe
    const userJson = newUser.toJSON();
    delete userJson.password;

    res.status(201).json(userJson);
  } catch (error) {
    next(error);
  }
});

/* POST login (Authentication). */
router.post('/login', async function(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Trouver l'utilisateur par email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Clé privée de signature JWT
    const privateKey = process.env.JWT_PRIVATE_TOKEN || 'f654cc3298ca27b36784aa1cb41dc7d1';

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      privateKey,
      { expiresIn: '24h' }
    );

    // Renvoyer le token et l'utilisateur (sans mot de passe)
    const userJson = user.toJSON();
    delete userJson.password;

    res.json({
      token,
      user: userJson
    });
  } catch (error) {
    next(error);
  }
});

/* PATCH update user by ID. */
router.patch('/:id', async function(req, res, next) {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const { name, email, password, description } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      // Hacher le nouveau mot de passe s'il est mis à jour
      user.password = bcrypt.hashSync(password, 10);
    }
    if (description) user.description = description;
    await user.save();

    // Renvoyer sans mot de passe
    const userJson = user.toJSON();
    delete userJson.password;

    res.json(userJson);
  } catch (error) {
    next(error);
  }
});

/* DELETE user */
router.delete('/:id', async function(req, res, next) {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted', id: userId });
  } catch (error) {
    next(error);
  }
});

module.exports = router;