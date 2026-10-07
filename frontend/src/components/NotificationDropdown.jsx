import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);
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
    const interval = setInterval(fetchNotifications, 15000); // reduced polling frequency since we have sockets
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (socket) {
      const handleNewNotification = (notif) => {
        setNotifications(prev => [notif, ...prev]);
        setUnreadCount(prev => prev + 1);
        setIsBouncing(true);
        setTimeout(() => setIsBouncing(false), 1000); // Ring animation
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
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(255,255,255,0.1)', border: 'none',
          padding: '0.5rem', borderRadius: '50%', color: 'var(--text-primary)',
          cursor: 'pointer', position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: isBouncing ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' : 'none',
          transform: 'translate3d(0, 0, 0)'
        }}
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
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '-5px', right: '-5px',
            background: '#ef4444', color: 'var(--text-primary)', fontSize: '0.75rem',
            fontWeight: 'bold', width: '20px', height: '20px',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', top: '120%', right: 0,
          width: '320px', maxHeight: '400px', overflowY: 'auto',
          background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          zIndex: 1000, padding: '1rem'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', color: '#fff' }}>Thông báo mới</h3>
          {notifications.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: '2rem 0' }}>Không có thông báo nào</p>
          ) : (
            notifications.map(n => (
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
                  padding: '0.75rem', background: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px', marginBottom: '0.5rem', position: 'relative',
                  cursor: n.locationId ? 'pointer' : 'default',
                  transition: 'background 0.2s',
                  color: '#fff',
                  opacity: n.read ? 0.6 : 1
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', lineHeight: 1.4 }}>{n.message}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(n.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
