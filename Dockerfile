FROM node:18-alpine

RUN addgroup -g 1001 -S nodejs
RUN adduser -S quizzine -u 1001

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production && npm cache clean --force

# Copier le code source
COPY --chown=quizzine:nodejs . .

# Créer les dossiers nécessaires
RUN mkdir -p logs uploads coverage && chown -R quizzine:nodejs logs uploads coverage

EXPOSE 3001

# Utiliser l'utilisateur non-root
USER quizzine

CMD ["npm", "start"]