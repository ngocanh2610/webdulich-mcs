import React, { createContext, useState, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Mode: '63' (trước sáp nhập) hoặc '34' (sau sáp nhập 2025)
  const [mode, setMode] = useState('63');
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);

  // Check token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (token && storedUser) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) {
            setUser(data.user);
            const newSocket = io({
              query: { username: data.user.username }
            });
            setSocket(newSocket);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    checkAuth();

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

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
            counts = countData.data;
          }
        }

        if (provData.success) {
          const finalProvinces = provData.data.map(p => ({
            ...p,
            // Sử dụng số lượng đếm được từ server, nếu không có thì mặc định là 0
            locationCount: counts[p.id] || counts[p.slug] || 0
          }));
          setProvinces(finalProvinces);
        }
      } catch (error) {
        console.error("Failed to fetch provinces", error);
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
    
    const newSocket = io({
      query: { username: userData.username }
    });
    setSocket(newSocket);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const value = {
    mode,
    setMode,
    provinces,
    loading,
    user,
    socket,
    login,
    logout
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
