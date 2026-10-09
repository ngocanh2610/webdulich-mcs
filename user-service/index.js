const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3005;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_for_vietnam_tourism';

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

// Mail transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER || 'placeholder@gmail.com',
    pass: process.env.SMTP_PASS || 'placeholder_app_password'
  }
});

// Google OAuth Client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Ensure users table schema has avatar and status columns
async function initDb() {
  try {
    const [cols] = await pool.query(`SHOW COLUMNS FROM users LIKE 'avatar'`);
    if (cols.length === 0) {
      await pool.query(`ALTER TABLE users ADD COLUMN avatar LONGTEXT NULL AFTER role`);
      console.log('✅ Added column avatar to users table');
    }
    const [statusCols] = await pool.query(`SHOW COLUMNS FROM users LIKE 'status'`);
    if (statusCols.length === 0) {
      await pool.query(`ALTER TABLE users ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'active' AFTER role`);
      console.log('✅ Added column status to users table');
    }
  } catch (err) {
    console.error('Lỗi khởi tạo cấu trúc bảng users:', err.message);
  }
}
initDb();

// Auth Middlewares
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để tiếp tục' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Bạn không có quyền thực hiện chức năng quản trị này' });
  }
  next();
};

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] }));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', service: 'user-service', db: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', service: 'user-service', db: 'disconnected' });
  }
});

// 1. Traditional Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Sai thông tin đăng nhập' });
    }

    const user = rows[0];
    if (user.status === 'disabled') {
      return res.status(403).json({ success: false, message: 'Tài khoản của bạn đã bị vô hiệu hóa bởi quản trị viên.' });
    }

    if (!user.password || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ success: false, message: 'Sai thông tin đăng nhập' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      success: true, 
      token, 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role, 
        avatar: user.avatar || null,
        status: user.status || 'active',
        created_at: user.created_at 
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

// 2. Request OTP for Registration
app.post('/api/auth/register-otp', async (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
    if (rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Tên người dùng hoặc Email đã tồn tại' });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60000; // Expires in 5 mins
    
    // Store pending OTP
    await pool.execute('DELETE FROM otps WHERE email = ?', [email]);
    await pool.execute('INSERT INTO otps (email, username, password, otp_code, expires_at) VALUES (?, ?, ?, ?, ?)', 
      [email, username, password, otpCode, expiresAt]);

    // Send Email
    try {
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail({
          from: `"Vietnam Tourism" <${process.env.SMTP_USER}>`,
          to: email,
          subject: 'Mã xác nhận đăng ký tài khoản',
          text: `Mã OTP của bạn là: ${otpCode}. Mã này sẽ hết hạn trong 5 phút.`,
          html: `<h3>Chào bạn,</h3><p>Mã OTP xác nhận đăng ký tài khoản của bạn là: <strong>${otpCode}</strong></p><p>Mã sẽ hết hạn trong 5 phút.</p>`
        });
        console.log(`Sent OTP to ${email}: ${otpCode}`);
      } else {
        console.log(`[MOCK EMAIL] OTP for ${email} is ${otpCode}`);
      }
    } catch (mailError) {
      console.error('Lỗi khi gửi email qua SMTP:', mailError.message);
      console.log(`[MOCK EMAIL FALLBACK] OTP for ${email} is ${otpCode}`);
    }
    
    res.json({ success: true, message: 'Đã gửi mã OTP tới email của bạn' });
  } catch (error) {
    console.error('Lỗi server:', error);
    res.status(500).json({ success: false, message: 'Không thể xử lý yêu cầu, vui lòng thử lại.' });
  }
});

