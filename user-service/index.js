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

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'OPTIONS'] }));
app.use(morgan('combined'));
app.use(express.json());

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
    if (!user.password || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ success: false, message: 'Sai thông tin đăng nhập' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user.id, username: user.username, role: user.role } });
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

    await pool.execute('INSERT INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)', 
      [id, pending.username, pending.email, hashedPassword, 'user']);

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
      
      await pool.execute('INSERT INTO users (id, username, email, role) VALUES (?, ?, ?, ?)', 
        [id, username, email, 'user']);
      
      const [newRows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
      user = newRows[0];
    } else {
      user = rows[0];
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user.id, username: user.username, role: user.role } });

  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ success: false, message: 'Xác thực Google thất bại' });
  }
});

// 5. Get Me
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Không có quyền truy cập' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, user: decoded });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token không hợp lệ' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ User Service running on port ${PORT}`);
});
