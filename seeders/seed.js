require('dotenv').config();
const bcrypt = require('bcryptjs');

const { 
  sequelize, 
  Role, 
  User, 
  Animal, 
  Image, 
  Partenaire, 
  Astuce,
  Tag
} = require('../models');

async function seed() {
  try {
    console.log('🌱 Début du seeding...');

    // Synchroniser la base de données
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.sync({ force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✓ Base de données synchronisée');

    // 1. Créer les rôles
    const roles = await Role.bulkCreate([
      { id: 1, name: 'user' },
      { id: 2, name: 'admin' },
      { id: 3, name: 'refuge' }
    ]);
    console.log('✓ Rôles créés:', roles.length);

    // 2. Créer des utilisateurs
    const users = await User.bulkCreate([
      {
        name: 'Admin KIBOO',
        email: 'admin@kiboo.fr',
        password: bcrypt.hashSync('admin123', 10),
        birthdate: '1990-01-01',
        role: 2,
        description: 'Administrateur de la plateforme'
      },
      {
        name: 'Marie Dupont',
        email: 'marie@example.com',
        password: bcrypt.hashSync('password123', 10),
        birthdate: '1995-05-15',
        role: 1,
        description: 'Amoureuse des chats'
      },
      {
        name: 'Refuge SPA Paris',
        email: 'spa.paris@example.com',
        password: bcrypt.hashSync('refuge123', 10),
        birthdate: '2000-01-01',
        role: 3,
        description: 'Refuge animalier à Paris'
      },
      {
        name: 'Jean Martin',
        email: 'jean@example.com',
        password: bcrypt.hashSync('password123', 10),
        birthdate: '1988-08-20',
        role: 1,
        description: 'Passionné par les animaux'
      },
      {
        name: 'Thomas',
        email: 'demo@kiboo.app',
        password: bcrypt.hashSync('demo1234', 10),
        birthdate: '1995-01-01',
        role: 1,
        description: 'Compte de démonstration Thomas'
      },
      {
        name: 'Camille',
        email: 'test@kiboo.app',
        password: bcrypt.hashSync('test1234', 10),
        birthdate: '1998-01-01',
        role: 1,
        description: 'Compte de démonstration Camille'
      }
    ]);
    console.log('✓ Utilisateurs créés:', users.length);

    // 3. Créer des animaux
    const animals = await Animal.bulkCreate([
      {
        nom: 'Cookie',
        espece: 'Chat',
        age: '4 mois',
        taille: 'Petit',
        race: 'Europeen',
        sexe: 'Male',
        user_id: 3,
        description: 'Cookie est un jeune chat tres social qui aime les jeux et les moments calmes. Il s adapte rapidement et recherche une famille douce et presente.'
      },
      {
        nom: 'Rex',
        espece: 'Chat',
        age: '4 ans',
        taille: 'Moyen',
        race: 'Sacre de Birmanie',
        sexe: 'Male',
        user_id: 3,
        description: 'Rex est calme et observateur. Il aime les routines stables et les espaces lumineux.'
      },
      {
        nom: 'Penny',
        espece: 'Chien',
        age: '6 ans',
        taille: 'Petit',
        race: 'Caniche Nain',
        sexe: 'Femelle',
        user_id: 3,
        description: 'Penny adore les promenades courtes et les interactions positives. Elle apprend vite.'
      },
      {
        nom: 'Panpan',
        espece: 'Lapin',
        age: '10 ans',
        taille: 'Petit',
        race: 'Lapin nain',
        sexe: 'Male',
        user_id: 3,
        description: 'Panpan est doux et discret. Il aime les environnements calmes, les cachettes confortables.'
      },
      {
        nom: 'Max',
        espece: 'Chien',
        age: '5 ans',
        taille: 'Grand',
        race: 'Berger Allemand',
        sexe: 'Male',
        user_id: 3,
        description: 'Max est protecteur, loyal et très affectueux.'
      }
    ]);
    console.log('✓ Animaux créés:', animals.length);

    // 4. Créer des images
    const images = await Image.bulkCreate([
      {
        url: 'https://placekitten.com/400/300',
        animal_id: 1
      },
      {
        url: 'https://placedog.net/400/300',
        animal_id: 2
      },
      {
        url: 'https://placekitten.com/400/301',
        animal_id: 3
      },
      {
        url: 'https://placekitten.com/400/302',
        animal_id: 4
      },
      {
        url: 'https://placedog.net/400/301',
        animal_id: 5
      }
    ]);
    console.log('✓ Images créées:', images.length);

    // 5. Créer des partenaires
    const partenaires = await Partenaire.bulkCreate([
      {
        nom: 'Purina',
        description: 'Leader mondial de la nutrition animale',
        code: 'PURINA2026'
      },
      {
        nom: 'Royal Canin',
        description: 'Alimentation sur-mesure pour animaux',
        code: 'ROYAL2026'
      },
      {
        nom: 'Vétérinaire Plus',
        description: 'Réseau de vétérinaires partenaires',
        code: 'VETOPLUS'
      },
      {
        nom: 'Animalis',
        description: 'Magasin spécialisé en produits pour animaux',
        code: 'ANIMALIS'
      }
    ]);
    console.log('✓ Partenaires créés:', partenaires.length);

    // 6. Créer des astuces
    const astuces = await Astuce.bulkCreate([
      {
        titre: 'Comment accueillir un chat pour la première fois',
        contenu: 'Préparez un espace calme avec litière, gamelles et jouets. Laissez-le explorer à son rythme.',
        categorie: 'Adoption'
      },
      {
        titre: 'L\'alimentation du chien adulte',
        contenu: 'Un chien adulte doit manger 2 fois par jour. Adaptez les portions à son poids et son activité.',
        categorie: 'Alimentation'
      },
      {
        titre: 'Reconnaître les signes de stress chez le chat',
        contenu: 'Queue gonflée, oreilles en arrière, miaulements excessifs sont des signes de stress.',
        categorie: 'Santé'
      },
      {
        titre: 'Toilettage du chien en été',
        contenu: 'Brossez régulièrement pour enlever les poils morts. Attention à ne pas raser complètement.',
        categorie: 'Toilettage'
      },
      {
        titre: 'Vaccins essentiels pour chat',
        contenu: 'Typhus, coryza et leucose sont les vaccins de base pour protéger votre chat.',
        categorie: 'Santé'
      },
      {
        titre: 'Éduquer un chiot à la propreté',
        contenu: 'Sortez-le régulièrement après les repas et félicitez-le quand il fait dehors.',
        categorie: 'Éducation'
      },
      {
        titre: 'Jeux et stimulation pour chat d\'appartement',
        contenu: 'Arbres à chat, jouets interactifs et sessions de jeu quotidiennes sont essentiels.',
        categorie: 'Bien-être'
      },
      {
        titre: 'Prévenir les puces et tiques',
        contenu: 'Utilisez des antiparasitaires adaptés dès le printemps et inspectez régulièrement.',
        categorie: 'Santé'
      }
    ]);
    console.log('✓ Astuces créées:', astuces.length);

    // 7. Créer des tags
    const tags = await Tag.bulkCreate([
      {
        name: 'Passionné de chats',
        couleur: '#FF6B9D',
        user_id: 2
      },
      {
        name: 'Allergique aux chiens',
        couleur: '#FFA500',
        user_id: 2
      },
      {
        name: 'Refuge certifié',
        couleur: '#4CAF50',
        user_id: 3
      },
      {
        name: 'Bénévole',
        couleur: '#2196F3',
        user_id: 4
      },
      {
        name: 'Grand jardin',
        couleur: '#8BC34A',
        user_id: 4
      },
      {
        name: 'Première adoption',
        couleur: '#9C27B0',
        user_id: 4
      }
    ]);
    console.log('✓ Tags créés:', tags.length);

    console.log('\n🎉 Seeding terminé avec succès !');
    console.log(`
📊 Résumé :
- ${roles.length} rôles
- ${users.length} utilisateurs
- ${animals.length} animaux
- ${images.length} images
- ${partenaires.length} partenaires
- ${astuces.length} astuces
- ${tags.length} tags
    `);

  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Exécuter le seeding
if (require.main === module) {
  seed()
    .then(() => {
      console.log('✅ Script de seeding terminé');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = seed;
