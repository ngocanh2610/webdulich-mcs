import React from 'react';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LocationCard = ({ location }) => {
  return (
    <Link to={`/locations/${location.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
      <div 
        className="card"
        style={{
          cursor: 'pointer',
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
        <div 
          style={{ 
            position: 'relative', 
            width: '100%',
            aspectRatio: '16/11',
            overflow: 'hidden',
            background: '#F1F5F9'
          }}
        >
          <img 
            src={location.images && location.images.length > 0 
              ? location.images[0] 
              : (location.image || 'https://images.unsplash.com/photo-1599708153386-62bf0bd17b43?w=800&q=80')} 
            alt={location.name} 
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

          {/* Golden Star Rating Badge (Top Right) */}
          <div style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            background: '#FFFFFF',
            padding: '0.25rem 0.6rem',
            fontSize: '0.8rem',
            fontWeight: 800,
            borderRadius: '8px',
            color: '#B45309',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            border: '1px solid #FEF3C7'
          }}>
            <Star size={13} fill="#F59E0B" color="#F59E0B" />
            <span>{location.rating || '4.8'}</span>
          </div>

          {/* Category / Status Tag (Top Left) */}
          {location.category && (
            <div style={{
              position: 'absolute',
              top: '0.75rem',
              left: '0.75rem',
              background: 'rgba(2, 50, 106, 0.85)',
              backdropFilter: 'blur(6px)',
              padding: '0.25rem 0.6rem',
              fontSize: '0.7rem',
              fontWeight: 700,
              borderRadius: '6px',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: '0.4px'
            }}>
              {location.category}
            </div>
          )}
        </div>

        {/* Card Body */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: 800,
            marginBottom: '0.4rem',
            color: 'var(--brand-navy)',
            lineHeight: 1.35
          }}>
            {location.name}
          </h3>
          
          <p style={{ 
            color: '#475569',
            fontSize: '0.85rem',
            fontWeight: 400,
            marginBottom: '0.85rem',
            lineHeight: 1.55,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1
          }}>
            {location.description}
          </p>
          
          {/* Address & Explore Footer */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: '0.5rem',
            borderTop: '1px solid #F1F5F9',
            paddingTop: '0.85rem',
            marginTop: 'auto'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.35rem',
              fontSize: '0.775rem', 
              color: '#64748B',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              <MapPin size={13} color="var(--brand-navy)" style={{ flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {location.address || 'Việt Nam'}
              </span>
            </div>

            <span style={{ 
              color: 'var(--brand-red)', 
              fontSize: '0.825rem', 
              fontWeight: 700, 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.2rem',
              flexShrink: 0
            }}>
              Chi tiết <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LocationCard;
