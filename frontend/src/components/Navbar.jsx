import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Map as MapIcon, Compass, User, LogOut, ShieldCheck, Sparkles, Menu, X, ArrowRight, Headset, ChevronDown, Users, Search } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const { mode, setMode, user, logout, unreadSupportChat } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/provinces?q=${encodeURIComponent(navSearch.trim())}`);
    }
  };

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

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
      <div style={{
        background: '#011E40',
        color: '#E2E8F0',
        fontSize: '0.8rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div className="top-bar-container" style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0.35rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Headset size={14} color="#F59E0B" /> 
              <span className="top-bar-hotline-label">Hotline CSKH: </span>
              <strong style={{ color: '#FCD34D' }}>0816 951 801</strong>
            </span>
            <span className="top-bar-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#94A3B8' }}>
              ✉️ doanngocanh26102005@gmail.com
            </span>
            <span className="top-bar-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#34D399' }}>
              ● Trực tuyến 24/7 toàn quốc
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => setMode(mode === '63' ? '34' : '63')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#CBD5E1',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '2px 4px'
              }}
              title={`Đang hiển thị ${mode} tỉnh. Bấm để chuyển sang ${mode === '63' ? '34' : '63'} tỉnh`}
            >
              <MapIcon size={13} color="#FCD34D" />
              <span>Chế độ: <strong style={{ color: '#FFFFFF' }}>{mode} Tỉnh</strong></span>
              <ChevronDown size={12} color="#94A3B8" />
            </button>
          </div>
        </div>
      </div>

      <div className="nav-inner-container">
        {/* Brand Logo & Search Box */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
          <Link 
            to="/" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.55rem', 
              textDecoration: 'none',
              flexShrink: 0
            }}
          >
            <img 
              src="/logo.png" 
              alt="VietnamTourism Logo" 
              className="nav-brand-logo"
              style={{ 
                width: '38px', 
                height: '38px', 
                objectFit: 'contain',
                flexShrink: 0,
                filter: 'drop-shadow(0 2px 5px rgba(13, 124, 117, 0.15))'
              }} 
            />
            <span 
              className="nav-brand-title"
              style={{ 
                fontFamily: 'var(--font-heading)', 
                fontWeight: 800, 
                fontSize: '1.25rem', 
                letterSpacing: '-0.3px',
                color: 'var(--brand-navy)',
                whiteSpace: 'nowrap'
              }}
            >
              VietnamTourism
            </span>
          </Link>

          {/* Search bar next to logo */}
          <form onSubmit={handleNavSearch} className="nav-search-box">
            <Search size={15} color="#94A3B8" style={{ flexShrink: 0 }} />
            <input 
              type="text" 
              className="nav-search-input"
              placeholder="Tìm kiếm điểm đến..." 
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
            />
          </form>
        </div>
        
        {/* Flat navigation links - all with the same color */}
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
            Khám Phá Tỉnh Thành
          </Link>

          <Link 
            to="/planner" 
            className={`nav-link-item ${isActive('/planner') ? 'active' : ''}`}
            title="Lập lịch trình du lịch thông minh bằng AI"
          >
            <span>AI Trợ lý du lịch</span>
            <Sparkles size={15} color="currentColor" style={{ opacity: 0.75 }} />
          </Link>
        </div>

        {/* Right action items */}
        <div className="nav-desktop-actions">
          {user && user.role === 'admin' && (
            <>
              <button
                type="button"
                onClick={() => navigate('/admin/approvals')}
                className="nav-admin-link"
                title="Quản lý duyệt bài đăng"
              >
                <ShieldCheck size={16} color="#CA8A04" />
                <span>Duyệt bài</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/admin/chat')}
                className="nav-admin-link"
                style={{ position: 'relative' }}
                title="Quản lý tin nhắn hỗ trợ khách hàng realtime"
              >
                <Headset size={16} color="#2563EB" />
                <span>Chat Hỗ trợ</span>
                {unreadSupportChat > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-6px',
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

          <NotificationDropdown />

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

                <div 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                >
                  <span 
                    className="nav-user-name"
                    style={{ 
                      fontWeight: 600, 
                      fontSize: '0.875rem',
                      color: '#1F2937', 
                      maxWidth: '110px', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap' 
                    }}
                  >
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
              className="nav-login-btn"
              onClick={() => navigate('/auth')}
            >
              <User size={16} />
              <span>Đăng nhập</span>
            </button>
          )}

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

      {/* Backdrop overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            zIndex: 998
          }}
        />
      )}

      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#FFFFFF',
            borderBottom: '2px solid #E2E8F0',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.12)',
            padding: '1rem 1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            maxHeight: 'calc(100vh - 90px)',
            overflowY: 'auto',
            zIndex: 999,
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {/* Mobile search input */}
          <form 
            onSubmit={(e) => {
              handleNavSearch(e);
              setMobileMenuOpen(false);
            }} 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              borderRadius: '9999px',
              padding: '0.5rem 0.85rem'
            }}
          >
            <Search size={16} color="#94A3B8" />
            <input 
              type="text" 
              placeholder="Tìm kiếm điểm đến..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '0.875rem',
                color: '#1E293B'
              }}
            />
          </form>

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
                background: '#F8FAFC',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                cursor: 'pointer'
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
                flexShrink: 0,
                overflow: 'hidden',
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
              className="nav-login-btn"
              onClick={() => {
                navigate('/auth');
                setMobileMenuOpen(false);
              }}
              style={{
                justifyContent: 'center',
                padding: '0.65rem 1rem',
                fontSize: '0.925rem'
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
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.925rem',
              color: isActive('/') ? '#005294' : '#334155',
              background: isActive('/') ? '#F1F5F9' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>Trang Chủ</span>
            <ArrowRight size={16} opacity={0.4} />
          </Link>

          <Link 
            to="/provinces" 
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.925rem',
              color: isActive('/provinces') ? '#005294' : '#334155',
              background: isActive('/provinces') ? '#F1F5F9' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>Khám Phá Tỉnh Thành</span>
            <ArrowRight size={16} opacity={0.4} />
          </Link>

          <Link 
            to="/planner" 
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.925rem',
              color: isActive('/planner') ? '#005294' : '#334155',
              background: isActive('/planner') ? '#F1F5F9' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              AI Trợ lý du lịch
              <Sparkles size={16} color="currentColor" style={{ opacity: 0.7 }} />
            </span>
            <ArrowRight size={16} opacity={0.4} />
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
