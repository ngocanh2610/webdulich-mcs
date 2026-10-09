import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import ModeSelector from '../components/ModeSelector';
import ProvinceCard from '../components/ProvinceCard';
import { useAppContext } from '../context/AppContext';
import { Sparkles, MapPin, Compass, ShieldCheck, HeartHandshake, ArrowRight, Award, Flame, Users, Calendar } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { mode, provinces, loading } = useAppContext();

  // Featured provinces (take top 6 with most locations or popular tourist spots)
  const featuredProvinces = provinces
    .slice()
    .sort((a, b) => (b.locationCount || 0) - (a.locationCount || 0))
    .slice(0, 6);

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh' }}>
      <HeroSection />
      
      {/* Mode Selector Section */}
      <section style={{ padding: '0 0 3rem 0', position: 'relative', zIndex: 20 }}>
        <div className="container">
          <ModeSelector />
        </div>
      </section>

      {/* Featured Destinations (Hot Deals / Điểm Đến Nổi Bật) */}
      <section style={{ padding: '3.5rem 0 5rem 0', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end', 
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                color: 'var(--brand-red)', 
                fontWeight: 800, 
                fontSize: '0.85rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.5px',
                marginBottom: '0.5rem'
              }}>
                <Flame size={16} color="var(--brand-red)" />
                <span>ĐIỂM ĐẾN NỔI BẬT ĐƯỢC YÊU THÍCH</span>
              </div>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--brand-navy)', letterSpacing: '-0.5px' }}>
                Khám Phá Địa Danh Hàng Đầu
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.25rem' }}>
                Những tỉnh thành sở hữu cảnh quan ngoạn mục và di sản văn hóa đặc sắc nhất dải đất hình chữ S.
              </p>
            </div>

            <Link 
              to="/provinces" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                color: 'var(--brand-navy)', 
                fontWeight: 700, 
                fontSize: '0.95rem',
                padding: '0.6rem 1.25rem',
                borderRadius: '12px',
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#DBEAFE';
                e.currentTarget.style.color = 'var(--brand-red)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#EFF6FF';
                e.currentTarget.style.color = 'var(--brand-navy)';
              }}
            >
              <span>Xem tất cả {mode} tỉnh thành</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Cards Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '2rem' 
          }}>
            {featuredProvinces.map(province => (
              <ProvinceCard key={province.id} province={province} />
            ))}
          </div>
        </div>
      </section>


      {/* Why Choose Vietnam Tourism (Vietravel Trust Section) */}
      <section style={{ padding: '5rem 0', background: '#F8FAFC' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.4rem', 
            color: 'var(--brand-navy)', 
            fontWeight: 800, 
            fontSize: '0.85rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.5px',
            marginBottom: '0.5rem'
          }}>
            <Award size={16} color="var(--brand-navy)" />
            <span>UY TÍN & CHẤT LƯỢNG HÀNG ĐẦU</span>
          </div>

          <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--brand-navy)', marginBottom: '1rem' }}>
            Tại Sao Chọn Vietnam Tourism?
          </h2>

          <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 3.5rem auto', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Nền tảng du lịch số thông minh hàng đầu kết nối du khách với mọi miền đất nước bằng dữ liệu chính xác và dịch vụ tận tâm.
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
            gap: '2rem',
            textAlign: 'left'
          }}>
            <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(2, 50, 106, 0.05)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-navy)', marginBottom: '1.25rem' }}>
                <Compass size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '0.5rem' }}>Dữ Liệu Toàn Diện 63/34 Tỉnh</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>Hệ thống cơ sở dữ liệu địa phương cập nhật liên tục, bao gồm thông tin chi tiết từng địa danh, di tích và điểm check-in hấp dẫn.</p>
            </div>

            <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(2, 50, 106, 0.05)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-red)', marginBottom: '1.25rem' }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '0.5rem' }}>Trợ Lý Du Lịch Thông Minh</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>Hệ thống hỗ trợ tư vấn, sắp xếp hành trình cá nhân hóa theo từng sở thích, nhu cầu và ngân sách của bạn.</p>
            </div>

            <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(2, 50, 106, 0.05)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706', marginBottom: '1.25rem' }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '0.5rem' }}>Cộng Đồng Đánh Giá Thực</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>Được đóng góp và phản hồi trực tiếp từ cộng đồng du khách trải nghiệm thực tế với hàng nghìn bình luận và hình ảnh chân thực.</p>
            </div>

            <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(2, 50, 106, 0.05)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', marginBottom: '1.25rem' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '0.5rem' }}>Kiểm Duyệt Nghiêm Ngặt</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>Mọi địa điểm và bài chia sẻ từ người dùng đều trải qua quy trình kiểm duyệt chất lượng từ Quản trị viên trước khi hiển thị công khai.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
