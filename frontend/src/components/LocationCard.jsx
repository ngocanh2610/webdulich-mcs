import React from 'react';
import { MapPin, Star } from 'lucide-react';

import { Link } from 'react-router-dom';

const LocationCard = ({ location }) => {
  return (
    <Link to={`/locations/${location.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div 
        className="card"
        style={{
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          background: 'transparent',
          border: 'none',
          height: '100%',
          transition: 'all 0.3s ease'
        }}
      >
      <div 
        style={{ 
          position: 'relative', 
          width: '100%',
          aspectRatio: '1/1',
          overflow: 'hidden',
          borderRadius: '12px'
        }}
      >
        <img 
          src={location.images && location.images.length > 0 
            ? location.images[0] 
            : 'https://images.unsplash.com/photo-1599708153386-62bf0bd17b43?w=800&q=80'} 
          alt={location.name} 
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
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: '#FFFFFF',
          padding: '0.25rem 0.5rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          borderRadius: '6px',
          color: '#111',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Star size={14} fill="var(--text-primary)" color="var(--text-primary)" />
          {location.rating || '4.5'}
        </div>
      </div>

      <div style={{ paddingTop: '1rem', paddingBottom: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ 
          fontSize: '1rem', 
          fontWeight: 700,
          marginBottom: '0.25rem',
          color: 'var(--text-primary)'
        }}>
          {location.name}
        </h3>
        
        <p style={{ 
          color: 'var(--text-secondary)',
          fontSize: '0.875rem',
          fontWeight: 500,
          marginBottom: '0.5rem',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1
        }}>
          {location.description}
        </p>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          fontSize: '0.75rem', 
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginTop: 'auto'
        }}>
          <MapPin size={12} />
          {location.address}
        </div>
      </div>
      </div>
    </Link>
  );
};

export default LocationCard;
