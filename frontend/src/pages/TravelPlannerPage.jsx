import React, { useState } from 'react';
import { 
  Sparkles, Calendar, DollarSign, MapPin, Users, Compass, 
  Utensils, Hotel, CheckCircle2, ArrowRight, Printer, Copy, 
  RotateCcw, Info, Sun, Moon, Sunrise, AlertCircle, Share2,
  Check, Heart, Luggage, Navigation, Search, ExternalLink, 
  Star, Tag, Filter
} from 'lucide-react';

const POPULAR_DESTINATIONS = [
  'Đà Nẵng', 'Đà Lạt', 'Sa Pa', 'Phú Quốc', 
  'Hà Nội', 'Hội An', 'Nha Trang', 'Ninh Bình', 
  'Huế', 'Hạ Long', 'Hà Giang', 'Quy Nhơn'
];

const DURATION_PRESETS = [
  { days: 1, label: '1 Ngày' },
  { days: 2, label: '2N1Đ' },
  { days: 3, label: '3N2Đ' },
  { days: 4, label: '4N3Đ' },
  { days: 5, label: '5N4Đ' },
  { days: 7, label: '1 Tuần' },
];

const BUDGET_PRESETS = [
  { amount: 2000000, label: '2 Triệu (Tiết kiệm)' },
  { amount: 5000000, label: '5 Triệu (Phổ thông)' },
  { amount: 8000000, label: '8 Triệu (Thoải mái)' },
  { amount: 15000000, label: '15 Triệu (Cao cấp)' },
  { amount: 25000000, label: '25 Triệu (Nghỉ dưỡng sang trọng)' },
];

const TRAVEL_STYLES = [
  { id: 'beach', label: '🏖️ Biển đảo & Bơi lội' },
  { id: 'photo', label: '📸 Check-in & Sống ảo' },
  { id: 'food', label: '🍜 Ẩm thực & Food tour' },
  { id: 'nature', label: '🏔️ Khám phá thiên nhiên' },
  { id: 'culture', label: '🏛️ Văn hóa & Lịch sử' },
  { id: 'resort', label: '💆 Nghỉ dưỡng thư thái' },
  { id: 'adventure', label: '🎒 Phượt mạo hiểm' },
];

const GROUP_TYPES = [
  { id: 'solo', label: '👤 Đi 1 mình (Solo)', desc: 'Tự do trải nghiệm theo cách riêng' },
  { id: 'couple', label: '💑 Cặp đôi (Couples)', desc: 'Lãng mạn, riêng tư và nhẹ nhàng' },
  { id: 'friends', label: '👥 Nhóm bạn (Friends)', desc: 'Sôi động, nhiều hoạt động vui nhộn' },
  { id: 'family', label: '👨‍👩‍👧‍👦 Gia đình (Family)', desc: 'Tiện nghi, an toàn cho người già & trẻ nhỏ' },
];

