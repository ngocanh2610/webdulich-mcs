const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2/promise');
let jwt;
try {
  jwt = require('jsonwebtoken');
} catch (e) {
  jwt = null;
}

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_for_vietnam_tourism';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://vn-tourism-users:3005';

const app = express();
const PORT = process.env.PORT || 3002;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  path: '/socket.io/'
});

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE'] }));
app.use(morgan('combined'));
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql-db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'root',
  database: process.env.DB_NAME || 'vntourism',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const verifyAuthToken = async (rawToken) => {
  if (!rawToken || typeof rawToken !== 'string') return null;
  const authHeader = rawToken.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`;
  const cleanToken = rawToken.startsWith('Bearer ') ? rawToken.slice(7).trim() : rawToken.trim();
  if (!cleanToken) return null;

  if (jwt) {
    try {
      const decoded = jwt.verify(cleanToken, JWT_SECRET);
      if (decoded && decoded.username) {
        return decoded;
      }
    } catch (jwtErr) {
      // Fallback to user-service verification below
    }
  }

  try {
    let userRes;
    try {
      userRes = await fetch(`${USER_SERVICE_URL}/api/auth/me`, {
        headers: { Authorization: authHeader }
      });
    } catch (netErr) {
      userRes = await fetch('http://localhost:3005/api/auth/me', {
        headers: { Authorization: authHeader }
      });
    }
    const userData = await userRes.json();
    if (userData && userData.success && userData.user) {
      return userData.user;
    }
  } catch (e) {
    // Ignore network verification failure
  }
  return null;
};

const initLocationsTable = async () => {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS locations (
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
        status VARCHAR(20) DEFAULT 'approved',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_province (province_id),
        INDEX idx_author (author),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(100) PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        location_id VARCHAR(100),
        target_user VARCHAR(100) NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_target_user (target_user)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS comments (
        id VARCHAR(100) PRIMARY KEY,
        location_id VARCHAR(100) NOT NULL,
        username VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        parent_id VARCHAR(100),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_location (location_id),
        INDEX idx_username (username)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS location_reactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        location_id VARCHAR(100) NOT NULL,
        username VARCHAR(100) NOT NULL,
        type VARCHAR(50) DEFAULT 'like',
        UNIQUE KEY uq_loc_user (location_id, username)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    const locationsJsonPath = path.join(__dirname, 'data', 'locations.json');
    const seedLocations = fs.existsSync(locationsJsonPath)
      ? JSON.parse(fs.readFileSync(locationsJsonPath, 'utf8'))
      : [];

    // Kiem tra du lieu locations
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM locations');
    if (rows[0].count === 0 && seedLocations.length > 0) {
      console.log('🔄 Đang đồng bộ dữ liệu locations từ locations.json vào MySQL...');
      for (const loc of seedLocations) {
        try {
          await pool.execute(
            `INSERT IGNORE INTO locations (id, province_id, name, type, rating, description, image, images_json, tags_json, author, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              loc.id,
              loc.provinceId || loc.province_id || '',
              loc.name,
              loc.type || 'discovery',
              loc.rating || 5,
              loc.description || '',
              loc.image || '',
              JSON.stringify(loc.images || []),
              JSON.stringify(loc.tags || []),
              loc.author || 'admin',
              loc.status || 'approved'
            ]
          );
        } catch (e) { }
      }
      console.log(`✅ Đã nạp thành công ${seedLocations.length} địa điểm vào MySQL`);
    } else if (seedLocations.length > 0) {
      // Auto-heal old broken / rate-limited Wikimedia & dead Unsplash URLs in existing seeded rows
      for (const loc of seedLocations) {
        if (!loc.image || !loc.image.startsWith('https://images.unsplash.com/')) continue;
        try {
          await pool.execute(
            `UPDATE locations
             SET image = ?, images_json = ?
             WHERE id = ? AND (image LIKE '%wikimedia.org%' OR image LIKE '%1573492534282%' OR image LIKE '%1599708153386%')`,
            [loc.image, JSON.stringify(loc.images && loc.images.length > 0 ? loc.images : [loc.image]), loc.id]
          );
        } catch (e) { }
      }
    }
  } catch (err) {
    console.error('Lỗi khởi tạo cấu trúc bảng locations:', err.message);
    setTimeout(initLocationsTable, 3000);
  }
};
setTimeout(initLocationsTable, 2000);

