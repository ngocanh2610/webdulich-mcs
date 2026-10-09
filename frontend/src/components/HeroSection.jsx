import React, { useState } from 'react';
import { Search, MapPin, Compass, ShieldCheck, Star, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const HeroSection = () => {
  const navigate = useNavigate();
  const { mode } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('q', searchTerm.trim());
    if (selectedRegion !== 'all') params.set('region', selectedRegion);
    navigate(`/provinces${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '88vh',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '110px',
      paddingBottom: '3.5rem',
      overflow: 'hidden',
      backgroundColor: '#011E40'
    }}>
      {/* Real Background Landscape Photo of Vietnam */}
      <img
        src="https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=90"
        alt="Việt Nam"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 40%',
          zIndex: 0
        }}
        onError={(e) => {
          // Fallback if unsplash has any network issue
          e.currentTarget.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1920&q=90';
        }}
      />

      {/* Dark Balanced Overlay - Keeps the photo clear and ensures 100% white text contrast */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(180deg, rgba(1, 30, 64, 0.6) 0%, rgba(2, 50, 106, 0.72) 65%, rgba(1, 30, 64, 0.85) 100%)',
        zIndex: 1
      }} />

      {/* Hero Content */}
      <div className="container animate-fade-in" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        
        {/* Top Tagline Badge - Basic & Clean */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          padding: '0.4rem 1.15rem',
          borderRadius: '30px',
          color: '#FFFFFF',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '1.25rem',
          letterSpacing: '0.5px'
        }}>
          <Compass size={15} color="#FFFFFF" />
          <span>KHÁM PHÁ DANH LAM THẮNG CẢNH 63 TỈNH THÀNH VIỆT NAM</span>
        </div>

        {/* Main Headline - Pure White, High Contrast, Basic & Elegant */}
        <h1 style={{ 
          fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', 
          marginBottom: '0.75rem',
          lineHeight: 1.15,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '-1px',
          maxWidth: '960px',
          textShadow: '0 3px 16px rgba(0, 0, 0, 0.75)'
        }}>
          Trọn Vẹn Vẻ Đẹp Việt Nam
        </h1>

        <div style={{
          fontSize: 'clamp(1.35rem, 2.8vw, 2.2rem)',
          fontWeight: 700,
          color: '#FFFFFF',
          marginBottom: '1.25rem',
          letterSpacing: '-0.5px',
          textShadow: '0 2px 12px rgba(0, 0, 0, 0.75)'
        }}>
          Hành Trình Khám Phá Dọc Miền Đất Nước
        </div>
        
        {/* Subtitle - Clean White/Ghi */}
        <p style={{ 
          fontSize: 'clamp(1rem, 1.7vw, 1.15rem)', 
          color: 'rgba(255, 255, 255, 0.95)',
          marginBottom: '2.5rem',
          fontWeight: 400,
          maxWidth: '750px',
          lineHeight: 1.7,
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
        }}>
          Trải nghiệm hành trình qua <strong>{mode} tỉnh thành</strong>, từ những thửa ruộng bậc thang Tây Bắc mờ sương 
          đến những bãi biển miền Trung đầy nắng và sông nước miền Tây hiền hòa.
        </p>

        {/* Commercial Search & Filter Widget */}
        <form 
          onSubmit={handleSearchSubmit}
          style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            padding: '0.85rem 1rem',
            width: '100%',
            maxWidth: '900px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)',
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            alignItems: 'center',
            marginBottom: '2.75rem'
          }}
        >
          {/* Destination Search Input */}
          <div style={{ flex: '2 1 280px', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <MapPin size={20} color="var(--brand-navy)" style={{ flexShrink: 0 }} />
            <div style={{ textAlign: 'left', width: '100%' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Điểm đến / Tỉnh thành</div>
              <input
                type="text"
                placeholder="Bạn muốn đi đâu? (Đà Nẵng, Sa Pa, Ninh Bình...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  color: '#0F172A',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  outline: 'none',
                  fontFamily: 'var(--font-body)'
                }}
              />
            </div>
          </div>

          {/* Region Selector */}
          <div style={{ flex: '1 1 180px', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <Compass size={20} color="var(--brand-navy)" style={{ flexShrink: 0 }} />
            <div style={{ textAlign: 'left', width: '100%' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Khu vực / Miền</div>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                style={{
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  color: '#0F172A',
                  fontSize: '0.925rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)'
                }}
              >
                <option value="all">Tất cả vùng miền</option>
                <option value="bac">Miền Bắc</option>
                <option value="trung">Miền Trung</option>
                <option value="nam">Miền Nam</option>
                <option value="tay">Miền Tây sông nước</option>
                <option value="taynguyen">Tây Nguyên</option>
              </select>
            </div>
          </div>

          {/* Search Button (Tím Đậm / Navy) */}
          <button 
            type="submit"
            style={{ 
              flex: '0 0 auto',
              background: 'var(--brand-navy)',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.95rem 2rem', 
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: '12px',
              minHeight: '52px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'background 0.2s ease',
              boxShadow: '0 4px 12px rgba(2, 50, 106, 0.25)'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#00478F'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--brand-navy)'}
          >
            <Search size={18} />
            <span>Tìm Điểm Đến</span>
          </button>
        </form>

        {/* 4 Trust Badges - Basic & Clean (No AI labels) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.25rem', 
          width: '100%', 
          maxWidth: '1000px' 
        }}>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(10px)', 
            padding: '1rem 1.25rem', 
            borderRadius: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(226, 232, 240, 0.8)'
          }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-navy)', flexShrink: 0 }}>
              <Compass size={20} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--brand-navy)' }}>{mode} Tỉnh Thành</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Tra cứu & thông tin chi tiết</div>
            </div>
          </div>

          <div style={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(10px)', 
            padding: '1rem 1.25rem', 
            borderRadius: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(226, 232, 240, 0.8)'
          }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-navy)', flexShrink: 0 }}>
              <Calendar size={20} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--brand-navy)' }}>Lập Kế Hoạch</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Gợi ý lịch trình thông minh</div>
            </div>
          </div>

          <div style={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(10px)', 
            padding: '1rem 1.25rem', 
            borderRadius: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(226, 232, 240, 0.8)'
          }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-navy)', flexShrink: 0 }}>
              <Star size={20} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--brand-navy)' }}>1,000+ Điểm Đến</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Đánh giá chân thực từ du khách</div>
            </div>
          </div>

          <div style={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(10px)', 
            padding: '1rem 1.25rem', 
            borderRadius: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(226, 232, 240, 0.8)'
          }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-navy)', flexShrink: 0 }}>
              <ShieldCheck size={20} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--brand-navy)' }}>Hỗ Trợ 24/7</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Tư vấn trực tuyến nhiệt tình</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
