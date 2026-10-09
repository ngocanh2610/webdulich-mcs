import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Layers, Map, CheckCircle2, Info } from 'lucide-react';

const ModeSelector = () => {
  const { mode, setMode } = useAppContext();

  return (
    <div className="glass-panel" style={{ 
      padding: '2.5rem 2rem', 
      textAlign: 'center',
      maxWidth: '880px',
      margin: '0 auto',
      transform: 'translateY(-35px)',
      boxShadow: '0 12px 32px rgba(2, 50, 106, 0.1)',
      border: '1px solid #E2E8F0',
      background: '#FFFFFF'
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        color: 'var(--brand-navy)',
        fontWeight: 700,
        fontSize: '0.85rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '0.5rem',
        background: '#EFF6FF',
        padding: '0.35rem 0.9rem',
        borderRadius: '20px'
      }}>
        <Info size={15} />
        <span>Tùy Chọn Bản Đồ Địa Giới</span>
      </div>

      <h2 style={{ fontSize: '1.85rem', marginBottom: '0.75rem', color: 'var(--brand-navy)', fontWeight: 800 }}>
        Chế Độ Bản Đồ Hành Chính
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '680px', margin: '0 auto 2rem auto', fontSize: '0.975rem', lineHeight: 1.6 }}>
        Hệ thống hỗ trợ tra cứu các tỉnh thành Việt Nam theo 2 cấu hình địa giới hành chính, 
        giúp bạn đối chiếu quy mô các địa phương trước và sau đề án sáp nhập không gian phát triển mới.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {/* Mode 63 */}
        <div 
          onClick={() => setMode('63')}
          style={{ 
            padding: '1.75rem', 
            borderRadius: '16px',
            border: `2px solid ${mode === '63' ? 'var(--brand-navy)' : '#E2E8F0'}`,
            background: mode === '63' ? '#F0F7FF' : '#FFFFFF',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            position: 'relative',
            textAlign: 'left',
            boxShadow: mode === '63' ? '0 8px 24px rgba(2, 50, 106, 0.12)' : 'none'
          }}
        >
          {mode === '63' && (
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--brand-navy)' }}>
              <CheckCircle2 size={22} fill="var(--brand-navy)" color="white" />
            </div>
          )}
          <div style={{ 
            width: '52px', height: '52px', borderRadius: '12px', 
            background: mode === '63' ? 'var(--brand-navy)' : '#F1F5F9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1rem',
            color: mode === '63' ? 'white' : '#64748B'
          }}>
            <Map size={26} />
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>
            HIỆN HÀNH TIÊU CHUẨN
          </div>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: 'var(--brand-navy)', fontWeight: 800 }}>
            63 Tỉnh Thành
          </h3>
          <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.5 }}>
            Bản đồ địa giới hành chính chính thức hiện nay với đầy đủ 63 đơn vị tỉnh, thành phố trực thuộc Trung ương.
          </p>
        </div>

        {/* Mode 34 */}
        <div 
          onClick={() => setMode('34')}
          style={{ 
            padding: '1.75rem', 
            borderRadius: '16px',
            border: `2px solid ${mode === '34' ? 'var(--brand-red)' : '#E2E8F0'}`,
            background: mode === '34' ? '#FFF1F2' : '#FFFFFF',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            position: 'relative',
            textAlign: 'left',
            boxShadow: mode === '34' ? '0 8px 24px rgba(225, 29, 72, 0.12)' : 'none'
          }}
        >
          {mode === '34' && (
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--brand-red)' }}>
              <CheckCircle2 size={22} fill="var(--brand-red)" color="white" />
            </div>
          )}
          <div style={{ 
            width: '52px', height: '52px', borderRadius: '12px', 
            background: mode === '34' ? 'var(--brand-red)' : '#F1F5F9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1rem',
            color: mode === '34' ? 'white' : '#64748B'
          }}>
            <Layers size={26} />
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-red)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>
            ĐỀ ÁN QUY HOẠCH 2025
          </div>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: 'var(--brand-navy)', fontWeight: 800 }}>
            34 Tỉnh Thành
          </h3>
          <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.5 }}>
            Cấu hình mở rộng không gian phát triển theo định hướng sáp nhập các địa phương lân cận có tương đồng văn hóa & kinh tế.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;