const TravelPlannerPage = () => {
  // Input Form States
  const [destination, setDestination] = useState('Đà Nẵng');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(6000000);
  const [selectedStyles, setSelectedStyles] = useState(['🏖️ Biển đảo & Bơi lội', '🍜 Ẩm thực & Food tour']);
  const [groupType, setGroupType] = useState('💑 Cặp đôi (Couples)');
  const [specialRequests, setSpecialRequests] = useState('Thích ăn hải sản tươi sống gần biển, ngắm hoàng hôn, ưu tiên di chuyển xe máy linh hoạt.');

  // App Execution States
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [planResult, setPlanResult] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline');
  const [activeDay, setActiveDay] = useState(1);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Filter & Search states cho Ở đâu và Ăn gì
  const [stayCategory, setStayCategory] = useState('ALL');
  const [staySearch, setStaySearch] = useState('');
  const [foodCategory, setFoodCategory] = useState('ALL');
  const [foodSearch, setFoodSearch] = useState('');

  const toggleStyle = (styleLabel) => {
    if (selectedStyles.includes(styleLabel)) {
      if (selectedStyles.length > 1) {
        setSelectedStyles(selectedStyles.filter(s => s !== styleLabel));
      }
    } else {
      setSelectedStyles([...selectedStyles, styleLabel]);
    }
  };

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    if (!destination.trim()) {
      setErrorMsg('Vui lòng nhập điểm đến du lịch mong muốn');
      return;
    }

    setErrorMsg('');
    setLoading(true);
    setLoadingStep(1);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 900);

    try {
      const response = await fetch('/api/chat/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: destination.trim(),
          days: parseInt(days, 10),
          budget: parseInt(budget, 10),
          travelStyle: selectedStyles.join(', '),
          groupType: groupType,
          specialRequests: specialRequests.trim()
        })
      });

      const data = await response.json();
      if (data.success && data.plan) {
        setPlanResult(data.plan);
        setActiveDay(1);
        setActiveTab('timeline');
        // Scroll to result section
        setTimeout(() => {
          const el = document.getElementById('itinerary-results');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setErrorMsg(data.error || 'Không thể tạo lịch trình, vui lòng thử lại sau.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Lỗi kết nối máy chủ AI. Vui lòng kiểm tra lại kết nối mạng.');
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  const handleCopyItinerary = () => {
    if (!planResult) return;
    let text = `🌟 KẾ HOẠCH DU LỊCH: ${planResult.title}\n`;
    text += `📍 Điểm đến: ${planResult.destination} | ⏱️ Thời gian: ${planResult.days} ngày | 💰 Ngân sách: ${planResult.budget?.toLocaleString('vi-VN')} VNĐ\n`;
    text += `📝 Giới thiệu: ${planResult.summary}\n\n`;
    
    planResult.dailyItinerary?.forEach(day => {
      text += `📅 ${day.title}\n`;
      text += `  🌅 Sáng: ${day.morning?.activity} (Ăn: ${day.morning?.food})\n`;
      text += `  ☀️ Chiều: ${day.afternoon?.activity} (Ăn: ${day.afternoon?.food})\n`;
      text += `  🌙 Tối: ${day.evening?.activity} (Ăn: ${day.evening?.food})\n\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', paddingTop: '90px', paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 1rem' }}>
        
        {/* HERO SECTION */}
        <div style={{
          textAlign: 'center',
          padding: '2.5rem 1.5rem',
          background: 'linear-gradient(135deg, #FFF1F2 0%, #FFFFFF 50%, #F0FDF4 100%)',
          borderRadius: '24px',
          border: '1px solid var(--border-light)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 56, 92, 0.1)',
            color: 'var(--accent-primary)',
            padding: '0.4rem 1rem',
            borderRadius: '30px',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1rem',
            letterSpacing: '0.5px'
          }}>
            <Sparkles size={16} />
            HỆ THỐNG GỢI Ý DU LỊCH AI • NLP & RECOMMENDATION ENGINE
          </div>

          <h1 style={{
            fontSize: '2.4rem',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            color: 'var(--text-primary)',
            lineHeight: 1.25,
            marginBottom: '0.75rem'
          }}>
            Lập Kế Hoạch Du Lịch Thông Minh <span style={{ color: 'var(--accent-primary)' }}>Theo Nhu Cầu</span>
          </h1>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.05rem',
            maxWidth: '780px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Nhập số ngày đi, ngân sách dự tính và sở thích của bạn — Trợ lý AI sẽ tính toán, tối ưu cung đường và sinh ra lịch trình hoàn chỉnh: <strong>chơi gì, ở đâu, ăn gì</strong> với bảng dự toán chi phí chi tiết nhất.
          </p>
        </div>

        {/* INPUT PLANNING FORM */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '20px',
          padding: '2rem',
          border: '1px solid var(--border-light)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
          marginBottom: '2.5rem'
        }}>
          <form onSubmit={handleGeneratePlan}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem', marginBottom: '1.75rem' }}>
              
              {/* 1. Điểm đến */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
                  <MapPin size={18} color="var(--accent-primary)" />
                  1. Điểm đến mong muốn:
                </label>
                <input 
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Ví dụ: Đà Nẵng, Sa Pa, Đà Lạt, Phú Quốc..."
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-strong)',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border 0.2s'
                  }}
                  required
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.6rem' }}>
                  {POPULAR_DESTINATIONS.slice(0, 6).map(dest => (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => setDestination(dest)}
                      style={{
                        background: destination === dest ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                        color: destination === dest ? '#fff' : 'var(--text-secondary)',
                        border: 'none',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {dest}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Số ngày chuyến đi */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
                  <Calendar size={18} color="var(--accent-primary)" />
                  2. Thời gian chuyến đi ({days} ngày):
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {DURATION_PRESETS.map(preset => (
                    <button
                      key={preset.days}
                      type="button"
                      onClick={() => setDays(preset.days)}
                      style={{
                        padding: '0.75rem 0.5rem',
                        borderRadius: '12px',
                        border: `2px solid ${days === preset.days ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                        background: days === preset.days ? 'rgba(255, 56, 92, 0.06)' : 'var(--bg-card)',
                        color: days === preset.days ? 'var(--accent-primary)' : 'var(--text-primary)',
                        fontWeight: days === preset.days ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        transition: 'all 0.15s'
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Ngân sách dự kiến */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
                  <DollarSign size={18} color="var(--accent-primary)" />
                  3. Tổng ngân sách dự kiến ({parseInt(budget, 10).toLocaleString('vi-VN')} VNĐ):
                </label>
                <input 
                  type="range"
                  min="1000000"
                  max="30000000"
                  step="500000"
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)', marginBottom: '0.5rem' }}
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {BUDGET_PRESETS.map(b => (
                    <button
                      key={b.amount}
                      type="button"
                      onClick={() => setBudget(b.amount)}
                      style={{
                        background: budget === b.amount ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                        color: budget === b.amount ? '#fff' : 'var(--text-secondary)',
                        border: 'none',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* 4. Đối tượng & Phong cách du lịch */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem', marginBottom: '1.75rem' }}>
              
              {/* Đối tượng */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
                  <Users size={18} color="var(--accent-primary)" />
                  4. Bạn đi cùng ai?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  {GROUP_TYPES.map(g => (
                    <div
                      key={g.id}
                      onClick={() => setGroupType(g.label)}
                      style={{
                        padding: '0.85rem',
                        borderRadius: '12px',
                        border: `2px solid ${groupType === g.label ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                        background: groupType === g.label ? 'rgba(255, 56, 92, 0.05)' : 'var(--bg-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: groupType === g.label ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                        {g.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {g.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phong cách */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
                  <Compass size={18} color="var(--accent-primary)" />
                  5. Phong cách du lịch ưu thích:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {TRAVEL_STYLES.map(style => {
                    const isSelected = selectedStyles.includes(style.label);
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => toggleStyle(style.label)}
                        style={{
                          padding: '0.55rem 0.9rem',
                          borderRadius: '25px',
                          border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-strong)'}`,
                          background: isSelected ? 'var(--accent-primary)' : 'var(--bg-card)',
                          color: isSelected ? '#fff' : 'var(--text-primary)',
                          fontWeight: isSelected ? 600 : 500,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          transition: 'all 0.15s'
                        }}
                      >
                        {style.label}
                        {isSelected && <Check size={14} />}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* 6. Yêu cầu chi tiết dạng văn bản (NLP Prompt) */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
                <Info size={18} color="var(--accent-primary)" />
                6. Yêu cầu đặc biệt bổ sung (Ngôn ngữ tự nhiên NLP):
              </label>
              <textarea
                rows={2}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Ví dụ: Thích quán cafe view biển hoàng hôn, muốn thử món bánh tráng cuốn thịt heo, thích đi xe máy hơn taxi..."
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-strong)',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            {errorMsg && (
              <div style={{
                background: '#FEF2F2',
                color: '#DC2626',
                padding: '0.85rem 1.25rem',
                borderRadius: '12px',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '1.5rem',
                border: '1px solid #FEE2E2'
              }}>
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Action Submit Button */}
            <div style={{ textAlign: 'center' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: 'var(--accent-gradient)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 3rem',
                  borderRadius: '35px',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 8px 24px rgba(255, 56, 92, 0.35)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.2s',
                  transform: loading ? 'scale(0.98)' : 'scale(1)'
                }}
              >
                <Sparkles size={22} />
                <span>{loading ? 'AI Đang Lập Kế Hoạch...' : 'Khởi Tạo Kế Hoạch Du Lịch Bằng AI'}</span>
                {!loading && <ArrowRight size={20} />}
              </button>
            </div>
          </form>

          {/* LOADING STATE ANIMATION */}
          {loading && (
            <div style={{
              marginTop: '2.5rem',
              padding: '2rem',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #F9FAFB, #F3F4F6)',
              border: '1px dashed var(--accent-primary)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                border: '4px solid rgba(255, 56, 92, 0.2)',
                borderTopColor: 'var(--accent-primary)',
                borderRadius: '50%',
                margin: '0 auto 1.25rem',
                animation: 'spin 0.8s linear infinite'
              }} />
              <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              `}</style>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                {loadingStep === 1 && '🔍 Đang phân tích yêu cầu NLP & đặc điểm điểm đến...'}
                {loadingStep === 2 && '🧭 Đang tính toán ma trận chi phí & tối ưu khoảng cách...'}
                {loadingStep === 3 && '🏨 Đang chọn lọc gợi ý lưu trú & món ăn đặc sản...'}
                {loadingStep >= 4 && '✨ Đang hoàn thiện lịch trình du lịch chi tiết cho bạn...'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Hệ thống đang đối sánh sở thích với hàng trăm địa điểm du lịch thực tế tại {destination}...
              </p>
            </div>
          )}
        </div>

        {/* RESULTS SECTION */}
        {planResult && (
          <div id="itinerary-results" style={{
            background: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1px solid var(--border-light)',
            boxShadow: '0 12px 36px rgba(0,0,0,0.06)',
            padding: '2.5rem',
            marginBottom: '3rem'
          }}>
            
            {/* Header Result */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '1.5rem',
              paddingBottom: '2rem',
              borderBottom: '1px solid var(--border-light)',
              marginBottom: '2rem'
            }}>
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#059669',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem'
                }}>
                  <CheckCircle2 size={16} />
                  KẾ HOẠCH ĐÃ HOÀN TẤT VÀ TỐI ƯU HOÁ
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                  {planResult.title}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '780px', lineHeight: 1.6 }}>
                  {planResult.summary}
                </p>
              </div>

              {/* Action Buttons: Print, Copy, Reset */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleCopyItinerary}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-strong)',
                    padding: '0.65rem 1.1rem',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {copied ? <Check size={16} color="#059669" /> : <Copy size={16} />}
                  <span>{copied ? 'Đã sao chép!' : 'Sao chép'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-strong)',
                    padding: '0.65rem 1.1rem',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <Printer size={16} />
                  <span>In / PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.querySelector('form');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'rgba(255, 56, 92, 0.1)',
                    color: 'var(--accent-primary)',
                    border: '1px solid rgba(255, 56, 92, 0.2)',
                    padding: '0.65rem 1.1rem',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <RotateCcw size={16} />
                  <span>Đổi tiêu chí</span>
                </button>
              </div>
            </div>

            {/* QUICK STATS CARDS */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={16} color="var(--accent-primary)" /> Điểm đến
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.4rem' }}>
                  {planResult.destination}
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={16} color="#3B82F6" /> Thời lượng
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.4rem' }}>
                  {planResult.days} Ngày ({planResult.days > 1 ? `${planResult.days - 1} Đêm` : 'Trong ngày'})
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <DollarSign size={16} color="#10B981" /> Tổng ngân sách
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#059669', marginTop: '0.4rem' }}>
                  {planResult.budget?.toLocaleString('vi-VN')} đ
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Hotel size={16} color="#8B5CF6" /> Gợi ý nơi ở
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#7C3AED', marginTop: '0.4rem' }}>
                  {planResult.accommodations?.length || 0} địa điểm
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Utensils size={16} color="#EA580C" /> Ẩm thực đặc sản
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#EA580C', marginTop: '0.4rem' }}>
                  {planResult.culinary?.length || 0} món nổi tiếng
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Users size={16} color="#3B82F6" /> Đối tượng
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.4rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {planResult.groupType || groupType}
                </div>
              </div>
            </div>

            {/* NAVIGATION TABS */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              borderBottom: '2px solid var(--border-light)',
              marginBottom: '2rem',
              overflowX: 'auto',
              paddingBottom: '2px'
            }}>
              <button
                type="button"
                onClick={() => setActiveTab('timeline')}
                style={{
                  padding: '0.85rem 1.5rem',
                  border: 'none',
                  borderBottom: activeTab === 'timeline' ? '3px solid var(--accent-primary)' : '3px solid transparent',
                  background: 'none',
                  color: activeTab === 'timeline' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: activeTab === 'timeline' ? 700 : 500,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s'
                }}
              >
                <Calendar size={18} />
                Lịch Trình Từng Ngày ({planResult.dailyItinerary?.length || 0})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('stay')}
                style={{
                  padding: '0.85rem 1.5rem',
                  border: 'none',
                  borderBottom: activeTab === 'stay' ? '3px solid var(--accent-primary)' : '3px solid transparent',
                  background: 'none',
                  color: activeTab === 'stay' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: activeTab === 'stay' ? 700 : 500,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s'
                }}
              >
                <Hotel size={18} />
                Ở Đâu ({planResult.accommodations?.length || 0} nơi lưu trú)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('food')}
                style={{
                  padding: '0.85rem 1.5rem',
                  border: 'none',
                  borderBottom: activeTab === 'food' ? '3px solid var(--accent-primary)' : '3px solid transparent',
                  background: 'none',
                  color: activeTab === 'food' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: activeTab === 'food' ? 700 : 500,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s'
                }}
              >
                <Utensils size={18} />
                Ăn Gì ({planResult.culinary?.length || 0} món đặc sản)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('budget')}
                style={{
                  padding: '0.85rem 1.5rem',
                  border: 'none',
                  borderBottom: activeTab === 'budget' ? '3px solid var(--accent-primary)' : '3px solid transparent',
                  background: 'none',
                  color: activeTab === 'budget' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: activeTab === 'budget' ? 700 : 500,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s'
                }}
              >
                <DollarSign size={18} />
                Dự Toán Chi Phí Chi Tiết
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tips')}
                style={{
                  padding: '0.85rem 1.5rem',
                  border: 'none',
                  borderBottom: activeTab === 'tips' ? '3px solid var(--accent-primary)' : '3px solid transparent',
                  background: 'none',
                  color: activeTab === 'tips' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: activeTab === 'tips' ? 700 : 500,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s'
                }}
              >
                <Luggage size={18} />
                Mẹo & Cẩm Nang
              </button>
            </div>

            {/* TAB CONTENT 1: TIMELINE LỊCH TRÌNH */}
            {activeTab === 'timeline' && (
              <div>
                {/* Day Selector Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                  {planResult.dailyItinerary?.map(d => (
                    <button
                      key={d.day}
                      type="button"
                      onClick={() => setActiveDay(d.day)}
                      style={{
                        padding: '0.65rem 1.25rem',
                        borderRadius: '12px',
                        border: 'none',
                        background: activeDay === d.day ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                        color: activeDay === d.day ? '#fff' : 'var(--text-primary)',
                        fontWeight: activeDay === d.day ? 700 : 600,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      Ngày {d.day}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setActiveDay('all')}
                    style={{
                      padding: '0.65rem 1.25rem',
                      borderRadius: '12px',
                      border: 'none',
                      background: activeDay === 'all' ? '#1F2937' : 'var(--bg-secondary)',
                      color: activeDay === 'all' ? '#fff' : 'var(--text-primary)',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    Xem toàn bộ các ngày
                  </button>
                </div>

                {/* Days Display */}
                {planResult.dailyItinerary
                  ?.filter(d => activeDay === 'all' || d.day === activeDay)
                  .map(dayItem => (
                    <div 
                      key={dayItem.day}
                      style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '20px',
                        padding: '1.75rem',
                        marginBottom: '2rem',
                        border: '1px solid var(--border-light)'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '1.5rem',
                        paddingBottom: '1rem',
                        borderBottom: '1px solid var(--border-light)'
                      }}>
                        <div style={{
                          background: 'var(--accent-primary)',
                          color: '#fff',
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '1.1rem'
                        }}>
                          {dayItem.day}
                        </div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {dayItem.title}
                        </h3>
                      </div>

                      {/* 3 Periods: Morning, Afternoon, Evening */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                        
                        {/* Morning */}
                        <div style={{
                          background: 'var(--bg-card)',
                          borderRadius: '16px',
                          padding: '1.4rem',
                          border: '1px solid #FEF3C7',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D97706', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.85rem' }}>
                            <Sunrise size={20} />
                            Buổi Sáng
                          </div>
                          <div style={{ marginBottom: '0.75rem' }}>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>🎯 Hoạt động chính:</strong>
                            <p style={{ color: 'var(--text-primary)', marginTop: '3px', fontWeight: 600 }}>{dayItem.morning?.activity}</p>
                          </div>
                          <div style={{ marginBottom: '0.75rem' }}>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>🥣 Ăn sáng gợi ý:</strong>
                            <p style={{ color: 'var(--text-primary)', marginTop: '3px' }}>{dayItem.morning?.food}</p>
                          </div>
                          {dayItem.morning?.tips && (
                            <div style={{ background: '#FFFBEB', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', color: '#92400E', marginTop: '0.5rem' }}>
                              💡 <strong>Mẹo:</strong> {dayItem.morning.tips}
                            </div>
                          )}
                        </div>

                        {/* Afternoon */}
                        <div style={{
                          background: 'var(--bg-card)',
                          borderRadius: '16px',
                          padding: '1.4rem',
                          border: '1px solid #BAE6FD',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0284C7', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.85rem' }}>
                            <Sun size={20} />
                            Buổi Chiều
                          </div>
                          <div style={{ marginBottom: '0.75rem' }}>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>🎯 Hoạt động chính:</strong>
                            <p style={{ color: 'var(--text-primary)', marginTop: '3px', fontWeight: 600 }}>{dayItem.afternoon?.activity}</p>
                          </div>
                          <div style={{ marginBottom: '0.75rem' }}>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>🍲 Bữa trưa & xế:</strong>
                            <p style={{ color: 'var(--text-primary)', marginTop: '3px' }}>{dayItem.afternoon?.food}</p>
                          </div>
                          {dayItem.afternoon?.tips && (
                            <div style={{ background: '#F0F9FF', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', color: '#0369A1', marginTop: '0.5rem' }}>
                              💡 <strong>Mẹo:</strong> {dayItem.afternoon.tips}
                            </div>
                          )}
                        </div>

                        {/* Evening */}
                        <div style={{
                          background: 'var(--bg-card)',
                          borderRadius: '16px',
                          padding: '1.4rem',
                          border: '1px solid #E9D5FF',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#7E22CE', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.85rem' }}>
                            <Moon size={20} />
                            Buổi Tối
                          </div>
                          <div style={{ marginBottom: '0.75rem' }}>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>🎯 Hoạt động đêm:</strong>
                            <p style={{ color: 'var(--text-primary)', marginTop: '3px', fontWeight: 600 }}>{dayItem.evening?.activity}</p>
                          </div>
                          <div style={{ marginBottom: '0.75rem' }}>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>🍜 Bữa tối đặc sản:</strong>
                            <p style={{ color: 'var(--text-primary)', marginTop: '3px' }}>{dayItem.evening?.food}</p>
                          </div>
                          {dayItem.evening?.tips && (
                            <div style={{ background: '#FAF5FF', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', color: '#6B21A8', marginTop: '0.5rem' }}>
                              💡 <strong>Mẹo:</strong> {dayItem.evening.tips}
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* TAB CONTENT 2: GỢI Ý LƯU TRÚ (Ở ĐÂU) */}
            {activeTab === 'stay' && (() => {
              const allStays = planResult.accommodations || [];
              const filteredStays = allStays.filter(item => {
                const typeStr = (item.type || '').toLowerCase();
                const matchesCat = stayCategory === 'ALL' || 
                  (stayCategory === 'hotel' && (typeStr.includes('khách sạn') || typeStr.includes('hotel'))) ||
                  (stayCategory === 'resort' && typeStr.includes('resort')) ||
                  (stayCategory === 'homestay' && typeStr.includes('homestay')) ||
                  (stayCategory === 'apartment' && (typeStr.includes('căn hộ') || typeStr.includes('apartment') || typeStr.includes('condotel') || typeStr.includes('villa'))) ||
                  (stayCategory === 'hostel' && (typeStr.includes('hostel') || typeStr.includes('dorm')));
                
                const searchLow = staySearch.toLowerCase().trim();
                const matchesSearch = !searchLow ||
                  (item.name || '').toLowerCase().includes(searchLow) ||
                  (item.area || '').toLowerCase().includes(searchLow) ||
                  (item.highlights || '').toLowerCase().includes(searchLow);
                return matchesCat && matchesSearch;
              });

              const getBadgeColor = (type) => {
                const t = (type || '').toLowerCase();
                if (t.includes('resort')) return { bg: 'linear-gradient(135deg, #7C3AED, #9333EA)', color: '#fff' };
                if (t.includes('cao cấp') || t.includes('5 sao')) return { bg: 'linear-gradient(135deg, #D97706, #F59E0B)', color: '#fff' };
                if (t.includes('homestay')) return { bg: 'linear-gradient(135deg, #059669, #10B981)', color: '#fff' };
                if (t.includes('căn hộ') || t.includes('villa')) return { bg: 'linear-gradient(135deg, #0284C7, #38BDF8)', color: '#fff' };
                if (t.includes('hostel')) return { bg: '#4B5563', color: '#fff' };
                return { bg: 'var(--accent-primary)', color: '#fff' };
              };

              return (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Hotel size={24} color="#7C3AED" />
                        Gợi ý Địa Điểm Lưu Trú ({allStays.length} lựa chọn phong phú)
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                        Đầy đủ phân khúc từ Resort nghỉ dưỡng, Khách sạn trung tâm, Căn hộ đến Homestay bản địa
                      </p>
                    </div>

                    {/* Search box for stay */}
                    <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                      <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                      <input 
                        type="text"
                        value={staySearch}
                        onChange={(e) => setStaySearch(e.target.value)}
                        placeholder="Tìm tên khách sạn, khu vực..."
                        style={{
                          width: '100%',
                          padding: '0.65rem 1rem 0.65rem 2.4rem',
                          borderRadius: '12px',
                          border: '1px solid var(--border-light)',
                          background: 'var(--bg-secondary)',
                          fontSize: '0.9rem',
                          outline: 'none',
                          color: 'var(--text-primary)'
                        }}
                      />
                      {staySearch && (
                        <button 
                          onClick={() => setStaySearch('')} 
                          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filter category chips */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
                    {[
                      { id: 'ALL', label: `Tất cả (${allStays.length})` },
                      { id: 'resort', label: '🏖️ Resort nghỉ dưỡng' },
                      { id: 'hotel', label: '🏨 Khách sạn' },
                      { id: 'homestay', label: '🏡 Homestay bản địa' },
                      { id: 'apartment', label: '🏢 Căn hộ / Villa' },
                      { id: 'hostel', label: '🎒 Hostel tiết kiệm' }
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setStayCategory(f.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          border: stayCategory === f.id ? '2px solid #7C3AED' : '1px solid var(--border-light)',
                          background: stayCategory === f.id ? '#F5F3FF' : 'var(--bg-card)',
                          color: stayCategory === f.id ? '#6D28D9' : 'var(--text-primary)',
                          fontWeight: stayCategory === f.id ? 700 : 500,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.15s'
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Cards display */}
                  {filteredStays.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--bg-secondary)', borderRadius: '16px' }}>
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Không tìm thấy nơi lưu trú nào phù hợp với bộ lọc hiện tại.</p>
                      <button 
                        type="button" 
                        onClick={() => { setStayCategory('ALL'); setStaySearch(''); }}
                        style={{ padding: '0.5rem 1.2rem', borderRadius: '10px', border: 'none', background: 'var(--accent-primary)', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Xóa bộ lọc
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                      {filteredStays.map((hotel, idx) => {
                        const badgeStyle = getBadgeColor(hotel.type);
                        const mapsQuery = encodeURIComponent(`${hotel.name} ${hotel.area || ''} ${planResult.destination}`);
                        const bookingQuery = encodeURIComponent(`đặt phòng ${hotel.name} ${planResult.destination}`);

                        return (
                          <div 
                            key={idx}
                            style={{
                              background: 'var(--bg-secondary)',
                              padding: '1.6rem',
                              borderRadius: '20px',
                              border: '1px solid var(--border-light)',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                              transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <div style={{
                                  background: badgeStyle.bg,
                                  color: badgeStyle.color,
                                  padding: '0.25rem 0.8rem',
                                  borderRadius: '20px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  letterSpacing: '0.3px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem'
                                }}>
                                  <Hotel size={13} />
                                  {hotel.type || 'Lưu trú'}
                                </div>
                                <span style={{
                                  background: 'rgba(5, 150, 105, 0.1)',
                                  color: '#059669',
                                  fontSize: '0.85rem',
                                  fontWeight: 700,
                                  padding: '0.2rem 0.6rem',
                                  borderRadius: '8px'
                                }}>
                                  Lựa chọn #{idx + 1}
                                </span>
                              </div>

                              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                                {hotel.name}
                              </h4>

                              <div style={{
                                display: 'inline-block',
                                background: '#ECFDF5',
                                border: '1px solid #A7F3D0',
                                color: '#065F46',
                                fontWeight: 800,
                                fontSize: '1.05rem',
                                padding: '0.35rem 0.8rem',
                                borderRadius: '10px',
                                marginBottom: '0.85rem'
                              }}>
                                💰 {hotel.priceRange}
                              </div>

                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                                <MapPin size={18} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <span><strong>Khu vực:</strong> {hotel.area}</span>
                              </p>

                              <div style={{ color: 'var(--text-primary)', fontSize: '0.92rem', background: 'var(--bg-card)', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#D97706', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                                  <Sparkles size={15} /> Điểm nổi bật & Tiện ích:
                                </div>
                                {hotel.highlights}
                              </div>
                            </div>

                            {/* Action links */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.4rem',
                                  padding: '0.6rem 0.5rem',
                                  borderRadius: '10px',
                                  background: 'var(--bg-card)',
                                  border: '1px solid var(--border-light)',
                                  color: 'var(--text-primary)',
                                  fontSize: '0.85rem',
                                  fontWeight: 600,
                                  textDecoration: 'none'
                                }}
                              >
                                <MapPin size={14} color="var(--accent-primary)" />
                                Bản đồ
                              </a>

                              <a
                                href={`https://www.google.com/search?q=${bookingQuery}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.4rem',
                                  padding: '0.6rem 0.5rem',
                                  borderRadius: '10px',
                                  background: 'rgba(255, 56, 92, 0.08)',
                                  border: '1px solid rgba(255, 56, 92, 0.2)',
                                  color: 'var(--accent-primary)',
                                  fontSize: '0.85rem',
                                  fontWeight: 600,
                                  textDecoration: 'none'
                                }}
                              >
                                <ExternalLink size={14} />
                                Giá phòng
                              </a>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* TAB CONTENT 3: ẨM THỰC ĐẶC SẢN (ĂN GÌ) */}
            {activeTab === 'food' && (() => {
              const allFoods = planResult.culinary || [];
              const filteredFoods = allFoods.filter(item => {
                const catStr = (item.category || '').toLowerCase();
                const dishStr = (item.dish || '').toLowerCase();

                const matchesCat = foodCategory === 'ALL' ||
                  (foodCategory === 'main' && (catStr.includes('món chính') || catStr.includes('cơm') || dishStr.includes('cơm') || dishStr.includes('bánh tráng cuốn') || dishStr.includes('nem'))) ||
                  (foodCategory === 'noodle' && (catStr.includes('món nước') || dishStr.includes('phở') || dishStr.includes('bún') || dishStr.includes('mì') || dishStr.includes('hủ tiếu') || dishStr.includes('bánh canh') || dishStr.includes('miến') || dishStr.includes('cháo'))) ||
                  (foodCategory === 'seafood' && (catStr.includes('hải sản') || catStr.includes('nướng') || dishStr.includes('hải sản') || dishStr.includes('nướng') || dishStr.includes('lẩu') || dishStr.includes('ghẹ') || dishStr.includes('tôm') || dishStr.includes('mực') || dishStr.includes('ốc') || dishStr.includes('bò') || dishStr.includes('dê'))) ||
                  (foodCategory === 'snack' && (catStr.includes('ăn vặt') || catStr.includes('tráng miệng') || dishStr.includes('chè') || dishStr.includes('bánh') || dishStr.includes('kem') || dishStr.includes('sữa chua') || dishStr.includes('xôi') || dishStr.includes('cốm'))) ||
                  (foodCategory === 'drink' && (catStr.includes('cà phê') || catStr.includes('đồ uống') || dishStr.includes('cà phê') || dishStr.includes('trà') || dishStr.includes('cocktail') || dishStr.includes('rượu') || dishStr.includes('nước mót') || dishStr.includes('sữa')));

                const searchLow = foodSearch.toLowerCase().trim();
                const matchesSearch = !searchLow ||
                  (item.dish || '').toLowerCase().includes(searchLow) ||
                  (item.places || item.recommendedPlaces || '').toLowerCase().includes(searchLow);

                return matchesCat && matchesSearch;
              });

              const getCategoryBadge = (category, dish) => {
                const c = (category || '').toLowerCase();
                const d = (dish || '').toLowerCase();
                if (c.includes('nước') || d.includes('bún') || d.includes('phở') || d.includes('mì')) return { label: '🍜 Món nước', bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE' };
                if (c.includes('hải sản') || c.includes('nướng') || d.includes('hải sản') || d.includes('nướng')) return { label: '🦐 Hải sản & Nướng', bg: '#FEF2F2', color: '#991B1B', border: '#FECACA' };
                if (c.includes('ăn vặt') || c.includes('tráng miệng') || d.includes('chè') || d.includes('bánh')) return { label: '🍧 Ăn vặt / Tráng miệng', bg: '#FDF2F8', color: '#9D174D', border: '#FBCFE8' };
                if (c.includes('cà phê') || c.includes('đồ uống') || d.includes('cà phê')) return { label: '☕ Cà phê & Chill', bg: '#FAF5FF', color: '#6B21A8', border: '#E9D5FF' };
                return { label: '🍲 Đặc sản chính', bg: '#FFF7ED', color: '#9A3412', border: '#FED7AA' };
              };

              return (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Utensils size={24} color="#EA580C" />
                        Danh sách Món ngon & Quán ăn đặc sản ({allFoods.length} món nổi tiếng)
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                        Các món ăn trứ danh địa phương kèm địa chỉ quán chuẩn vị lâu đời nhất
                      </p>
                    </div>

                    {/* Search box for food */}
                    <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                      <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                      <input 
                        type="text"
                        value={foodSearch}
                        onChange={(e) => setFoodSearch(e.target.value)}
                        placeholder="Tìm món ngon, tên quán, địa chỉ..."
                        style={{
                          width: '100%',
                          padding: '0.65rem 1rem 0.65rem 2.4rem',
                          borderRadius: '12px',
                          border: '1px solid var(--border-light)',
                          background: 'var(--bg-secondary)',
                          fontSize: '0.9rem',
                          outline: 'none',
                          color: 'var(--text-primary)'
                        }}
                      />
                      {foodSearch && (
                        <button 
                          onClick={() => setFoodSearch('')} 
                          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filter category chips */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
                    {[
                      { id: 'ALL', label: `Tất cả (${allFoods.length})` },
                      { id: 'main', label: '🍲 Món chính truyền thống' },
                      { id: 'noodle', label: '🍜 Món nước & Phở / Bún' },
                      { id: 'seafood', label: '🦐 Hải sản & Đồ nướng' },
                      { id: 'snack', label: '🍧 Ăn vặt & Tráng miệng' },
                      { id: 'drink', label: '☕ Cà phê & Thức uống' }
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFoodCategory(f.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          border: foodCategory === f.id ? '2px solid #EA580C' : '1px solid var(--border-light)',
                          background: foodCategory === f.id ? '#FFF7ED' : 'var(--bg-card)',
                          color: foodCategory === f.id ? '#C2410C' : 'var(--text-primary)',
                          fontWeight: foodCategory === f.id ? 700 : 500,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.15s'
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Foods Grid */}
                  {filteredFoods.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--bg-secondary)', borderRadius: '16px' }}>
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Không tìm thấy món ăn nào phù hợp với từ khóa.</p>
                      <button 
                        type="button" 
                        onClick={() => { setFoodCategory('ALL'); setFoodSearch(''); }}
                        style={{ padding: '0.5rem 1.2rem', borderRadius: '10px', border: 'none', background: 'var(--accent-primary)', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Xóa bộ lọc
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                      {filteredFoods.map((food, idx) => {
                        const catBadge = getCategoryBadge(food.category, food.dish);
                        const firstPlace = (food.places || food.recommendedPlaces || '').split(',')[0];
                        const mapQuery = encodeURIComponent(`${food.dish} ${firstPlace} ${planResult.destination}`);

                        return (
                          <div 
                            key={idx}
                            style={{
                              background: 'var(--bg-secondary)',
                              padding: '1.5rem',
                              borderRadius: '18px',
                              border: '1px solid var(--border-light)',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                              transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                                <span style={{
                                  background: catBadge.bg,
                                  color: catBadge.color,
                                  border: `1px solid ${catBadge.border}`,
                                  padding: '0.2rem 0.65rem',
                                  borderRadius: '12px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700
                                }}>
                                  {catBadge.label}
                                </span>

                                <span style={{
                                  background: 'rgba(239, 68, 68, 0.08)',
                                  color: 'var(--accent-primary)',
                                  padding: '0.25rem 0.7rem',
                                  borderRadius: '20px',
                                  fontSize: '0.8rem',
                                  fontWeight: 700
                                }}>
                                  💰 {food.cost || food.estimatedCost}
                                </span>
                              </div>

                              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                                🥘 {food.dish}
                              </h4>

                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1rem', lineHeight: 1.5, background: 'var(--bg-card)', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                                <strong style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
                                  <MapPin size={15} color="var(--accent-primary)" />
                                  Quán & Địa chỉ nổi tiếng:
                                </strong>
                                <span>{food.places || food.recommendedPlaces}</span>
                              </p>
                            </div>

                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem',
                                padding: '0.6rem 0.75rem',
                                borderRadius: '10px',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-light)',
                                color: 'var(--accent-primary)',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                textDecoration: 'none',
                                marginTop: '0.5rem'
                              }}
                            >
                              <Navigation size={14} />
                              Chỉ đường đến quán trên Google Maps
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* TAB CONTENT 4: DỰ TOÁN CHI PHÍ (BUDGET BREAKDOWN) */}
            {activeTab === 'budget' && (
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  💰 Bảng Phân Bổ Chi Phí Dự Toán Theo Ngân Sách:
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  Tổng ngân sách mục tiêu: <strong>{planResult.budget?.toLocaleString('vi-VN')} VNĐ</strong>. Dưới đây là tỷ lệ phân bổ chi phí khoa học được đề xuất:
                </p>

                {planResult.budgetBreakdown && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem'
                  }}>
                    <div style={{ background: '#EFF6FF', padding: '1.25rem', borderRadius: '16px', border: '1px solid #BFDBFE' }}>
                      <div style={{ fontSize: '0.85rem', color: '#1E40AF', fontWeight: 600 }}>🏨 Lưu trú (Khách sạn)</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E3A8A', marginTop: '0.4rem' }}>
                        {planResult.budgetBreakdown.accommodation?.toLocaleString('vi-VN')} đ
                      </div>
                    </div>

                    <div style={{ background: '#ECFDF5', padding: '1.25rem', borderRadius: '16px', border: '1px solid #A7F3D0' }}>
                      <div style={{ fontSize: '0.85rem', color: '#065F46', fontWeight: 600 }}>🍜 Ăn uống ẩm thực</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#064E3B', marginTop: '0.4rem' }}>
                        {planResult.budgetBreakdown.food?.toLocaleString('vi-VN')} đ
                      </div>
                    </div>

                    <div style={{ background: '#FFF7ED', padding: '1.25rem', borderRadius: '16px', border: '1px solid #FED7AA' }}>
                      <div style={{ fontSize: '0.85rem', color: '#9A3412', fontWeight: 600 }}>🎟️ Vé tham quan & vui chơi</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#7C2D12', marginTop: '0.4rem' }}>
                        {planResult.budgetBreakdown.sightseeing?.toLocaleString('vi-VN')} đ
                      </div>
                    </div>

                    <div style={{ background: '#F5F3FF', padding: '1.25rem', borderRadius: '16px', border: '1px solid #DDD6FE' }}>
                      <div style={{ fontSize: '0.85rem', color: '#5B21B6', fontWeight: 600 }}>🛵 Di chuyển tại chỗ</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#4C1D95', marginTop: '0.4rem' }}>
                        {planResult.budgetBreakdown.transportation?.toLocaleString('vi-VN')} đ
                      </div>
                    </div>

                    <div style={{ background: '#FDF2F8', padding: '1.25rem', borderRadius: '16px', border: '1px solid #FBCFE8' }}>
                      <div style={{ fontSize: '0.85rem', color: '#9D174D', fontWeight: 600 }}>🛡️ Quỹ dự phòng & mua sắm</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#831843', marginTop: '0.4rem' }}>
                        {planResult.budgetBreakdown.contingency?.toLocaleString('vi-VN')} đ
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 5: MẸO & CẨM NANG */}
            {activeTab === 'tips' && (
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
                  💡 Lời Khuyên & Cẩm Nang Thực Tế Cho Chuyến Đi:
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {planResult.travelTips?.map((tip, idx) => (
                    <div 
                      key={idx}
                      style={{
                        background: 'var(--bg-secondary)',
                        padding: '1.2rem 1.5rem',
                        borderRadius: '16px',
                        borderLeft: '4px solid var(--accent-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '1rem',
                        color: 'var(--text-primary)',
                        lineHeight: 1.5
                      }}
                    >
                      <CheckCircle2 size={20} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default TravelPlannerPage;
