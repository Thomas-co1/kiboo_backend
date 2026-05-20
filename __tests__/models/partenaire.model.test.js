const { Partenaire } = require('../../models');
const testSequelize = require('../helpers/testDb');

// Re-définir le modèle Partenaire avec la connexion de test
const TestPartenaire = testSequelize.define('Partenaire', Partenaire.rawAttributes, {
  tableName: 'Partenaires'
});

describe('Partenaire Model', () => {
  beforeAll(async () => {
    await testSequelize.sync({ force: true });
  }, 30000);

  afterAll(async () => {
    await testSequelize.close();
  });

  afterEach(async () => {
    await TestPartenaire.destroy({ where: {}, truncate: true });
  });

  it('devrait créer un partenaire valide', async () => {
    const partenaire = await TestPartenaire.create({
      nom: 'Sponsor XYZ',
      description: 'Un grand sponsor',
      code: 'XYZ2026'
    });

    expect(partenaire.id).toBeDefined();
    expect(partenaire.nom).toBe('Sponsor XYZ');
    expect(partenaire.code).toBe('XYZ2026');
  });

  it('devrait refuser un partenaire sans nom', async () => {
    await expect(
      TestPartenaire.create({
        code: 'TEST'
      })
    ).rejects.toThrow();
  });

  it('devrait refuser un partenaire sans code', async () => {
    await expect(
      TestPartenaire.create({
        nom: 'Test Sponsor'
      })
    ).rejects.toThrow();
  });

  it('devrait refuser un code dupliqué', async () => {
    await TestPartenaire.create({
      nom: 'Sponsor 1',
      code: 'UNIQUE'
    });

    await expect(
      TestPartenaire.create({
        nom: 'Sponsor 2',
        code: 'UNIQUE'
      })
    ).rejects.toThrow();
  });

  it('devrait permettre une description optionnelle', async () => {
    const partenaire = await TestPartenaire.create({
      nom: 'Sponsor',
      code: 'CODE123'
    });

    expect(partenaire.description).toBeUndefined();
  });
});
