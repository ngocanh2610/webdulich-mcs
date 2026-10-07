import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Map as MapIcon, Compass, User, LogOut, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const { mode, user, logout } = useAppContext();
  const navigate = useNavigate();

  return (
    <nav className="glass-nav" style={{ 
      position: 'fixed', 
      top: 0, 
      width: '100%', 
      zIndex: 100, 
      padding: '1rem 0'
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)' }}>
          <div style={{ 
            background: 'var(--accent-gradient)', 
            padding: '0.5rem', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Compass size={24} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.5px' }}>
            Vietnam<span style={{ color: 'var(--accent-primary)' }}>Tourism</span>
          </span>
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Trang Chủ</Link>
          <Link to="/provinces" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
            Khám Phá {mode} Tỉnh
          </Link>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'rgba(255,255,255,0.1)', 
            padding: '0.4rem 0.8rem', 
            borderRadius: '20px',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}>
            <MapIcon size={16} />
            <span>Chế độ: <strong>{mode} Tỉnh Thành</strong></span>
          </div>

          {/* Right Side: Auth & Notifications */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

            {user && user.role === 'admin' && (
              <button
                onClick={() => navigate('/admin/approvals')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  background: 'rgba(234, 179, 8, 0.15)', color: '#eab308',
                  border: '1px solid rgba(234, 179, 8, 0.35)',
                  padding: '0.45rem 0.9rem', borderRadius: '20px',
                  fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(234, 179, 8, 0.25)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(234, 179, 8, 0.15)'}
                title="Quản lý duyệt bài đăng"
              >
                <ShieldCheck size={16} />
                <span>Duyệt bài</span>
              </button>
            )}

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <NotificationDropdown />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={16} />
                  </div>
                  <span style={{ fontWeight: 500 }}>{user.username}</span>
                  {user.role === 'admin' && (
                    <span style={{ fontSize: '0.7rem', background: '#ef4444', padding: '0.1rem 0.4rem', borderRadius: '10px', marginLeft: '0.25rem' }}>ADMIN</span>
                  )}
                </div>
                <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)' }}></div>
                <button 
                  onClick={logout}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  title="Đăng xuất"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/auth')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'var(--accent-primary)', color: 'white',
                  border: 'none', padding: '0.6rem 1.25rem', borderRadius: '20px',
                  fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                <User size={18} /> Đăng nhập
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
