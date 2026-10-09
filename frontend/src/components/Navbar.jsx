import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Map as MapIcon, Compass, User, LogOut, ShieldCheck, Sparkles, Menu, X, ArrowRight, Headset, ChevronDown, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const { mode, setMode, user, logout, unreadSupportChat } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Close menus on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="glass-nav" style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0,
      right: 0,
      width: '100%', 
      zIndex: 1000
    }}>
      <div className="nav-inner-container">
        {/* Brand Logo */}
        <Link 
          to="/" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            textDecoration: 'none',
            flexShrink: 0
          }}
        >
          <div style={{ 
            background: 'var(--accent-gradient)', 
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(255, 56, 92, 0.25)',
            flexShrink: 0
          }}>
            <Compass size={22} color="white" />
          </div>
          <span style={{ 
            fontFamily: 'var(--font-heading)', 
            fontWeight: 800, 
            fontSize: '1.25rem', 
            letterSpacing: '-0.3px',
            color: '#111827',
            whiteSpace: 'nowrap'
          }}>
            Vietnam<span style={{ color: 'var(--accent-primary)' }}>Tourism</span>
          </span>
        </Link>
        
        {/* Center Navigation Links (Desktop) */}
        <div className="nav-desktop-center">
          <Link 
            to="/" 
            className={`nav-link-item ${isActive('/') ? 'active' : ''}`}
          >
            Trang Chủ
          </Link>

          <Link 
            to="/provinces" 
            className={`nav-link-item ${isActive('/provinces') ? 'active' : ''}`}
          >
            Khám Phá {mode} Tỉnh
          </Link>

          <Link 
            to="/planner" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.45rem', 
              background: isActive('/planner') ? '#00A699' : '#F0FDFA', 
              color: isActive('/planner') ? '#FFFFFF' : '#00A699', 
              padding: '0.45rem 1rem', 
              borderRadius: '20px', 
              fontWeight: 700, 
              fontSize: '0.875rem',
              border: isActive('/planner') ? '1px solid #00A699' : '1px solid #99F6E4',
              boxShadow: isActive('/planner') ? '0 4px 12px rgba(0, 166, 153, 0.25)' : 'none',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!isActive('/planner')) {
                e.currentTarget.style.background = '#CCFBF1';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/planner')) {
                e.currentTarget.style.background = '#F0FDFA';
              }
            }}
          >
            <span>Lập Kế Hoạch AI</span>
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="nav-desktop-actions">
          {/* Mode Switcher Pill */}
          <button 
            type="button"
            onClick={() => setMode(mode === '63' ? '34' : '63')}
            title={`Đang hiển thị ${mode} tỉnh. Bấm để chuyển sang ${mode === '63' ? '34' : '63'} tỉnh`}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.45rem', 
              background: '#F3F4F6', 
              border: '1px solid #E5E7EB',
              padding: '0.45rem 0.85rem', 
              borderRadius: '20px',
              fontSize: '0.85rem',
              color: '#374151',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#E5E7EB';
              e.currentTarget.style.borderColor = '#D1D5DB';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#F3F4F6';
              e.currentTarget.style.borderColor = '#E5E7EB';
            }}
          >
            <MapIcon size={15} color="var(--accent-primary)" />
            <span className="nav-mode-badge-full">Chế độ: <strong style={{ color: '#111827' }}>{mode} Tỉnh Thành</strong></span>
            <span className="nav-mode-badge-compact"><strong style={{ color: '#111827' }}>{mode} Tỉnh</strong></span>
          </button>

          {/* Admin Approval & Support Chat Buttons */}
          {user && user.role === 'admin' && (
            <>
              <button
                type="button"
                onClick={() => navigate('/admin/approvals')}
                style={{
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.4rem',
                  background: '#FEF9C3', 
                  color: '#854D0E',
                  border: '1px solid #FDE047',
                  padding: '0.45rem 0.85rem', 
                  borderRadius: '20px',
                  fontWeight: 600, 
                  fontSize: '0.85rem', 
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#FEF08A'}
                onMouseLeave={e => e.currentTarget.style.background = '#FEF9C3'}
                title="Quản lý duyệt bài đăng"
              >
                <ShieldCheck size={16} color="#CA8A04" />
                <span>Duyệt bài</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/admin/chat')}
                style={{
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.4rem',
                  background: isActive('/admin/chat') ? '#2563EB' : '#EFF6FF', 
                  color: isActive('/admin/chat') ? '#FFFFFF' : '#1D4ED8',
                  border: '1px solid #BFDBFE',
                  padding: '0.45rem 0.85rem', 
                  borderRadius: '20px',
                  fontWeight: 600, 
                  fontSize: '0.85rem', 
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  position: 'relative',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  if (!isActive('/admin/chat')) e.currentTarget.style.background = '#DBEAFE';
                }}
                onMouseLeave={e => {
                  if (!isActive('/admin/chat')) e.currentTarget.style.background = '#EFF6FF';
                }}
                title="Quản lý tin nhắn hỗ trợ khách hàng realtime"
              >
                <Headset size={16} color={isActive('/admin/chat') ? '#FFFFFF' : '#2563EB'} />
                <span>Chat Hỗ trợ</span>
                {unreadSupportChat > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: '#EF4444',
                    color: '#FFFFFF',
                    borderRadius: '10px',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '1px 5px',
                    border: '1px solid #FFFFFF'
                  }}>
                    {unreadSupportChat}
                  </span>
                )}
              </button>
            </>
          )}

          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* User Account / Login */}
          {/* User Account / Login */}
          {user ? (
            <div ref={userMenuRef} style={{ position: 'relative' }}>
              <div 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  background: '#F9FAFB', 
                  padding: '0.3rem 0.65rem 0.3rem 0.35rem', 
                  borderRadius: '24px', 
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#D1D5DB'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}
              >
                {/* Avatar with click to profile */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/profile');
                  }}
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: 'var(--accent-gradient)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    flexShrink: 0,
                    overflow: 'hidden',
                    boxShadow: '0 2px 6px rgba(255, 56, 92, 0.25)',
                    border: '1.5px solid #FFFFFF'
                  }}
                  title="Nhấn để xem thông tin cá nhân"
                >
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.username} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement.innerText = user.username.charAt(0).toUpperCase();
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Username & role pill */}
                <div 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                >
                  <span style={{ 
                    fontWeight: 600, 
                    fontSize: '0.875rem',
                    color: '#1F2937', 
                    maxWidth: '110px', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap' 
                  }}>
                    {user.username}
                  </span>
                  {user.role === 'admin' && (
                    <span style={{ 
                      fontSize: '0.65rem', 
                      fontWeight: 700,
                      background: '#EF4444', 
                      color: '#FFFFFF',
                      padding: '0.15rem 0.45rem', 
                      borderRadius: '10px',
                      letterSpacing: '0.5px'
                    }}>
                      ADMIN
                    </span>
                  )}
                  <ChevronDown size={14} color="#6B7280" />
                </div>
              </div>

              {/* Account Dropdown Menu */}
              {userMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '260px',
                  background: '#FFFFFF',
                  borderRadius: '18px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                  border: '1px solid #E5E7EB',
                  overflow: 'hidden',
                  zIndex: 1100,
                  animation: 'fadeIn 0.15s ease-out'
                }}>
                  {/* User Profile Header in Dropdown */}
                  <div 
                    onClick={() => {
                      navigate('/profile');
                      setUserMenuOpen(false);
                    }}
                    style={{
                      padding: '1rem',
                      background: 'linear-gradient(135deg, #FFF1F2 0%, #EFF6FF 100%)',
                      borderBottom: '1px solid #E5E7EB',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'var(--accent-gradient)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '1rem',
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: '2px solid #FFFFFF',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.username} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        user.username.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {user.username}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {user.email || 'Xem hồ sơ của bạn'}
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div style={{ padding: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        navigate('/profile');
                        setUserMenuOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        fontSize: '0.875rem',
                        color: '#374151',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <User size={16} color="var(--accent-primary)" />
                      <span>Thông tin cá nhân</span>
                    </button>

                    {user.role === 'admin' && (
                      <button
                        type="button"
                        onClick={() => {
                          navigate('/profile?tab=users');
                          setUserMenuOpen(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '10px',
                          border: 'none',
                          background: 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          fontSize: '0.875rem',
                          color: '#1D4ED8',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#EFF6FF'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <Users size={16} color="#2563EB" />
                        <span>Quản lý người dùng</span>
                      </button>
                    )}

                    <div style={{ height: '1px', background: '#E5E7EB', margin: '0.35rem 0' }} />

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        fontSize: '0.875rem',
                        color: '#EF4444',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={16} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              type="button"
              onClick={() => navigate('/auth')}
              style={{
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.45rem',
                background: 'var(--accent-gradient)', 
                color: 'white',
                border: 'none', 
                padding: '0.55rem 1.2rem', 
                borderRadius: '24px',
                fontWeight: 600, 
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(255, 56, 92, 0.25)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 56, 92, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 56, 92, 0.25)';
              }}
            >
              <User size={16} />
              <span>Đăng nhập</span>
            </button>
          )}

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="nav-mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          style={{
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid #E5E7EB',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
            padding: '1rem 1.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {/* User Profile Card (Mobile) */}
          {user ? (
            <div 
              onClick={() => {
                navigate('/profile');
                setMobileMenuOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.85rem 1rem',
                background: 'linear-gradient(135deg, #FFF1F2 0%, #EFF6FF 100%)',
                borderRadius: '14px',
                border: '1px solid #FECDD3',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '1.1rem',
                flexShrink: 0,
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(255, 56, 92, 0.25)',
                border: '2px solid #FFFFFF'
              }}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user.username.charAt(0).toUpperCase()
                )}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E293B' }}>{user.username}</span>
                  {user.role === 'admin' && (
                    <span style={{ fontSize: '0.65rem', background: '#EF4444', color: '#FFFFFF', padding: '1px 6px', borderRadius: '8px', fontWeight: 700 }}>
                      ADMIN
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Chạm để xem thông tin cá nhân</div>
              </div>
              <ArrowRight size={16} color="var(--accent-primary)" />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                navigate('/auth');
                setMobileMenuOpen(false);
              }}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: 'none',
                background: 'var(--accent-gradient)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <User size={18} />
              <span>Đăng nhập / Đăng ký</span>
            </button>
          )}

          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: isActive('/') ? 'var(--accent-primary)' : '#1F2937',
              background: isActive('/') ? 'rgba(255, 56, 92, 0.08)' : '#F9FAFB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>Trang Chủ</span>
            <ArrowRight size={16} opacity={0.5} />
          </Link>

          <Link 
            to="/provinces" 
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: isActive('/provinces') ? 'var(--accent-primary)' : '#1F2937',
              background: isActive('/provinces') ? 'rgba(255, 56, 92, 0.08)' : '#F9FAFB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>Khám Phá {mode} Tỉnh</span>
            <ArrowRight size={16} opacity={0.5} />
          </Link>

          <Link 
            to="/planner" 
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: '#FFFFFF',
              background: 'linear-gradient(135deg, #00A699 0%, #008489 100%)',
              boxShadow: '0 4px 14px rgba(0, 166, 153, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>Lập Kế Hoạch AI</span>
            <ArrowRight size={16} />
          </Link>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            background: '#F3F4F6',
            borderRadius: '12px',
            marginTop: '0.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
              <MapIcon size={16} color="var(--accent-primary)" />
              <span>Chế độ: <strong>{mode} Tỉnh Thành</strong></span>
            </div>
            <button
              type="button"
              onClick={() => setMode(mode === '63' ? '34' : '63')}
              style={{
                background: 'var(--accent-primary)',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Đổi sang {mode === '63' ? '34' : '63'} tỉnh
            </button>
          </div>

          {user && (
            <>
              {user.role === 'admin' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/profile?tab=users');
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      background: '#EFF6FF',
                      color: '#1D4ED8',
                      border: '1px solid #BFDBFE',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Users size={18} color="#2563EB" />
                    <span>Quản lý tài khoản người dùng</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigate('/admin/approvals');
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      background: '#FEF9C3',
                      color: '#854D0E',
                      border: '1px solid #FDE047',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    <ShieldCheck size={18} color="#CA8A04" />
                    <span>Quản lý duyệt bài</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigate('/admin/chat');
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      background: '#EFF6FF',
                      color: '#1D4ED8',
                      border: '1px solid #BFDBFE',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    <Headset size={18} color="#2563EB" />
                    <span>Chat Hỗ trợ khách hàng</span>
                    {unreadSupportChat > 0 && (
                      <span style={{
                        background: '#EF4444',
                        color: '#FFFFFF',
                        borderRadius: '10px',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '2px 7px'
                      }}>
                        {unreadSupportChat} mới
                      </span>
                    )}
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: '#FEF2F2',
                  color: '#DC2626',
                  border: '1px solid #FECACA',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  marginTop: '0.25rem'
                }}
              >
                <LogOut size={18} />
                <span>Đăng xuất</span>
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
