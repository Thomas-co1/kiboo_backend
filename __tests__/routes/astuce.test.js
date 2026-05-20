const request = require('supertest');
const express = require('express');
const { sequelize } = require('../../models');
const astuceRoutes = require('../../routes/Astuce');

const app = express();
app.use(express.json());
app.use('/api/astuces', astuceRoutes);

describe('Astuce Routes', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /api/astuces', () => {
    it('devrait retourner un tableau', async () => {
      const res = await request(app).get('/api/astuces');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/astuces', () => {
    it('devrait créer une nouvelle astuce', async () => {
      const newAstuce = {
        titre: 'Astuce pour adopter un chat',
        contenu: 'Voici comment bien accueillir votre nouveau chat...',
        categorie: 'Adoption'
      };

      const res = await request(app)
        .post('/api/astuces')
        .send(newAstuce);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.titre).toBe(newAstuce.titre);
      expect(res.body.contenu).toBe(newAstuce.contenu);
    });

    it('devrait refuser une astuce sans titre ou contenu', async () => {
      const res = await request(app)
        .post('/api/astuces')
        .send({ categorie: 'Test' });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/astuces/:id', () => {
    let astuceId;

    beforeEach(async () => {
      const astuce = await request(app)
        .post('/api/astuces')
        .send({ titre: 'Test Astuce', contenu: 'Contenu test', categorie: 'Test' });
      astuceId = astuce.body.id;
    });

    it('devrait retourner une astuce par ID', async () => {
      const res = await request(app).get(`/api/astuces/${astuceId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(astuceId);
    });

    it('devrait retourner 404 pour un ID inexistant', async () => {
      const res = await request(app).get('/api/astuces/99999');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /api/astuces/categorie/:categorie', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/astuces')
        .send({ titre: 'Astuce Santé', contenu: 'Contenu santé', categorie: 'Santé' });
      await request(app)
        .post('/api/astuces')
        .send({ titre: 'Astuce Alimentation', contenu: 'Contenu alim', categorie: 'Alimentation' });
    });

    it('devrait retourner les astuces par catégorie', async () => {
      const res = await request(app).get('/api/astuces/categorie/Santé');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].categorie).toBe('Santé');
    });
  });

  describe('PATCH /api/astuces/:id', () => {
    let astuceId;

    beforeEach(async () => {
      const astuce = await request(app)
        .post('/api/astuces')
        .send({ titre: 'Update Test', contenu: 'Contenu', categorie: 'Test' });
      astuceId = astuce.body.id;
    });

    it('devrait mettre à jour une astuce', async () => {
      const res = await request(app)
        .patch(`/api/astuces/${astuceId}`)
        .send({ titre: 'Titre Modifié' });

      expect(res.statusCode).toBe(200);
      expect(res.body.titre).toBe('Titre Modifié');
    });
  });

  describe('DELETE /api/astuces/:id', () => {
    let astuceId;

    beforeEach(async () => {
      const astuce = await request(app)
        .post('/api/astuces')
        .send({ titre: 'Delete Test', contenu: 'Contenu delete', categorie: 'Test' });
      astuceId = astuce.body.id;
    });

    it('devrait supprimer une astuce', async () => {
      const res = await request(app).delete(`/api/astuces/${astuceId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
    });
  });
});