// 3. Verify OTP & Create Account
app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otpCode } = req.body;
  
  try {
    const [rows] = await pool.execute('SELECT * FROM otps WHERE email = ? AND otp_code = ?', [email, otpCode]);
    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Mã OTP không hợp lệ' });
    }
    
    const pending = rows[0];
    if (Date.now() > pending.expires_at) {
      return res.status(400).json({ success: false, message: 'Mã OTP đã hết hạn' });
    }

    // OTP valid, create user
    const salt = bcrypt.genSaltSync(10);
    const id = `user-${Date.now()}`;
    const hashedPassword = bcrypt.hashSync(pending.password, salt);

    await pool.execute('INSERT INTO users (id, username, email, password, role, status) VALUES (?, ?, ?, ?, ?, ?)', 
      [id, pending.username, pending.email, hashedPassword, 'user', 'active']);

    // Clean up OTP
    await pool.execute('DELETE FROM otps WHERE email = ?', [email]);

    res.json({ success: true, message: 'Đăng ký thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

// 3.1 Request OTP for Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp địa chỉ email' });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE LOWER(email) = ?', [cleanEmail]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Email này chưa được đăng ký trong hệ thống' });
    }

    const user = rows[0];
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60000; // 5 minutes

    // Store pending OTP for password reset
    await pool.execute('DELETE FROM otps WHERE email = ?', [cleanEmail]);
    await pool.execute('INSERT INTO otps (email, username, password, otp_code, expires_at) VALUES (?, ?, ?, ?, ?)', 
      [cleanEmail, user.username, 'RESET_PASSWORD', otpCode, expiresAt]);

    // Send email
    try {
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail({
          from: `"Vietnam Tourism" <${process.env.SMTP_USER}>`,
          to: cleanEmail,
          subject: 'Mã xác nhận đặt lại mật khẩu',
          text: `Mã OTP đặt lại mật khẩu của bạn là: ${otpCode}. Mã có hiệu lực trong 5 phút.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
              <h2 style="color: #0f172a; text-align: center; margin-bottom: 8px;">Khôi phục mật khẩu</h2>
              <p style="color: #475569; font-size: 15px;">Xin chào <strong>${user.username}</strong>,</p>
              <p style="color: #475569; font-size: 15px; line-height: 1.5;">Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản liên kết với email này.</p>
              <div style="text-align: center; margin: 25px 0;">
                <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2563eb; background-color: #eff6ff; padding: 12px 24px; border-radius: 8px; border: 1px dashed #3b82f6;">${otpCode}</span>
              </div>
              <p style="color: #64748b; font-size: 13px;">Mã OTP có hiệu lực trong <strong>5 phút</strong>. Tuyệt đối không cung cấp mã này cho bất kỳ ai.</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">Nếu bạn không gửi yêu cầu này, vui lòng bỏ qua email.</p>
            </div>
          `
        });
        console.log(`[FORGOT-PW] Sent OTP to ${cleanEmail}: ${otpCode}`);
      } else {
        console.log(`[MOCK EMAIL / FORGOT-PW] OTP for ${cleanEmail} is ${otpCode}`);
      }
    } catch (mailError) {
      console.error('Lỗi khi gửi email qua SMTP:', mailError.message);
      console.log(`[MOCK EMAIL FALLBACK / FORGOT-PW] OTP for ${cleanEmail} is ${otpCode}`);
    }

    res.json({ success: true, message: 'Mã xác nhận OTP đã được gửi về email của bạn' });
  } catch (error) {
    console.error('Lỗi server forgot-password:', error);
    res.status(500).json({ success: false, message: 'Lỗi hệ thống, vui lòng thử lại sau.' });
  }
});

// 3.2 Verify OTP & Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
  const { email, otpCode, newPassword } = req.body;
  if (!email || !otpCode || !newPassword) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ email, mã OTP và mật khẩu mới' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có tối thiểu 6 ký tự' });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const [rows] = await pool.execute('SELECT * FROM otps WHERE email = ? AND otp_code = ?', [cleanEmail, otpCode.trim()]);
    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Mã OTP không chính xác' });
    }

    const pending = rows[0];
    if (Date.now() > pending.expires_at) {
      return res.status(400).json({ success: false, message: 'Mã OTP đã hết hạn, vui lòng yêu cầu mã mới' });
    }

    // Hash new password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    // Update user password
    await pool.execute('UPDATE users SET password = ? WHERE LOWER(email) = ?', [hashedPassword, cleanEmail]);

    // Clean up OTP
    await pool.execute('DELETE FROM otps WHERE email = ?', [cleanEmail]);

    res.json({ success: true, message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.' });
  } catch (error) {
    console.error('Lỗi reset-password:', error);
    res.status(500).json({ success: false, message: 'Lỗi hệ thống khi đổi mật khẩu' });
  }
});

