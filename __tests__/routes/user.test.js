const request = require('supertest');
const express = require('express');
const { sequelize } = require('../../models');
const userRoutes = require('../../routes/User');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Routes', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /api/users', () => {
    it('devrait retourner un tableau vide au départ', async () => {
      const res = await request(app).get('/api/users');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/users', () => {
    it('devrait créer un nouvel utilisateur', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        birthdate: '1990-01-01',
        role: 1
      };

      const res = await request(app)
        .post('/api/users')
        .send(newUser);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe(newUser.name);
      expect(res.body.email).toBe(newUser.email);
    });

    it('devrait refuser un utilisateur sans champs requis', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ name: 'Test' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/users/:id', () => {
    let userId;

    beforeEach(async () => {
      const user = await request(app)
        .post('/api/users')
        .send({
          name: 'Test User 2',
          email: 'test2@example.com',
          password: 'password123',
          birthdate: '1990-01-01',
          role: 1
        });
      userId = user.body.id;
    });

    it('devrait retourner un utilisateur par ID', async () => {
      const res = await request(app).get(`/api/users/${userId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(userId);
      expect(res.body).not.toHaveProperty('password');
    });

    it('devrait retourner 404 pour un ID inexistant', async () => {
      const res = await request(app).get('/api/users/99999');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PATCH /api/users/:id', () => {
    let userId;

    beforeEach(async () => {
      const user = await request(app)
        .post('/api/users')
        .send({
          name: 'Test User 3',
          email: 'test3@example.com',
          password: 'password123',
          birthdate: '1990-01-01',
          role: 1
        });
      userId = user.body.id;
    });

    it('devrait mettre à jour un utilisateur', async () => {
      const res = await request(app)
        .patch(`/api/users/${userId}`)
        .send({ name: 'Updated Name' });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Updated Name');
    });
  });

  describe('DELETE /api/users/:id', () => {
    let userId;

    beforeEach(async () => {
      const user = await request(app)
        .post('/api/users')
        .send({
          name: 'Test User 4',
          email: 'test4@example.com',
          password: 'password123',
          birthdate: '1990-01-01',
          role: 1
        });
      userId = user.body.id;
    });

    it('devrait supprimer un utilisateur', async () => {
      const res = await request(app).delete(`/api/users/${userId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      // Nettoyer et réinitialiser les utilisateurs avant chaque test de connexion
      await sequelize.sync({ force: true });
      
      // Insérer un utilisateur de test (qui sera haché automatiquement via la route)
      await request(app)
        .post('/api/users')
        .send({
          name: 'Auth User',
          email: 'auth@example.com',
          password: 'secretpassword',
          birthdate: '1992-02-02',
          role: 1
        });
    });

    it('devrait connecter un utilisateur avec les bons identifiants et renvoyer un JWT', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'auth@example.com',
          password: 'secretpassword'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe('auth@example.com');
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('devrait rejeter la connexion avec un mauvais mot de passe', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'auth@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('devrait rejeter la connexion si l\'email n\'existe pas', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'secretpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });
});
