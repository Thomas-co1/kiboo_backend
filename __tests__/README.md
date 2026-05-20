# Tests KIBOO Backend

## 📋 Structure des tests

```
__tests__/
├── setup.js                    # Configuration globale des tests
├── models/                     # Tests unitaires des modèles
│   ├── user.model.test.js
│   └── partenaire.model.test.js
└── routes/                     # Tests fonctionnels des routes API
    ├── user.test.js
    ├── animal.test.js
    └── partenaire.test.js
```

## 🚀 Commandes de test

### Lancer tous les tests
```bash
npm test
```

### Lancer les tests en mode watch (redémarre automatiquement)
```bash
npm run test:watch
```

### Générer un rapport de couverture
```bash
npm run test:coverage
```

## ✅ Tests implémentés

### Tests unitaires (Modèles)
- ✅ **User Model** : Validation des champs, email unique, date d'inscription
- ✅ **Partenaire Model** : Validation nom/code, unicité du code, description optionnelle

### Tests fonctionnels (Routes API)
- ✅ **User Routes** : GET, POST, PATCH, DELETE avec validations
- ✅ **Animal Routes** : CRUD complet avec relations
- ✅ **Partenaire Routes** : CRUD + recherche par code unique

## 🎯 Couverture testée

- Création d'entités
- Récupération par ID
- Mise à jour partielle (PATCH)
- Suppression
- Validation des champs requis
- Gestion des erreurs (404, 400)
- Contraintes d'unicité
- Relations entre modèles

## 🔧 Configuration

Les tests utilisent une base de données séparée (`kiboo_test`) configurée dans `.env.test`.
La base est automatiquement créée et nettoyée à chaque exécution.