const initChatTable = async () => {
  try {
    await pool.execute(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Bảng support_messages đã sẵn sàng');
  } catch (err) {
    console.error('Lỗi khởi tạo bảng support_messages:', err.message);
    setTimeout(initChatTable, 3000);
  }
};
initChatTable();

const userSockets = new Map();

io.use(async (socket, next) => {
  try {
    const rawToken =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization ||
      socket.handshake.query?.token;

    if (rawToken) {
      const verified = await verifyAuthToken(rawToken);
      socket.user = verified
        ? { id: verified.id, username: verified.username, role: verified.role || 'user' }
        : null;
    } else {
      socket.user = null;
    }
    return next();
  } catch (err) {
    socket.user = null;
    return next();
  }
});

io.on('connection', (socket) => {
  const verifiedUser = socket.user;
  const username = verifiedUser?.username || null;
  const role = verifiedUser?.role || null;
  const isAdmin = role === 'admin';

  if (username) {
    if (!userSockets.has(username)) {
      userSockets.set(username, new Set());
    }
    userSockets.get(username).add(socket.id);

    socket.join(`user_${username}`);

    if (isAdmin) {
      socket.join('admins');
    }

    io.to('admins').emit('user_online_status', { username, online: true });
  }

  socket.on('join_location', (locationId) => {
    if (locationId) {
      socket.join(`location_${locationId}`);
    }
  });

  socket.on('leave_location', (locationId) => {
    if (locationId) {
      socket.leave(`location_${locationId}`);
    }
  });

  socket.on('support_typing', ({ conversationId, isTyping }) => {
    if (!username) return;
    if (isAdmin) {
      if (conversationId) {
        io.to(`user_${conversationId}`).emit('admin_typing', { isTyping: Boolean(isTyping) });
      }
    } else {
      io.to('admins').emit('user_typing', {
        conversationId: username,
        isTyping: Boolean(isTyping),
        username
      });
    }
  });

  socket.on('send_support_message', async (data, callback) => {
    try {
      if (!username) {
        if (callback) callback({ success: false, message: 'Vui lòng đăng nhập để gửi tin nhắn hỗ trợ' });
        return;
      }

      const { message, targetUser, conversationId } = data || {};
      if (!message || !String(message).trim()) {
        if (callback) callback({ success: false, message: 'Nội dung tin nhắn không hợp lệ' });
        return;
      }

      const cleanMessage = String(message).trim();
      const msgId = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const sender_username = username;
      const sender_role = isAdmin ? 'admin' : 'user';
      let receiver_username = '';
      let conv_id = '';

      if (isAdmin) {
        const target = targetUser || conversationId;
        if (!target) {
          if (callback) callback({ success: false, message: 'Cần xác định người nhận' });
          return;
        }
        receiver_username = target;
        conv_id = target;
      } else {
        receiver_username = 'admin';
        conv_id = username;
      }

      await pool.execute(
        'INSERT INTO support_messages (id, sender_username, sender_role, receiver_username, conversation_id, message, is_read) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [msgId, sender_username, sender_role, receiver_username, conv_id, cleanMessage, false]
      );

      const newMsg = {
        id: msgId,
        sender_username,
        sender_role,
        receiver_username,
        conversation_id: conv_id,
        message: cleanMessage,
        is_read: false,
        created_at: new Date().toISOString()
      };

      if (isAdmin) {
        io.to(`user_${receiver_username}`).emit('new_support_message', newMsg);
        io.to('admins').emit('new_support_message', newMsg);
      } else {
        io.to('admins').emit('new_support_message', newMsg);
        io.to(`user_${username}`).emit('new_support_message', newMsg);
      }

      if (callback) callback({ success: true, data: newMsg });
    } catch (err) {
      console.error('Lỗi socket send_support_message:', err);
      if (callback) callback({ success: false, message: 'Lỗi server' });
    }
  });

  socket.on('mark_support_read', async ({ conversationId } = {}) => {
    try {
      if (!username) return;
      if (isAdmin) {
        if (!conversationId) return;
        await pool.execute(
          'UPDATE support_messages SET is_read = TRUE WHERE conversation_id = ? AND receiver_username = ?',
          [conversationId, 'admin']
        );
        io.to(`user_${conversationId}`).emit('messages_marked_read', { conversationId });
        io.to('admins').emit('messages_marked_read', { conversationId });
      } else {
        await pool.execute(
          'UPDATE support_messages SET is_read = TRUE WHERE conversation_id = ? AND receiver_username = ?',
          [username, username]
        );
        io.to('admins').emit('messages_marked_read', { conversationId: username });
        io.to(`user_${username}`).emit('messages_marked_read', { conversationId: username });
      }
    } catch (err) {
      console.error('Lỗi socket mark_support_read:', err);
    }
  });

  socket.on('disconnect', () => {
    if (username && userSockets.has(username)) {
      userSockets.get(username).delete(socket.id);
      if (userSockets.get(username).size === 0) {
        userSockets.delete(username);
        io.to('admins').emit('user_online_status', { username, online: false });
      }
    }
  });
});

const notifyUser = async (username, notification) => {
  try {
    const payload = {
      ...notification,
      read: Boolean(notification.read),
      createdAt: notification.createdAt || new Date().toISOString()
    };

    await pool.execute(
      'INSERT INTO notifications (id, type, message, location_id, target_user, is_read) VALUES (?, ?, ?, ?, ?, ?)',
      [payload.id, payload.type, payload.message, payload.locationId, payload.target, false]
    );

    if (username === 'admin') {
      io.to('admins').emit('new_notification', payload);
    } else if (userSockets.has(username)) {
      const socketIds = userSockets.get(username);
      for (const socketId of socketIds) {
        io.to(socketId).emit('new_notification', payload);
      }
    }
  } catch (error) {
    console.error('Error saving notification', error);
  }
};

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Yêu cầu đăng nhập' });
  }

  const verified = await verifyAuthToken(authHeader);
  if (!verified) {
    return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
  }

  req.user = verified;
  next();
};

