# 🌱 Seeding de la base de données KIBOO

## Utilisation

### Remplir la base de données avec des données initiales

```bash
npm run seed
```

## Données créées

Le script de seeding crée automatiquement :

### 👥 **3 Rôles**
- User (utilisateur standard)
- Admin (administrateur)
- Refuge (structure d'accueil d'animaux)

### 🙋 **4 Utilisateurs**
- **Admin KIBOO** (admin@kiboo.fr) - Administrateur
- **Marie Dupont** (marie@example.com) - Utilisatrice
- **Refuge SPA Paris** (spa.paris@example.com) - Refuge
- **Jean Martin** (jean@example.com) - Utilisateur

Tous les mots de passe : `password123` (sauf admin : `admin123`)

### 🐾 **5 Animaux**
- Minou (chat européen)
- Rex (Labrador)
- Félix (chat tigré)
- Bella (chat siamois)
- Max (berger allemand)

### 🖼️ **5 Images**
Images placeholder pour chaque animal

### 🤝 **4 Partenaires**
- Purina (PURINA2026)
- Royal Canin (ROYAL2026)
- Vétérinaire Plus (VETOPLUS)
- Animalis (ANIMALIS)

### 💡 **8 Astuces**
Catégories : Adoption, Alimentation, Santé, Toilettage, Éducation, Bien-être

## ⚠️ Attention

Ce script utilise `{ force: true }` ce qui **supprime et recrée** toutes les tables.
**Toutes les données existantes seront perdues !**

Utilisez uniquement en développement ou pour réinitialiser la base.
