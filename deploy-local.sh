#!/bin/bash

echo "=========================================="
echo "🚀 Triggering Local Production Deployment..."
echo "=========================================="

# 1. Kéo Image mới nhất từ Docker Hub
echo "📥 Pulling latest image from Docker Hub..."
docker compose -f docker-compose-prod.yaml pull

# 2. Khởi chạy lại Container với Image mới (Zero downtime rebuild)
echo "🔄 Recreating containers..."
docker compose -f docker-compose-prod.yaml up -d --remove-orphans

# 3. Dọn dẹp Image cũ để tiết kiệm dung lượng đĩa
echo "🧹 Cleaning up old unused images..."
docker image prune -f

# 4. Hiển thị trạng thái các container
echo "✅ Deployment completed! Container Status:"
docker compose -f docker-compose-prod.yaml ps
