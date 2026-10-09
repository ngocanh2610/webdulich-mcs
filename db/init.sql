CREATE DATABASE vntourism DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vntourism;

-- Bảng Users
CREATE TABLE users (
  id VARCHAR(100) PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Thêm user admin mặc định
INSERT IGNORE INTO users (id, username, email, password, role, created_at) 
VALUES ('admin', 'admin', 'admin@vietnamtourism.vn', '$2a$10$Dn0PSZeWI4bDWbg9wSdK9e8Prc2hGxJS.oKQFwdbl8udQsVSMEWXq', 'admin', NOW()); 

-- Bảng OTPs (Lưu thông tin đăng ký tạm thời)
CREATE TABLE otps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  otp_code VARCHAR(20) NOT NULL,
  expires_at BIGINT NOT NULL
);

-- Bảng Tỉnh Thành
CREATE TABLE provinces (
  id VARCHAR(50) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  region_code VARCHAR(50),
  capital VARCHAR(100),
  image TEXT,
  area INT DEFAULT 0,
  population INT DEFAULT 0,
  description TEXT,
  region VARCHAR(100),
  merged_from JSON,
  PRIMARY KEY (id, type),
  INDEX idx_slug (slug)
);

-- Bảng Locations (Địa điểm)
CREATE TABLE locations (
  id VARCHAR(100) PRIMARY KEY,
  province_id VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) DEFAULT 'discovery',
  rating INT DEFAULT 5,
  description TEXT,
  image TEXT,
  images_json JSON,
  tags_json JSON,
  author VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author) REFERENCES users(username) ON DELETE CASCADE,
  FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE CASCADE
);

-- Bảng Notifications (Đã liên kết khóa ngoại)
CREATE TABLE notifications (
  id VARCHAR(100) PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  location_id VARCHAR(100),
  target_user VARCHAR(100) NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (target_user) REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Bảng Comments
CREATE TABLE comments (
  id VARCHAR(100) PRIMARY KEY,
  location_id VARCHAR(100) NOT NULL,
  username VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  parent_id VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
  FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

-- Bảng Reactions
CREATE TABLE location_reactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  location_id VARCHAR(100) NOT NULL,
  username VARCHAR(100) NOT NULL,
  type VARCHAR(50) DEFAULT 'like',
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
  FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
  UNIQUE(location_id, username)
);

-- Bảng Tin nhắn Hỗ trợ Realtime giữa Người dùng và Admin (User <-> Admin)
CREATE TABLE IF NOT EXISTS support_messages (
  id VARCHAR(100) PRIMARY KEY,
  sender_username VARCHAR(100) NOT NULL,
  sender_role VARCHAR(20) NOT NULL DEFAULT 'user',
  receiver_username VARCHAR(100) NOT NULL,
  conversation_id VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_conversation (conversation_id),
  INDEX idx_sender (sender_username),
  INDEX idx_receiver (receiver_username),
  INDEX idx_created (created_at)
);