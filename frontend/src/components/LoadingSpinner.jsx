import React from 'react';

const LoadingSpinner = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '400px',
      gap: '1rem'
    }}>
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Đang tải dữ liệu...</p>
    </div>
  );
};

export default LoadingSpinner;
