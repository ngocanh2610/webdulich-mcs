import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Sparkles, MessageSquare, RefreshCw, Compass } from 'lucide-react';

/**
 * MakeYourTripChat - Trợ lý AI Tư vấn & Lên Kế Hoạch Du Lịch Thông Minh
 * Hội thoại tự nhiên, hỏi đáp nhu cầu ngày đi, thời gian, ngân sách, link TikTok
 * Đồng bộ hai chiều với Lịch trình & Bản đồ thời gian thực.
 */
const MakeYourTripChat = ({
  messages = [],
  onSendMessage = () => {},
  loading = false,
  suggestedPrompts = [],
  onSelectPrompt = () => {}
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  // Giả lập giọng nói / Speech to text
  const handleToggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói trực tiếp. Bạn có thể nhập văn bản!');
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'vi-VN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(prev => (prev ? prev + ' ' + transcript : transcript));
        }
      };

      recognition.start();
    } catch (e) {
      console.warn('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: '620px',
      background: '#FFFFFF',
      borderRadius: '20px',
      border: '1px solid #E2E8F0',
      boxShadow: '0 4px 20px rgba(2, 50, 106, 0.05)',
      overflow: 'hidden'
    }}>
      
      {/* CHAT HEADER */}
      <div style={{
        padding: '1rem 1.25rem',
        borderBottom: '1px solid #F1F5F9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#FAFBFD'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #02326A 0%, #0284C7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--brand-navy)' }}>
              Trợ lý AI Lập Lịch Trình
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
              Tư vấn trực tiếp 24/7
            </div>
          </div>
        </div>

        <div style={{
          background: '#EFF6FF',
          color: '#0284C7',
          padding: '0.25rem 0.65rem',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: 700
        }}>
          VietnamTourism AI
        </div>
      </div>

      {/* MESSAGES THREAD */}
      <div style={{
        flex: 1,
        padding: '1.25rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        background: '#FAFBFD'
      }}>
        
        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                width: '100%'
              }}
            >
              {isUser ? (
                // USER SPEECH BUBBLE (Màu xanh biển nhạt)
                <div style={{
                  maxWidth: '85%',
                  background: '#E0F2FE',
                  color: '#0369A1',
                  padding: '0.85rem 1.15rem',
                  borderRadius: '18px 18px 4px 18px',
                  fontSize: '0.92rem',
                  fontWeight: 500,
                  lineHeight: 1.5,
                  boxShadow: '0 2px 6px rgba(2, 132, 199, 0.08)',
                  wordBreak: 'break-word'
                }}>
                  {msg.text}
                </div>
              ) : (
                // AI SPEECH CARD (Thẻ trắng viền mảnh xám, bullet points rõ ràng như trong ảnh)
                <div style={{
                  maxWidth: '92%',
                  background: '#FFFFFF',
                  color: '#1E293B',
                  padding: '1rem 1.15rem',
                  borderRadius: '4px 18px 18px 18px',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  wordBreak: 'break-word'
                }}>
                  <div style={{ whiteSpace: 'pre-line' }}>
                    {msg.text}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* LOADING TYPING INDICATOR */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 0' }}>
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              padding: '0.75rem 1rem',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              color: '#64748B'
            }}>
              <RefreshCw size={14} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
              <span>AI đang phân tích và tối ưu lịch trình...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* QUICK SUGGESTION CHIPS (Gợi ý câu trả lời nhanh) */}
      {suggestedPrompts && suggestedPrompts.length > 0 && (
        <div style={{
          padding: '0.5rem 1rem',
          background: '#FFFFFF',
          borderTop: '1px solid #F1F5F9',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPrompt(prompt)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '14px',
                border: '1px solid #BFDBFE',
                background: '#EFF6FF',
                color: '#0284C7',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#DBEAFE'}
              onMouseLeave={e => e.currentTarget.style.background = '#EFF6FF'}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* INPUT BAR */}
      <form onSubmit={handleSubmit} style={{
        padding: '0.75rem 1rem',
        borderTop: '1px solid #E2E8F0',
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Nhập mong muốn hoặc chia sẻ link tiktok liên quan đến chuyến du lịch"
          disabled={loading}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            borderRadius: '24px',
            border: '1px solid #D1D5DB',
            outline: 'none',
            fontSize: '0.88rem',
            fontFamily: 'inherit',
            color: '#0F172A',
            background: '#F8FAFC'
          }}
        />

        {/* Nút micro */}
        <button
          type="button"
          onClick={handleToggleVoice}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            border: 'none',
            background: isListening ? '#FEE2E2' : '#F1F5F9',
            color: isListening ? '#EF4444' : '#64748B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
          title={isListening ? 'Đang lắng nghe...' : 'Nói yêu cầu qua micro'}
        >
          <Mic size={18} />
        </button>

        {/* Nút gửi */}
        <button
          type="submit"
          disabled={!inputText.trim() || loading}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            border: 'none',
            background: inputText.trim() && !loading ? 'var(--brand-navy)' : '#CBD5E1',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputText.trim() && !loading ? 'pointer' : 'default',
            transition: 'all 0.15s'
          }}
        >
          <Send size={16} />
        </button>
      </form>

    </div>
  );
};

export default MakeYourTripChat;
