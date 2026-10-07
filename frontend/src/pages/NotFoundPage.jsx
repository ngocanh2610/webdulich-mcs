import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ 
        fontSize: '8rem', 
        fontWeight: 800, 
        background: 'var(--accent-gradient)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '1rem',
        lineHeight: 1
      }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Không tìm thấy trang</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px' }}>
        Trang bạn đang tìm kiếm có thể đã bị xóa, thay đổi tên hoặc tạm thời không thể truy cập.
      </p>
      <Link to="/" className="btn-primary">
        <Home size={18} /> Về Trang Chủ
      </Link>
    </div>
  );
};

export default NotFoundPage;
