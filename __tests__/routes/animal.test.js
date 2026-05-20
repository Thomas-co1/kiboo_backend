const request = require('supertest');
const express = require('express');
const { sequelize } = require('../../models');
const animalRoutes = require('../../routes/Animal');

const app = express();
app.use(express.json());
app.use('/api/animals', animalRoutes);

describe('Animal Routes', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /api/animals', () => {
    it('devrait retourner un tableau', async () => {
      const res = await request(app).get('/api/animals');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/animals', () => {
    it('devrait créer un nouvel animal', async () => {
      const newAnimal = {
        content: 'Chat noir et blanc',
        user_id: 1
      };

      const res = await request(app)
        .post('/api/animals')
        .send(newAnimal);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.content).toBe(newAnimal.content);
    });

    it('devrait refuser un animal sans content', async () => {
      const res = await request(app)
        .post('/api/animals')
        .send({ user_id: 1 });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/animals/:id', () => {
    let animalId;

    beforeEach(async () => {
      const animal = await request(app)
        .post('/api/animals')
        .send({ content: 'Test Animal', user_id: 1 });
      animalId = animal.body.id;
    });

    it('devrait retourner un animal par ID', async () => {
      const res = await request(app).get(`/api/animals/${animalId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(animalId);
    });

    it('devrait retourner 404 pour un ID inexistant', async () => {
      const res = await request(app).get('/api/animals/99999');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PATCH /api/animals/:id', () => {
    let animalId;

    beforeEach(async () => {
      const animal = await request(app)
        .post('/api/animals')
        .send({ content: 'Test Animal', user_id: 1 });
      animalId = animal.body.id;
    });

    it('devrait mettre à jour un animal', async () => {
      const res = await request(app)
        .patch(`/api/animals/${animalId}`)
        .send({ content: 'Updated Content' });

      expect(res.statusCode).toBe(200);
      expect(res.body.content).toBe('Updated Content');
    });
  });

  describe('DELETE /api/animals/:id', () => {
    let animalId;

    beforeEach(async () => {
      const animal = await request(app)
        .post('/api/animals')
        .send({ content: 'Test Animal Delete', user_id: 1 });
      animalId = animal.body.id;
    });

    it('devrait supprimer un animal', async () => {
      const res = await request(app).delete(`/api/animals/${animalId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
    });
  });
});
