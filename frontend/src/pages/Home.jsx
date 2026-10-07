import React from 'react';
import HeroSection from '../components/HeroSection';
import ModeSelector from '../components/ModeSelector';

const Home = () => {
  return (
    <div>
      <HeroSection />
      
      <section style={{ padding: '0 0 5rem 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <ModeSelector />
          
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <h3 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Khám Phá Vẻ Đẹp Việt Nam</h3>
            <p style={{ 
              color: 'var(--text-secondary)', 
              maxWidth: '800px', 
              margin: '0 auto',
              fontSize: '1.125rem',
              lineHeight: 1.8
            }}>
              Việt Nam là một quốc gia tuyệt đẹp với bề dày lịch sử, văn hóa đa dạng và thiên nhiên hùng vĩ. 
              Từ những thửa ruộng bậc thang trải dài ở miền núi phía Bắc, dải bờ biển xanh ngát miền Trung, 
              cho đến vùng đồng bằng sông nước trù phú ở miền Nam. Hãy cùng <strong style={{ color: 'var(--text-primary)' }}>VietnamTourism</strong> bắt đầu hành trình khám phá 
              những danh lam thắng cảnh độc đáo trên khắp 63 tỉnh thành của dải đất hình chữ S.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
