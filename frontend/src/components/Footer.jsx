import React from 'react';
import { Phone, Mail, User } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ 
      background: 'var(--bg-secondary)', 
      padding: '4rem 0 2rem 0',
      borderTop: '1px solid var(--border-strong)',
      marginTop: 'auto'
    }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>VietnamTourism</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          Khám phá vẻ đẹp bất tận của Việt Nam qua các danh lam thắng cảnh hùng vĩ, 
          di sản văn hóa lâu đời và những thành phố năng động trải dài từ Bắc chí Nam.
        </p>
        
        <div style={{ 
          borderTop: '1px solid var(--border-light)', 
          paddingTop: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.75rem',
          color: 'var(--text-muted)',
          fontSize: '0.875rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={16} color="var(--accent-primary)" />
            <span>Tác giả: <strong>Đoàn Ngọc Anh</strong></span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={16} color="var(--accent-secondary)" />
              <span>0816951801</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} color="var(--accent-primary)" />
              <span>doanngocanh26102005@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
