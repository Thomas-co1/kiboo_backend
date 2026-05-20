const { User, Role, sequelize } = require('../../models');

describe('User Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    // Créer un rôle de test
    await Role.create({ id: 1, name: 'user' });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  it('devrait créer un utilisateur valide', async () => {
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      birthdate: '1990-01-01',
      role: 1
    });

    expect(user.id).toBeDefined();
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
  });

  it('devrait refuser un utilisateur sans email', async () => {
    await expect(
      User.create({
        name: 'John Doe',
        password: 'password123',
        birthdate: '1990-01-01',
        role: 1
      })
    ).rejects.toThrow();
  });

  it('devrait refuser un email dupliqué', async () => {
    await User.create({
      name: 'User 1',
      email: 'duplicate@example.com',
      password: 'password123',
      birthdate: '1990-01-01',
      role: 1
    });

    await expect(
      User.create({
        name: 'User 2',
        email: 'duplicate@example.com',
        password: 'password123',
        birthdate: '1990-01-01',
        role: 1
      })
    ).rejects.toThrow();
  });

  it('devrait avoir une date d\'inscription par défaut', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      birthdate: '1990-01-01',
      role: 1
    });

    expect(user.inscription_date).toBeDefined();
    expect(user.inscription_date).toBeInstanceOf(Date);
  });
});
