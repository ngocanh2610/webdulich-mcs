import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, ShieldCheck, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { GoogleLogin } from '@react-oauth/google';

const AuthPage = () => {
  const { login } = useAppContext();
  const navigate = useNavigate();
  
  // 'login' | 'register' | 'forgot'
  const [authMode, setAuthMode] = useState('login');
  
  // Register flow: 1: Info, 2: OTP
  const [registerStep, setRegisterStep] = useState(1);
  
  // Forgot flow: 1: Email, 2: OTP & New Password
  const [forgotStep, setForgotStep] = useState(1);
  
  // Form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // Forgot password fields
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const switchMode = (newMode) => {
    setAuthMode(newMode);
    setRegisterStep(1);
    setForgotStep(1);
    setError('');
    setSuccessMsg('');
  };

  // 1. Traditional Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (data.success) {
        login(data.user, data.token);
        navigate(-1);
      } else {
        setError(data.message || 'Lỗi đăng nhập');
      }
    } catch (err) {
      setError('Lỗi kết nối tới máy chủ');
    } finally {
      setLoading(false);
    }
  };

  // 2. Register Flow
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    if (registerStep === 1) {
      try {
        const res = await fetch('/api/auth/register-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (data.success) {
          setSuccessMsg('Mã OTP đã được gửi tới email của bạn!');
          setRegisterStep(2);
        } else {
          setError(data.message || 'Lỗi gửi mã OTP');
        }
      } catch (err) {
        setError('Lỗi kết nối tới máy chủ');
      } finally {
        setLoading(false);
      }
    } else if (registerStep === 2) {
      try {
        const res = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otpCode })
        });
        const data = await res.json();
        if (data.success) {
          setSuccessMsg('Đăng ký thành công! Vui lòng đăng nhập.');
          setTimeout(() => {
            switchMode('login');
            setUsername('');
            setPassword('');
            setEmail('');
            setOtpCode('');
          }, 2000);
        } else {
          setError(data.message || 'Mã OTP không hợp lệ');
        }
      } catch (err) {
        setError('Lỗi kết nối tới máy chủ');
      } finally {
        setLoading(false);
      }
    }
  };

  // 3. Forgot Password Flow
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    if (forgotStep === 1) {
      if (!forgotEmail.trim()) {
        setError('Vui lòng nhập địa chỉ email');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: forgotEmail.trim() })
        });
        const data = await res.json();
        if (data.success) {
          setSuccessMsg(data.message || 'Mã OTP đã được gửi về email của bạn!');
          setForgotStep(2);
        } else {
          setError(data.message || 'Không thể gửi mã OTP');
        }
      } catch (err) {
        setError('Lỗi kết nối tới máy chủ');
      } finally {
        setLoading(false);
      }
    } else if (forgotStep === 2) {
      if (!forgotOtp.trim()) {
        setError('Vui lòng nhập mã OTP');
        setLoading(false);
        return;
      }
      if (!newPassword || newPassword.length < 6) {
        setError('Mật khẩu mới phải có tối thiểu 6 ký tự');
        setLoading(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('Mật khẩu xác nhận không khớp');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: forgotEmail.trim(),
            otpCode: forgotOtp.trim(),
            newPassword
          })
        });
        const data = await res.json();
        if (data.success) {
          setSuccessMsg(data.message || 'Đặt lại mật khẩu thành công!');
          setTimeout(() => {
            switchMode('login');
            setForgotEmail('');
            setForgotOtp('');
            setNewPassword('');
            setConfirmPassword('');
            setSuccessMsg('Đổi mật khẩu thành công! Bạn có thể đăng nhập ngay.');
          }, 2000);
        } else {
          setError(data.message || 'Mã OTP không chính xác hoặc đã hết hạn');
        }
      } catch (err) {
        setError('Lỗi kết nối tới máy chủ');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResendForgotOTP = async () => {
    if (!forgotEmail) return;
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Đã gửi lại mã OTP mới về email của bạn!');
      } else {
        setError(data.message || 'Không thể gửi lại mã OTP');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });
      const data = await res.json();
      if (data.success) {
        login(data.user, data.token);
        navigate(-1);
      } else {
        setError(data.message || 'Google Auth Failed');
      }
    } catch (err) {
      setError('Lỗi kết nối server khi đăng nhập bằng Google');
    }
  };

  const handleGoogleError = () => {
    setError('Đăng nhập Google thất bại');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: '#FAFAFA'
    }}>

      <div style={{
        position: 'relative',
        width: '100%', maxWidth: '440px',
        padding: '3rem 2.5rem',
        borderRadius: '16px',
        background: '#FFFFFF',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--glass-shadow)',
        zIndex: 10
      }}>
        
        <button 
          onClick={() => navigate('/')}
          style={{
            position: 'absolute', top: '1.5rem', left: '1.5rem',
            background: 'transparent', border: 'none',
            color: 'var(--text-secondary)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem', borderRadius: '8px', transition: 'all 0.3s'
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <ArrowLeft size={20} />
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Về trang chủ</span>
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
          {authMode === 'forgot' ? (
            <KeyRound size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
          ) : (
            <ShieldCheck size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
          )}
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>
            {authMode === 'login' && 'Chào mừng trở lại'}
            {authMode === 'register' && 'Tạo tài khoản mới'}
            {authMode === 'forgot' && 'Khôi phục mật khẩu'}
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            {authMode === 'login' && 'Đăng nhập để khám phá và chia sẻ địa điểm'}
            {authMode === 'register' && 'Tham gia cộng đồng du lịch Việt Nam'}
            {authMode === 'forgot' && (forgotStep === 1 ? 'Nhập email để nhận mã OTP đặt lại mật khẩu' : `Nhập OTP và đặt mật khẩu mới cho ${forgotEmail}`)}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.875rem', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}

        {/* Success message */}
        {successMsg && (
          <div style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.875rem', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ─── 1. LOGIN FORM ─── */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                Tên đăng nhập hoặc Email
              </label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  style={{
                    width: '100%', padding: '0.875rem 1rem 0.875rem 2.5rem',
                    background: '#FFFFFF', border: '1px solid var(--border-strong)',
                    borderRadius: '8px', color: 'var(--text-primary)', outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--text-primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
                  placeholder="Nhập username hoặc email"
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ color: 'var(--text-secondary)' }}>Mật khẩu</label>
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  style={{
                    background: 'transparent', border: 'none',
                    color: 'var(--accent-primary)', fontSize: '0.875rem',
                    fontWeight: 500, cursor: 'pointer', padding: 0
                  }}
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: '100%', padding: '0.875rem 1rem 0.875rem 2.5rem',
                    background: '#FFFFFF', border: '1px solid var(--border-strong)',
                    borderRadius: '8px', color: 'var(--text-primary)', outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--text-primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
                  placeholder="Nhập mật khẩu"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                width: '100%', padding: '1rem',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>
        )}

        {/* ─── 2. REGISTER FORM ─── */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit}>
            {registerStep === 2 ? (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Mã OTP (gửi qua email)</label>
                <div style={{ position: 'relative' }}>
                  <ShieldCheck size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value)}
                    style={{
                      width: '100%', padding: '0.875rem 1rem 0.875rem 2.5rem',
                      background: '#FFFFFF', border: '1px solid var(--border-strong)',
                      borderRadius: '8px', color: 'var(--text-primary)', outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--text-primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
                    placeholder="Nhập mã 6 số"
                  />
                </div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Tên đăng nhập</label>
                  <div style={{ position: 'relative' }}>
                    <UserIcon size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      style={{
                        width: '100%', padding: '0.875rem 1rem 0.875rem 2.5rem',
                        background: '#FFFFFF', border: '1px solid var(--border-strong)',
                        borderRadius: '8px', color: 'var(--text-primary)', outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--text-primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
                      placeholder="Chọn tên đăng nhập"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      style={{
                        width: '100%', padding: '0.875rem 1rem 0.875rem 2.5rem',
                        background: '#FFFFFF', border: '1px solid var(--border-strong)',
                        borderRadius: '8px', color: 'var(--text-primary)', outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--text-primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
                      placeholder="Nhập địa chỉ email"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Mật khẩu</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      style={{
                        width: '100%', padding: '0.875rem 1rem 0.875rem 2.5rem',
                        background: '#FFFFFF', border: '1px solid var(--border-strong)',
                        borderRadius: '8px', color: 'var(--text-primary)', outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--text-primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
                      placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                    />
                  </div>
                </div>
              </>
            )}

            <button 
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                width: '100%', padding: '1rem',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Đang xử lý...' : (registerStep === 1 ? 'Tiếp tục (Gửi mã OTP)' : 'Xác nhận Đăng ký')}
            </button>
          </form>
        )}

        {/* ─── 3. FORGOT PASSWORD FORM ─── */}
        {authMode === 'forgot' && (
          <form onSubmit={handleForgotSubmit}>
            {forgotStep === 1 ? (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                    Email đã đăng ký tài khoản
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      style={{
                        width: '100%', padding: '0.875rem 1rem 0.875rem 2.5rem',
                        background: '#FFFFFF', border: '1px solid var(--border-strong)',
                        borderRadius: '8px', color: 'var(--text-primary)', outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--text-primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
                      placeholder="Nhập email của bạn"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{
                    width: '100%', padding: '1rem',
                    fontSize: '1rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? 'Đang gửi mã...' : 'Gửi mã OTP qua Email'}
                </button>
              </>
            ) : (
              <>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                    Mã OTP (6 chữ số trong email)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <ShieldCheck size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={forgotOtp}
                      onChange={e => setForgotOtp(e.target.value)}
                      style={{
                        width: '100%', padding: '0.875rem 1rem 0.875rem 2.5rem',
                        background: '#FFFFFF', border: '1px solid var(--border-strong)',
                        borderRadius: '8px', color: 'var(--text-primary)', outline: 'none',
                        letterSpacing: '3px', fontSize: '1.1rem', fontWeight: 600,
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--text-primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
                      placeholder="000000"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                    Mật khẩu mới
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      style={{
                        width: '100%', padding: '0.875rem 1rem 0.875rem 2.5rem',
                        background: '#FFFFFF', border: '1px solid var(--border-strong)',
                        borderRadius: '8px', color: 'var(--text-primary)', outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--text-primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
                      placeholder="Tối thiểu 6 ký tự"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.75rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                    Xác nhận mật khẩu mới
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      style={{
                        width: '100%', padding: '0.875rem 1rem 0.875rem 2.5rem',
                        background: '#FFFFFF', border: '1px solid var(--border-strong)',
                        borderRadius: '8px', color: 'var(--text-primary)', outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--text-primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{
                    width: '100%', padding: '1rem',
                    fontSize: '1rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    marginBottom: '0.75rem'
                  }}
                >
                  {loading ? 'Đang cập nhật...' : 'Xác nhận Đổi Mật Khẩu'}
                </button>

                <div style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={handleResendForgotOTP}
                    disabled={loading}
                    style={{
                      background: 'transparent', border: 'none',
                      color: 'var(--text-secondary)', fontSize: '0.875rem',
                      cursor: 'pointer', textDecoration: 'underline'
                    }}
                  >
                    Gửi lại mã OTP
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        {/* Google Login (Only shown on Login and Register Step 1) */}
        {((authMode === 'login') || (authMode === 'register' && registerStep === 1)) && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', margin: '1.75rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-strong)' }}></div>
              <span style={{ padding: '0 1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Hoặc</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-strong)' }}></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                shape="rectangular"
                width="100%"
              />
            </div>
          </>
        )}

        {/* Footer Navigation */}
        <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {authMode === 'login' && (
            <>
              Chưa có tài khoản?
              <button 
                onClick={() => switchMode('register')}
                style={{
                  background: 'transparent', border: 'none',
                  color: 'var(--accent-primary)', fontWeight: 600,
                  cursor: 'pointer', marginLeft: '0.5rem',
                  fontSize: '0.95rem'
                }}
              >
                Đăng ký ngay
              </button>
            </>
          )}

          {authMode === 'register' && (
            <>
              Đã có tài khoản?
              <button 
                onClick={() => switchMode('login')}
                style={{
                  background: 'transparent', border: 'none',
                  color: 'var(--accent-primary)', fontWeight: 600,
                  cursor: 'pointer', marginLeft: '0.5rem',
                  fontSize: '0.95rem'
                }}
              >
                Đăng nhập
              </button>
            </>
          )}

          {authMode === 'forgot' && (
            <button 
              onClick={() => switchMode('login')}
              style={{
                background: 'transparent', border: 'none',
                color: 'var(--accent-primary)', fontWeight: 600,
                cursor: 'pointer', display: 'inline-flex',
                alignItems: 'center', gap: '0.35rem',
                fontSize: '0.95rem'
              }}
            >
              <ArrowLeft size={16} />
              Quay lại Đăng nhập
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