const formatLocation = async (row) => {
  const [reactionsRows] = await pool.execute('SELECT username, type FROM location_reactions WHERE location_id = ?', [row.id]);

  let parsedImages = [];
  try { parsedImages = typeof row.images_json === 'string' ? JSON.parse(row.images_json) : (row.images_json || []); } catch (e) { }

  let parsedTags = [];
  try { parsedTags = typeof row.tags_json === 'string' ? JSON.parse(row.tags_json) : (row.tags_json || []); } catch (e) { }

  return {
    ...row,
    provinceId: row.province_id,
    status: row.status || 'approved',
    createdAt: row.created_at,
    images: parsedImages,
    tags: parsedTags,
    reactions: reactionsRows
  };
};

const formatComment = (r) => ({
  ...r,
  locationId: r.location_id,
  parentId: r.parent_id,
  createdAt: r.created_at
});

const resolveProvinceFilterSlugs = async (provinceParam, modeParam) => {
  if (!provinceParam) return [];
  const rawSlugs = String(provinceParam)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (rawSlugs.length === 0) return [];
  const slugSet = new Set(rawSlugs);

  if (slugSet.has('hue')) {
    slugSet.add('thua-thien-hue');
  }

  if (rawSlugs.length === 1 && (modeParam === '34' || rawSlugs[0] === 'hue')) {
    try {
      const [p34Rows] = await pool.execute(
        "SELECT merged_from FROM provinces WHERE (id = ? OR slug = ?) AND type = '34' LIMIT 1",
        [rawSlugs[0], rawSlugs[0]]
      );
      if (p34Rows.length > 0 && p34Rows[0].merged_from) {
        const mergedNames = typeof p34Rows[0].merged_from === 'string'
          ? JSON.parse(p34Rows[0].merged_from)
          : p34Rows[0].merged_from;

        if (Array.isArray(mergedNames) && mergedNames.length > 0) {
          const [p63Rows] = await pool.query("SELECT slug, name FROM provinces WHERE type = '63'");
          const nameMap = new Map(p63Rows.map(r => [String(r.name).trim().toLowerCase(), r.slug]));
          for (const n of mergedNames) {
            const mapped = nameMap.get(String(n).trim().toLowerCase());
            if (mapped) slugSet.add(mapped);
          }
        }
      }
    } catch (e) {
      // Ignore province table lookup errors
    }
  }

  return Array.from(slugSet);
};

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM locations');
    res.json({
      status: 'ok',
      service: 'location-service',
      port: PORT,
      timestamp: new Date().toISOString(),
      total: rows[0].total
    });
  } catch (e) {
    res.status(500).json({ status: 'error' });
  }
});

