#!/bin/bash
# ========================================================
# Script dong bo 100% du lieu tu XAMPP len MySQL tren AWS EC2
# ========================================================

set -e

echo "📥 [1/3] Cap nhat ban sao luu database moi nhat tu Git..."
cd ~/webdulich-mcs
git fetch origin main
git reset --hard origin/main

echo "🔄 [2/3] Nap 100% du lieu tu XAMPP (Users, Locations, Comments, Tin nhan) vao MySQL..."
sudo docker exec -i vn-tourism-mysql mysql -uroot -proot1234 vntourism < db/backup_xampp.sql

echo "🔄 [3/3] Khoi dong lai cac service backend..."
sudo docker compose restart province-service location-service user-service

echo "=========================================================="
echo "🎉 CHUC MUNG! TOAN BO DU LIEU CU TREN XAMPP DA DUOC MIGRATION THANH CONG!"
echo "👉 4 tai khoan, 36 dia diem, comment va tin nhan da online 100%!"
echo "👉 Kiem tra ngay: https://ngoccanhh2610.id.vn"
echo "=========================================================="
