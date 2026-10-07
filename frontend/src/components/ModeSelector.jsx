import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Layers, Map } from 'lucide-react';

const ModeSelector = () => {
  const { mode, setMode } = useAppContext();

  return (
    <div className="glass-panel" style={{ 
      padding: '3rem', 
      textAlign: 'center',
      maxWidth: '800px',
      margin: '0 auto',
      transform: 'translateY(-50px)'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Chọn Chế Độ Bản Đồ Hành Chính</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
        Website hỗ trợ hiển thị danh sách các tỉnh thành phố Việt Nam theo 2 cấu hình hành chính khác nhau. 
        Việc này giúp bạn so sánh quy mô các địa phương trước và sau đề án sáp nhập.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Mode 63 */}
        <div 
          onClick={() => setMode('63')}
          style={{ 
            padding: '2rem', 
            borderRadius: '16px',
            border: `2px solid ${mode === '63' ? 'var(--accent-primary)' : 'var(--border-light)'}`,
            background: mode === '63' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.02)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <div style={{ 
            width: '60px', height: '60px', borderRadius: '50%', 
            background: mode === '63' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <Map size={30} color={mode === '63' ? 'white' : 'var(--text-muted)'} />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: mode === '63' ? 'var(--accent-primary)' : 'white' }}>
            63 Tỉnh Thành
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Bản đồ hành chính tiêu chuẩn hiện tại.
          </p>
        </div>

        {/* Mode 34 */}
        <div 
          onClick={() => setMode('34')}
          style={{ 
            padding: '2rem', 
            borderRadius: '16px',
            border: `2px solid ${mode === '34' ? 'var(--accent-secondary)' : 'var(--border-light)'}`,
            background: mode === '34' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.02)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <div style={{ 
            width: '60px', height: '60px', borderRadius: '50%', 
            background: mode === '34' ? 'var(--accent-secondary)' : 'var(--bg-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <Layers size={30} color={mode === '34' ? 'white' : 'var(--text-muted)'} />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: mode === '34' ? 'var(--accent-secondary)' : 'white' }}>
            34 Tỉnh Thành
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Cấu hình mở rộng sau đề án sáp nhập năm 2025.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;
