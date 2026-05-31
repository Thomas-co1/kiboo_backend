#!/bin/bash

# Script de déploiement pour KIBOO Backend sur VPS
# Utilisation: bash deploy.sh

set -e  # Arrête le script en cas d'erreur

echo "=========================================="
echo "  Déploiement KIBOO Backend sur VPS"
echo "=========================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
APP_DIR="/var/www/kiboo_backend"
GITHUB_REPO="https://github.com/Thomas-co1/kiboo_backend.git"
DB_NAME="kiboo_db"
DB_USER="kibooSequelize"
DB_PASSWORD="Kiboo2024Secure!"

echo ""
echo "${YELLOW}[1/10] Mise à jour du système...${NC}"
sudo apt update
sudo apt upgrade -y

echo ""
echo "${YELLOW}[2/10] Installation de Git (si nécessaire)...${NC}"
sudo apt install -y git

echo ""
echo "${YELLOW}[3/10] Installation de Node.js et npm (si nécessaire)...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

echo ""
echo "${YELLOW}[4/10] Installation de PM2 globalement...${NC}"
sudo npm install -g pm2

echo ""
echo "${YELLOW}[5/10] Installation de MariaDB (si nécessaire)...${NC}"
if ! command -v mysql &> /dev/null; then
    sudo apt install -y mariadb-server
    sudo mysql_secure_installation
fi

echo ""
echo "${YELLOW}[6/10] Configuration de la base de données...${NC}"
sudo mysql -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';"
sudo mysql -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
echo "${GREEN}✓ Base de données configurée${NC}"

echo ""
echo "${YELLOW}[7/10] Clonage/Mise à jour du dépôt Git...${NC}"
if [ -d "$APP_DIR" ]; then
    echo "Le répertoire existe déjà, mise à jour..."
    cd $APP_DIR
    git pull origin main
else
    echo "Clonage du dépôt..."
    sudo mkdir -p /var/www
    cd /var/www
    sudo git clone $GITHUB_REPO
    cd $APP_DIR
fi

echo ""
echo "${YELLOW}[8/10] Installation des dépendances...${NC}"
npm install --omit=dev

echo ""
echo "${YELLOW}[9/10] Configuration du fichier .env...${NC}"
if [ ! -f .env ]; then
    cat > .env << EOF
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_HOST=localhost
JWT_PRIVATE_TOKEN=f654cc3298ca27b36784aa1cb41dc7d1
PORT=3000
NODE_ENV=production
EOF
    echo "${GREEN}✓ Fichier .env créé${NC}"
else
    echo "${YELLOW}⚠ Le fichier .env existe déjà${NC}"
fi

echo ""
echo "${YELLOW}[10/10] Configuration de Nginx...${NC}"
if [ ! -f /etc/nginx/sites-available/kiboo ]; then
    sudo tee /etc/nginx/sites-available/kiboo > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;

    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

    # Créer le lien symbolique
    sudo ln -sf /etc/nginx/sites-available/kiboo /etc/nginx/sites-enabled/
    
    # Supprimer le site par défaut s'il existe
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Tester la configuration nginx
    sudo nginx -t
    
    # Redémarrer nginx
    sudo systemctl restart nginx
    echo "${GREEN}✓ Nginx configuré${NC}"
else
    echo "${YELLOW}⚠ Configuration nginx existante${NC}"
fi

echo ""
echo "${YELLOW}Démarrage de l'application avec PM2...${NC}"
pm2 stop kiboo-backend 2>/dev/null || true
pm2 delete kiboo-backend 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo ""
echo "${GREEN}=========================================="
echo "  ✓ Déploiement terminé avec succès !"
echo "==========================================${NC}"
echo ""
echo "📋 Commandes utiles:"
echo "  • Voir les logs: pm2 logs kiboo-backend"
echo "  • Statut: pm2 status"
echo "  • Redémarrer: pm2 restart kiboo-backend"
echo "  • Arrêter: pm2 stop kiboo-backend"
echo ""
echo "🌐 Tester l'API: curl http://localhost:3000/"
echo "🌐 Via Nginx: curl http://votre-ip/api/"
echo ""
