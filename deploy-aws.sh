#!/bin/bash
set -e

echo "=== Nexus AI AWS Avtomatik O'rnatish Skripti ==="

# 1. Tizim paketlarini yangilash
sudo apt-get update -y
sudo apt-get install -y git python3 python3-pip curl

# 2. Port 8000 da serverni tekshirish
echo "Python backend serverini test rejimida tekshirish..."
python3 backend/server.py &
SERVER_PID=$!
sleep 2

if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Server muvaffaqiyatli ishga tushdi!"
    kill $SERVER_PID
else
    echo "❌ Serverni ishga tushirishda xatolik yuz berdi"
    exit 1
fi

echo "=== O'rnatish yakunlandi! ==="
echo "Doimiy fonda ishga tushirish uchun: sudo cp nexus-ai.service /etc/systemd/system/ && sudo systemctl enable --now nexus-ai"
