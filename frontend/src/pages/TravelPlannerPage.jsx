import React, { useState } from 'react';
import { 
  Printer, Copy, RotateCcw, AlertCircle, Check, Navigation, Search, ExternalLink
} from 'lucide-react';

const TRAVEL_STYLES = [
  { id: 'beach', label: 'Biển đảo & Bơi lội' },
  { id: 'photo', label: 'Check-in & Sống ảo' },
  { id: 'food', label: 'Ẩm thực & Food tour' },
  { id: 'nature', label: 'Khám phá thiên nhiên' },
  { id: 'culture', label: 'Văn hóa & Lịch sử' },
  { id: 'resort', label: 'Nghỉ dưỡng thư thái' },
  { id: 'adventure', label: 'Phượt mạo hiểm' },
];

const GROUP_TYPES = [
  { id: 'solo', label: 'Đi 1 mình', desc: 'Tự do trải nghiệm theo cách riêng' },
  { id: 'couple', label: 'Cặp đôi', desc: 'Lãng mạn, riêng tư và nhẹ nhàng' },
  { id: 'friends', label: 'Nhóm bạn', desc: 'Sôi động, nhiều hoạt động vui nhộn' },
  { id: 'family', label: 'Gia đình', desc: 'Tiện nghi, an toàn cho người già & trẻ nhỏ' },
];

