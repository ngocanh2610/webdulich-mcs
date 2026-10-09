import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, X, Send, Bot, User, Mail, Phone, 
  ShieldCheck, Headset, LogIn, ExternalLink, Sparkles 
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ChatWidget = () => {
  const { user, socket, unreadSupportChat, setUnreadSupportChat } = useAppContext();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ai'); // 'ai' | 'admin'

  // State cho AI Chat
  const [aiMessages, setAiMessages] = useState([
    { role: 'ai', text: 'Chào bạn! Mình là VietnamTourism AI. Bạn cần gợi ý hay hỏi gì về du lịch Việt Nam không nào?' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // State cho Admin Support Chat
  const [adminMessages, setAdminMessages] = useState([]);
  const [adminInput, setAdminInput] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const [isSendingSupport, setIsSendingSupport] = useState(false);

  const messagesEndRef = useRef(null);
  const supportTypingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages, adminMessages, activeTab, isAdminTyping]);

  // Tải tin nhắn với Admin khi mở tab admin hoặc khi đăng nhập
  const fetchAdminMessages = async () => {
    const token = localStorage.getItem('token');
    if (!token || !user || user.role === 'admin') return;

    try {
      setAdminLoading(true);
      const res = await fetch(`/api/support-chat/messages/${user.username}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAdminMessages(data.data || []);
        setUnreadSupportChat(0);
        if (socket) {
          socket.emit('mark_support_read', { conversationId: user.username });
        }
      }
    } catch (err) {
      console.error('Lỗi tải tin nhắn hỗ trợ:', err);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'admin' && user && user.role !== 'admin') {
      fetchAdminMessages();
    }
  }, [isOpen, activeTab, user]);

  // Lắng nghe WebSocket cho Support Chat phía User
  useEffect(() => {
    if (!socket || !user || user.role === 'admin') return;

    const handleNewMessage = (msg) => {
      // Tin nhắn gửi đến user này
      if (msg.conversation_id === user.username) {
        setAdminMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });

        // Nếu widget đang mở và đang ở tab admin, đánh dấu đã đọc ngay
        if (isOpen && activeTab === 'admin') {
          socket.emit('mark_support_read', { conversationId: user.username });
          setUnreadSupportChat(0);
        }
      }
    };

    const handleAdminTyping = ({ isTyping }) => {
      setIsAdminTyping(isTyping);
    };

    const handleMessagesMarkedRead = () => {
      setAdminMessages(prev => prev.map(m => ({ ...m, is_read: true })));
    };

    socket.on('new_support_message', handleNewMessage);
    socket.on('admin_typing', handleAdminTyping);
    socket.on('messages_marked_read', handleMessagesMarkedRead);

    return () => {
      socket.off('new_support_message', handleNewMessage);
      socket.off('admin_typing', handleAdminTyping);
      socket.off('messages_marked_read', handleMessagesMarkedRead);
    };
  }, [socket, user, isOpen, activeTab, setUnreadSupportChat]);

  // Gửi tin nhắn cho AI
  const handleSendAi = async () => {
    if (!aiInput.trim()) return;

    const userMessage = { role: 'user', text: aiInput.trim() };
    setAiMessages(prev => [...prev, userMessage]);
    setAiInput('');
    setAiLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text })
      });
      const data = await response.json();
      
      if (data.success) {
        setAiMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        setAiMessages(prev => [...prev, { role: 'ai', text: 'Xin lỗi, tớ đang gặp sự cố kết nối. Cậu thử lại sau nhé!' }]);
      }
    } catch (error) {
      setAiMessages(prev => [...prev, { role: 'ai', text: 'Đã có lỗi xảy ra khi gọi AI.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  // Gõ phím tin nhắn gửi Admin
  const handleAdminInputChange = (e) => {
    setAdminInput(e.target.value);

    if (socket && user) {
      socket.emit('support_typing', {
        conversationId: user.username,
        isTyping: true,
        senderRole: 'user'
      });

      if (supportTypingTimeoutRef.current) clearTimeout(supportTypingTimeoutRef.current);
      supportTypingTimeoutRef.current = setTimeout(() => {
        socket.emit('support_typing', {
          conversationId: user.username,
          isTyping: false,
          senderRole: 'user'
        });
      }, 1500);
    }
  };

  // Gửi tin nhắn tới Admin
  const handleSendAdmin = async () => {
    const content = adminInput.trim();
    if (!content || !user || isSendingSupport) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    setIsSendingSupport(true);

    try {
      const res = await fetch('/api/support-chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: content,
          conversationId: user.username
        })
      });

      const data = await res.json();
      if (data.success) {
        setAdminMessages(prev => {
          if (prev.some(m => m.id === data.data.id)) return prev;
          return [...prev, data.data];
        });
        setAdminInput('');

        if (socket) {
          socket.emit('support_typing', {
            conversationId: user.username,
            isTyping: false,
            senderRole: 'user'
          });
        }
      }
    } catch (err) {
      console.error('Lỗi gửi tin nhắn cho admin:', err);
    } finally {
      setIsSendingSupport(false);
    }
  };

  const widgetStyle = {
    position: 'fixed',
    bottom: '28px',
    right: '28px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  };

  const actionButtonStyle = {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
    transition: 'all 0.3s ease',
    background: 'rgba(25, 25, 35, 0.88)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#FFFFFF',
    textDecoration: 'none',
    position: 'relative'
  };

  const adminButtonStyle = {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(255, 56, 92, 0.45)',
    transition: 'all 0.3s ease',
    background: 'linear-gradient(135deg, #FF385C, #E00B41)',
    border: '2px solid rgba(255,255,255,0.3)',
    color: '#FFFFFF',
    position: 'relative'
  };

  const tooltipStyle = {
    position: 'absolute',
    right: '58px',
    background: 'rgba(15, 23, 42, 0.92)',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#FFFFFF',
    whiteSpace: 'nowrap',
    opacity: 0,
    transform: 'translateX(10px)',
    transition: 'all 0.25s ease',
    pointerEvents: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.1)'
  };

  const chatButtonStyle = {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #00c6ff, #0072ff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(0, 114, 255, 0.45)',
    transition: 'transform 0.3s ease',
    color: '#FFFFFF',
    zIndex: 2,
    position: 'relative'
  };

  const chatWindowStyle = {
    position: 'absolute',
    bottom: '76px',
    right: '0',
    width: '380px',
    height: '540px',
    background: '#131622',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '22px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
    transform: isOpen ? 'scale(1)' : 'scale(0)',
    transformOrigin: 'bottom right',
    transition: 'transform 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
    color: '#FFFFFF'
  };

  const formatMessageTime = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div style={widgetStyle}>
      {/* 1. Contact Button: Mail */}
      <a href="mailto:doanngocanh26102005@gmail.com" 
         style={{ ...actionButtonStyle, transform: isOpen ? 'scale(0)' : 'scale(1)' }} 
         className="contact-btn">
        <span className="tooltip" style={tooltipStyle}>Gửi Email hỗ trợ</span>
        <Mail size={18} />
      </a>

      {/* 2. Contact Button: Phone */}
      <a href="tel:0816951801" 
         style={{ ...actionButtonStyle, transform: isOpen ? 'scale(0)' : 'scale(1)' }} 
         className="contact-btn">
        <span className="tooltip" style={tooltipStyle}>Hotline: 0816951801</span>
        <Phone size={18} />
      </a>

      {/* 3. Nút CHAT VỚI ADMIN RIÊNG BIỆT (Màu đỏ nổi bật) */}
      <div 
         onClick={() => {
           setActiveTab('admin');
           setIsOpen(true);
           if (user && user.role !== 'admin') {
             fetchAdminMessages();
           }
         }}
         style={{ ...adminButtonStyle, transform: isOpen ? 'scale(0)' : 'scale(1)' }} 
         className="contact-btn admin-chat-btn"
         title="Nhắn tin với Admin">
        <span className="tooltip" style={tooltipStyle}>
          💬 Nhắn tin với Quản trị viên (Admin)
        </span>
        <Headset size={23} />

        {/* Chấm xanh báo Admin Online */}
        <span style={{
          position: 'absolute',
          bottom: '2px',
          right: '2px',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: '#10B981',
          border: '2px solid #FFFFFF',
          boxShadow: '0 0 6px #10B981'
        }} />

        {/* Badge số tin nhắn chưa đọc từ Admin */}
        {unreadSupportChat > 0 && (
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            background: '#EF4444',
            color: '#FFFFFF',
            fontSize: '0.72rem',
            fontWeight: 800,
            borderRadius: '12px',
            padding: '2px 7px',
            border: '2px solid #FFFFFF',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            animation: 'pulse 2s infinite'
          }}>
            {unreadSupportChat}
          </span>
        )}
      </div>

      {/* Main Chat Window */}
      <div style={chatWindowStyle}>
        {/* Top Header with Tabs */}
        <div style={{
          padding: '12px 16px',
          background: 'rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px' }}>
              VIETNAM TOURISM SUPPORT
            </span>
            <X 
              size={18} 
              style={{ cursor: 'pointer', color: '#9CA3AF', transition: 'color 0.2s' }} 
              onClick={() => setIsOpen(false)} 
            />
          </div>

          {/* Tab Selector */}
          <div style={{
            display: 'flex',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '12px',
            padding: '3px',
            gap: '4px'
          }}>
            <button
              onClick={() => setActiveTab('ai')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '7px 10px',
                borderRadius: '9px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 700,
                background: activeTab === 'ai' ? 'linear-gradient(135deg, #00c6ff, #0072ff)' : 'transparent',
                color: activeTab === 'ai' ? '#FFFFFF' : '#9CA3AF',
                transition: 'all 0.2s'
              }}
            >
              <Bot size={15} />
              <span>Trợ lý AI</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('admin');
                if (user && user.role !== 'admin') {
                  fetchAdminMessages();
                }
              }}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '7px 10px',
                borderRadius: '9px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 700,
                background: activeTab === 'admin' ? 'linear-gradient(135deg, #FF385C, #E00B41)' : 'transparent',
                color: activeTab === 'admin' ? '#FFFFFF' : '#9CA3AF',
                transition: 'all 0.2s',
                position: 'relative'
              }}
            >
              <Headset size={15} />
              <span>Hỗ trợ Admin</span>
              {unreadSupportChat > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  background: '#EF4444',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  borderRadius: '10px',
                  padding: '1px 5px',
                  lineHeight: 1.2
                }}>
                  {unreadSupportChat}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: AI Chat Assistant */}
        {activeTab === 'ai' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {aiMessages.map((msg, index) => (
                <div key={index} style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'flex-start',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                }}>
                  <div style={{ 
                    width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    background: msg.role === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(0, 198, 255, 0.2)' 
                  }}>
                    {msg.role === 'user' ? <User size={15} /> : <Bot size={15} color="#00c6ff" />}
                  </div>
                  <div style={{
                    background: msg.role === 'user' ? 'linear-gradient(135deg, #00c6ff, #0072ff)' : 'rgba(255,255,255,0.06)',
                    padding: '9px 13px',
                    borderRadius: '14px',
                    borderTopRightRadius: msg.role === 'user' ? 0 : '14px',
                    borderTopLeftRadius: msg.role === 'ai' ? 0 : '14px',
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                    maxWidth: '75%',
                    wordWrap: 'break-word'
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 198, 255, 0.2)' }}>
                    <Bot size={15} color="#00c6ff" />
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', padding: '9px 13px', borderRadius: '14px', borderTopLeftRadius: 0, fontSize: '0.88rem', color: '#9CA3AF' }}>
                    AI đang suy nghĩ...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* AI Input */}
            <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.2)' }}>
              <input 
                type="text" 
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAi()}
                placeholder="Hỏi AI về du lịch Việt Nam..." 
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '18px',
                  padding: '9px 14px',
                  color: '#FFFFFF',
                  outline: 'none',
                  fontSize: '0.88rem'
                }}
              />
              <button 
                onClick={handleSendAi}
                disabled={aiLoading}
                style={{
                  width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #00c6ff, #0072ff)',
                  border: 'none', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  opacity: aiLoading ? 0.5 : 1
                }}
              >
                <Send size={16} style={{ marginLeft: '-1px' }} />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Live Support Chat with Admin */}
        {activeTab === 'admin' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {!user ? (
              /* Case 1: Chưa đăng nhập */
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '28px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(255, 56, 92, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FF385C',
                  marginBottom: '14px'
                }}>
                  <Headset size={28} />
                </div>
                <h4 style={{ margin: '0 0 8px', fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Chat Với Quản Trị Viên
                </h4>
                <p style={{ margin: '0 0 20px', fontSize: '0.84rem', color: '#9CA3AF', lineHeight: 1.5 }}>
                  Vui lòng đăng nhập để trao đổi trực tiếp và lưu trữ lịch sử tin nhắn với Ban quản trị.
                </p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/auth');
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #FF385C, #E00B41)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(255, 56, 92, 0.35)'
                  }}
                >
                  <LogIn size={16} />
                  Đăng nhập ngay
                </button>
              </div>
            ) : user.role === 'admin' ? (
              /* Case 2: Đang đăng nhập tài khoản Admin */
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '28px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(37, 99, 235, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#3B82F6',
                  marginBottom: '14px'
                }}>
                  <ShieldCheck size={28} />
                </div>
                <h4 style={{ margin: '0 0 8px', fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Bạn là Quản Trị Viên
                </h4>
                <p style={{ margin: '0 0 20px', fontSize: '0.84rem', color: '#9CA3AF', lineHeight: 1.5 }}>
                  Vui lòng truy cập Bảng điều khiển Quản lý Chat để xem danh sách toàn bộ tin nhắn từ khách hàng và phản hồi.
                </p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/admin/chat');
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
                  }}
                >
                  <ExternalLink size={16} />
                  Mở Quản Lý Chat Admin
                </button>
              </div>
            ) : (
              /* Case 3: Người dùng thường đã đăng nhập -> Chat 1-1 với Admin */
              <>
                {/* Admin Status Sub-header */}
                <div style={{
                  padding: '8px 16px',
                  background: 'rgba(0,0,0,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#10B981'
                    }} />
                    <span style={{ fontSize: '0.78rem', color: '#D1D5DB' }}>
                      Admin / Hỗ trợ viên đang trực tuyến
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                    1-1 Bảo mật
                  </span>
                </div>

                {/* Messages Body */}
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {adminLoading ? (
                    <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '0.85rem', margin: 'auto' }}>
                      Đang tải tin nhắn...
                    </div>
                  ) : adminMessages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#9CA3AF', margin: 'auto', padding: '20px' }}>
                      <Headset size={32} style={{ margin: '0 auto 8px', color: '#FF385C' }} />
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: '#FFFFFF' }}>
                        Xin chào {user.username}!
                      </p>
                      <p style={{ margin: '4px 0 0', fontSize: '0.82rem', lineHeight: 1.4 }}>
                        Bạn có thắc mắc hay cần hỗ trợ gì về các địa điểm du lịch? Hãy nhắn tin cho Admin ngay bên dưới nhé!
                      </p>
                    </div>
                  ) : (
                    adminMessages.map((msg, index) => {
                      const isMe = msg.sender_role === 'user' && msg.sender_username === user.username;

                      return (
                        <div
                          key={msg.id || index}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: isMe ? 'flex-end' : 'flex-start'
                          }}
                        >
                          {/* Sender Info */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginBottom: '3px',
                            fontSize: '0.7rem',
                            color: '#9CA3AF'
                          }}>
                            {!isMe ? (
                              <>
                                <ShieldCheck size={12} color="#60A5FA" />
                                <strong style={{ color: '#60A5FA' }}>Quản trị viên</strong>
                              </>
                            ) : (
                              <span>Bạn</span>
                            )}
                            <span>• {formatMessageTime(msg.created_at)}</span>
                          </div>

                          {/* Message Bubble */}
                          <div style={{
                            maxWidth: '78%',
                            padding: '9px 13px',
                            borderRadius: '14px',
                            fontSize: '0.88rem',
                            lineHeight: 1.45,
                            wordBreak: 'break-word',
                            background: isMe 
                              ? 'linear-gradient(135deg, #FF385C, #E00B41)' 
                              : 'rgba(255,255,255,0.08)',
                            color: '#FFFFFF',
                            borderTopRightRadius: isMe ? 0 : '14px',
                            borderTopLeftRadius: !isMe ? 0 : '14px'
                          }}>
                            {msg.message}
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Admin is typing indicator */}
                  {isAdminTyping && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#60A5FA', fontSize: '0.78rem' }}>
                      <ShieldCheck size={14} />
                      <span>Admin đang soạn tin nhắn...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Support Chat Input */}
                <div style={{
                  padding: '12px 14px',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  gap: '8px',
                  background: 'rgba(0,0,0,0.2)'
                }}>
                  <input
                    type="text"
                    value={adminInput}
                    onChange={handleAdminInputChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendAdmin()}
                    placeholder="Nhắn tin cho Quản trị viên..."
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '18px',
                      padding: '9px 14px',
                      color: '#FFFFFF',
                      outline: 'none',
                      fontSize: '0.88rem'
                    }}
                  />
                  <button
                    onClick={handleSendAdmin}
                    disabled={!adminInput.trim() || isSendingSupport}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #FF385C, #E00B41)',
                      border: 'none',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: adminInput.trim() && !isSendingSupport ? 'pointer' : 'default',
                      opacity: adminInput.trim() && !isSendingSupport ? 1 : 0.5
                    }}
                  >
                    <Send size={16} style={{ marginLeft: '-1px' }} />
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 4. Nút Chat AI (Màu xanh dương) */}
      <div 
        style={{ ...chatButtonStyle, transform: isOpen ? 'scale(0)' : 'scale(1)' }}
        onClick={() => {
          setActiveTab('ai');
          setIsOpen(true);
        }}
        className="contact-btn ai-chat-btn"
        title="Hỏi đáp Trợ lý AI Du Lịch"
      >
        <span className="tooltip" style={tooltipStyle}>
          🤖 Hỏi đáp Trợ lý AI Du Lịch
        </span>
        <Bot size={28} />
      </div>

      {/* CSS Styles */}
      <style>{`
        .contact-btn:hover {
          background: rgba(255, 255, 255, 0.22) !important;
        }
        .admin-chat-btn:hover {
          background: linear-gradient(135deg, #FF1E47, #C80036) !important;
          box-shadow: 0 6px 22px rgba(255, 56, 92, 0.6) !important;
        }
        .ai-chat-btn:hover {
          background: linear-gradient(135deg, #00B4D8, #0077B6) !important;
          box-shadow: 0 6px 22px rgba(0, 114, 255, 0.6) !important;
        }
        .contact-btn:hover .tooltip {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ChatWidget;
