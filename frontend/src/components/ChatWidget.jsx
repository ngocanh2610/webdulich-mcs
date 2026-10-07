import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Mail, Phone } from 'lucide-react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Chào cậu! Tớ là VietnamTourism AI. Cậu muốn hỏi gì về du lịch Việt Nam nào?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text })
      });
      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: 'Xin lỗi, tớ đang gặp sự cố kết nối. Cậu thử lại sau nhé!' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Đã có lỗi xảy ra khi gọi AI.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const widgetStyle = {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px'
  };

  const actionButtonStyle = {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
    background: 'rgba(25, 25, 35, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#FFFFFF',
    textDecoration: 'none',
    position: 'relative'
  };

  const tooltipStyle = {
    position: 'absolute',
    right: '55px',
    background: 'rgba(0,0,0,0.8)',
    padding: '5px 10px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    color: '#FFFFFF',
    whiteSpace: 'nowrap',
    opacity: 0,
    transform: 'translateX(10px)',
    transition: 'all 0.3s ease',
    pointerEvents: 'none'
  };

  const chatButtonStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #00c6ff, #0072ff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0, 114, 255, 0.4)',
    transition: 'transform 0.3s ease',
    color: '#FFFFFF',
    zIndex: 2
  };

  const chatWindowStyle = {
    position: 'absolute',
    bottom: '80px',
    right: '0',
    width: '350px',
    height: '500px',
    background: 'rgba(20, 20, 30, 0.85)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    transform: isOpen ? 'scale(1)' : 'scale(0)',
    transformOrigin: 'bottom right',
    transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
    color: '#FFFFFF'
  };

  return (
    <div style={widgetStyle}>
      {/* Contact Buttons with tooltips */}
      <a href="mailto:doanngocanh26102005@gmail.com" 
         style={{ ...actionButtonStyle, transform: isOpen ? 'scale(0)' : 'scale(1)' }} 
         className="contact-btn">
        <span className="tooltip" style={tooltipStyle}>doanngocanh26102005@gmail.com</span>
        <Mail size={18} />
      </a>
      <a href="tel:0816951801" 
         style={{ ...actionButtonStyle, transform: isOpen ? 'scale(0)' : 'scale(1)' }} 
         className="contact-btn">
        <span className="tooltip" style={tooltipStyle}>0816951801</span>
        <Phone size={18} />
      </a>

      {/* Chat Window */}
      <div style={chatWindowStyle}>
        <div style={{ padding: '15px 20px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bot size={24} color="#00c6ff" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>VietnamTourism AI</h3>
          </div>
          <X size={20} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setIsOpen(false)} />
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                background: msg.role === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(0, 198, 255, 0.2)' 
              }}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} color="#00c6ff" />}
              </div>
              <div style={{
                background: msg.role === 'user' ? 'linear-gradient(135deg, #00c6ff, #0072ff)' : 'rgba(255,255,255,0.05)',
                padding: '10px 15px',
                borderRadius: '15px',
                borderTopRightRadius: msg.role === 'user' ? 0 : '15px',
                borderTopLeftRadius: msg.role === 'ai' ? 0 : '15px',
                fontSize: '0.95rem',
                lineHeight: 1.5,
                maxWidth: '75%',
                wordWrap: 'break-word'
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 198, 255, 0.2)' }}>
                <Bot size={16} color="#00c6ff" />
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 15px', borderRadius: '15px', borderTopLeftRadius: 0, fontSize: '0.95rem' }}>
                Đang gõ...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Hỏi AI về du lịch..." 
            style={{
              flex: 1,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '10px 15px',
              color: '#FFFFFF',
              outline: 'none'
            }}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            style={{
              width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #00c6ff, #0072ff)',
              border: 'none', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              opacity: isLoading ? 0.5 : 1
            }}
          >
            <Send size={18} style={{ marginLeft: '-2px' }} />
          </button>
        </div>
      </div>

      {/* Main Toggle Button */}
      <div 
        style={{...chatButtonStyle, transform: isOpen ? 'scale(0)' : 'scale(1)'}}
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare size={28} />
      </div>

      {/* Additional CSS for hover effects */}
      <style>{`
        .contact-btn:hover {
          background: rgba(255, 255, 255, 0.15) !important;
        }
        .contact-btn:hover .tooltip {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }
      `}</style>
    </div>
  );
};

export default ChatWidget;
