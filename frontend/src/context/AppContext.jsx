import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [mode, setMode] = useState('63');
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [unreadSupportChat, setUnreadSupportChat] = useState(0);
  const socketRef = useRef(null);

  const connectAuthenticatedSocket = useCallback((userData, token) => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    if (!userData || !token) {
      setSocket(null);
      return null;
    }

    const newSocket = io({
      path: '/socket.io/',
      auth: { token },
      query: { username: userData.username, role: userData.role }
    });
    socketRef.current = newSocket;
    setSocket(newSocket);
    return newSocket;
  }, []);

  const fetchUnreadChatCount = useCallback(async (token) => {
    const currentToken = token || localStorage.getItem('token');
    if (!currentToken) return;

    try {
      const res = await fetch('/api/support-chat/unread-count', {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        setUnreadSupportChat(data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Không thể lấy số tin nhắn chưa đọc:', err);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      let storedUser = null;
      try {
        storedUser = JSON.parse(localStorage.getItem('user'));
      } catch {
        storedUser = null;
      }

      if (token && storedUser) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) {
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            connectAuthenticatedSocket(data.user, token);
            fetchUnreadChatCount(token);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            if (data.message && data.message.includes('vô hiệu hóa')) {
              alert(data.message);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    checkAuth();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [connectAuthenticatedSocket, fetchUnreadChatCount]);

  useEffect(() => {
    if (!socket || !user) return;

    const handleNewMessage = (msg) => {
      if (user.role === 'admin' && msg.receiver_username === 'admin') {
        setUnreadSupportChat(prev => prev + 1);
      } else if (user.role !== 'admin' && msg.receiver_username === user.username && msg.sender_role === 'admin') {
        setUnreadSupportChat(prev => prev + 1);
      }
    };

    const handleMessagesRead = () => {
      fetchUnreadChatCount();
    };

    socket.on('new_support_message', handleNewMessage);
    socket.on('messages_marked_read', handleMessagesRead);

    return () => {
      socket.off('new_support_message', handleNewMessage);
      socket.off('messages_marked_read', handleMessagesRead);
    };
  }, [socket, user, fetchUnreadChatCount]);

  useEffect(() => {
    const fetchProvinces = async () => {
      setLoading(true);
      try {
        const [provRes, countRes] = await Promise.all([
          fetch(`/api/provinces?mode=${mode}`),
          fetch(`/api/locations/meta/counts`)
        ]);

        const provData = await provRes.json();
        let counts = {};

        if (countRes.ok) {
          const countData = await countRes.json();
          if (countData.success) {
            counts = countData.data || {};
          }
        }

        if (provData.success) {
          const finalProvinces = provData.data.map(p => {
            const slugKeys = Array.from(new Set([
              ...(Array.isArray(p.mergedSlugs) ? p.mergedSlugs : []),
              p.slug,
              p.id
            ].filter(Boolean)));
            const locationCount = slugKeys.reduce((sum, key) => sum + (counts[key] || 0), 0);
            return {
              ...p,
              locationCount
            };
          });
          setProvinces(finalProvinces);
        }
      } catch (error) {
        console.error('Failed to fetch provinces', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, [mode]);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    connectAuthenticatedSocket(userData, token);
    fetchUnreadChatCount(token);
  };

  const updateUser = (updatedData) => {
    setUser(prev => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem('user', JSON.stringify(merged));
      return merged;
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setUnreadSupportChat(0);

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setSocket(null);
  };

  const value = {
    mode,
    setMode,
    provinces,
    loading,
    user,
    socket,
    unreadSupportChat,
    setUnreadSupportChat,
    fetchUnreadChatCount,
    login,
    updateUser,
    logout
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
