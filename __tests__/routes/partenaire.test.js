const request = require('supertest');
const express = require('express');
const { sequelize } = require('../../models');
const partenaireRoutes = require('../../routes/Partenaire');

const app = express();
app.use(express.json());
app.use('/api/partenaires', partenaireRoutes);

describe('Partenaire Routes', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /api/partenaires', () => {
    it('devrait retourner un tableau', async () => {
      const res = await request(app).get('/api/partenaires');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/partenaires', () => {
    it('devrait créer un nouveau partenaire', async () => {
      const newPartenaire = {
        nom: 'Sponsor Test',
        description: 'Un sponsor de test',
        code: 'TEST2026'
      };

      const res = await request(app)
        .post('/api/partenaires')
        .send(newPartenaire);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.nom).toBe(newPartenaire.nom);
      expect(res.body.code).toBe(newPartenaire.code);
    });

    it('devrait refuser un partenaire sans nom ou code', async () => {
      const res = await request(app)
        .post('/api/partenaires')
        .send({ description: 'Test' });

      expect(res.statusCode).toBe(400);
    });

    it('devrait refuser un code dupliqué', async () => {
      await request(app)
        .post('/api/partenaires')
        .send({ nom: 'Partner 1', code: 'UNIQUE123' });

      const res = await request(app)
        .post('/api/partenaires')
        .send({ nom: 'Partner 2', code: 'UNIQUE123' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('already exists');
    });
  });

  describe('GET /api/partenaires/code/:code', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/partenaires')
        .send({ nom: 'Code Test', code: 'CODETEST' });
    });

    it('devrait retourner un partenaire par code', async () => {
      const res = await request(app).get('/api/partenaires/code/CODETEST');
      expect(res.statusCode).toBe(200);
      expect(res.body.code).toBe('CODETEST');
    });

    it('devrait retourner 404 pour un code inexistant', async () => {
      const res = await request(app).get('/api/partenaires/code/NOEXIST');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /api/partenaires/:id', () => {
    let partenaireId;

    beforeEach(async () => {
      const partenaire = await request(app)
        .post('/api/partenaires')
        .send({ nom: 'ID Test', code: 'IDTEST' });
      partenaireId = partenaire.body.id;
    });

    it('devrait retourner un partenaire par ID', async () => {
      const res = await request(app).get(`/api/partenaires/${partenaireId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(partenaireId);
    });
  });

  describe('PATCH /api/partenaires/:id', () => {
    let partenaireId;

    beforeEach(async () => {
      const partenaire = await request(app)
        .post('/api/partenaires')
        .send({ nom: 'Update Test', code: 'UPDATE' });
      partenaireId = partenaire.body.id;
    });

    it('devrait mettre à jour un partenaire', async () => {
      const res = await request(app)
        .patch(`/api/partenaires/${partenaireId}`)
        .send({ nom: 'Updated Nom' });

      expect(res.statusCode).toBe(200);
      expect(res.body.nom).toBe('Updated Nom');
    });
  });

  describe('DELETE /api/partenaires/:id', () => {
    let partenaireId;

    beforeEach(async () => {
      const partenaire = await request(app)
        .post('/api/partenaires')
        .send({ nom: 'Delete Test', code: 'DELETE' });
      partenaireId = partenaire.body.id;
    });

    it('devrait supprimer un partenaire', async () => {
      const res = await request(app).delete(`/api/partenaires/${partenaireId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
    });
  });
});
