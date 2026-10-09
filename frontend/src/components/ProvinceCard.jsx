import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Compass, ArrowRight } from 'lucide-react';

const ProvinceCard = ({ province }) => {
  return (
    <Link to={`/provinces/${province.slug}`} style={{ color: 'inherit', display: 'block', textDecoration: 'none' }}>
      <div 
        className="card" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          overflow: 'hidden',
          height: '100%',
          boxShadow: '0 4px 16px rgba(2, 50, 106, 0.06)',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Thumbnail Image Container */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', overflow: 'hidden', background: '#F1F5F9' }}>
          <img 
            src={province.image || 'https://images.unsplash.com/photo-1599708153386-62bf0bd17b43?w=800&q=80'} 
            alt={province.name}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transition: 'transform 0.6s ease'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1599708153386-62bf0bd17b43?w=800&q=80'; }}
          />

          {/* Region Badge (Top Left) */}
          <div style={{
            position: 'absolute',
            top: '0.85rem',
            left: '0.85rem',
            background: 'rgba(2, 50, 106, 0.85)',
            backdropFilter: 'blur(6px)',
            padding: '0.25rem 0.65rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            borderRadius: '6px',
            color: '#FFFFFF',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <MapPin size={11} color="#38BDF8" />
            {province.region}
          </div>

          {/* Location Count Badge (Top Right) */}
          {province.locationCount !== undefined && (
            <div style={{
              position: 'absolute',
              top: '0.85rem',
              right: '0.85rem',
              background: '#FFFFFF',
              padding: '0.25rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: 800,
              borderRadius: '6px',
              color: 'var(--brand-navy)',
              boxShadow: '0 2px 8px rgba(2, 50, 106, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              border: '1px solid #E2E8F0'
            }}>
              <span>{province.locationCount} điểm đến</span>
            </div>
          )}
        </div>
        
        {/* Card Body */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h3 style={{ 
            fontSize: '1.2rem', 
            fontWeight: 800,
            color: 'var(--brand-navy)',
            marginBottom: '0.4rem',
            lineHeight: 1.3
          }}>
            {province.name}
          </h3>

          <p style={{ 
            color: '#475569', 
            fontSize: '0.875rem', 
            lineHeight: 1.55,
            fontWeight: 400,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            marginBottom: '1rem',
            flex: 1
          }}>
            {province.description || 'Khám phá các danh lam thắng cảnh, di tích lịch sử và văn hóa độc đáo.'}
          </p>

          {/* Card Footer */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderTop: '1px solid #F1F5F9',
            paddingTop: '0.85rem',
            marginTop: 'auto'
          }}>
            <span style={{ fontSize: '0.775rem', color: '#64748B', fontWeight: 600 }}>
              {province.capital ? `Thủ phủ: ${province.capital}` : 'Việt Nam'}
            </span>
            <span style={{ 
              color: 'var(--brand-red)', 
              fontSize: '0.825rem', 
              fontWeight: 700, 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.25rem' 
            }}>
              Khám phá <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProvinceCard;