app.get('/api/locations', async (req, res) => {
  const { province, mode, type, search, status, author, limit = 50, offset = 0 } = req.query;

  let query = 'SELECT * FROM locations WHERE 1=1';
  const params = [];

  if (status) {
    if (status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }
  } else {
    query += " AND status = 'approved'";
  }

  if (author) {
    query += ' AND author = ?';
    params.push(author);
  }

  let provinceSlugs = [];
  if (province) {
    provinceSlugs = await resolveProvinceFilterSlugs(province, mode);
    if (provinceSlugs.length === 1) {
      query += ' AND province_id = ?';
      params.push(provinceSlugs[0]);
    } else if (provinceSlugs.length > 1) {
      query += ` AND province_id IN (${provinceSlugs.map(() => '?').join(',')})`;
      params.push(...provinceSlugs);
    }
  }

  if (type && type !== 'all') {
    query += ' AND type = ?';
    params.push(type);
  }

  if (search) {
    const q = `%${search.toLowerCase()}%`;
    query += ' AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ?)';
    params.push(q, q);
  }

  try {
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countRows] = await pool.execute(countQuery, params);
    const total = countRows[0].total;

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(query, params);
    const data = await Promise.all(rows.map(row => formatLocation(row)));

    res.json({
      success: true,
      total,
      limit: Number(limit),
      offset: Number(offset),
      data
    });
  } catch (error) {
    console.error('Lỗi DB locations, fallback sang locations.json:', error.message);
    try {
      const locationsJsonPath = path.join(__dirname, 'data', 'locations.json');
      let fallback = [];
      if (fs.existsSync(locationsJsonPath)) {
        fallback = JSON.parse(fs.readFileSync(locationsJsonPath, 'utf8'));
      }
      if (!status || status === 'approved') {
        fallback = fallback.filter(l => (l.status || 'approved') === 'approved');
      } else if (status !== 'all') {
        fallback = fallback.filter(l => (l.status || 'approved') === status);
      }
      if (provinceSlugs.length > 0) {
        fallback = fallback.filter(l => provinceSlugs.includes(l.provinceId || l.province_id));
      }
      if (type && type !== 'all') {
        fallback = fallback.filter(l => l.type === type);
      }
      if (search) {
        fallback = fallback.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));
      }
      res.json({
        success: true,
        total: fallback.length,
        limit: Number(limit),
        offset: Number(offset),
        data: fallback.slice(Number(offset), Number(offset) + Number(limit))
      });
    } catch (e2) {
      res.status(500).json({ success: false });
    }
  }
});

