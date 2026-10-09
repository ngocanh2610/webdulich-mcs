const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
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
app.use(cors({ origin: '*', methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'] }));
app.use(morgan('combined'));
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql-db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'root',
  database: process.env.DB_NAME || 'vntourism',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Khởi tạo bảng support_messages nếu chưa tồn tại
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
  }
};
initChatTable();

// Connected sockets map
const userSockets = new Map(); // username -> Set of socketIds

io.on('connection', (socket) => {
  const username = socket.handshake.query.username;
  const role = socket.handshake.query.role;

  if (username) {
    if (!userSockets.has(username)) {
      userSockets.set(username, new Set());
    }
    userSockets.get(username).add(socket.id);

    // Join room theo username riêng
    socket.join(`user_${username}`);

    // Nếu là admin, join room 'admins'
    if (role === 'admin' || username === 'admin') {
      socket.join('admins');
    }

    // Thông báo cho tất cả admin trạng thái online
    io.to('admins').emit('user_online_status', { username, online: true });
  }

  socket.on('join_location', (locationId) => {
    socket.join(`location_${locationId}`);
  });

  socket.on('leave_location', (locationId) => {
    socket.leave(`location_${locationId}`);
  });

  // Typing event
  socket.on('support_typing', ({ conversationId, isTyping, senderRole }) => {
    if (senderRole === 'admin') {
      io.to(`user_${conversationId}`).emit('admin_typing', { isTyping });
    } else {
      io.to('admins').emit('user_typing', { conversationId, isTyping, username });
    }
  });

  // Gửi tin nhắn qua Socket
  socket.on('send_support_message', async (data, callback) => {
    try {
      const { message, targetUser, conversationId } = data;
      if (!username || !message || !message.trim()) {
        if (callback) callback({ success: false, message: 'Nội dung tin nhắn không hợp lệ' });
        return;
      }

      const msgId = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const isAdmin = role === 'admin' || username === 'admin';

      let sender_username = username;
      let sender_role = isAdmin ? 'admin' : 'user';
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
        // NGƯỜI DÙNG CHỈ ĐƯỢC PHÉP GỬI CHO ADMIN, KHÔNG THỂ GỬI CHO NGƯỜI DÙNG KHÁC
        receiver_username = 'admin';
        conv_id = username;
      }

      await pool.execute(
        'INSERT INTO support_messages (id, sender_username, sender_role, receiver_username, conversation_id, message, is_read) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [msgId, sender_username, sender_role, receiver_username, conv_id, message.trim(), false]
      );

      const newMsg = {
        id: msgId,
        sender_username,
        sender_role,
        receiver_username,
        conversation_id: conv_id,
        message: message.trim(),
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

  // Đánh dấu đã đọc qua Socket
  socket.on('mark_support_read', async ({ conversationId }) => {
    try {
      if (!conversationId) return;
      const isAdmin = role === 'admin' || username === 'admin';
      if (isAdmin) {
        await pool.execute(
          'UPDATE support_messages SET is_read = TRUE WHERE conversation_id = ? AND receiver_username = ?',
          [conversationId, 'admin']
        );
        io.to(`user_${conversationId}`).emit('messages_marked_read', { conversationId });
      } else {
        await pool.execute(
          'UPDATE support_messages SET is_read = TRUE WHERE conversation_id = ? AND receiver_username = ?',
          [username, username]
        );
        io.to('admins').emit('messages_marked_read', { conversationId: username });
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
    // Add to database
    await pool.execute(
      'INSERT INTO notifications (id, type, message, location_id, target_user, is_read) VALUES (?, ?, ?, ?, ?, ?)',
      [notification.id, notification.type, notification.message, notification.locationId, notification.target, false]
    );

    // Emit if connected
    if (userSockets.has(username)) {
      const socketIds = userSockets.get(username);
      for (const socketId of socketIds) {
        io.to(socketId).emit('new_notification', notification);
      }
    }
  } catch (error) {
    console.error('Error saving notification', error);
  }
};

// Middleware to verify user token via jwt trực tiếp hoặc user-service
const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Yêu cầu đăng nhập' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  // 1. Thử verify JWT trực tiếp (cực nhanh và độc lập)
  if (jwt) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (jwtErr) {
      // nếu token hết hạn hoặc lỗi, fallback qua user service
    }
  }

  // 2. Fallback gọi user-service
  try {
    let userRes;
    try {
      userRes = await fetch(`${USER_SERVICE_URL}/api/auth/me`, {
        headers: { 'Authorization': authHeader }
      });
    } catch (netErr) {
      // Fallback localhost nếu chạy dev ngoài Docker
      userRes = await fetch(`http://localhost:3005/api/auth/me`, {
        headers: { 'Authorization': authHeader }
      });
    }
    const userData = await userRes.json();
    
    if (!userData.success) {
      return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
    }
    
    req.user = userData.user; // Attach user to request
    next();
  } catch (e) {
    console.error('Error verifying token', e);
    return res.status(500).json({ success: false, message: 'Lỗi xác thực' });
  }
};

// Helper function to format locations
const formatLocation = async (row) => {
  const [reactionsRows] = await pool.execute('SELECT username, type FROM location_reactions WHERE location_id = ?', [row.id]);
  
  let parsedImages = [];
  try { parsedImages = typeof row.images_json === 'string' ? JSON.parse(row.images_json) : (row.images_json || []); } catch(e){}
  
  let parsedTags = [];
  try { parsedTags = typeof row.tags_json === 'string' ? JSON.parse(row.tags_json) : (row.tags_json || []); } catch(e){}

  return {
    ...row,
    provinceId: row.province_id,
    status: row.status || 'approved',
    images: parsedImages,
    tags: parsedTags,
    reactions: reactionsRows
  };
};

// Health check
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

// GET /api/locations?province=ha-noi&type=...&search=...
app.get('/api/locations', async (req, res) => {
  const { province, type, search, status, author, limit = 50, offset = 0 } = req.query;

  let query = 'SELECT * FROM locations WHERE 1=1';
  const params = [];

  if (status) {
    if (status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }
  } else {
    // Mặc định công khai: chỉ lấy bài viết đã được duyệt
    query += " AND status = 'approved'";
  }

  if (author) {
    query += ' AND author = ?';
    params.push(author);
  }

  if (province) {
    query += ' AND province_id = ?';
    params.push(province);
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
    // Get total
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countRows] = await pool.execute(countQuery, params);
    const total = countRows[0].total;

    // Get data
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
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// GET /api/locations/recent - Recent contributions
app.get('/api/locations/recent', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM locations WHERE status = 'approved' ORDER BY created_at DESC LIMIT 10");
    const data = await Promise.all(rows.map(row => formatLocation(row)));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// GET /api/locations/notifications - Get user notifications
app.get('/api/locations/notifications', requireAuth, async (req, res) => {
  try {
    let query = 'SELECT * FROM notifications WHERE target_user = ? ORDER BY created_at DESC LIMIT 100';
    let params = [req.user.username];
    
    if (req.user.role === 'admin') {
      query = 'SELECT * FROM notifications WHERE target_user = ? OR target_user = ? ORDER BY created_at DESC LIMIT 100';
      params.push('admin');
    }
    
    const [rows] = await pool.execute(query, params);
    // map to match frontend
    const data = rows.map(r => ({...r, locationId: r.location_id, read: r.is_read}));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// DELETE /api/locations/notifications/:id - Mark as read/delete notification
app.delete('/api/locations/notifications/:id', requireAuth, async (req, res) => {
  try {
    await pool.execute('DELETE FROM notifications WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// PUT /api/locations/notifications/:id/read - Mark notification as read
app.put('/api/locations/notifications/:id/read', requireAuth, async (req, res) => {
  try {
    await pool.execute('UPDATE notifications SET is_read = TRUE WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// GET /api/locations/:id
app.get('/api/locations/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM locations WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Địa điểm không tồn tại' });
    }
    
    const location = await formatLocation(rows[0]);

    // Get related locations from same province
    const [relatedRows] = await pool.execute(
      'SELECT * FROM locations WHERE province_id = ? AND id != ? LIMIT 4', 
      [location.province_id, location.id]
    );
    const related = await Promise.all(relatedRows.map(row => formatLocation(row)));

    res.json({ success: true, data: location, related });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// GET /api/locations/meta/types - location types
app.get('/api/locations/meta/types', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT DISTINCT type FROM locations WHERE type IS NOT NULL');
    res.json({ success: true, data: rows.map(r => r.type) });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// GET /api/locations/meta/counts - get location counts per province
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

// GET /api/locations/admin/pending - Get pending approval locations (Admin only)
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

// PUT /api/locations/:id/status - Approve or reject location (Admin only)
app.put('/api/locations/:id/status', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền duyệt hoặc từ chối bài viết' });
  }

  const { status, reason } = req.body;
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

    // Gửi thông báo đến tác giả của bài viết
    if (loc.author && loc.author !== req.user.username) {
      const isApproved = status === 'approved';
      const msg = isApproved 
        ? `Chúc mừng! Bài viết "${loc.name}" của bạn đã được Admin duyệt và đăng tải công khai.`
        : `Bài viết "${loc.name}" của bạn đã bị từ chối duyệt.${reason ? ' Lý do: ' + reason : ''}`;
      
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

    // Broadcast socket event realtime
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

// POST /api/locations - User Generated Content
app.post('/api/locations', requireAuth, async (req, res) => {
  const { provinceId, name, type, description, tags, images } = req.body;
  
  if (!provinceId || !name || !description) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc (provinceId, name, description)' });
  }

  const id = `${provinceId}-${Date.now()}`;
  let mainImage = images && images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80';
  
  // Admin đăng thì tự động duyệt ngay; user thường thì phải chờ admin duyệt (pending)
  const initialStatus = req.user.role === 'admin' ? 'approved' : 'pending';

  try {
    await pool.execute(
      'INSERT INTO locations (id, province_id, name, type, rating, description, image, images_json, tags_json, author, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, provinceId, name, type || 'discovery', 5, description, mainImage, JSON.stringify(images || []), JSON.stringify(tags || []), req.user.username, initialStatus]
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

// PUT /api/locations/:id - Update User Generated Content
app.put('/api/locations/:id', requireAuth, async (req, res) => {
  const { name, type, description, tags, images } = req.body;
  const id = req.params.id;
  
  try {
    const [rows] = await pool.execute('SELECT * FROM locations WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy địa điểm' });
    }

    const loc = rows[0];

    // Check permissions: Must be admin or the author
    if (req.user.role !== 'admin' && req.user.username !== loc.author) {
      return res.status(403).json({ success: false, message: 'Không có quyền sửa bài viết này' });
    }

    let mainImage = images && images.length > 0 ? images[0] : loc.image;

    await pool.execute(
      'UPDATE locations SET name = COALESCE(?, name), type = COALESCE(?, type), description = COALESCE(?, description), tags_json = COALESCE(?, tags_json), image = COALESCE(?, image), images_json = COALESCE(?, images_json) WHERE id = ?',
      [name, type, description, tags ? JSON.stringify(tags) : null, mainImage, images ? JSON.stringify(images) : null, id]
    );

    const [updatedRows] = await pool.execute('SELECT * FROM locations WHERE id = ?', [id]);
    const updatedLoc = await formatLocation(updatedRows[0]);
    
    res.json({ success: true, data: updatedLoc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật dữ liệu' });
  }
});


// DELETE /api/locations/:id
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

// GET /api/locations/:id/comments
app.get('/api/locations/:id/comments', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM comments WHERE location_id = ? ORDER BY created_at ASC', [req.params.id]);
    const data = rows.map(r => ({...r, locationId: r.location_id, parentId: r.parent_id}));
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// POST /api/locations/:id/comments
app.post('/api/locations/:id/comments', requireAuth, async (req, res) => {
  const { content, parentId } = req.body;
  
  try {
    const [rows] = await pool.execute('SELECT * FROM locations WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    const location = rows[0];

    const cmtId = `cmt-${Date.now()}`;
    await pool.execute(
      'INSERT INTO comments (id, location_id, username, content, parent_id) VALUES (?, ?, ?, ?, ?)',
      [cmtId, location.id, req.user.username, content, parentId || null]
    );

    const [newCmtRows] = await pool.execute('SELECT * FROM comments WHERE id = ?', [cmtId]);
    const newComment = {...newCmtRows[0], locationId: newCmtRows[0].location_id, parentId: newCmtRows[0].parent_id};

    // Notify target user
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

    // Broadcast
    io.to(`location_${location.id}`).emit('new_comment', newComment);

    res.json({ success: true, data: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// POST /api/locations/:id/react
app.post('/api/locations/:id/react', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM locations WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    const location = rows[0];

    const [existing] = await pool.execute('SELECT * FROM location_reactions WHERE location_id = ? AND username = ?', [location.id, req.user.username]);
    
    let added = false;
    if (existing.length > 0) {
      // Toggle off
      await pool.execute('DELETE FROM location_reactions WHERE location_id = ? AND username = ?', [location.id, req.user.username]);
    } else {
      // Toggle on
      await pool.execute('INSERT INTO location_reactions (location_id, username, type) VALUES (?, ?, ?)', [location.id, req.user.username, 'like']);
      added = true;

      // Notify author
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

// ==========================================
// SUPPORT CHAT APIS (Realtime User <-> Admin)
// ==========================================

// 1. GET /api/support-chat/conversations (Chỉ Admin mới có quyền)
app.get('/api/support-chat/conversations', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Chỉ Quản trị viên mới có quyền xem danh sách hội thoại' });
  }

  try {
    const [rows] = await pool.query(`
      SELECT 
        latest.conversation_id as username,
        u.email,
        u.role,
        m.message as last_message,
        m.sender_role as last_sender_role,
        m.created_at as last_message_time,
        COALESCE(unread.unread_count, 0) as unread_count
      FROM (
        SELECT conversation_id, MAX(created_at) as max_time
        FROM support_messages
        GROUP BY conversation_id
      ) latest
      JOIN support_messages m ON m.conversation_id = latest.conversation_id AND m.created_at = latest.max_time
      LEFT JOIN users u ON u.username = latest.conversation_id
      LEFT JOIN (
        SELECT conversation_id, COUNT(*) as unread_count
        FROM support_messages
        WHERE receiver_username = 'admin' AND is_read = FALSE
        GROUP BY conversation_id
      ) unread ON unread.conversation_id = latest.conversation_id
      ORDER BY m.created_at DESC
    `);

    const conversations = rows.map(r => ({
      ...r,
      is_online: userSockets.has(r.username)
    }));

    res.json({ success: true, data: conversations });
  } catch (error) {
    console.error('Lỗi lấy danh sách hội thoại:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

// 2. GET /api/support-chat/messages/:conversationId
// User chỉ được xem tin nhắn của mình; Admin được xem của bất kỳ ai
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

    // Tự động đánh dấu đã đọc
    if (isAdmin) {
      await pool.execute(
        'UPDATE support_messages SET is_read = TRUE WHERE conversation_id = ? AND receiver_username = ?',
        [conversationId, 'admin']
      );
      io.to(`user_${conversationId}`).emit('messages_marked_read', { conversationId });
    } else {
      await pool.execute(
        'UPDATE support_messages SET is_read = TRUE WHERE conversation_id = ? AND receiver_username = ?',
        [req.user.username, req.user.username]
      );
      io.to('admins').emit('messages_marked_read', { conversationId: req.user.username });
    }

    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Lỗi lấy lịch sử chat:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

// 3. POST /api/support-chat/send
app.post('/api/support-chat/send', requireAuth, async (req, res) => {
  const { message, targetUser, conversationId } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập nội dung tin nhắn' });
  }

  const isAdmin = req.user.role === 'admin';
  const msgId = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  let sender_username = req.user.username;
  let sender_role = isAdmin ? 'admin' : 'user';
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
    // NGƯỜI DÙNG CHỈ ĐƯỢC PHÉP GỬI CHO ADMIN, TUYỆT ĐỐI KHÔNG GỬI CHO NGƯỜI KHÁC
    receiver_username = 'admin';
    conv_id = req.user.username;
  }

  try {
    await pool.execute(
      'INSERT INTO support_messages (id, sender_username, sender_role, receiver_username, conversation_id, message, is_read) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [msgId, sender_username, sender_role, receiver_username, conv_id, message.trim(), false]
    );

    const newMsg = {
      id: msgId,
      sender_username,
      sender_role,
      receiver_username,
      conversation_id: conv_id,
      message: message.trim(),
      is_read: false,
      created_at: new Date().toISOString()
    };

    // Emit Realtime qua Socket
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

// 4. PUT /api/support-chat/read/:conversationId
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
    } else {
      await pool.execute(
        'UPDATE support_messages SET is_read = TRUE WHERE conversation_id = ? AND receiver_username = ?',
        [req.user.username, req.user.username]
      );
      io.to('admins').emit('messages_marked_read', { conversationId: req.user.username });
    }

    res.json({ success: true, message: 'Đã đánh dấu đã đọc' });
  } catch (error) {
    console.error('Lỗi đánh dấu đã đọc:', error);
    res.status(500).json({ success: false });
  }
});

// 5. GET /api/support-chat/unread-count
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
