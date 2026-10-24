#!/bin/bash
# ========================================================
# Script khoi tao va nap du lieu MySQL tren AWS EC2
# ========================================================

set -e

echo "🔄 [1/3] Nap cau truc bang tu db/init.sql..."
cd ~/webdulich-mcs
sudo docker exec -i vn-tourism-mysql mysql -uroot -proot1234 vntourism < db/init.sql

echo "🌱 [2/3] Nap du lieu dia diem moi vao MySQL..."
sudo docker exec -i vn-tourism-locations node -e '
const fs = require("fs");
const mysql = require("mysql2/promise");

async function seed() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "mysql-db",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root1234",
    database: process.env.DB_NAME || "vntourism"
  });

  const locations = JSON.parse(fs.readFileSync("/app/data/locations.json", "utf8"));
  console.log("Bat dau nap " + locations.length + " dia diem...");
  
  for (const loc of locations) {
    try {
      await pool.execute(
        `INSERT IGNORE INTO locations (id, province_id, name, type, rating, description, image, images_json, tags_json, author, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          loc.id,
          loc.provinceId || loc.province_id || "",
          loc.name,
          loc.type || "discovery",
          loc.rating || 5,
          loc.description || "",
          loc.image || "",
          JSON.stringify(loc.images || []),
          JSON.stringify(loc.tags || []),
          loc.author || "admin",
          loc.status || "approved"
        ]
      );
    } catch (e) {
      console.error("Loi:", e.message);
    }
  }
  console.log("✅ Da nap hoan tat tat ca dia diem!");
  await pool.end();
}
seed();
'

echo "🔄 [3/3] Khoi dong lai backend services de cap nhat cache..."
sudo docker compose restart province-service location-service user-service

echo "=========================================================="
echo "🎉 TAT CA DU LIEU DATABASE DA DUOC NAP THANH CONG!"
echo "👉 Kiem tra lai web ngay: https://ngoccanhh2610.id.vn"
echo "=========================================================="
