FROM node:20-alpine

WORKDIR /app

# Dépendances système nécessaires pour Expo et ngrok (tunnel)
RUN apk add --no-cache git curl bash

# Installer @expo/ngrok globalement pour le mode tunnel
RUN npm install -g @expo/ngrok@^4.1.0

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./

# Installer les dépendances du projet
RUN npm install

# Copier le reste du projet
COPY . .

# Ports Expo : Metro bundler + Expo Go
EXPOSE 8081
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

CMD ["npx", "expo", "start", "--tunnel"]