app.get('/api/locations/recent', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM locations WHERE status = 'approved' ORDER BY created_at DESC LIMIT 10");
    const data = await Promise.all(rows.map(row => formatLocation(row)));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.get('/api/locations/notifications', requireAuth, async (req, res) => {
  try {
    let query = 'SELECT * FROM notifications WHERE target_user = ? ORDER BY created_at DESC LIMIT 100';
    const params = [req.user.username];

    if (req.user.role === 'admin') {
      query = 'SELECT * FROM notifications WHERE target_user = ? OR target_user = ? ORDER BY created_at DESC LIMIT 100';
      params.push('admin');
    }

    const [rows] = await pool.execute(query, params);
    const data = rows.map(r => ({
      ...r,
      locationId: r.location_id,
      read: Boolean(r.is_read),
      createdAt: r.created_at
    }));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.put('/api/locations/notifications/read-all', requireAuth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      await pool.execute(
        'UPDATE notifications SET is_read = TRUE WHERE target_user = ? OR target_user = ?',
        [req.user.username, 'admin']
      );
    } else {
      await pool.execute(
        'UPDATE notifications SET is_read = TRUE WHERE target_user = ?',
        [req.user.username]
      );
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.delete('/api/locations/notifications/:id', requireAuth, async (req, res) => {
  try {
    let result;
    if (req.user.role === 'admin') {
      [result] = await pool.execute(
        'DELETE FROM notifications WHERE id = ? AND (target_user = ? OR target_user = ?)',
        [req.params.id, req.user.username, 'admin']
      );
    } else {
      [result] = await pool.execute(
        'DELETE FROM notifications WHERE id = ? AND target_user = ?',
        [req.params.id, req.user.username]
      );
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Thông báo không tồn tại hoặc không thuộc quyền sở hữu' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.put('/api/locations/notifications/:id/read', requireAuth, async (req, res) => {
  try {
    let result;
    if (req.user.role === 'admin') {
      [result] = await pool.execute(
        'UPDATE notifications SET is_read = TRUE WHERE id = ? AND (target_user = ? OR target_user = ?)',
        [req.params.id, req.user.username, 'admin']
      );
    } else {
      [result] = await pool.execute(
        'UPDATE notifications SET is_read = TRUE WHERE id = ? AND target_user = ?',
        [req.params.id, req.user.username]
      );
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Thông báo không tồn tại hoặc không thuộc quyền sở hữu' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.get('/api/locations/meta/types', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT DISTINCT type FROM locations WHERE type IS NOT NULL');
    res.json({ success: true, data: rows.map(r => r.type) });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.get('/api/locations/meta/counts', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT province_id, COUNT(*) as count FROM locations WHERE status = 'approved' GROUP BY province_id");
    const counts = {};
    rows.forEach(r => {
      counts[r.province_id] = r.count;
    });
    res.json({ success: true, data: counts });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.get('/api/locations/admin/pending', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền truy cập trang duyệt bài' });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM locations WHERE status = 'pending' ORDER BY created_at DESC");
    const data = await Promise.all(rows.map(row => formatLocation(row)));
    res.json({ success: true, total: data.length, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi khi tải danh sách bài chờ duyệt' });
  }
});

app.get('/api/locations/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM locations WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Địa điểm không tồn tại' });
    }

    const location = await formatLocation(rows[0]);

    const [relatedRows] = await pool.execute(
      "SELECT * FROM locations WHERE province_id = ? AND id != ? AND status = 'approved' LIMIT 4",
      [location.province_id, location.id]
    );
    const related = await Promise.all(relatedRows.map(row => formatLocation(row)));

    res.json({ success: true, data: location, related });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

app.put('/api/locations/:id/status', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền duyệt hoặc từ chối bài viết' });
  }

  const { status, reason, rejectionReason } = req.body;
  const finalReason = (reason ?? rejectionReason ?? '').toString().trim();

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
  }

  const id = req.params.id;

  try {
    const [rows] = await pool.execute('SELECT * FROM locations WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy địa điểm' });
    }

    const loc = rows[0];

    await pool.execute('UPDATE locations SET status = ? WHERE id = ?', [status, id]);

    const [updatedRows] = await pool.execute('SELECT * FROM locations WHERE id = ?', [id]);
    const updatedLoc = await formatLocation(updatedRows[0]);

    if (loc.author && loc.author !== req.user.username) {
      const isApproved = status === 'approved';
      const msg = isApproved
        ? `Chúc mừng! Bài viết "${loc.name}" của bạn đã được Admin duyệt và đăng tải công khai.`
        : `Bài viết "${loc.name}" của bạn đã bị từ chối duyệt.${finalReason ? ' Lý do: ' + finalReason : ''}`;

      notifyUser(loc.author, {
        id: `notif-${Date.now()}`,
        type: isApproved ? 'location_approved' : 'location_rejected',
        message: msg,
        locationId: loc.id,
        target: loc.author,
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    io.emit('location_status_updated', {
      locationId: id,
      status,
      name: loc.name
    });

    res.json({
      success: true,
      data: updatedLoc,
      message: status === 'approved' ? 'Đã duyệt bài viết thành công!' : 'Đã từ chối bài viết!'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật trạng thái bài viết' });
  }
});

app.post('/api/locations', requireAuth, async (req, res) => {
  const { provinceId, name, type, description, tags, images } = req.body;

  if (!provinceId || !name || !description) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc (provinceId, name, description)' });
  }

  const id = `${provinceId}-${Date.now()}`;
  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const mainImage = safeImages.length > 0 ? safeImages[0] : 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80';

  const initialStatus = req.user.role === 'admin' ? 'approved' : 'pending';

  try {
    await pool.execute(
      'INSERT INTO locations (id, province_id, name, type, rating, description, image, images_json, tags_json, author, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, provinceId, String(name).trim(), type || 'discovery', 5, String(description).trim(), mainImage, JSON.stringify(safeImages), JSON.stringify(Array.isArray(tags) ? tags : []), req.user.username, initialStatus]
    );

    const [rows] = await pool.execute('SELECT * FROM locations WHERE id = ?', [id]);
    const newLocation = await formatLocation(rows[0]);

    if (initialStatus === 'pending') {
      notifyUser('admin', {
        id: `notif-${Date.now()}`,
        type: 'pending_approval',
        message: `Người dùng ${newLocation.author} vừa gửi bài đăng "${newLocation.name}" đang chờ bạn duyệt.`,
        locationId: newLocation.id,
        target: 'admin',
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: newLocation,
      message: initialStatus === 'pending'
        ? 'Bài viết của bạn đã được gửi và đang chờ Admin duyệt trước khi đăng tải công khai!'
        : 'Đăng bài thành công!'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi khi lưu dữ liệu' });
  }
});

app.put('/api/locations/:id', requireAuth, async (req, res) => {
  const { name, provinceId, province_id, type, description, tags, images } = req.body;
  const id = req.params.id;

  try {
    const [rows] = await pool.execute('SELECT * FROM locations WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy địa điểm' });
    }

    const loc = rows[0];

    if (req.user.role !== 'admin' && req.user.username !== loc.author) {
      return res.status(403).json({ success: false, message: 'Không có quyền sửa bài viết này' });
    }

    const nextName = name !== undefined && String(name).trim() ? String(name).trim() : loc.name;
    const incomingProv = provinceId !== undefined ? provinceId : province_id;
    const nextProvinceId = incomingProv !== undefined && String(incomingProv).trim() ? String(incomingProv).trim() : loc.province_id;
    const nextType = type !== undefined && String(type).trim() ? String(type).trim() : (loc.type || 'discovery');
    const nextDescription = description !== undefined ? String(description) : (loc.description || '');

    const existingTagsJson = typeof loc.tags_json === 'string' ? loc.tags_json : JSON.stringify(loc.tags_json || []);
    const nextTagsJson = Array.isArray(tags) ? JSON.stringify(tags) : existingTagsJson;

    const existingImagesJson = typeof loc.images_json === 'string' ? loc.images_json : JSON.stringify(loc.images_json || []);
    const hasNewImages = Array.isArray(images);
    const cleanNewImages = hasNewImages ? images.filter(Boolean) : [];
    const nextMainImage = hasNewImages
      ? (cleanNewImages[0] || loc.image || 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80')
      : loc.image;
    const nextImagesJson = hasNewImages ? JSON.stringify(cleanNewImages) : existingImagesJson;

    await pool.execute(
      'UPDATE locations SET name = ?, province_id = ?, type = ?, description = ?, tags_json = ?, image = ?, images_json = ? WHERE id = ?',
      [nextName, nextProvinceId, nextType, nextDescription, nextTagsJson, nextMainImage, nextImagesJson, id]
    );

    const [updatedRows] = await pool.execute('SELECT * FROM locations WHERE id = ?', [id]);
    const updatedLoc = await formatLocation(updatedRows[0]);

    res.json({ success: true, data: updatedLoc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật dữ liệu' });
  }
});

app.delete('/api/locations/:id', requireAuth, async (req, res) => {
  const id = req.params.id;

  try {
    const [rows] = await pool.execute('SELECT * FROM locations WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy địa điểm' });
    }

    if (req.user.role !== 'admin' && req.user.username !== rows[0].author) {
      return res.status(403).json({ success: false, message: 'Không có quyền xóa bài viết này' });
    }

    await pool.execute('DELETE FROM locations WHERE id = ?', [id]);
    res.json({ success: true, message: 'Đã xóa thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi khi xóa dữ liệu' });
  }
});

app.get('/api/locations/:id/comments', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM comments WHERE location_id = ? ORDER BY created_at ASC', [req.params.id]);
    const data = rows.map(formatComment);
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

app.post('/api/locations/:id/comments', requireAuth, async (req, res) => {
  const { content, parentId } = req.body;
  if (!content || !String(content).trim()) {
    return res.status(400).json({ success: false, message: 'Nội dung bình luận không được để trống' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM locations WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    const location = rows[0];

    const cmtId = `cmt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    await pool.execute(
      'INSERT INTO comments (id, location_id, username, content, parent_id) VALUES (?, ?, ?, ?, ?)',
      [cmtId, location.id, req.user.username, String(content).trim(), parentId || null]
    );

    const [newCmtRows] = await pool.execute('SELECT * FROM comments WHERE id = ?', [cmtId]);
    const newComment = formatComment(newCmtRows[0]);

    let targetUser = null;
    let message = '';

    if (parentId) {
      const [parentRows] = await pool.execute('SELECT * FROM comments WHERE id = ?', [parentId]);
      if (parentRows.length > 0 && parentRows[0].username !== req.user.username) {
        targetUser = parentRows[0].username;
        message = `${req.user.username} đã trả lời bình luận của bạn tại "${location.name}"`;
      }
    } else if (location.author && location.author !== req.user.username) {
      targetUser = location.author;
      message = `${req.user.username} đã bình luận về địa điểm "${location.name}" của bạn`;
    }

    if (targetUser) {
      notifyUser(targetUser, {
        id: `notif-${Date.now()}`,
        type: 'comment',
        message,
        locationId: location.id,
        target: targetUser,
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    io.to(`location_${location.id}`).emit('new_comment', newComment);

    res.json({ success: true, data: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

app.post('/api/locations/:id/react', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM locations WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    const location = rows[0];

    const [existing] = await pool.execute('SELECT * FROM location_reactions WHERE location_id = ? AND username = ?', [location.id, req.user.username]);

    let added = false;
    if (existing.length > 0) {
      await pool.execute('DELETE FROM location_reactions WHERE location_id = ? AND username = ?', [location.id, req.user.username]);
    } else {
      await pool.execute('INSERT INTO location_reactions (location_id, username, type) VALUES (?, ?, ?)', [location.id, req.user.username, 'like']);
      added = true;

      if (location.author && location.author !== req.user.username) {
        notifyUser(location.author, {
          id: `notif-${Date.now()}`,
          type: 'reaction',
          message: `${req.user.username} đã thả cảm xúc vào địa điểm "${location.name}" của bạn`,
          locationId: location.id,
          target: location.author,
          read: false,
          createdAt: new Date().toISOString()
        });
      }
    }

    const [allReactions] = await pool.execute('SELECT username, type FROM location_reactions WHERE location_id = ?', [location.id]);

    io.to(`location_${location.id}`).emit('reaction_update', {
      locationId: location.id,
      reactions: allReactions
    });

    res.json({ success: true, added, totalReactions: allReactions.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi' });
  }
});

app.get('/api/support-chat/conversations', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Chỉ Quản trị viên mới có quyền xem danh sách hội thoại' });
  }

  try {
    const [rows] = await pool.query(`
      SELECT
        m.conversation_id as username,
        m.id as msg_id,
        u.email,
        u.role,
        m.message as last_message,
        m.sender_role as last_sender_role,
        m.created_at as last_message_time,
        COALESCE(unread.unread_count, 0) as unread_count
      FROM support_messages m
      INNER JOIN (
        SELECT conversation_id, MAX(created_at) as max_time
        FROM support_messages
        GROUP BY conversation_id
      ) latest ON m.conversation_id = latest.conversation_id AND m.created_at = latest.max_time
      LEFT JOIN users u ON u.username = m.conversation_id
      LEFT JOIN (
        SELECT conversation_id, COUNT(*) as unread_count
        FROM support_messages
        WHERE receiver_username = 'admin' AND is_read = FALSE
        GROUP BY conversation_id
      ) unread ON unread.conversation_id = m.conversation_id
      ORDER BY m.created_at DESC, m.id DESC
    `);

    const seen = new Set();
    const conversations = [];
    for (const r of rows) {
      if (!r.username || seen.has(r.username)) continue;
      seen.add(r.username);
      const { msg_id, ...rest } = r;
      conversations.push({
        ...rest,
        is_online: userSockets.has(r.username)
      });
    }

    res.json({ success: true, data: conversations });
  } catch (error) {
    console.error('Lỗi lấy danh sách hội thoại:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

app.get('/api/support-chat/messages/:conversationId', requireAuth, async (req, res) => {
  const { conversationId } = req.params;
  const isAdmin = req.user.role === 'admin';

  if (!isAdmin && conversationId !== req.user.username) {
    return res.status(403).json({ success: false, message: 'Bạn không có quyền xem cuộc trò chuyện của người khác' });
  }

  try {
    const [messages] = await pool.execute(
      'SELECT id, sender_username, sender_role, receiver_username, conversation_id, message, is_read, created_at FROM support_messages WHERE conversation_id = ? ORDER BY created_at ASC LIMIT 300',
      [conversationId]
    );

    if (isAdmin) {
      await pool.execute(
        'UPDATE support_messages SET is_read = TRUE WHERE conversation_id = ? AND receiver_username = ?',
        [conversationId, 'admin']
      );
      io.to(`user_${conversationId}`).emit('messages_marked_read', { conversationId });
      io.to('admins').emit('messages_marked_read', { conversationId });
    } else {
      await pool.execute(
        'UPDATE support_messages SET is_read = TRUE WHERE conversation_id = ? AND receiver_username = ?',
        [req.user.username, req.user.username]
      );
      io.to('admins').emit('messages_marked_read', { conversationId: req.user.username });
      io.to(`user_${req.user.username}`).emit('messages_marked_read', { conversationId: req.user.username });
    }

    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Lỗi lấy lịch sử chat:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

app.post('/api/support-chat/send', requireAuth, async (req, res) => {
  const { message, targetUser, conversationId } = req.body;
  if (!message || !String(message).trim()) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập nội dung tin nhắn' });
  }

  const cleanMessage = String(message).trim();
  const isAdmin = req.user.role === 'admin';
  const msgId = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const sender_username = req.user.username;
  const sender_role = isAdmin ? 'admin' : 'user';
  let receiver_username = '';
  let conv_id = '';

  if (isAdmin) {
    const target = targetUser || conversationId;
    if (!target) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin người nhận tin nhắn' });
    }
    receiver_username = target;
    conv_id = target;
  } else {
    receiver_username = 'admin';
    conv_id = req.user.username;
  }

  try {
    await pool.execute(
      'INSERT INTO support_messages (id, sender_username, sender_role, receiver_username, conversation_id, message, is_read) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [msgId, sender_username, sender_role, receiver_username, conv_id, cleanMessage, false]
    );

    const newMsg = {
      id: msgId,
      sender_username,
      sender_role,
      receiver_username,
      conversation_id: conv_id,
      message: cleanMessage,
      is_read: false,
      created_at: new Date().toISOString()
    };

    if (isAdmin) {
      io.to(`user_${receiver_username}`).emit('new_support_message', newMsg);
      io.to('admins').emit('new_support_message', newMsg);
    } else {
      io.to('admins').emit('new_support_message', newMsg);
      io.to(`user_${sender_username}`).emit('new_support_message', newMsg);
    }

    res.json({ success: true, data: newMsg });
  } catch (error) {
    console.error('Lỗi lưu tin nhắn:', error);
    res.status(500).json({ success: false, message: 'Lỗi gửi tin nhắn' });
  }
});

app.put('/api/support-chat/read/:conversationId', requireAuth, async (req, res) => {
  const { conversationId } = req.params;
  const isAdmin = req.user.role === 'admin';

  try {
    if (isAdmin) {
      await pool.execute(
        'UPDATE support_messages SET is_read = TRUE WHERE conversation_id = ? AND receiver_username = ?',
        [conversationId, 'admin']
      );
      io.to(`user_${conversationId}`).emit('messages_marked_read', { conversationId });
      io.to('admins').emit('messages_marked_read', { conversationId });
    } else {
      await pool.execute(
        'UPDATE support_messages SET is_read = TRUE WHERE conversation_id = ? AND receiver_username = ?',
        [req.user.username, req.user.username]
      );
      io.to('admins').emit('messages_marked_read', { conversationId: req.user.username });
      io.to(`user_${req.user.username}`).emit('messages_marked_read', { conversationId: req.user.username });
    }

    res.json({ success: true, message: 'Đã đánh dấu đã đọc' });
  } catch (error) {
    console.error('Lỗi đánh dấu đã đọc:', error);
    res.status(500).json({ success: false });
  }
});

app.get('/api/support-chat/unread-count', requireAuth, async (req, res) => {
  const isAdmin = req.user.role === 'admin';

  try {
    let unreadCount = 0;
    if (isAdmin) {
      const [rows] = await pool.execute(
        'SELECT COUNT(*) as count FROM support_messages WHERE receiver_username = ? AND is_read = FALSE',
        ['admin']
      );
      unreadCount = rows[0].count;
    } else {
      const [rows] = await pool.execute(
        'SELECT COUNT(*) as count FROM support_messages WHERE conversation_id = ? AND receiver_username = ? AND is_read = FALSE',
        [req.user.username, req.user.username]
      );
      unreadCount = rows[0].count;
    }

    res.json({ success: true, unreadCount });
  } catch (error) {
    console.error('Lỗi đếm tin nhắn chưa đọc:', error);
    res.status(500).json({ success: false, unreadCount: 0 });
  }
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Location Service (with WebSockets) running on port ${PORT}`);
});
