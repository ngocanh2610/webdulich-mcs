import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import LocationCard from '../components/LocationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AddLocationModal from '../components/AddLocationModal';
import { ArrowLeft, MapPin, Users, Maximize, AlertCircle, Plus } from 'lucide-react';

const ProvinceDetailPage = () => {
  const { slug } = useParams();
  const { mode, user } = useAppContext();
  const navigate = useNavigate();
  
  const [province, setProvince] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch province details
        const provRes = await fetch(`/api/provinces/${slug}?mode=${mode}`);
        const provData = await provRes.json();
        
        if (!provData.success) {
          setError(provData.message);
          setLoading(false);
          return;
        }
        
        setProvince(provData.data);
        
        // Fetch locations for this province
        const locRes = await fetch(`/api/locations?province=${provData.data.id}`);
        const locData = await locRes.json();
        
        if (locData.success) {
          setLocations(locData.data);
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi tải dữ liệu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [slug, mode]);

  if (loading) return <div style={{ paddingTop: '100px' }}><LoadingSpinner /></div>;
  
  if (error || !province) {
    return (
      <div style={{ paddingTop: '150px', textAlign: 'center', minHeight: '60vh' }}>
        <AlertCircle size={64} color="var(--accent-secondary)" style={{ margin: '0 auto 1rem auto' }} />
        <h2 style={{ marginBottom: '1rem' }}>{error || 'Không tìm thấy tỉnh thành'}</h2>
        <button className="btn-secondary" onClick={() => navigate('/provinces')}>
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Hero Header */}
      <div style={{ 
        position: 'relative', 
        height: '60vh',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'flex-end',
        paddingBottom: '3rem'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url(${province.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -2
        }} />
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to bottom, rgba(10, 10, 15, 0.2) 0%, rgba(10, 10, 15, 0.95) 100%)',
          zIndex: -1
        }} />
        
        <div className="container" style={{ zIndex: 10 }}>
          <button 
            onClick={() => navigate('/provinces')} 
            style={{ 
              background: 'rgba(0, 0, 0, 0.45)', 
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.3)', 
              color: '#FFFFFF',
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              cursor: 'pointer',
              marginBottom: '1.25rem',
              padding: '0.45rem 1rem',
              borderRadius: '20px',
              fontWeight: 600,
              fontSize: '0.875rem'
            }}
          >
            <ArrowLeft size={16} /> Quay lại danh sách tỉnh thành
          </button>
          
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-block',
              padding: '0.3rem 0.85rem',
              backgroundColor: 'rgba(2, 50, 106, 0.85)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {province.region}
            </span>
            {province.mergedFrom && (
              <span style={{ background: 'var(--brand-red)', color: 'white', padding: '0.3rem 0.85rem', borderRadius: '20px', fontSize: '0.825rem', fontWeight: 700 }}>
                Sáp nhập từ: {province.mergedFrom.join(', ')}
              </span>
            )}
          </div>
          
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '0.85rem', lineHeight: 1.15, color: '#FFFFFF', fontWeight: 900, textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
            {province.name}
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'rgba(255, 255, 255, 0.95)', maxWidth: '850px', lineHeight: 1.7, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
            {province.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ marginTop: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem 1.75rem', display: 'flex', alignItems: 'center', gap: '1.25rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', boxShadow: '0 4px 16px rgba(2, 50, 106, 0.05)' }}>
            <div style={{ background: '#EFF6FF', padding: '0.9rem', borderRadius: '12px', color: 'var(--brand-navy)' }}>
              <Maximize size={28} />
            </div>
            <div>
              <div style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Diện tích tự nhiên</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--brand-navy)' }}>{province.area.toLocaleString()} <span style={{ fontSize: '0.95rem', fontWeight: 500, color: '#64748B' }}>km²</span></div>
            </div>
          </div>
          
          <div className="glass-panel" style={{ padding: '1.5rem 1.75rem', display: 'flex', alignItems: 'center', gap: '1.25rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', boxShadow: '0 4px 16px rgba(2, 50, 106, 0.05)' }}>
            <div style={{ background: '#FEF2F2', padding: '0.9rem', borderRadius: '12px', color: 'var(--brand-red)' }}>
              <Users size={28} />
            </div>
            <div>
              <div style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dân số ước tính</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--brand-navy)' }}>{province.population.toLocaleString()} <span style={{ fontSize: '0.95rem', fontWeight: 500, color: '#64748B' }}>người</span></div>
            </div>
          </div>
          
          <div className="glass-panel" style={{ padding: '1.5rem 1.75rem', display: 'flex', alignItems: 'center', gap: '1.25rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', boxShadow: '0 4px 16px rgba(2, 50, 106, 0.05)' }}>
            <div style={{ background: '#FEF3C7', padding: '0.9rem', borderRadius: '12px', color: '#D97706' }}>
              <MapPin size={28} />
            </div>
            <div>
              <div style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Trung tâm hành chính</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--brand-navy)' }}>{province.capital}</div>
            </div>
          </div>
        </div>

        {/* Locations List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '0.4rem' }}>Địa Điểm Nổi Bật</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Khám phá các danh thắng, khu du lịch và di tích tiêu biểu tại {province.name}</p>
            </div>
            <button 
              className="btn-action-red" 
              onClick={() => {
                if (!user) {
                  navigate('/auth');
                } else {
                  setIsModalOpen(true);
                }
              }}
            >
              <Plus size={18} /> Đóng góp địa điểm mới
            </button>
          </div>
          
          {locations.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
              {locations.map(loc => (
                <LocationCard key={loc.id} location={loc} />
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
              <MapPin size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Đang cập nhật địa điểm</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Hãy là người đầu tiên đóng góp địa điểm cho khu vực này!</p>
            </div>
          )}
        </div>
      </div>

      <AddLocationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={(newLoc) => setLocations([...locations, newLoc])}
      />
    </div>
  );
};

export default ProvinceDetailPage;
