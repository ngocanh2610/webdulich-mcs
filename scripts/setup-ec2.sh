#!/bin/bash
# ========================================================
# Kich ban cai dat moi truong tu dong tren AWS EC2 Ubuntu
# Web Microservice Du Lich Viet Nam (ngoccanhh2610.id.vn)
# ========================================================

set -e

echo "🔄 Cap nhat package he thong..."
sudo apt-get update -y
sudo apt-get upgrade -y

echo "📦 Cai dat Git, Curl va cac tien ich can thiet..."
sudo apt-get install -y ca-certificates curl gnupg lsb-release git

echo "🐳 Cai dat Docker Engine..."
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "🔑 Phan quyen Docker cho user ubuntu..."
sudo usermod -aG docker $USER

echo "📂 Clone source code ve may chu..."
cd ~
if [ ! -d "webdulich-mcs" ]; then
  git clone https://github.com/ngocanh2610/webdulich-mcs.git
fi

cd webdulich-mcs

echo "📝 Tao file .env mau neu chua co..."
if [ ! -f ".env" ]; then
  cp .env.example .env
fi

echo "========================================================"
echo "✅ Cai dat hoan tat!"
echo "👉 Luu y: Vui long thoat terminal (go exit) va SSH lai"
echo "   de quyen docker co hieu luc, hoac chay: newgrp docker"
echo "========================================================"
