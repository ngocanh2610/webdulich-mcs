#!/bin/bash
# ========================================================
# Kich ban cai dat SSL (HTTPS) cho ngoccanhh2610.id.vn
# ========================================================

set -e

echo "🚀 [1/5] Cap nhat Docker containers ve cong 8080..."
cd ~/webdulich-mcs
git fetch origin main
git reset --hard origin/main
docker compose -f docker-compose.prod.yml up -d

echo "📦 [2/5] Cai dat Nginx va Certbot tren may chu Ubuntu..."
sudo apt-get update -y
sudo apt-get install -y nginx certbot python3-certbot-nginx

echo "⚙️ [3/5] Cau hinh Nginx lam Reverse Proxy cho Docker..."
sudo tee /etc/nginx/sites-available/default > /dev/null << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name ngoccanhh2610.id.vn www.ngoccanhh2610.id.vn;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /socket.io/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo nginx -t
sudo systemctl restart nginx

echo "🔒 [4/5] Cap chung chi SSL Let's Encrypt (HTTPS) tu dong..."
sudo certbot --nginx -d ngoccanhh2610.id.vn -d www.ngoccanhh2610.id.vn --non-interactive --agree-tos -m doanngocanh26102005@gmail.com --redirect

echo "🔄 [5/5] Khoi dong lai Nginx va kiem tra..."
sudo systemctl reload nginx

# Khoi tao database mau neu chua co
docker exec -i vn-tourism-mysql mysql -uroot -proot1234 vntourism < db/init.sql 2>/dev/null || true
docker compose -f docker-compose.prod.yml restart location-service 2>/dev/null || true

echo "=========================================================="
echo "🎉 CHUC MUNG! Website cua ban da duoc bao mat voi HTTPS!"
echo "👉 Truy cap ngay: https://ngoccanhh2610.id.vn"
echo "=========================================================="
