import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const HeroSection = () => {
  const navigate = useNavigate();
  const { mode } = useAppContext();

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '80px',
      overflow: 'hidden'
    }}>
      {/* Background Image & Overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'url("https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=90")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        zIndex: -2
      }} />
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0, 0, 0, 0.4)',
        zIndex: -1
      }} />

      <div className="container animate-fade-in" style={{ zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ maxWidth: '1000px' }}>
          
          <h1 style={{ 
            fontSize: '5.5rem', 
            marginBottom: '1rem',
            lineHeight: 1.1,
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-2px'
          }}>
            Vẻ đẹp vượt thời gian
          </h1>
          
          <p style={{ 
            fontSize: '1.25rem', 
            color: 'rgba(255,255,255,0.95)',
            marginBottom: '3rem',
            fontWeight: 500,
            maxWidth: '600px',
            margin: '0 auto 3rem auto',
            lineHeight: 1.8
          }}>
            Trải nghiệm hành trình dọc miền đất nước, từ những ruộng bậc thang Tây Bắc mờ sương 
            đến những bãi biển miền Trung đầy nắng và sông nước miền Tây hiền hòa.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => navigate('/provinces')} style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              Khám Phá Ngay
            </button>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div style={{ 
        position: 'absolute', 
        bottom: '2rem', 
        left: '50%', 
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'var(--text-muted)'
      }}>
        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Cuộn xuống</span>
        <div style={{ 
          width: '1px', 
          height: '40px', 
          background: 'linear-gradient(to bottom, var(--text-muted), transparent)' 
        }} />
      </div>
    </div>
  );
};

export default HeroSection;
