import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { socket } = useAppContext();

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/locations/notifications', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
        setUnreadCount(data.data.filter(n => !n.read).length);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (socket) {
      const handleNewNotification = (notif) => {
        setNotifications(prev => [notif, ...prev]);
        setUnreadCount(prev => prev + 1);
        setIsBouncing(true);
        setTimeout(() => setIsBouncing(false), 1000);
      };
      
      socket.on('new_notification', handleNewNotification);
      return () => {
        socket.off('new_notification', handleNewNotification);
      };
    }
  }, [socket]);

  const handleRead = async (id, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/locations/notifications/${id}/read`, { 
        method: 'PUT',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', flexShrink: 0 }}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Thông báo"
        style={{
          background: isOpen ? '#E5E7EB' : '#F3F4F6',
          border: '1px solid #E5E7EB',
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          color: '#374151',
          cursor: 'pointer',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: isBouncing ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' : 'none',
          transition: 'all 0.2s ease',
          flexShrink: 0
        }}
        onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.background = '#E5E7EB'; }}
        onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.background = '#F3F4F6'; }}
      >
        <style>
          {`
            @keyframes shake {
              10%, 90% { transform: translate3d(-1px, 0, 0); }
              20%, 80% { transform: translate3d(2px, 0, 0); }
              30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
              40%, 60% { transform: translate3d(4px, 0, 0); }
            }
          `}
        </style>
        <Bell size={18} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            background: '#EF4444',
            color: '#FFFFFF',
            fontSize: '0.7rem',
            fontWeight: 700,
            minWidth: '18px',
            height: '18px',
            borderRadius: '9px',
            padding: '0 4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 0 2px #FFFFFF',
            lineHeight: 1
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 10px)',
          right: 0,
          width: '320px',
          maxHeight: '420px',
          overflowY: 'auto',
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '16px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
          zIndex: 1100,
          padding: '1rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid #F3F4F6'
          }}>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>
              Thông báo mới
            </h3>
            {unreadCount > 0 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                {unreadCount} chưa đọc
              </span>
            )}
          </div>

          {notifications.length === 0 ? (
            <div style={{ color: '#9CA3AF', textAlign: 'center', margin: '2rem 0', fontSize: '0.875rem' }}>
              Không có thông báo nào
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {notifications.map(n => (
                <div 
                  key={n.id} 
                  onClick={(e) => {
                    if (n.locationId) {
                      navigate(`/locations/${n.locationId}`);
                      setIsOpen(false);
                    }
                    if (!n.read) {
                      handleRead(n.id, e);
                    }
                  }}
                  style={{
                    padding: '0.75rem',
                    background: n.read ? '#F9FAFB' : '#FEF2F2',
                    border: `1px solid ${n.read ? '#F3F4F6' : '#FEE2E2'}`,
                    borderRadius: '10px',
                    position: 'relative',
                    cursor: n.locationId ? 'pointer' : 'default',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 56, 92, 0.3)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = n.read ? '#F3F4F6' : '#FEE2E2'; }}
                >
                  <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.85rem', lineHeight: 1.4, color: '#1F2937', fontWeight: n.read ? 400 : 600 }}>
                    {n.message}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.725rem', color: '#9CA3AF' }}>
                      {new Date(n.createdAt).toLocaleString('vi-VN')}
                    </span>
                    {!n.read && (
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444' }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
