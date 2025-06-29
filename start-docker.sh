#!/bin/bash
# filepath: c:\Users\m_cis\Desktop\IUT Bourbogne\Semestre 3\SAE\SAE-S3-2024-2025-site-de-quizz\start-docker.sh

echo "🚀 Démarrage de Quizzine avec Docker..."

# Construire et démarrer les services
docker-compose up --build -d

echo " Attente du démarrage des services..."
sleep 30

# Vérifier le statut des services
docker-compose ps

echo " Application disponible sur http://localhost:3001"
echo "  MongoDB disponible sur localhost:27017"
echo " Redis disponible sur localhost:6379"

echo "Pour voir les logs:"
echo "  docker-compose logs -f app"
echo "  docker-compose logs -f mongodb"

echo " Pour arrêter:"
echo "  docker-compose down"