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
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-secondary)',
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              cursor: 'pointer',
              marginBottom: '1rem',
              padding: 0
            }}
          >
            <ArrowLeft size={16} /> Quay lại
          </button>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 12px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '16px',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              {province.region}
            </span>
            {province.mergedFrom && (
              <span style={{ background: 'var(--accent-secondary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                Sáp nhập từ: {province.mergedFrom.join(', ')}
              </span>
            )}
          </div>
          
          <h1 style={{ fontSize: '4rem', marginBottom: '1rem', lineHeight: 1.1, color: '#FFFFFF' }}>{province.name}</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '800px', lineHeight: 1.6 }}>
            {province.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
              <Maximize size={32} color="var(--accent-primary)" />
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Diện tích</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{province.area.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-secondary)' }}>km²</span></div>
            </div>
          </div>
          
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
              <Users size={32} color="var(--accent-primary)" />
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Dân số</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{province.population.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-secondary)' }}>người</span></div>
            </div>
          </div>
          
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
              <MapPin size={32} color="var(--accent-primary)" />
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Trung tâm hành chính</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{province.capital}</div>
            </div>
          </div>
        </div>

        {/* Locations List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Địa điểm nổi bật</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Khám phá những điểm đến tuyệt vời tại {province.name}</p>
            </div>
            <button 
              className="btn-primary" 
              onClick={() => {
                if (!user) {
                  navigate('/auth');
                } else {
                  setIsModalOpen(true);
                }
              }}
            >
              <Plus size={18} /> Đóng góp địa điểm
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