// 4. Google Login
app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ success: false, message: 'Missing credential' });

  try {
    let payload;
    if (process.env.GOOGLE_CLIENT_ID) {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } else {
      payload = jwt.decode(credential);
      console.warn("⚠️ Bypassing Google Token Verification because GOOGLE_CLIENT_ID is not set in environment!");
    }

    const { email, name, sub } = payload;
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    let user;
    
    if (rows.length === 0) {
      // Auto register if user doesn't exist
      const id = `user-${sub || Date.now()}`;
      const username = name.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000);
      const avatar = payload.picture || null;
      
      await pool.execute('INSERT INTO users (id, username, email, role, avatar, status) VALUES (?, ?, ?, ?, ?, ?)', 
        [id, username, email, 'user', avatar, 'active']);
      
      const [newRows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
      user = newRows[0];
    } else {
      user = rows[0];
      if (user.status === 'disabled') {
        return res.status(403).json({ success: false, message: 'Tài khoản của bạn đã bị vô hiệu hóa bởi quản trị viên.' });
      }
      if (!user.avatar && payload.picture) {
        await pool.execute('UPDATE users SET avatar = ? WHERE id = ?', [payload.picture, user.id]);
        user.avatar = payload.picture;
      }
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      success: true, 
      token, 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role, 
        avatar: user.avatar || null,
        status: user.status || 'active',
        created_at: user.created_at 
      } 
    });

  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ success: false, message: 'Xác thực Google thất bại' });
  }
});

// 5. Get Me (Lấy thông tin người dùng hiện tại)
const handleGetMe = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, username, email, role, avatar, status, created_at FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }
    const currentUser = rows[0];
    if (currentUser.status === 'disabled') {
      return res.status(403).json({ success: false, message: 'Tài khoản của bạn đã bị vô hiệu hóa bởi quản trị viên.' });
    }
    res.json({ success: true, user: currentUser });
  } catch (error) {
    console.error('Lỗi Get Me:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
};
app.get('/api/auth/me', authenticateToken, handleGetMe);
app.get('/api/users/me', authenticateToken, handleGetMe);

// 6. Update Profile (Cập nhật thông tin cá nhân / ảnh đại diện)
const handleUpdateProfile = async (req, res) => {
  const { avatar, email, currentPassword, newPassword } = req.body;
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }
    const user = rows[0];
    if (user.status === 'disabled') {
      return res.status(403).json({ success: false, message: 'Tài khoản đã bị vô hiệu hóa' });
    }

    // Cập nhật avatar nếu có truyền lên (có thể là URL ảnh, base64 hoặc chuỗi rỗng để xóa)
    if (avatar !== undefined) {
      await pool.execute('UPDATE users SET avatar = ? WHERE id = ?', [avatar, req.user.id]);
    }

    // Cập nhật email nếu thay đổi
    if (email && email.trim() && email.trim().toLowerCase() !== user.email.toLowerCase()) {
      const cleanEmail = email.trim().toLowerCase();
      const [emailCheck] = await pool.execute('SELECT id FROM users WHERE LOWER(email) = ? AND id != ?', [cleanEmail, req.user.id]);
      if (emailCheck.length > 0) {
        return res.status(400).json({ success: false, message: 'Email này đã được sử dụng bởi một tài khoản khác' });
      }
      await pool.execute('UPDATE users SET email = ? WHERE id = ?', [cleanEmail, req.user.id]);
    }

    // Cập nhật mật khẩu nếu có
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mật khẩu hiện tại' });
      }
      if (!user.password || !bcrypt.compareSync(currentPassword, user.password)) {
        return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không chính xác' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có tối thiểu 6 ký tự' });
      }
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(newPassword, salt);
      await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);
    }

    const [updatedRows] = await pool.execute('SELECT id, username, email, role, avatar, status, created_at FROM users WHERE id = ?', [req.user.id]);
    res.json({
      success: true,
      message: 'Cập nhật thông tin cá nhân thành công',
      user: updatedRows[0]
    });
  } catch (error) {
    console.error('Lỗi cập nhật profile:', error);
    res.status(500).json({ success: false, message: 'Lỗi cập nhật thông tin cá nhân: ' + error.message });
  }
};
app.put('/api/auth/profile', authenticateToken, handleUpdateProfile);
app.put('/api/users/profile', authenticateToken, handleUpdateProfile);