const TravelPlannerPage = () => {
  // Input Form States
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('Đà Nẵng');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(6000000);
  const [selectedStyles, setSelectedStyles] = useState(['Biển đảo & Bơi lội', 'Ẩm thực & Food tour']);
  const [groupType, setGroupType] = useState('Cặp đôi');
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
          startLocation: startLocation.trim(),
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
        if (!startLocation.trim()) {
          data.plan.startLocation = '';
        } else if (!data.plan.startLocation && startLocation.trim()) {
          data.plan.startLocation = startLocation.trim();
        }
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
    let text = `KẾ HOẠCH DU LỊCH: ${planResult.title}\n`;
    if (planResult.startLocation) {
      text += `Lộ trình: ${planResult.startLocation} ➔ ${planResult.destination} | `;
    } else {
      text += `Điểm đến: ${planResult.destination} | `;
    }
    text += `Thời gian: ${planResult.days} ngày | Ngân sách: ${planResult.budget?.toLocaleString('vi-VN')} VNĐ\n`;
    if (planResult.nlpAnalysis?.extractedEntities?.length > 0) {
      text += `Phân tích NLP: ${planResult.nlpAnalysis.extractedEntities.join(', ')}\n`;
    }
    text += `Giới thiệu: ${planResult.summary}\n\n`;
    
    planResult.dailyItinerary?.forEach(day => {
      text += `${day.title}\n`;
      text += `  Sáng: ${day.morning?.activity} (Ăn: ${day.morning?.food})\n`;
      text += `  Chiều: ${day.afternoon?.activity} (Ăn: ${day.afternoon?.food})\n`;
      text += `  Tối: ${day.evening?.activity} (Ăn: ${day.evening?.food})\n\n`;
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
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(2, 50, 106, 0.05)',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: '#EFF6FF',
            color: 'var(--brand-navy)',
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1rem',
            border: '1px solid #BFDBFE',
            letterSpacing: '0.5px'
          }}>
            ⚡ TRỢ LÝ LẬP LỊCH TRÌNH DU LỊCH
          </div>

          <h1 style={{
            fontSize: '2.4rem',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            color: 'var(--brand-navy)',
            lineHeight: 1.25,
            marginBottom: '0.75rem'
          }}>
            Lập Kế Hoạch Du Lịch Thông Minh Theo Nhu Cầu
          </h1>

          <p style={{
            color: '#4B5563',
            fontSize: '1.05rem',
            maxWidth: '780px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Nhập số ngày đi, ngân sách dự tính và sở thích của bạn — Trợ lý sẽ tính toán, tối ưu cung đường và sinh ra lịch trình hoàn chỉnh: <strong>chơi gì, ở đâu, ăn gì</strong> với bảng dự toán chi phí chi tiết.
          </p>
        </div>

        {/* INPUT PLANNING FORM */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '2rem',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
          marginBottom: '2.5rem'
        }}>
          <form onSubmit={handleGeneratePlan}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
              
              {/* 1. Điểm xuất phát (tùy chọn) */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.6rem', color: '#111827' }}>
                  1. Điểm xuất phát (tùy chọn):
                </label>
                <input 
                  type="text"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  placeholder="Ví dụ: Hà Nội, TP.HCM... (không bắt buộc)"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid #D1D5DB',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    color: '#111827',
                    background: '#FFFFFF',
                    transition: 'border 0.2s'
                  }}
                />
              </div>

              {/* 2. Điểm đến */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.6rem', color: '#111827' }}>
                  2. Điểm đến mong muốn:
                </label>
                <input 
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Ví dụ: Đà Nẵng, Hạ Long, Xuyên Việt..."
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid #D1D5DB',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    color: '#111827',
                    background: '#FFFFFF',
                    transition: 'border 0.2s'
                  }}
                  required
                />
              </div>

              {/* 3. Số ngày chuyến đi */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.6rem', color: '#111827' }}>
                  3. Thời gian chuyến đi:
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="number"
                    min="1"
                    max="60"
                    value={days}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        setDays('');
                      } else {
                        setDays(Math.max(1, Math.min(60, parseInt(val, 10))));
                      }
                    }}
                    onBlur={() => {
                      if (!days || days < 1) setDays(3);
                    }}
                    placeholder="Nhập số ngày (Ví dụ: 3, 7, 14, 30...)"
                    style={{
                      width: '100%',
                      padding: '0.85rem 3.5rem 0.85rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid #D1D5DB',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      color: '#111827',
                      background: '#FFFFFF',
                      transition: 'border 0.2s'
                    }}
                    required
                  />
                  <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#00A699', fontSize: '0.9rem' }}>
                    Ngày
                  </span>
                </div>
              </div>

              {/* 4. Ngân sách dự kiến */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.6rem', color: '#111827' }}>
                  4. Tổng ngân sách dự kiến:
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text"
                    value={budget ? Number(budget).toLocaleString('vi-VN') : ''}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '');
                      setBudget(raw ? parseInt(raw, 10) : '');
                    }}
                    onBlur={() => {
                      if (!budget || budget < 500000) setBudget(5000000);
                    }}
                    placeholder="Nhập số tiền ngân sách (Ví dụ: 5.000.000...)"
                    style={{
                      width: '100%',
                      padding: '0.85rem 3.5rem 0.85rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid #D1D5DB',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      color: '#111827',
                      background: '#FFFFFF',
                      transition: 'border 0.2s'
                    }}
                    required
                  />
                  <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#00A699', fontSize: '0.9rem' }}>
                    VNĐ
                  </span>
                </div>
              </div>

            </div>

            {/* 5. Đối tượng & 6. Phong cách du lịch */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem', marginBottom: '1.75rem' }}>
              
              {/* Đối tượng */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.6rem', color: '#111827' }}>
                  5. Bạn đi cùng ai?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  {GROUP_TYPES.map(g => (
                    <div
                      key={g.id}
                      onClick={() => setGroupType(g.label)}
                      style={{
                        padding: '0.85rem',
                        borderRadius: '12px',
                        border: `2px solid ${groupType === g.label ? 'var(--brand-navy)' : '#E5E7EB'}`,
                        background: groupType === g.label ? '#EFF6FF' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: groupType === g.label ? 'var(--brand-navy)' : '#111827' }}>
                        {g.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#4B5563', marginTop: '2px' }}>
                        {g.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phong cách */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.6rem', color: '#111827' }}>
                  6. Phong cách du lịch ưu thích:
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
                          padding: '0.55rem 0.95rem',
                          borderRadius: '25px',
                          border: `1px solid ${isSelected ? 'var(--brand-navy)' : '#E5E7EB'}`,
                          background: isSelected ? 'var(--brand-navy)' : '#F9FAFB',
                          color: isSelected ? '#FFFFFF' : '#374151',
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
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

            {/* 7. Yêu cầu chi tiết dạng văn bản */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.6rem', color: '#111827' }}>
                7. Yêu cầu đặc biệt bổ sung:
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
                  border: '1px solid #D1D5DB',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  color: '#111827',
                  background: '#FFFFFF',
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
                  background: 'linear-gradient(135deg, #E11D48 0%, #DC2626 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '1.1rem 3.5rem',
                  borderRadius: '35px',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 6px 20px rgba(225, 29, 72, 0.35)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.2s',
                  transform: loading ? 'scale(0.98)' : 'scale(1)'
                }}
                onMouseEnter={e => { 
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(225, 29, 72, 0.45)';
                  }
                }}
                onMouseLeave={e => { 
                  if (!loading) {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(225, 29, 72, 0.35)';
                  }
                }}
              >
                <span>{loading ? 'Hệ Thống Đang Lập Kế Hoạch...' : 'Khởi Tạo Kế Hoạch Du Lịch'}</span>
              </button>
            </div>
          </form>

          {/* LOADING STATE ANIMATION */}
          {loading && (
            <div style={{
              marginTop: '2.5rem',
              padding: '2rem',
              borderRadius: '16px',
              background: '#F0FDFA',
              border: '1px dashed #5EEAD4',
              textAlign: 'center'
            }}>
              <div style={{
                width: '45px',
                height: '45px',
                border: '3px solid #CCFBF1',
                borderTopColor: '#00A699',
                borderRadius: '50%',
                margin: '0 auto 1.25rem',
                animation: 'spin 0.8s linear infinite'
              }} />
              <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              `}</style>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0F766E' }}>
                {loadingStep === 1 && 'Đang phân tích yêu cầu & đặc điểm điểm đến...'}
                {loadingStep === 2 && 'Đang tính toán ngân sách & tối ưu khoảng cách...'}
                {loadingStep === 3 && 'Đang chọn lọc nơi lưu trú & món ăn đặc sản...'}
                {loadingStep >= 4 && 'Đang hoàn thiện lịch trình du lịch chi tiết cho bạn...'}
              </h3>
              <p style={{ color: '#0D9488', fontSize: '0.9rem' }}>
                Hệ thống đang đối sánh sở thích với hàng trăm địa điểm du lịch thực tế tại {destination}...
              </p>
            </div>
          )}
        </div>

        {/* RESULTS SECTION */}
        {planResult && (
          <div id="itinerary-results" style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
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
              borderBottom: '1px solid #E5E7EB',
              marginBottom: '2rem'
            }}>
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#F0FDFA',
                  color: '#00A699',
                  border: '1px solid #99F6E4',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem'
                }}>
                  KẾ HOẠCH ĐÃ HOÀN TẤT VÀ TỐI ƯU HOÁ
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                  {planResult.title}
                </h2>
                <p style={{ color: '#4B5563', fontSize: '1.05rem', maxWidth: '780px', lineHeight: 1.6 }}>
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
                    background: '#FFFFFF',
                    color: '#111827',
                    border: '1px solid #D1D5DB',
                    padding: '0.65rem 1.1rem',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Đã sao chép!' : 'Sao chép'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: '#FFFFFF',
                    color: '#111827',
                    border: '1px solid #D1D5DB',
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
                    background: '#F0FDFA',
                    color: '#00A699',
                    border: '1px solid #99F6E4',
                    padding: '0.65rem 1.1rem',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#CCFBF1'}
                  onMouseLeave={e => e.currentTarget.style.background = '#F0FDFA'}
                >
                  <RotateCcw size={16} />
                  <span>Đổi tiêu chí</span>
                </button>
              </div>
            </div>



            {/* QUICK STATS CARDS - Bỏ 2 ô "Gợi ý nơi ở" và "Ẩm thực đặc sản", chữ màu đen */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{ background: '#F9FAFB', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                <div style={{ color: '#4B5563', fontSize: '0.85rem', fontWeight: 600 }}>
                  {planResult.startLocation ? 'Lộ trình di chuyển' : 'Điểm đến'}
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', marginTop: '0.4rem', wordBreak: 'break-word' }}>
                  {planResult.startLocation ? `${planResult.startLocation} ➔ ${planResult.destination}` : planResult.destination}
                </div>
              </div>

              <div style={{ background: '#F9FAFB', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                <div style={{ color: '#4B5563', fontSize: '0.85rem', fontWeight: 600 }}>Thời lượng</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', marginTop: '0.4rem' }}>
                  {planResult.days} Ngày ({planResult.days > 1 ? `${planResult.days - 1} Đêm` : 'Trong ngày'})
                </div>
              </div>

              <div style={{ background: '#F9FAFB', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                <div style={{ color: '#4B5563', fontSize: '0.85rem', fontWeight: 600 }}>Tổng ngân sách</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', marginTop: '0.4rem' }}>
                  {planResult.budget?.toLocaleString('vi-VN')} đ
                </div>
              </div>

              <div style={{ background: '#F9FAFB', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                <div style={{ color: '#4B5563', fontSize: '0.85rem', fontWeight: 600 }}>Đối tượng</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', marginTop: '0.4rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {planResult.groupType || groupType}
                </div>
              </div>
            </div>

            {/* NAVIGATION TABS */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              borderBottom: '2px solid #E5E7EB',
              marginBottom: '2rem',
              overflowX: 'auto',
              paddingBottom: '2px'
            }}>
              {[
                { id: 'timeline', label: `Lịch Trình Từng Ngày (${planResult.dailyItinerary?.length || 0})` },
                { id: 'stay', label: `Ở Đâu (${planResult.accommodations?.length || 0})` },
                { id: 'food', label: `Ăn Gì (${planResult.culinary?.length || 0})` },
                { id: 'budget', label: 'Dự Toán Chi Phí' },
                { id: 'tips', label: 'Mẹo & Cẩm Nang' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '0.85rem 1.5rem',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '3px solid #00A699' : '3px solid transparent',
                    background: 'none',
                    color: activeTab === tab.id ? '#00A699' : '#6B7280',
                    fontWeight: activeTab === tab.id ? 700 : 500,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s'
                  }}
                >
                  {tab.label}
                </button>
              ))}
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
                        border: activeDay === d.day ? '1px solid #00A699' : '1px solid #E5E7EB',
                        background: activeDay === d.day ? '#00A699' : '#FFFFFF',
                        color: activeDay === d.day ? '#FFFFFF' : '#111827',
                        fontWeight: activeDay === d.day ? 700 : 600,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        boxShadow: activeDay === d.day ? '0 4px 12px rgba(0, 166, 153, 0.25)' : 'none',
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
                      border: activeDay === 'all' ? '1px solid #00A699' : '1px solid #E5E7EB',
                      background: activeDay === 'all' ? '#00A699' : '#FFFFFF',
                      color: activeDay === 'all' ? '#FFFFFF' : '#111827',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      boxShadow: activeDay === 'all' ? '0 4px 12px rgba(0, 166, 153, 0.25)' : 'none',
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
                        background: '#F9FAFB',
                        borderRadius: '20px',
                        padding: '1.75rem',
                        marginBottom: '2rem',
                        border: '1px solid #E5E7EB'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '1.5rem',
                        paddingBottom: '1rem',
                        borderBottom: '1px solid #E5E7EB'
                      }}>
                        <div style={{
                          background: '#00A699',
                          color: '#FFFFFF',
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '1rem'
                        }}>
                          {dayItem.day}
                        </div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827' }}>
                          {dayItem.title}
                        </h3>
                      </div>

                      {/* 3 Periods: Morning, Afternoon, Evening */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                        
                        {/* Morning */}
                        <div style={{
                          background: '#FFFFFF',
                          borderRadius: '16px',
                          padding: '1.4rem',
                          border: '1px solid #E5E7EB',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                        }}>
                          <div style={{ color: '#111827', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.85rem' }}>
                            Buổi Sáng
                          </div>
                          <div style={{ marginBottom: '0.75rem' }}>
                            <strong style={{ fontSize: '0.85rem', color: '#4B5563', textTransform: 'uppercase' }}>Hoạt động chính:</strong>
                            <p style={{ color: '#111827', marginTop: '3px', fontWeight: 600 }}>{dayItem.morning?.activity}</p>
                          </div>
                          <div style={{ marginBottom: '0.75rem' }}>
                            <strong style={{ fontSize: '0.85rem', color: '#4B5563', textTransform: 'uppercase' }}>Ăn sáng gợi ý:</strong>
                            <p style={{ color: '#111827', marginTop: '3px' }}>{dayItem.morning?.food}</p>
                          </div>
                          {dayItem.morning?.tips && (
                            <div style={{ background: '#F0FDFA', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', color: '#0F766E', marginTop: '0.5rem', border: '1px solid #CCFBF1' }}>
                              <strong>Mẹo:</strong> {dayItem.morning.tips}
                            </div>
                          )}
                        </div>

                        {/* Afternoon */}
                        <div style={{
                          background: '#FFFFFF',
                          borderRadius: '16px',
                          padding: '1.4rem',
                          border: '1px solid #E5E7EB',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                        }}>
                          <div style={{ color: '#111827', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.85rem' }}>
                            Buổi Chiều
                          </div>
                          <div style={{ marginBottom: '0.75rem' }}>
                            <strong style={{ fontSize: '0.85rem', color: '#4B5563', textTransform: 'uppercase' }}>Hoạt động chính:</strong>
                            <p style={{ color: '#111827', marginTop: '3px', fontWeight: 600 }}>{dayItem.afternoon?.activity}</p>
                          </div>
                          <div style={{ marginBottom: '0.75rem' }}>
                            <strong style={{ fontSize: '0.85rem', color: '#4B5563', textTransform: 'uppercase' }}>Bữa trưa & xế:</strong>
                            <p style={{ color: '#111827', marginTop: '3px' }}>{dayItem.afternoon?.food}</p>
                          </div>
                          {dayItem.afternoon?.tips && (
                            <div style={{ background: '#F0FDFA', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', color: '#0F766E', marginTop: '0.5rem', border: '1px solid #CCFBF1' }}>
                              <strong>Mẹo:</strong> {dayItem.afternoon.tips}
                            </div>
                          )}
                        </div>

                        {/* Evening */}
                        <div style={{
                          background: '#FFFFFF',
                          borderRadius: '16px',
                          padding: '1.4rem',
                          border: '1px solid #E5E7EB',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                        }}>
                          <div style={{ color: '#111827', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.85rem' }}>
                            Buổi Tối
                          </div>
                          <div style={{ marginBottom: '0.75rem' }}>
                            <strong style={{ fontSize: '0.85rem', color: '#4B5563', textTransform: 'uppercase' }}>Hoạt động đêm:</strong>
                            <p style={{ color: '#111827', marginTop: '3px', fontWeight: 600 }}>{dayItem.evening?.activity}</p>
                          </div>
                          <div style={{ marginBottom: '0.75rem' }}>
                            <strong style={{ fontSize: '0.85rem', color: '#4B5563', textTransform: 'uppercase' }}>Bữa tối đặc sản:</strong>
                            <p style={{ color: '#111827', marginTop: '3px' }}>{dayItem.evening?.food}</p>
                          </div>
                          {dayItem.evening?.tips && (
                            <div style={{ background: '#F0FDFA', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', color: '#0F766E', marginTop: '0.5rem', border: '1px solid #CCFBF1' }}>
                              <strong>Mẹo:</strong> {dayItem.evening.tips}
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

              return (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827' }}>
                        Gợi ý Địa Điểm Lưu Trú ({allStays.length} lựa chọn)
                      </h3>
                      <p style={{ color: '#4B5563', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                        Đầy đủ phân khúc từ Resort nghỉ dưỡng, Khách sạn trung tâm, Căn hộ đến Homestay bản địa
                      </p>
                    </div>

                    {/* Search box for stay */}
                    <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                      <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
                      <input 
                        type="text"
                        value={staySearch}
                        onChange={(e) => setStaySearch(e.target.value)}
                        placeholder="Tìm tên khách sạn, khu vực..."
                        style={{
                          width: '100%',
                          padding: '0.65rem 1rem 0.65rem 2.4rem',
                          borderRadius: '12px',
                          border: '1px solid #D1D5DB',
                          background: '#FFFFFF',
                          fontSize: '0.9rem',
                          outline: 'none',
                          color: '#111827'
                        }}
                      />
                      {staySearch && (
                        <button 
                          onClick={() => setStaySearch('')} 
                          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#6B7280' }}
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
                      { id: 'resort', label: 'Resort nghỉ dưỡng' },
                      { id: 'hotel', label: 'Khách sạn' },
                      { id: 'homestay', label: 'Homestay bản địa' },
                      { id: 'apartment', label: 'Căn hộ / Villa' },
                      { id: 'hostel', label: 'Hostel tiết kiệm' }
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setStayCategory(f.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          border: stayCategory === f.id ? '2px solid #00A699' : '1px solid #E5E7EB',
                          background: stayCategory === f.id ? '#F0FDFA' : '#FFFFFF',
                          color: stayCategory === f.id ? '#00A699' : '#111827',
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
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#F9FAFB', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                      <p style={{ color: '#4B5563', marginBottom: '1rem' }}>Không tìm thấy nơi lưu trú nào phù hợp với bộ lọc hiện tại.</p>
                      <button 
                        type="button" 
                        onClick={() => { setStayCategory('ALL'); setStaySearch(''); }}
                        style={{ padding: '0.5rem 1.2rem', borderRadius: '10px', border: 'none', background: '#00A699', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Xóa bộ lọc
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                      {filteredStays.map((hotel, idx) => {
                        const mapsQuery = encodeURIComponent(`${hotel.name} ${hotel.area || ''} ${planResult.destination}`);
                        const bookingQuery = encodeURIComponent(`đặt phòng ${hotel.name} ${planResult.destination}`);

                        return (
                          <div 
                            key={idx}
                            style={{
                              background: '#F9FAFB',
                              padding: '1.6rem',
                              borderRadius: '20px',
                              border: '1px solid #E5E7EB',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                              transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <div style={{
                                  background: '#F0FDFA',
                                  color: '#00A699',
                                  padding: '0.25rem 0.8rem',
                                  borderRadius: '20px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  letterSpacing: '0.3px',
                                  border: '1px solid #99F6E4'
                                }}>
                                  {hotel.type || 'Lưu trú'}
                                </div>
                                <span style={{
                                  background: '#F3F4F6',
                                  color: '#374151',
                                  fontSize: '0.85rem',
                                  fontWeight: 700,
                                  padding: '0.2rem 0.6rem',
                                  borderRadius: '8px'
                                }}>
                                  Lựa chọn #{idx + 1}
                                </span>
                              </div>

                              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                                {hotel.name}
                              </h4>

                              <div style={{
                                display: 'inline-block',
                                background: '#F0FDFA',
                                border: '1px solid #99F6E4',
                                color: '#00A699',
                                fontWeight: 800,
                                fontSize: '1.05rem',
                                padding: '0.35rem 0.8rem',
                                borderRadius: '10px',
                                marginBottom: '0.85rem'
                              }}>
                                {hotel.priceRange}
                              </div>

                              <p style={{ color: '#374151', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                                <strong>Khu vực:</strong> {hotel.area}
                              </p>

                              <div style={{ color: '#111827', fontSize: '0.92rem', background: '#FFFFFF', padding: '0.85rem', borderRadius: '12px', border: '1px solid #E5E7EB', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                                <div style={{ fontWeight: 700, color: '#111827', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                                  Điểm nổi bật & Tiện ích:
                                </div>
                                {hotel.highlights}
                              </div>
                            </div>

                            {/* Action links */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', paddingTop: '0.75rem', borderTop: '1px solid #E5E7EB' }}>
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
                                  background: '#FFFFFF',
                                  border: '1px solid #D1D5DB',
                                  color: '#111827',
                                  fontSize: '0.85rem',
                                  fontWeight: 600,
                                  textDecoration: 'none'
                                }}
                              >
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
                                  background: '#00A699',
                                  border: '1px solid #00A699',
                                  color: '#FFFFFF',
                                  fontSize: '0.85rem',
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                  boxShadow: '0 2px 8px rgba(0, 166, 153, 0.25)'
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

              return (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827' }}>
                        Danh sách Món ngon & Quán ăn đặc sản ({allFoods.length} món)
                      </h3>
                      <p style={{ color: '#4B5563', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                        Các món ăn trứ danh địa phương kèm địa chỉ quán chuẩn vị lâu đời nhất
                      </p>
                    </div>

                    {/* Search box for food */}
                    <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                      <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
                      <input 
                        type="text"
                        value={foodSearch}
                        onChange={(e) => setFoodSearch(e.target.value)}
                        placeholder="Tìm món ngon, tên quán, địa chỉ..."
                        style={{
                          width: '100%',
                          padding: '0.65rem 1rem 0.65rem 2.4rem',
                          borderRadius: '12px',
                          border: '1px solid #D1D5DB',
                          background: '#FFFFFF',
                          fontSize: '0.9rem',
                          outline: 'none',
                          color: '#111827'
                        }}
                      />
                      {foodSearch && (
                        <button 
                          onClick={() => setFoodSearch('')} 
                          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#6B7280' }}
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
                      { id: 'main', label: 'Món chính truyền thống' },
                      { id: 'noodle', label: 'Món nước & Phở / Bún' },
                      { id: 'seafood', label: 'Hải sản & Đồ nướng' },
                      { id: 'snack', label: 'Ăn vặt & Tráng miệng' },
                      { id: 'drink', label: 'Cà phê & Thức uống' }
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFoodCategory(f.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          border: foodCategory === f.id ? '2px solid #00A699' : '1px solid #E5E7EB',
                          background: foodCategory === f.id ? '#F0FDFA' : '#FFFFFF',
                          color: foodCategory === f.id ? '#00A699' : '#111827',
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
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#F9FAFB', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                      <p style={{ color: '#4B5563', marginBottom: '1rem' }}>Không tìm thấy món ăn nào phù hợp với từ khóa.</p>
                      <button 
                        type="button" 
                        onClick={() => { setFoodCategory('ALL'); setFoodSearch(''); }}
                        style={{ padding: '0.5rem 1.2rem', borderRadius: '10px', border: 'none', background: '#00A699', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Xóa bộ lọc
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                      {filteredFoods.map((food, idx) => {
                        const firstPlace = (food.places || food.recommendedPlaces || '').split(',')[0];
                        const mapQuery = encodeURIComponent(`${food.dish} ${firstPlace} ${planResult.destination}`);

                        return (
                          <div 
                            key={idx}
                            style={{
                              background: '#F9FAFB',
                              padding: '1.5rem',
                              borderRadius: '18px',
                              border: '1px solid #E5E7EB',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                              transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                                <span style={{
                                  background: '#F0FDFA',
                                  color: '#00A699',
                                  border: '1px solid #99F6E4',
                                  padding: '0.2rem 0.65rem',
                                  borderRadius: '12px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700
                                }}>
                                  {food.category || 'Ẩm thực'}
                                </span>

                                <span style={{
                                  background: '#FFFFFF',
                                  color: '#111827',
                                  border: '1px solid #D1D5DB',
                                  padding: '0.25rem 0.7rem',
                                  borderRadius: '20px',
                                  fontSize: '0.8rem',
                                  fontWeight: 700
                                }}>
                                  {food.cost || food.estimatedCost}
                                </span>
                              </div>

                              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                                {food.dish}
                              </h4>

                              <p style={{ color: '#4B5563', fontSize: '0.92rem', marginBottom: '1rem', lineHeight: 1.5, background: '#FFFFFF', padding: '0.75rem', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                                <strong style={{ color: '#111827', display: 'block', marginBottom: '0.2rem' }}>
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
                                background: '#F0FDFA',
                                border: '1px solid #99F6E4',
                                color: '#00A699',
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

            {/* TAB CONTENT 4: DỰ TOÁN CHI PHÍ */}
            {activeTab === 'budget' && (
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.75rem', color: '#111827' }}>
                  Bảng Phân Bổ Chi Phí Dự Toán Theo Ngân Sách
                </h3>
                <p style={{ color: '#4B5563', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  Tổng ngân sách mục tiêu: <strong>{planResult.budget?.toLocaleString('vi-VN')} VNĐ</strong>. Dưới đây là tỷ lệ phân bổ chi phí khoa học được đề xuất:
                </p>

                {planResult.budgetBreakdown && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem'
                  }}>
                    <div style={{ background: '#F9FAFB', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                      <div style={{ fontSize: '0.85rem', color: '#4B5563', fontWeight: 600 }}>Lưu trú (Khách sạn)</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', marginTop: '0.4rem' }}>
                        {planResult.budgetBreakdown.accommodation?.toLocaleString('vi-VN')} đ
                      </div>
                    </div>

                    <div style={{ background: '#F9FAFB', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                      <div style={{ fontSize: '0.85rem', color: '#4B5563', fontWeight: 600 }}>Ăn uống ẩm thực</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', marginTop: '0.4rem' }}>
                        {planResult.budgetBreakdown.food?.toLocaleString('vi-VN')} đ
                      </div>
                    </div>

                    <div style={{ background: '#F9FAFB', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                      <div style={{ fontSize: '0.85rem', color: '#4B5563', fontWeight: 600 }}>Vé tham quan & vui chơi</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', marginTop: '0.4rem' }}>
                        {planResult.budgetBreakdown.sightseeing?.toLocaleString('vi-VN')} đ
                      </div>
                    </div>

                    <div style={{ background: '#F9FAFB', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                      <div style={{ fontSize: '0.85rem', color: '#4B5563', fontWeight: 600 }}>Di chuyển tại chỗ</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', marginTop: '0.4rem' }}>
                        {planResult.budgetBreakdown.transportation?.toLocaleString('vi-VN')} đ
                      </div>
                    </div>

                    <div style={{ background: '#F9FAFB', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                      <div style={{ fontSize: '0.85rem', color: '#4B5563', fontWeight: 600 }}>Quỹ dự phòng & mua sắm</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', marginTop: '0.4rem' }}>
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
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem', color: '#111827' }}>
                  Lời Khuyên & Cẩm Nang Thực Tế Cho Chuyến Đi
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {planResult.travelTips?.map((tip, idx) => (
                    <div 
                      key={idx}
                      style={{
                        background: '#F0FDFA',
                        padding: '1.2rem 1.5rem',
                        borderRadius: '16px',
                        border: '1px solid #CCFBF1',
                        borderLeft: '4px solid #00A699',
                        fontSize: '1rem',
                        color: '#111827',
                        lineHeight: 1.5
                      }}
                    >
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
