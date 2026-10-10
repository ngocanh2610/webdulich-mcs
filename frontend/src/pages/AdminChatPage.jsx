import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Send, User, Search, RefreshCw, ShieldCheck,
  Circle, Clock, CheckCheck, HelpCircle, ArrowLeft, Filter
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const AdminChatPage = () => {
  const { user, socket, setUnreadSupportChat } = useAppContext();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'unread'
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [userTypingMap, setUserTypingMap] = useState({}); // username -> boolean

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Quick replies dành cho Admin
  const quickReplies = [
    'Xin chào bạn! Mình có thể hỗ trợ gì cho bạn về các điểm du lịch ạ?',
    'Cảm ơn bạn đã liên hệ, admin đang kiểm tra và sẽ phản hồi ngay nhé!',
    'Bạn vui lòng cung cấp thêm thông tin địa điểm bạn muốn tới nhé!',
    'Chúc bạn có chuyến khám phá Việt Nam thật vui vẻ và an toàn!'
  ];

  // Kiểm tra quyền Admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Cuộn xuống cuối tin nhắn
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Tải danh sách các cuộc trò chuyện
  const fetchConversations = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoadingConv(true);
      const res = await fetch('/api/support-chat/conversations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const convList = data.data || [];
        setConversations(convList);

        // Nếu chưa chọn user nào và có danh sách, tự động chọn user đầu tiên
        if (!selectedUser && convList.length > 0) {
          setSelectedUser(convList[0]);
          fetchMessages(convList[0].username);
        }
      }
    } catch (err) {
      console.error('Lỗi tải danh sách hội thoại:', err);
    } finally {
      setLoadingConv(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Tải tin nhắn của User được chọn
  const fetchMessages = async (targetUsername) => {
    const token = localStorage.getItem('token');
    if (!token || !targetUsername) return;

    try {
      setLoadingMessages(true);
      const res = await fetch(`/api/support-chat/messages/${targetUsername}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMessages(data.data || []);
        // Reset unread count của user này trong danh sách
        setConversations(prev => prev.map(c =>
          c.username === targetUsername ? { ...c, unread_count: 0 } : c
        ));
        // Đánh dấu đã đọc qua socket
        if (socket) {
          socket.emit('mark_support_read', { conversationId: targetUsername });
        }
      }
    } catch (err) {
      console.error('Lỗi tải tin nhắn:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectUser = (conv) => {
    setSelectedUser(conv);
    fetchMessages(conv.username);
  };

  // Lắng nghe WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      // Cập nhật danh sách conversations
      setConversations(prev => {
        const convId = msg.conversation_id;
        const index = prev.findIndex(c => c.username === convId);

        let updatedConv;
        if (index > -1) {
          const current = prev[index];
          const isCurrentActive = selectedUser && selectedUser.username === convId;
          updatedConv = {
            ...current,
            last_message: msg.message,
            last_sender_role: msg.sender_role,
            last_message_time: msg.created_at,
            unread_count: isCurrentActive ? 0 : (msg.sender_role === 'user' ? (current.unread_count || 0) + 1 : current.unread_count)
          };
          const others = prev.filter((_, i) => i !== index);
          return [updatedConv, ...others];
        } else {
          // Người dùng mới
          const newConv = {
            username: convId,
            last_message: msg.message,
            last_sender_role: msg.sender_role,
            last_message_time: msg.created_at,
            unread_count: (selectedUser && selectedUser.username === convId) ? 0 : 1,
            is_online: true
          };
          return [newConv, ...prev];
        }
      });

      // Nếu đang mở chat với user này, đẩy tin nhắn vào list
      if (selectedUser && selectedUser.username === msg.conversation_id) {
        setMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        socket.emit('mark_support_read', { conversationId: selectedUser.username });
      }
    };

    const handleUserOnlineStatus = ({ username, online }) => {
      setConversations(prev => prev.map(c =>
        c.username === username ? { ...c, is_online: online } : c
      ));
      if (selectedUser && selectedUser.username === username) {
        setSelectedUser(prev => ({ ...prev, is_online: online }));
      }
    };

    const handleUserTyping = ({ conversationId, isTyping }) => {
      setUserTypingMap(prev => ({
        ...prev,
        [conversationId]: isTyping
      }));
    };

    const handleMessagesMarkedRead = ({ conversationId }) => {
      if (selectedUser && selectedUser.username === conversationId) {
        setMessages(prev => prev.map(m => ({ ...m, is_read: true })));
      }
    };

    socket.on('new_support_message', handleNewMessage);
    socket.on('user_online_status', handleUserOnlineStatus);
    socket.on('user_typing', handleUserTyping);
    socket.on('messages_marked_read', handleMessagesMarkedRead);

    return () => {
      socket.off('new_support_message', handleNewMessage);
      socket.off('user_online_status', handleUserOnlineStatus);
      socket.off('user_typing', handleUserTyping);
      socket.off('messages_marked_read', handleMessagesMarkedRead);
    };
  }, [socket, selectedUser]);

  // Gõ phím và báo typing
  const handleInputChange = (e) => {
    setInputValue(e.target.value);

    if (socket && selectedUser) {
      socket.emit('support_typing', {
        conversationId: selectedUser.username,
        isTyping: true,
        senderRole: 'admin'
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('support_typing', {
          conversationId: selectedUser.username,
          isTyping: false,
          senderRole: 'admin'
        });
      }, 1500);
    }
  };

  // Gửi tin nhắn
  const handleSendMessage = async (textToSend) => {
    const content = (textToSend || inputValue).trim();
    if (!content || !selectedUser || isSending) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    setIsSending(true);

    try {
      const res = await fetch('/api/support-chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: content,
          targetUser: selectedUser.username,
          conversationId: selectedUser.username
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessages(prev => {
          if (prev.some(m => m.id === data.data.id)) return prev;
          return [...prev, data.data];
        });
        setInputValue('');

        setConversations(prev => {
          const index = prev.findIndex(c => c.username === selectedUser.username);
          if (index > -1) {
            const current = {
              ...prev[index],
              last_message: content,
              last_sender_role: 'admin',
              last_message_time: new Date().toISOString()
            };
            const others = prev.filter((_, i) => i !== index);
            return [current, ...others];
          }
          return prev;
        });

        if (socket) {
          socket.emit('support_typing', {
            conversationId: selectedUser.username,
            isTyping: false,
            senderRole: 'admin'
          });
        }
      }
    } catch (err) {
      console.error('Lỗi gửi tin nhắn:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Lọc cuộc hội thoại
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.email && conv.email.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filterType === 'unread') {
      return matchesSearch && conv.unread_count > 0;
    }
    return matchesSearch;
  });

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const hours = String(date.getHours()).padStart(2, '0');
    const mins = String(date.getMinutes()).padStart(2, '0');

    if (isToday) return `${hours}:${mins}`;
    return `${date.getDate()}/${date.getMonth() + 1} ${hours}:${mins}`;
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '1440px',
      margin: '0 auto',
      padding: '120px 16px 16px',
      height: '100vh',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 4px 12px',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #FF385C, #E00B41)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 3px 10px rgba(255, 56, 92, 0.25)',
            flexShrink: 0
          }}>
            <MessageSquare size={20} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>
              Trung Tâm Hỗ Trợ Khách Hàng
            </h1>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B7280' }}>
            </p>
          </div>
        </div>

        <button
          onClick={fetchConversations}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#F3F4F6',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            padding: '7px 12px',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: '#374151',
            cursor: 'pointer',
            transition: 'all 0.2s',
            flexShrink: 0
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#E5E7EB'}
          onMouseLeave={e => e.currentTarget.style.background = '#F3F4F6'}
        >
          <RefreshCw size={14} />
          Làm mới danh sách
        </button>
      </div>

      {/* Main Chat Layout Container (Flexbox 2 cột chuẩn) */}
      <div style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 8px 25px rgba(0,0,0,0.06)',
        overflow: 'hidden'
      }}>
        {/* Cột 1: Danh Sách Cuộc Hội Thoại (Sidebar Trái) */}
        <div style={{
          width: '320px',
          minWidth: '280px',
          maxWidth: '340px',
          flexShrink: 0,
          borderRight: '1px solid #E5E7EB',
          display: 'flex',
          flexDirection: 'column',
          background: '#F9FAFB',
          height: '100%',
          overflow: 'hidden'
        }}>
          {/* Header Search & Filter */}
          <div style={{ padding: '12px 14px', borderBottom: '1px solid #E5E7EB', background: '#FFFFFF', flexShrink: 0 }}>
            {/* Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#F3F4F6',
              borderRadius: '8px',
              padding: '7px 10px',
              gap: '6px',
              border: '1px solid #E5E7EB',
              marginBottom: '10px'
            }}>
              <Search size={15} color="#9CA3AF" />
              <input
                type="text"
                placeholder="Tìm khách hàng..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '0.82rem',
                  width: '100%',
                  color: '#111827'
                }}
              />
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setFilterType('all')}
                style={{
                  flex: 1,
                  padding: '5px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: filterType === 'all' ? '#111827' : '#F3F4F6',
                  color: filterType === 'all' ? '#FFFFFF' : '#4B5563',
                  transition: 'all 0.15s'
                }}
              >
                Tất cả ({conversations.length})
              </button>
              <button
                onClick={() => setFilterType('unread')}
                style={{
                  flex: 1,
                  padding: '5px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: filterType === 'unread' ? '#EF4444' : '#F3F4F6',
                  color: filterType === 'unread' ? '#FFFFFF' : '#4B5563',
                  transition: 'all 0.15s'
                }}
              >
                Chưa đọc ({conversations.filter(c => c.unread_count > 0).length})
              </button>
            </div>
          </div>

          {/* Conversations Scroll Area */}
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            {loadingConv ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#9CA3AF', fontSize: '0.85rem' }}>
                Đang tải danh sách...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div style={{ padding: '30px 16px', textAlign: 'center', color: '#9CA3AF' }}>
                <HelpCircle size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>Chưa có tin nhắn nào</p>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem' }}>Khách hàng nhắn tin sẽ hiện tại đây</p>
              </div>
            ) : (
              filteredConversations.map(conv => {
                const isSelected = selectedUser && selectedUser.username === conv.username;
                const isTyping = userTypingMap[conv.username];

                return (
                  <div
                    key={conv.username}
                    onClick={() => handleSelectUser(conv)}
                    style={{
                      padding: '12px 14px',
                      borderBottom: '1px solid #F3F4F6',
                      cursor: 'pointer',
                      background: isSelected ? '#EFF6FF' : '#FFFFFF',
                      borderLeft: isSelected ? '4px solid #2563EB' : '4px solid transparent',
                      transition: 'background 0.15s ease',
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center'
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) e.currentTarget.style.background = '#F9FAFB';
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) e.currentTarget.style.background = '#FFFFFF';
                    }}
                  >
                    {/* User Avatar with Online Dot */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.95rem'
                      }}>
                        {conv.username.charAt(0).toUpperCase()}
                      </div>
                      {conv.is_online && (
                        <div style={{
                          position: 'absolute',
                          bottom: '0',
                          right: '0',
                          width: '11px',
                          height: '11px',
                          borderRadius: '50%',
                          background: '#10B981',
                          border: '2px solid #FFFFFF'
                        }} title="Đang online" />
                      )}
                    </div>

                    {/* Conv Info */}
                    <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{
                          fontWeight: conv.unread_count > 0 ? 800 : 600,
                          fontSize: '0.88rem',
                          color: '#111827',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {conv.username}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#9CA3AF', flexShrink: 0 }}>
                          {formatTime(conv.last_message_time)}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                          fontSize: '0.78rem',
                          color: conv.unread_count > 0 ? '#111827' : '#6B7280',
                          fontWeight: conv.unread_count > 0 ? 600 : 400,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {isTyping ? (
                            <span style={{ color: '#2563EB', fontStyle: 'italic' }}>
                              Đang gõ tin...
                            </span>
                          ) : (
                            conv.last_message || 'Bắt đầu cuộc trò chuyện'
                          )}
                        </span>

                        {conv.unread_count > 0 && (
                          <span style={{
                            background: '#EF4444',
                            color: '#FFFFFF',
                            borderRadius: '10px',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '1px 6px',
                            marginLeft: '6px',
                            flexShrink: 0
                          }}>
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Cột 2: Cửa Sổ Chat (Right Column) */}
        <div style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          background: '#FFFFFF',
          height: '100%',
          overflow: 'hidden'
        }}>
          {selectedUser ? (
            <>
              {/* Chat Active Header */}
              <div style={{
                padding: '12px 20px',
                borderBottom: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#FFFFFF',
                flexShrink: 0
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '1rem',
                    flexShrink: 0
                  }}>
                    {selectedUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#111827' }}>
                        {selectedUser.username}
                      </h3>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.72rem',
                        padding: '1px 7px',
                        borderRadius: '10px',
                        fontWeight: 600,
                        background: selectedUser.is_online ? '#ECFDF5' : '#F3F4F6',
                        color: selectedUser.is_online ? '#059669' : '#6B7280'
                      }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: selectedUser.is_online ? '#10B981' : '#9CA3AF'
                        }} />
                        {selectedUser.is_online ? 'Đang online' : 'Ngoại tuyến'}
                      </span>
                    </div>
                    {selectedUser.email && (
                      <span style={{ fontSize: '0.76rem', color: '#6B7280' }}>
                        {selectedUser.email}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => fetchMessages(selectedUser.username)}
                  title="Làm mới cuộc trò chuyện"
                  style={{
                    background: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '7px',
                    cursor: 'pointer',
                    color: '#6B7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <RefreshCw size={15} />
                </button>
              </div>

              {/* Chat Messages Body */}
              <div style={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                padding: '18px 20px',
                background: '#F8FAFC',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {loadingMessages ? (
                  <div style={{ textAlign: 'center', color: '#9CA3AF', margin: 'auto', fontSize: '0.85rem' }}>
                    Đang tải tin nhắn...
                  </div>
                ) : messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#9CA3AF', margin: 'auto' }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Chưa có tin nhắn nào</p>
                    <p style={{ margin: '4px 0 0', fontSize: '0.8rem' }}>Gửi tin nhắn chào mừng khách hàng bên dưới</p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isAdmin = msg.sender_role === 'admin';

                    return (
                      <div
                        key={msg.id || index}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isAdmin ? 'flex-end' : 'flex-start'
                        }}
                      >
                        {/* Sender Label */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          marginBottom: '3px',
                          fontSize: '0.72rem',
                          color: '#6B7280'
                        }}>
                          {isAdmin ? (
                            <>
                              <ShieldCheck size={12} color="#2563EB" />
                              <strong style={{ color: '#2563EB' }}>Quản trị viên</strong>
                              <span>• {formatTime(msg.created_at)}</span>
                            </>
                          ) : (
                            <>
                              <User size={12} color="#4B5563" />
                              <strong>{msg.sender_username}</strong>
                              <span>• {formatTime(msg.created_at)}</span>
                            </>
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div style={{
                          maxWidth: '75%',
                          padding: '10px 15px',
                          borderRadius: '14px',
                          fontSize: '0.9rem',
                          lineHeight: '1.45',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                          background: isAdmin
                            ? 'linear-gradient(135deg, #2563EB, #1D4ED8)'
                            : '#FFFFFF',
                          color: isAdmin ? '#FFFFFF' : '#1E293B',
                          border: isAdmin ? 'none' : '1px solid #E2E8F0',
                          borderTopRightRadius: isAdmin ? '2px' : '14px',
                          borderTopLeftRadius: !isAdmin ? '2px' : '14px'
                        }}>
                          {msg.message}
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Typing Indicator */}
                {userTypingMap[selectedUser.username] && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6B7280', fontSize: '0.78rem' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <User size={12} color="#64748B" />
                    </div>
                    <span>{selectedUser.username} đang gõ tin nhắn...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies Bar (Co giãn tốt) */}
              <div style={{
                padding: '7px 16px',
                background: '#FFFFFF',
                borderTop: '1px solid #F1F5F9',
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  Trả lời mẫu:
                </span>
                {quickReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(reply)}
                    style={{
                      background: '#F1F5F9',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      padding: '3px 9px',
                      fontSize: '0.74rem',
                      color: '#334155',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      flexShrink: 0
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#E2E8F0'}
                    onMouseLeave={e => e.currentTarget.style.background = '#F1F5F9'}
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div style={{
                padding: '12px 16px',
                borderTop: '1px solid #E5E7EB',
                background: '#FFFFFF',
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                flexShrink: 0
              }}>
                <input
                  type="text"
                  placeholder={`Gửi phản hồi cho ${selectedUser.username}... (Nhấn Enter để gửi)`}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    padding: '10px 16px',
                    borderRadius: '20px',
                    border: '1px solid #D1D5DB',
                    outline: 'none',
                    fontSize: '0.88rem',
                    background: '#F9FAFB',
                    color: '#111827',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#2563EB'}
                  onBlur={e => e.currentTarget.style.borderColor = '#D1D5DB'}
                />

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isSending}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: inputValue.trim()
                      ? 'linear-gradient(135deg, #2563EB, #1D4ED8)'
                      : '#E5E7EB',
                    color: '#FFFFFF',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: inputValue.trim() && !isSending ? 'pointer' : 'default',
                    boxShadow: inputValue.trim() ? '0 3px 10px rgba(37, 99, 235, 0.3)' : 'none',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                >
                  <Send size={16} style={{ marginLeft: '-1px' }} />
                </button>
              </div>
            </>
          ) : (
            /* Empty State khi chưa chọn conversation */
            <div style={{
              margin: 'auto',
              textAlign: 'center',
              padding: '30px',
              color: '#9CA3AF'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                color: '#2563EB'
              }}>
                <MessageSquare size={28} />
              </div>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 700, color: '#1F2937' }}>
                Hộp Thư Hỗ Trợ Khách Hàng
              </h3>
              <p style={{ margin: 0, fontSize: '0.84rem', maxWidth: '340px', lineHeight: 1.5 }}>
                Chọn một khách hàng từ danh sách bên trái để xem nội dung trao đổi và phản hồi nhanh chóng qua kết nối WebSocket realtime.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatPage;
