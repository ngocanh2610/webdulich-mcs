import React from 'react';
import { Phone, Mail, User, Users, Compass, MapPin, Sparkles, ShieldCheck, Clock, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ 
      background: '#011E40', 
      color: '#CBD5E1',
      padding: '4.5rem 0 2rem 0',
      borderTop: '3px solid var(--brand-red)',
      marginTop: 'auto',
      fontFamily: 'var(--font-body)'
    }}>
      <div className="container">
        {/* Main 4-Column Footer Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '2.5rem',
          paddingBottom: '3.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* Col 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div style={{ 
                width: '38px', height: '38px', borderRadius: '10px', 
                background: 'linear-gradient(135deg, #02326A 0%, #005294 100%)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' 
              }}>
                <Compass size={22} />
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
                Vietnam<span style={{ color: 'var(--brand-red)' }}>Tourism</span>
              </span>
            </div>

            <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#94A3B8', marginBottom: '1.25rem' }}>
              Cổng thông tin du lịch thông minh hàng đầu Việt Nam. Khám phá vẻ đẹp bất tận của 63 tỉnh thành phố với sự đồng hành của cộng đồng du lịch uy tín.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FEF08A', fontSize: '0.825rem', fontWeight: 600 }}>
              <ShieldCheck size={16} color="#FBBF24" />
              <span>Hệ thống thông tin du lịch chính thống & bảo mật</span>
            </div>
          </div>

          {/* Col 2: Vùng Miền Du Lịch */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 800, marginBottom: '1.25rem', position: 'relative', paddingBottom: '0.5rem' }}>
              Khám Phá Vùng Miền
              <span style={{ position: 'absolute', bottom: 0, left: 0, width: '30px', height: '2px', background: 'var(--brand-red)' }} />
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/provinces?region=bac" style={{ color: '#CBD5E1', transition: 'color 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.color = '#FEF08A'} onMouseLeave={e => e.currentTarget.style.color = '#CBD5E1'}>
                  • Du lịch Miền Bắc (Hà Nội, Sa Pa, Hạ Long, Ninh Bình)
                </Link>
              </li>
              <li>
                <Link to="/provinces?region=trung" style={{ color: '#CBD5E1', transition: 'color 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.color = '#FEF08A'} onMouseLeave={e => e.currentTarget.style.color = '#CBD5E1'}>
                  • Du lịch Miền Trung (Đà Nẵng, Hội An, Huế, Nha Trang)
                </Link>
              </li>
              <li>
                <Link to="/provinces?region=taynguyen" style={{ color: '#CBD5E1', transition: 'color 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.color = '#FEF08A'} onMouseLeave={e => e.currentTarget.style.color = '#CBD5E1'}>
                  • Du lịch Tây Nguyên (Đà Lạt, Buôn Ma Thuột, Kon Tum)
                </Link>
              </li>
              <li>
                <Link to="/provinces?region=nam" style={{ color: '#CBD5E1', transition: 'color 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.color = '#FEF08A'} onMouseLeave={e => e.currentTarget.style.color = '#CBD5E1'}>
                  • Du lịch Miền Nam (TP. Hồ Chí Minh, Vũng Tàu, Tây Ninh)
                </Link>
              </li>
              <li>
                <Link to="/provinces?region=tay" style={{ color: '#CBD5E1', transition: 'color 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.color = '#FEF08A'} onMouseLeave={e => e.currentTarget.style.color = '#CBD5E1'}>
                  • Du lịch Miền Tây sông nước & Phú Quốc
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Tiện Ích Số */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 800, marginBottom: '1.25rem', position: 'relative', paddingBottom: '0.5rem' }}>
              Tiện Ích & Dịch Vụ
              <span style={{ position: 'absolute', bottom: 0, left: 0, width: '30px', height: '2px', background: 'var(--brand-red)' }} />
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/planner" style={{ color: '#FDE047', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={14} color="#FBBF24" /> Lập Lịch Trình Thông Minh
                </Link>
              </li>
              <li>
                <Link to="/provinces" style={{ color: '#CBD5E1' }}>
                  • Tra cứu bản đồ 63 & 34 tỉnh thành
                </Link>
              </li>
              <li>
                <Link to="/profile" style={{ color: '#CBD5E1' }}>
                  • Quản lý thông tin & Điểm đến đã lưu
                </Link>
              </li>
              <li>
                <span style={{ color: '#94A3B8' }}>
                  • Kiểm duyệt bài đăng cộng đồng
                </span>
              </li>
              <li>
                <span style={{ color: '#94A3B8' }}>
                  • Hỗ trợ trò chuyện trực tuyến 24/7
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Liên Hệ & CSKH */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 800, marginBottom: '1.25rem', position: 'relative', paddingBottom: '0.5rem' }}>
              Chăm Sóc Khách Hàng
              <span style={{ position: 'absolute', bottom: 0, left: 0, width: '30px', height: '2px', background: 'var(--brand-red)' }} />
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <Phone size={18} color="var(--brand-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ color: '#94A3B8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Tổng đài tư vấn miễn phí</div>
                  <strong style={{ color: '#FFFFFF', fontSize: '1.1rem' }}>0816 951 801</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <Mail size={18} color="#38BDF8" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ color: '#94A3B8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Email hỗ trợ</div>
                  <span style={{ color: '#E2E8F0', wordBreak: 'break-all' }}>doanngocanh26102005@gmail.com</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <Clock size={18} color="#34D399" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ color: '#94A3B8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Thời gian phục vụ</div>
                  <span style={{ color: '#E2E8F0' }}>08:00 - 21:00 (Hàng ngày, kể cả ngày Lễ)</span>
                </div>
              </div>

              <div style={{ marginTop: '0.65rem', paddingTop: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94A3B8', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <User size={15} color="#38BDF8" />
                  <span>Phát triển bởi: <strong style={{ color: '#FFFFFF' }}>Đoàn Ngọc Anh</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#94A3B8', fontSize: '0.82rem', lineHeight: 1.45 }}>
                  <Users size={15} color="#34D399" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ color: '#94A3B8' }}>Đồng sáng tác:</span>
                    <div style={{ color: '#E2E8F0', marginTop: '0.15rem' }}>
                      Nguyễn Trọng Hải Nam, Bùi Nam Khánh, Nguyễn Quang Nam Anh, Phan Quang Minh
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ 
          paddingTop: '2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1rem',
          fontSize: '0.825rem',
          color: '#64748B'
        }}>
          <div>
            © 2026 <strong>Vietnam Tourism</strong>. Bản quyền thuộc về tác giả Đoàn Ngọc Anh & các cộng sự. Tất cả các quyền được bảo lưu.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span>Điều khoản sử dụng</span>
            <span>Chính sách bảo mật</span>
            <span>Quy chế hoạt động</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
