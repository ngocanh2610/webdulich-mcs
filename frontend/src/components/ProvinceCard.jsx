import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const ProvinceCard = ({ province }) => {
  return (
    <Link to={`/provinces/${province.slug}`} style={{ color: 'inherit', display: 'block', textDecoration: 'none' }}>
      <div className="card" style={{ 
        display: 'flex', 
        flexDirection: 'column',
        background: 'transparent',
        border: 'none',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden', borderRadius: '12px' }}>
          <img 
            src={province.image || 'https://images.unsplash.com/photo-1599708153386-62bf0bd17b43?w=800&q=80'} 
            alt={province.name}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transition: 'transform 0.8s ease'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1599708153386-62bf0bd17b43?w=800&q=80'; }}
          />
          {province.locationCount !== undefined && (
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: '#FFFFFF',
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              borderRadius: '6px',
              color: 'var(--accent-primary)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              {province.locationCount} địa điểm
            </div>
          )}
        </div>
        
        <div style={{ paddingTop: '1.25rem', paddingBottom: '1rem' }}>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--text-secondary)', 
            textTransform: 'uppercase', 
            letterSpacing: '1px',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <MapPin size={12} />
            {province.region}
          </div>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '0.25rem' 
          }}>
            {province.name}
          </h3>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '0.875rem', 
            lineHeight: 1.5,
            fontWeight: 500,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {province.description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProvinceCard;