// 7. Admin: Lấy danh sách tất cả người dùng (User Management)
const handleGetUsers = async (req, res) => {
  const { q, status, role } = req.query;
  try {
    let query = 'SELECT id, username, email, role, avatar, status, created_at FROM users WHERE 1=1';
    const params = [];

    if (q && q.trim()) {
      query += ' AND (username LIKE ? OR email LIKE ?)';
      params.push(`%${q.trim()}%`, `%${q.trim()}%`);
    }

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (role && role !== 'all') {
      query += ' AND role = ?';
      params.push(role);
    }

    query += ' ORDER BY created_at DESC';

    const [users] = await pool.execute(query, params);

    // Thống kê nhanh
    const [countsResult] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' OR status IS NULL THEN 1 ELSE 0 END) as activeCount,
        SUM(CASE WHEN status = 'disabled' THEN 1 ELSE 0 END) as disabledCount,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as adminCount,
        SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) as userCount
      FROM users
    `);

    res.json({
      success: true,
      users,
      counts: countsResult[0] || { total: 0, activeCount: 0, disabledCount: 0, adminCount: 0, userCount: 0 }
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách users:', error);
    res.status(500).json({ success: false, message: 'Không thể lấy danh sách người dùng' });
  }
};
app.get('/api/users', authenticateToken, requireAdmin, handleGetUsers);
app.get('/api/auth/users', authenticateToken, requireAdmin, handleGetUsers);

// 8. Admin: Vô hiệu hóa hoặc kích hoạt lại tài khoản người dùng
const handleUpdateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['active', 'disabled'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ (chỉ chấp nhận active hoặc disabled)' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    const targetUser = rows[0];

    // Không cho phép tự vô hiệu hóa tài khoản của chính mình
    if (targetUser.id === req.user.id || targetUser.username === req.user.username) {
      return res.status(400).json({ success: false, message: 'Bạn không thể tự vô hiệu hóa tài khoản của chính mình' });
    }

    // Không cho phép vô hiệu hóa admin hệ thống
    if (targetUser.username === 'admin') {
      return res.status(400).json({ success: false, message: 'Không thể vô hiệu hóa tài khoản Quản trị viên hệ thống (admin)' });
    }

    await pool.execute('UPDATE users SET status = ? WHERE id = ?', [status, id]);

    res.json({
      success: true,
      message: status === 'disabled' ? `Đã vô hiệu hóa tài khoản "${targetUser.username}"` : `Đã kích hoạt lại tài khoản "${targetUser.username}"`,
      status
    });
  } catch (error) {
    console.error('Lỗi cập nhật trạng thái user:', error);
    res.status(500).json({ success: false, message: 'Lỗi cập nhật trạng thái người dùng: ' + error.message });
  }
};
app.patch('/api/users/:id/status', authenticateToken, requireAdmin, handleUpdateUserStatus);
app.patch('/api/auth/users/:id/status', authenticateToken, requireAdmin, handleUpdateUserStatus);

// 9. Admin: Xóa tài khoản người dùng
const handleDeleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    const targetUser = rows[0];

    // Không cho phép tự xóa tài khoản chính mình
    if (targetUser.id === req.user.id || targetUser.username === req.user.username) {
      return res.status(400).json({ success: false, message: 'Bạn không thể tự xóa tài khoản của chính mình' });
    }

    // Không cho phép xóa admin hệ thống
    if (targetUser.username === 'admin') {
      return res.status(400).json({ success: false, message: 'Không thể xóa tài khoản Quản trị viên hệ thống (admin)' });
    }

    // Dọn dẹp tin nhắn hỗ trợ nếu có
    try {
      await pool.execute('DELETE FROM support_messages WHERE sender_username = ? OR receiver_username = ?', [targetUser.username, targetUser.username]);
    } catch (cleanMsgErr) {
      // Bỏ qua nếu bảng không tồn tại
    }

    // Xóa user (các bảng locations, comments, reactions, notifications có ON DELETE CASCADE sẽ tự động được xóa)
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);

    res.json({
      success: true,
      message: `Đã xóa vĩnh viễn tài khoản "${targetUser.username}" thành công`
    });
  } catch (error) {
    console.error('Lỗi xóa user:', error);
    res.status(500).json({ success: false, message: 'Lỗi xóa tài khoản người dùng: ' + error.message });
  }
};
app.delete('/api/users/:id', authenticateToken, requireAdmin, handleDeleteUser);
app.delete('/api/auth/users/:id', authenticateToken, requireAdmin, handleDeleteUser);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ User Service running on port ${PORT}`);
});
