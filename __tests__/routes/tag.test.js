const request = require('supertest');
const { sequelize, Tag, User, Role } = require('../../models');

// Importer l'app Express
let app;
beforeAll(() => {
  const express = require('express');
  app = express();
  app.use(express.json());
  const tagRoutes = require('../../routes/Tag');
  app.use('/api/tags', tagRoutes);
});

describe('Tag Routes', () => {
  let testUser;
  let testTag;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Créer un rôle
    await Role.create({ id: 1, name: 'user' });

    // Créer un utilisateur de test
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      birthdate: '1990-01-01',
      role: 1
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/tags', () => {
    it('should create a new tag', async () => {
      const response = await request(app)
        .post('/api/tags')
        .send({
          name: 'Chat lover',
          couleur: '#FF6B9D',
          user_id: testUser.id
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Chat lover');
      expect(response.body.couleur).toBe('#FF6B9D');
      expect(response.body.user_id).toBe(testUser.id);
      testTag = response.body;
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/api/tags')
        .send({
          couleur: '#FF0000',
          user_id: testUser.id
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/tags', () => {
    it('should return all tags', async () => {
      const response = await request(app).get('/api/tags');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/tags/user/:userId', () => {
    it('should return tags for a specific user', async () => {
      const response = await request(app).get(`/api/tags/user/${testUser.id}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].user_id).toBe(testUser.id);
    });

    it('should return 400 for invalid user ID', async () => {
      const response = await request(app).get('/api/tags/user/invalid');

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/tags/:id', () => {
    it('should return a specific tag', async () => {
      const response = await request(app).get(`/api/tags/${testTag.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testTag.id);
      expect(response.body.name).toBe(testTag.name);
    });

    it('should return 404 for non-existent tag', async () => {
      const response = await request(app).get('/api/tags/99999');

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/tags/:id', () => {
    it('should update a tag', async () => {
      const response = await request(app)
        .patch(`/api/tags/${testTag.id}`)
        .send({
          name: 'Updated Tag Name',
          couleur: '#00FF00'
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Tag Name');
      expect(response.body.couleur).toBe('#00FF00');
    });

    it('should return 404 for non-existent tag', async () => {
      const response = await request(app)
        .patch('/api/tags/99999')
        .send({ name: 'Test' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/tags/:id', () => {
    it('should delete a tag', async () => {
      const response = await request(app).delete(`/api/tags/${testTag.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.id).toBe(testTag.id);
    });

    it('should return 404 when trying to delete non-existent tag', async () => {
      const response = await request(app).delete('/api/tags/99999');

      expect(response.status).toBe(404);
    });
  });
});
